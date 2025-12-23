import { supabase } from '../config/supabase';
import { AppError } from '../utils/errors';
import type {
  PurchaseOrder,
  PurchaseOrderDetail,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  PurchaseOrderFilters,
  PurchaseOrderListResponse,
} from '../types/purchaseOrder';

/**
 * 生成订单号
 * 格式: YY-MM-DD-xxx (例如: 25-12-23-001)
 */
function generateOrderNumber(existingNumbers: string[]): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const prefix = `${year}-${month}-${day}`;

  // 找出今天的最大编号
  const todayNumbers = existingNumbers
    .filter(num => num.startsWith(prefix))
    .map(num => {
      const match = num.match(/-(\d{3})$/);
      return match ? parseInt(match[1], 10) : 0;
    });

  const maxNumber = todayNumbers.length > 0 ? Math.max(...todayNumbers) : 0;
  const newNumber = String(maxNumber + 1).padStart(3, '0');

  return `${prefix}-${newNumber}`;
}

/**
 * 计算订单总金额
 */
function calculateTotalAmount(
  items: Array<{ unit_price: number; quantity: number }>,
  costs: Array<{ cost_amount: number }>
): number {
  const itemsTotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const costsTotal = costs.reduce((sum, cost) => sum + cost.cost_amount, 0);
  return itemsTotal + costsTotal;
}

