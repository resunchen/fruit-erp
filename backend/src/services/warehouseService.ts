/**
 * 仓储管理 - 业务逻辑服务
 */

import { supabase } from '../supabase';
import {
  Warehouse,
  WarehouseLocation,
  Inventory,
  InboundOrder,
  OutboundOrder,
  InventoryAlert,
  CreateInboundOrderRequest,
  CreateOutboundOrderRequest,
  InventoryQueryFilters,
  InventoryListResponse,
  InboundOrderListResponse,
} from '../types/warehouse';

class WarehouseService {
  /**
   * 获取仓库列表
   */
  async getWarehouses(
    organizationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: Warehouse[]; pagination: any }> {
    const offset = (page - 1) * limit;

    // 获取总数
    const { count } = await supabase
      .from('warehouses')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId);

    // 获取数据
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('organization_id', organizationId)
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
   * 创建仓库
   */
  async createWarehouse(
    organizationId: string,
    data: {
      name: string;
      location?: string;
      capacity?: number;
      temperature_controlled?: boolean;
    }
  ): Promise<Warehouse> {
    const { data: warehouse, error } = await supabase
      .from('warehouses')
      .insert({
        organization_id: organizationId,
        name: data.name,
        location: data.location,
        capacity: data.capacity,
        temperature_controlled: data.temperature_controlled || false,
      })
      .select()
      .single();

    if (error) throw error;
    return warehouse;
  }

