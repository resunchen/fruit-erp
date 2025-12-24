/**
 * 发货管理 - 业务逻辑服务
 */

import { supabase } from '../supabase';
import {
  SalesOrder,
  PackingOrder,
  ShippingOrder,
  CreateSalesOrderRequest,
  CreatePackingOrderRequest,
  CreateShippingOrderRequest,
  SalesOrderFilters,
} from '../types/shipping';

class ShippingService {
  /**
   * 获取销售订单列表
   */
  async getSalesOrders(
    organizationId: string,
    filters: SalesOrderFilters
  ): Promise<any> {
    let query = supabase
      .from('sales_orders')
      .select(
        `
        *,
        items:sales_order_items(*),
        packing_orders(id, packing_number, status)
      `,
        { count: 'exact' }
      )
      .eq('organization_id', organizationId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.customer_name) {
      query = query.ilike('customer_name', `%${filters.customer_name}%`);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: data || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * 创建销售订单
   */
  async createSalesOrder(
    organizationId: string,
    userId: string,
    data: CreateSalesOrderRequest
  ): Promise<SalesOrder> {
    // 生成销售订单号
    const order_number = await this.generateSalesOrderNumber(organizationId);

    // 计算总金额
    const total_amount = data.items.reduce((sum, item) => sum + item.total_price, 0);

    // 创建销售订单主记录
    const { data: salesOrder, error } = await supabase
      .from('sales_orders')
      .insert({
        organization_id: organizationId,
        order_number,
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        total_amount,
        status: 'draft',
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // 插入销售订单明细
    if (data.items && data.items.length > 0) {
      const items = data.items.map((item) => ({
        sales_order_id: salesOrder.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.total_price,
        remark: item.remark,
      }));

      const { error: itemsError } = await supabase
        .from('sales_order_items')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    return this.getSalesOrderById(salesOrder.id, organizationId);
  }

  /**
   * 获取销售订单详情
   */
  async getSalesOrderById(id: string, organizationId: string): Promise<SalesOrder> {
    const { data, error } = await supabase
      .from('sales_orders')
      .select(
        `
        *,
        items:sales_order_items(*)
      `
      )
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 更新销售订单状态
   */
  async updateSalesOrderStatus(
    id: string,
    organizationId: string,
    status: string
  ): Promise<SalesOrder> {
    const { error } = await supabase
      .from('sales_orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) throw error;
    return this.getSalesOrderById(id, organizationId);
  }

  /**
   * 获取打包单列表
   */
  async getPackingOrders(
    organizationId: string,
    filters: any
  ): Promise<any> {
    let query = supabase
      .from('packing_orders')
      .select(
        `
        *,
        items:packing_order_items(*),
        sales_order:sales_orders(id, order_number, customer_name)
      `,
        { count: 'exact' }
      )
      .eq('organization_id', organizationId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.sales_order_id) {
      query = query.eq('sales_order_id', filters.sales_order_id);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: data || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * 创建打包单
   */
  async createPackingOrder(
    organizationId: string,
    userId: string,
    data: CreatePackingOrderRequest
  ): Promise<PackingOrder> {
    // 生成打包单号
    const packing_number = await this.generatePackingOrderNumber(organizationId);

    // 创建打包单主记录
    const { data: packingOrder, error } = await supabase
      .from('packing_orders')
      .insert({
        organization_id: organizationId,
        packing_number,
        sales_order_id: data.sales_order_id,
        status: 'pending',
        packed_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // 插入打包单明细
    if (data.items && data.items.length > 0) {
      const items = data.items.map((item) => ({
        packing_order_id: packingOrder.id,
        product_name: item.product_name,
        planned_quantity: item.planned_quantity,
        unit: item.unit,
        batch_id: item.batch_id,
        boxes_count: item.boxes_count,
        remark: item.remark,
      }));

      const { error: itemsError } = await supabase
        .from('packing_order_items')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    // 更新销售订单状态为packing
    await this.updateSalesOrderStatus(data.sales_order_id, organizationId, 'packing');

    return this.getPackingOrderById(packingOrder.id, organizationId);
  }

  /**
   * 获取打包单详情
   */
  async getPackingOrderById(id: string, organizationId: string): Promise<PackingOrder> {
    const { data, error } = await supabase
      .from('packing_orders')
      .select(
        `
        *,
        items:packing_order_items(*),
        sales_order:sales_orders(id, order_number, customer_name)
      `
      )
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 完成打包单
   */
  async completePackingOrder(
    id: string,
    organizationId: string,
    userId: string,
    data: {
      items: any[];
      total_boxes: number;
    }
  ): Promise<PackingOrder> {
    // 获取打包单
    const packingOrder = await this.getPackingOrderById(id, organizationId);

    // 更新打包单明细
    for (const item of data.items) {
      const { error } = await supabase
        .from('packing_order_items')
        .update({
          actual_quantity: item.actual_quantity,
          boxes_count: item.boxes_count,
        })
        .eq('packing_order_id', id)
        .eq('product_name', item.product_name);

      if (error) throw error;
    }

    // 更新打包单状态为packed
    const { error } = await supabase
      .from('packing_orders')
      .update({
        status: 'packed',
        packing_date: new Date().toISOString(),
        total_boxes: data.total_boxes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    // 更新销售订单状态为packed
    await this.updateSalesOrderStatus(packingOrder.sales_order_id, organizationId, 'packed');

    return this.getPackingOrderById(id, organizationId);
  }

  /**
   * 获取发货单列表
   */
  async getShippingOrders(
    organizationId: string,
    filters: any
  ): Promise<any> {
    let query = supabase
      .from('shipping_orders')
      .select(
        `
        *,
        items:shipping_order_items(*),
        packing_order:packing_orders(id, packing_number, sales_order_id),
        sales_order:sales_orders(id, order_number, customer_name)
      `,
        { count: 'exact' }
      )
      .eq('organization_id', organizationId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.shipping_method) {
      query = query.eq('shipping_method', filters.shipping_method);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: data || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * 创建发货单
   */
  async createShippingOrder(
    organizationId: string,
    userId: string,
    data: CreateShippingOrderRequest
  ): Promise<ShippingOrder> {
    // 生成发货单号
    const shipping_number = await this.generateShippingOrderNumber(organizationId);

    // 创建发货单主记录
    const { data: shippingOrder, error } = await supabase
      .from('shipping_orders')
      .insert({
        organization_id: organizationId,
        shipping_number,
        packing_order_id: data.packing_order_id,
        shipping_method: data.shipping_method,
        status: 'pending',
        truck_plate_number: data.truck_plate_number,
        driver_name: data.driver_name,
        driver_phone: data.driver_phone,
        truck_fee: data.truck_fee,
        express_company: data.express_company,
        express_number: data.express_number,
        express_fee: data.express_fee,
        total_boxes: data.total_boxes,
        total_weight: data.total_weight,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // 插入发货单明细
    if (data.items && data.items.length > 0) {
      const items = data.items.map((item) => ({
        shipping_order_id: shippingOrder.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit: item.unit,
        batch_id: item.batch_id,
        boxes_count: item.boxes_count,
        remark: item.remark,
      }));

      const { error: itemsError } = await supabase
        .from('shipping_order_items')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    // 获取打包单并更新状态
    const { data: packingOrder } = await supabase
      .from('packing_orders')
      .select('sales_order_id')
      .eq('id', data.packing_order_id)
      .single();

    if (packingOrder) {
      await this.updateSalesOrderStatus(
        packingOrder.sales_order_id,
        organizationId,
        'shipping'
      );
    }

    return this.getShippingOrderById(shippingOrder.id, organizationId);
  }

  /**
   * 获取发货单详情
   */
  async getShippingOrderById(id: string, organizationId: string): Promise<ShippingOrder> {
    const { data, error } = await supabase
      .from('shipping_orders')
      .select(
        `
        *,
        items:shipping_order_items(*),
        packing_order:packing_orders(id, packing_number, sales_order_id)
      `
      )
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 确认发货
   */
  async confirmShipping(id: string, organizationId: string): Promise<ShippingOrder> {
    const shippingOrder = await this.getShippingOrderById(id, organizationId);

    // 更新发货单状态
    const { error } = await supabase
      .from('shipping_orders')
      .update({
        status: 'shipped',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    // 获取关联的销售订单并更新状态
    const { data: packingOrder } = await supabase
      .from('packing_orders')
      .select('sales_order_id')
      .eq('id', shippingOrder.packing_order_id)
      .single();

    if (packingOrder) {
      await this.updateSalesOrderStatus(
        packingOrder.sales_order_id,
        organizationId,
        'shipped'
      );
    }

    // 更新打包单状态
    await supabase
      .from('packing_orders')
      .update({
        status: 'shipped',
        updated_at: new Date().toISOString(),
      })
      .eq('id', shippingOrder.packing_order_id);

    return this.getShippingOrderById(id, organizationId);
  }

  /**
   * 确认收货（标记为已送达）
   */
  async confirmDelivery(id: string, organizationId: string): Promise<ShippingOrder> {
    const { error } = await supabase
      .from('shipping_orders')
      .update({
        status: 'delivered',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    return this.getShippingOrderById(id, organizationId);
  }

  /**
   * 生成销售订单号
   */
  private async generateSalesOrderNumber(organizationId: string): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

    const { count } = await supabase
      .from('sales_orders')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .like('order_number', `SO-${dateStr}%`);

    const sequence = ((count || 0) + 1).toString().padStart(4, '0');
    return `SO-${dateStr}-${sequence}`;
  }

  /**
   * 生成打包单号
   */
  private async generatePackingOrderNumber(organizationId: string): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

    const { count } = await supabase
      .from('packing_orders')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .like('packing_number', `PK-${dateStr}%`);

    const sequence = ((count || 0) + 1).toString().padStart(4, '0');
    return `PK-${dateStr}-${sequence}`;
  }

  /**
   * 生成发货单号
   */
  private async generateShippingOrderNumber(organizationId: string): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

    const { count } = await supabase
      .from('shipping_orders')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .like('shipping_number', `SH-${dateStr}%`);

    const sequence = ((count || 0) + 1).toString().padStart(4, '0');
    return `SH-${dateStr}-${sequence}`;
  }
}

export const shippingService = new ShippingService();