export const purchaseOrderService = {
  /**
   * 获取采购订单列表
   */
  async getOrders(filters: PurchaseOrderFilters): Promise<PurchaseOrderListResponse> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const offset = (page - 1) * limit;
    const search = filters.search?.trim();
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';

    try {
      let query = supabase
        .from('purchase_orders')
        .select('*', { count: 'exact' })
        .neq('status', 'deleted');

      // 搜索：按订单号搜索
      if (search) {
        query = query.or(`order_number.ilike.%${search}%`);
      }

      // 供应商筛选
      if (filters.supplier_id) {
        query = query.eq('supplier_id', filters.supplier_id);
      }

      // 创建人筛选
      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      // 状态筛选
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // 日期范围筛选
      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      // 排序
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // 分页
      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        throw new AppError('获取采购订单列表失败', 500, 500);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        items: data || [],
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('获取采购订单列表失败', 500, 500);
    }
  },

  /**
   * 获取采购订单详情（包含项目和成本）
   */
  async getOrderDetail(orderId: string): Promise<PurchaseOrderDetail> {
    try {
      // 获取订单主信息
      const { data: order, error: orderError } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('id', orderId)
        .neq('status', 'deleted')
        .single();

      if (orderError || !order) {
        throw new AppError('采购订单不存在', 404, 404);
      }

      // 获取订单项目
      const { data: items, error: itemsError } = await supabase
        .from('purchase_order_items')
        .select('*')
        .eq('purchase_order_id', orderId);

      if (itemsError) {
        throw new AppError('获取订单项目失败', 500, 500);
      }

      // 获取成本信息
      const { data: costs, error: costsError } = await supabase
        .from('purchase_costs')
        .select('*')
        .eq('purchase_order_id', orderId);

      if (costsError) {
        throw new AppError('获取订单成本失败', 500, 500);
      }

      // 获取供应商名称
      let supplierName = '';
      if (order.supplier_id) {
        const { data: supplier } = await supabase
          .from('suppliers')
          .select('name')
          .eq('id', order.supplier_id)
          .single();
        supplierName = supplier?.name || '';
      }

      return {
        ...order,
        supplier_name: supplierName,
        items: items || [],
        costs: costs || [],
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('获取采购订单详情失败', 500, 500);
    }
  },

  /**
   * 创建采购订单
   */
  async createOrder(
    request: CreatePurchaseOrderRequest,
    userId: string
  ): Promise<PurchaseOrder> {
    try {
      // 验证供应商存在
      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('id')
        .eq('id', request.supplier_id)
        .single();

      if (supplierError || !supplier) {
        throw new AppError('供应商不存在', 400, 400);
      }

      // 验证项目不为空
      if (!request.items || request.items.length === 0) {
        throw new AppError('订单必须至少包含一项', 400, 400);
      }

      // 生成订单号
      const { data: existingOrders } = await supabase
        .from('purchase_orders')
        .select('order_number');
      const orderNumber = generateOrderNumber(
        (existingOrders || []).map(o => o.order_number)
      );

      // 计算总金额
      const totalAmount = calculateTotalAmount(
        request.items,
        request.costs || []
      );

      // 创建订单
      const { data: order, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          supplier_id: request.supplier_id,
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'draft',
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new AppError('创建采购订单失败', 500, 500);
      }

      // 创建订单项目
      const itemsData = request.items.map(item => ({
        purchase_order_id: order.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        created_at: new Date().toISOString(),
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(itemsData);

      if (itemsError) {
        throw new AppError('创建订单项目失败', 500, 500);
      }

      // 创建成本信息
      if (request.costs && request.costs.length > 0) {
        const costsData = request.costs.map(cost => ({
          purchase_order_id: order.id,
          cost_type: cost.cost_type,
          cost_amount: cost.cost_amount,
          created_at: new Date().toISOString(),
        }));

        const { error: costsError } = await supabase
          .from('purchase_costs')
          .insert(costsData);

        if (costsError) {
          throw new AppError('创建成本信息失败', 500, 500);
        }
      }

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('创建采购订单失败', 500, 500);
    }
  },

  /**
   * 更新采购订单
   */
  async updateOrder(
    orderId: string,
    request: UpdatePurchaseOrderRequest
  ): Promise<PurchaseOrder> {
    try {
      // 获取现有订单
      const { data: order, error: orderError } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('id', orderId)
        .neq('status', 'deleted')
        .single();

      if (orderError || !order) {
        throw new AppError('采购订单不存在', 404, 404);
      }

      // 准备更新数据
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (request.supplier_id) {
        updateData.supplier_id = request.supplier_id;
      }

      if (request.status) {
        updateData.status = request.status;
      }

      // 如果更新了项目或成本，重新计算总金额
      if (request.items || request.costs) {
        const items = request.items || [];
        const costs = request.costs || [];
        const totalAmount = calculateTotalAmount(items, costs);
        updateData.total_amount = totalAmount;

        // 删除旧项目
        await supabase
          .from('purchase_order_items')
          .delete()
          .eq('purchase_order_id', orderId);

        // 创建新项目
        if (items.length > 0) {
          const itemsData = items.map(item => ({
            purchase_order_id: orderId,
            product_name: item.product_name,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            total_price: item.unit_price * item.quantity,
            created_at: new Date().toISOString(),
          }));

          const { error: itemsError } = await supabase
            .from('purchase_order_items')
            .insert(itemsData);

          if (itemsError) {
            throw new AppError('更新订单项目失败', 500, 500);
          }
        }

        // 删除旧成本
        await supabase
          .from('purchase_costs')
          .delete()
          .eq('purchase_order_id', orderId);

        // 创建新成本
        if (costs.length > 0) {
          const costsData = costs.map(cost => ({
            purchase_order_id: orderId,
            cost_type: cost.cost_type,
            cost_amount: cost.cost_amount,
            created_at: new Date().toISOString(),
          }));

          const { error: costsError } = await supabase
            .from('purchase_costs')
            .insert(costsData);

          if (costsError) {
            throw new AppError('更新成本信息失败', 500, 500);
          }
        }
      }

      // 更新订单
      const { data: updatedOrder, error: updateError } = await supabase
        .from('purchase_orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (updateError || !updatedOrder) {
        throw new AppError('更新采购订单失败', 500, 500);
      }

      return updatedOrder;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('更新采购订单失败', 500, 500);
    }
  },

  /**
   * 删除采购订单（软删除）
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .update({ status: 'deleted', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        throw new AppError('删除采购订单失败', 500, 500);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('删除采购订单失败', 500, 500);
    }
  },
};