  /**
   * 获取仓库详情
   */
  async getWarehouseById(id: string, organizationId: string): Promise<Warehouse> {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 获取库位列表
   */
  async getWarehouseLocations(
    warehouseId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: WarehouseLocation[]; pagination: any }> {
    const offset = (page - 1) * limit;

    const { count } = await supabase
      .from('warehouse_locations')
      .select('*', { count: 'exact' })
      .eq('warehouse_id', warehouseId);

    const { data, error } = await supabase
      .from('warehouse_locations')
      .select('*')
      .eq('warehouse_id', warehouseId)
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
   * 创建库位
   */
  async createWarehouseLocation(
    warehouseId: string,
    data: {
      location_code: string;
      rack_number?: number;
      shelf_number?: number;
      capacity?: number;
    }
  ): Promise<WarehouseLocation> {
    const { data: location, error } = await supabase
      .from('warehouse_locations')
      .insert({
        warehouse_id: warehouseId,
        location_code: data.location_code,
        rack_number: data.rack_number,
        shelf_number: data.shelf_number,
        capacity: data.capacity,
      })
      .select()
      .single();

    if (error) throw error;
    return location;
  }

  /**
   * 查询库存
   */
  async queryInventory(
    organizationId: string,
    filters: InventoryQueryFilters
  ): Promise<InventoryListResponse> {
    let query = supabase
      .from('inventory')
      .select(
        `
        *,
        warehouse:warehouses(id, name, location),
        location:warehouse_locations(id, location_code)
      `,
        { count: 'exact' }
      );

    // 应用过滤条件
    if (filters.warehouse_id) {
      query = query.eq('warehouse_id', filters.warehouse_id);
    }
    if (filters.location_id) {
      query = query.eq('location_id', filters.location_id);
    }
    if (filters.product_name) {
      query = query.ilike('product_name', `%${filters.product_name}%`);
    }
    if (filters.batch_id) {
      query = query.eq('batch_id', filters.batch_id);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.expiration_date_from) {
      query = query.gte('expiration_date', filters.expiration_date_from);
    }
    if (filters.expiration_date_to) {
      query = query.lte('expiration_date', filters.expiration_date_to);
    }

    const offset = ((filters.page || 1) - 1) * (filters.limit || 20);

    const { data, count, error } = await query
      .order('inbound_date', { ascending: false })
      .range(offset, offset + (filters.limit || 20) - 1);

    if (error) throw error;

    return {
      items: data || [],
      pagination: {
        total: count || 0,
        page: filters.page || 1,
        limit: filters.limit || 20,
        totalPages: Math.ceil((count || 0) / (filters.limit || 20)),
      },
    };
  }

  /**
   * 获取库存预警列表
   */
  async getInventoryAlerts(
    organizationId: string,
    filters: {
      alert_level?: string;
      is_resolved?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<any> {
    let query = supabase
      .from('inventory_alerts')
      .select(
        `
        *,
        inventory:inventory(id, product_name, quantity, unit, warehouse_id),
        warehouse:warehouses(id, name)
      `,
        { count: 'exact' }
      );

    if (filters.alert_level) {
      query = query.eq('alert_level', filters.alert_level);
    }
    if (filters.is_resolved !== undefined) {
      query = query.eq('is_resolved', filters.is_resolved);
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
   * 获取入库单列表
   */
  async getInboundOrders(
    organizationId: string,
    filters: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<InboundOrderListResponse> {
    let query = supabase
      .from('inbound_orders')
      .select(
        `
        *,
        items:inbound_order_items(*),
        warehouse:warehouses(id, name),
        purchase_order:purchase_orders(id, order_number)
      `,
        { count: 'exact' }
      )
      .eq('organization_id', organizationId);

    if (filters.status) {
      query = query.eq('status', filters.status);
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
   * 创建入库单
   */
  async createInboundOrder(
    organizationId: string,
    userId: string,
    data: CreateInboundOrderRequest
  ): Promise<InboundOrder> {
    // 生成入库单号
    const inbound_number = await this.generateInboundNumber(organizationId);

    // 创建入库单主记录
    const { data: inboundOrder, error } = await supabase
      .from('inbound_orders')
      .insert({
        organization_id: organizationId,
        purchase_order_id: data.purchase_order_id,
        inbound_number,
        warehouse_id: data.warehouse_id,
        status: 'draft',
        created_by: userId,
        total_quantity: data.items.reduce((sum, item) => sum + item.quantity, 0),
      })
      .select()
      .single();

    if (error) throw error;

    // 插入入库单明细
    if (data.items && data.items.length > 0) {
      const items = data.items.map((item) => ({
        inbound_order_id: inboundOrder.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit: item.unit,
        location_id: item.location_id,
        batch_id: item.batch_id,
        expiration_date: item.expiration_date,
        remark: item.remark,
      }));

      const { error: itemsError } = await supabase
        .from('inbound_order_items')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    // 获取完整的入库单（包含items）
    return this.getInboundOrderById(inboundOrder.id, organizationId);
  }

  /**
   * 获取入库单详情
   */
  async getInboundOrderById(id: string, organizationId: string): Promise<InboundOrder> {
    const { data, error } = await supabase
      .from('inbound_orders')
      .select(
        `
        *,
        items:inbound_order_items(*),
        warehouse:warehouses(id, name),
        purchase_order:purchase_orders(id, order_number)
      `
      )
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 确认入库单（完成入库，增加库存）
   */
  async confirmInboundOrder(
    inboundOrderId: string,
    organizationId: string,
    items: any[]
  ): Promise<any> {
    // 开始事务
    const inboundOrder = await this.getInboundOrderById(inboundOrderId, organizationId);

    // 对于每个入库单明细项，增加库存
    for (const item of items) {
      // 检查是否已有相同product_name + batch_id的库存
      const { data: existingInventory } = await supabase
        .from('inventory')
        .select('*')
        .eq('warehouse_id', inboundOrder.warehouse_id)
        .eq('product_name', item.product_name)
        .eq('batch_id', item.batch_id)
        .eq('status', 'available')
        .single();

      if (existingInventory) {
        // 更新现有库存
        const newQuantity =
          parseFloat(existingInventory.quantity) + parseFloat(item.quantity);

        const { error: updateError } = await supabase
          .from('inventory')
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingInventory.id);

        if (updateError) throw updateError;

        // 记录库存日志
        await this.logInventoryChange(existingInventory.id, 'inbound', {
          change_quantity: item.quantity,
          before_quantity: existingInventory.quantity,
          after_quantity: newQuantity,
          reference_order_id: inboundOrderId,
          remark: `Inbound from ${item.product_name}`,
        });
      } else {
        // 创建新库存记录
        const { data: newInventory, error: insertError } = await supabase
          .from('inventory')
          .insert({
            warehouse_id: inboundOrder.warehouse_id,
            location_id: item.location_id,
            product_name: item.product_name,
            batch_id: item.batch_id,
            purchase_order_id: inboundOrder.purchase_order_id,
            quantity: item.quantity,
            unit: item.unit,
            status: 'available',
            expiration_date: item.expiration_date,
            inbound_date: new Date().toISOString().split('T')[0],
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // 记录库存日志
        await this.logInventoryChange(newInventory.id, 'inbound', {
          change_quantity: item.quantity,
          before_quantity: 0,
          after_quantity: item.quantity,
          reference_order_id: inboundOrderId,
          remark: `Inbound from ${item.product_name}`,
        });
      }
    }

    // 更新入库单状态为confirmed
    const { error: updateError } = await supabase
      .from('inbound_orders')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', inboundOrderId);

    if (updateError) throw updateError;

    // 检查过期预警
    await this.checkExpirationAlerts(inboundOrder.warehouse_id);

    return this.getInboundOrderById(inboundOrderId, organizationId);
  }

  /**
   * 获取出库单列表
   */
  async getOutboundOrders(
    organizationId: string,
    filters: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<any> {
    let query = supabase
      .from('outbound_orders')
      .select(
        `
        *,
        items:outbound_order_items(*),
        warehouse:warehouses(id, name)
      `,
        { count: 'exact' }
      )
      .eq('organization_id', organizationId);

    if (filters.status) {
      query = query.eq('status', filters.status);
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
   * 创建出库单
   */
  async createOutboundOrder(
    organizationId: string,
    userId: string,
    data: CreateOutboundOrderRequest
  ): Promise<OutboundOrder> {
    // 生成出库单号
    const outbound_number = await this.generateOutboundNumber(organizationId);

    // 创建出库单主记录
    const { data: outboundOrder, error } = await supabase
      .from('outbound_orders')
      .insert({
        organization_id: organizationId,
        outbound_number,
        warehouse_id: data.warehouse_id,
        related_order_id: data.related_order_id,
        status: 'draft',
        created_by: userId,
        total_quantity: data.items.reduce((sum, item) => sum + item.requested_quantity, 0),
      })
      .select()
      .single();

    if (error) throw error;

    // 插入出库单明细
    if (data.items && data.items.length > 0) {
      const items = data.items.map((item) => ({
        outbound_order_id: outboundOrder.id,
        product_name: item.product_name,
        requested_quantity: item.requested_quantity,
        unit: item.unit,
        batch_id: item.batch_id,
        remark: item.remark,
      }));

      const { error: itemsError } = await supabase
        .from('outbound_order_items')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    return this.getOutboundOrderById(outboundOrder.id, organizationId);
  }

  /**
   * 获取出库单详情
   */
  async getOutboundOrderById(id: string, organizationId: string): Promise<OutboundOrder> {
    const { data, error } = await supabase
      .from('outbound_orders')
      .select(
        `
        *,
        items:outbound_order_items(*),
        warehouse:warehouses(id, name)
      `
      )
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 确认出库单（完成出库，减少库存）
   */
  async confirmOutboundOrder(
    outboundOrderId: string,
    organizationId: string,
    items: any[]
  ): Promise<any> {
    const outboundOrder = await this.getOutboundOrderById(outboundOrderId, organizationId);

    // 对每个出库明细项进行库存扣减（FIFO原则）
    for (const item of items) {
      const actualQuantity = item.actual_quantity || item.requested_quantity;

      // 获取库存（FIFO - 按inbound_date升序）
      const { data: inventories } = await supabase
        .from('inventory')
        .select('*')
        .eq('warehouse_id', outboundOrder.warehouse_id)
        .eq('product_name', item.product_name)
        .eq('status', 'available')
        .order('inbound_date', { ascending: true });

      if (!inventories || inventories.length === 0) {
        throw new Error(`No available inventory for ${item.product_name}`);
      }

      let remainingQuantity = actualQuantity;

      // 按FIFO原则扣减库存
      for (const inventory of inventories) {
        if (remainingQuantity <= 0) break;

        const deductQuantity = Math.min(remainingQuantity, inventory.quantity);
        const newQuantity = inventory.quantity - deductQuantity;

        // 更新库存
        if (newQuantity > 0) {
          await supabase
            .from('inventory')
            .update({
              quantity: newQuantity,
              updated_at: new Date().toISOString(),
            })
            .eq('id', inventory.id);
        } else {
          // 数量为0，删除记录
          await supabase.from('inventory').delete().eq('id', inventory.id);
        }

        // 记录库存日志
        await this.logInventoryChange(inventory.id, 'outbound', {
          change_quantity: -deductQuantity,
          before_quantity: inventory.quantity,
          after_quantity: newQuantity,
          reference_order_id: outboundOrderId,
          remark: `Outbound of ${item.product_name}`,
        });

        remainingQuantity -= deductQuantity;
      }

      if (remainingQuantity > 0) {
        throw new Error(`Insufficient inventory for ${item.product_name}`);
      }

      // 更新出库单明细的actual_quantity
      const { error: updateError } = await supabase
        .from('outbound_order_items')
        .update({
          actual_quantity: actualQuantity,
        })
        .eq('outbound_order_id', outboundOrderId)
        .eq('product_name', item.product_name);

      if (updateError) throw updateError;
    }

    // 更新出库单状态为confirmed
    const { error: updateError } = await supabase
      .from('outbound_orders')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', outboundOrderId);

    if (updateError) throw updateError;

    return this.getOutboundOrderById(outboundOrderId, organizationId);
  }

  /**
   * 记录库存变化日志
   */
  private async logInventoryChange(
    inventoryId: string,
    operationType: 'inbound' | 'outbound',
    data: {
      change_quantity: number;
      before_quantity: number;
      after_quantity: number;
      reference_order_id: string;
      remark?: string;
    }
  ): Promise<void> {
    const { error } = await supabase.from('inventory_logs').insert({
      inventory_id: inventoryId,
      operation_type: operationType,
      change_quantity: data.change_quantity,
      before_quantity: data.before_quantity,
      after_quantity: data.after_quantity,
      reference_order_id: data.reference_order_id,
      remark: data.remark,
    });

    if (error) throw error;
  }

  /**
   * 检查过期预警
   */
  private async checkExpirationAlerts(warehouseId: string): Promise<void> {
    const today = new Date();
    const warningDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天后

    // 获取即将过期的库存
    const { data: expiringInventories } = await supabase
      .from('inventory')
      .select('*')
      .eq('warehouse_id', warehouseId)
      .eq('status', 'available')
      .not('expiration_date', 'is', null)
      .lte('expiration_date', warningDate.toISOString().split('T')[0])
      .gt('expiration_date', today.toISOString().split('T')[0]);

    if (expiringInventories) {
      for (const inventory of expiringInventories) {
        const daysUntilExpiration = Math.ceil(
          (new Date(inventory.expiration_date).getTime() - today.getTime()) /
            (24 * 60 * 60 * 1000)
        );

        // 检查是否已有相同的预警
        const { data: existingAlert } = await supabase
          .from('inventory_alerts')
          .select('*')
          .eq('inventory_id', inventory.id)
          .eq('alert_type', 'expiration_warning')
          .eq('is_resolved', false)
          .single();

        if (!existingAlert) {
          await supabase.from('inventory_alerts').insert({
            inventory_id: inventory.id,
            warehouse_id: warehouseId,
            product_name: inventory.product_name,
            batch_id: inventory.batch_id,
            alert_type: 'expiration_warning',
            alert_level: daysUntilExpiration <= 3 ? 'critical' : 'warning',
            days_until_expiration: daysUntilExpiration,
            current_quantity: inventory.quantity,
            expiration_date: inventory.expiration_date,
          });
        }
      }
    }
  }

  /**
   * 生成入库单号
   */
  private async generateInboundNumber(organizationId: string): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

    // 获取今天已有的入库单数
    const { count } = await supabase
      .from('inbound_orders')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .like('inbound_number', `IB-${dateStr}%`);

    const sequence = ((count || 0) + 1).toString().padStart(4, '0');
    return `IB-${dateStr}-${sequence}`;
  }

  /**
   * 生成出库单号
   */
  private async generateOutboundNumber(organizationId: string): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

    // 获取今天已有的出库单数
    const { count } = await supabase
      .from('outbound_orders')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .like('outbound_number', `OB-${dateStr}%`);

    const sequence = ((count || 0) + 1).toString().padStart(4, '0');
    return `OB-${dateStr}-${sequence}`;
  }
}

export const warehouseService = new WarehouseService();
