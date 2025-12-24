import { request } from '../utils/request';
import type {
  PurchaseOrder,
  PurchaseOrderDetail,
  PurchaseOrderListResponse,
  PurchaseOrderFilters,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from '../types/purchaseOrder';

export const purchaseOrderService = {
  /**
   * 获取采购订单列表
   */
  async getOrders(filters?: PurchaseOrderFilters): Promise<PurchaseOrderListResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const url = `/api/v1/purchase/orders${queryString ? `?${queryString}` : ''}`;

    const response = await request<PurchaseOrderListResponse>(url, {
      method: 'GET',
    });

    return response.data;
  },

  /**
   * 获取采购订单详情
   */
  async getOrder(id: string): Promise<PurchaseOrderDetail> {
    const response = await request<PurchaseOrderDetail>(`/api/v1/purchase/orders/${id}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * 创建采购订单
   */
  async createOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    const response = await request<PurchaseOrder>('/api/v1/purchase/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * 更新采购订单
   */
  async updateOrder(id: string, data: UpdatePurchaseOrderRequest): Promise<PurchaseOrder> {
    const response = await request<PurchaseOrder>(`/api/v1/purchase/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * 删除采购订单
   */
  async deleteOrder(id: string): Promise<void> {
    await request(`/api/v1/purchase/orders/${id}`, {
      method: 'DELETE',
    });
  },
};
