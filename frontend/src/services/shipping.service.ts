/**
 * 发货管理 - 前端服务
 */

import { request, get, post, put } from '@/utils/request';
import {
  SalesOrder,
  PackingOrder,
  ShippingOrder,
  SalesOrderFilters,
} from '@/types/shipping';

class ShippingService {
  /**
   * 销售订单
   */
  async getSalesOrders(filters?: SalesOrderFilters) {
    const response = await get<any>('/api/v1/shipping/sales-orders', {
      params: filters,
    });
    return response.data;
  }

  async createSalesOrder(data: {
    customer_name?: string;
    customer_id?: string;
    items: any[];
  }) {
    const response = await post<SalesOrder>('/api/v1/shipping/sales-orders', data);
    return response.data;
  }

  async getSalesOrderById(id: string) {
    const response = await get<SalesOrder>(`/api/v1/shipping/sales-orders/${id}`);
    return response.data;
  }

  async updateSalesOrderStatus(id: string, status: string) {
    const response = await put<SalesOrder>(
      `/api/v1/shipping/sales-orders/${id}/status`,
      { status }
    );
    return response.data;
  }

  /**
   * 打包单
   */
  async getPackingOrders(filters?: {
    status?: string;
    sales_order_id?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await get<any>('/api/v1/shipping/packing-orders', {
      params: filters,
    });
    return response.data;
  }

  async createPackingOrder(data: {
    sales_order_id: string;
    items: any[];
  }) {
    const response = await post<PackingOrder>(
      '/api/v1/shipping/packing-orders',
      data
    );
    return response.data;
  }

  async getPackingOrderById(id: string) {
    const response = await get<PackingOrder>(
      `/api/v1/shipping/packing-orders/${id}`
    );
    return response.data;
  }

  async completePackingOrder(
    id: string,
    data: {
      items: any[];
      total_boxes: number;
    }
  ) {
    const response = await post<PackingOrder>(
      `/api/v1/shipping/packing-orders/${id}/complete`,
      data
    );
    return response.data;
  }

  /**
   * 发货单
   */
  async getShippingOrders(filters?: {
    status?: string;
    shipping_method?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await get<any>('/api/v1/shipping/shipping-orders', {
      params: filters,
    });
    return response.data;
  }

  async createShippingOrder(data: {
    packing_order_id: string;
    shipping_method: 'truck' | 'express';
    truck_plate_number?: string;
    driver_name?: string;
    driver_phone?: string;
    truck_fee?: number;
    express_company?: string;
    express_number?: string;
    express_fee?: number;
    total_boxes: number;
    total_weight?: number;
    items: any[];
  }) {
    const response = await post<ShippingOrder>(
      '/api/v1/shipping/shipping-orders',
      data
    );
    return response.data;
  }

  async getShippingOrderById(id: string) {
    const response = await get<ShippingOrder>(
      `/api/v1/shipping/shipping-orders/${id}`
    );
    return response.data;
  }

  async confirmShipping(id: string) {
    const response = await post<ShippingOrder>(
      `/api/v1/shipping/shipping-orders/${id}/ship`,
      {}
    );
    return response.data;
  }

  async confirmDelivery(id: string) {
    const response = await post<ShippingOrder>(
      `/api/v1/shipping/shipping-orders/${id}/deliver`,
      {}
    );
    return response.data;
  }
}

export const shippingService = new ShippingService();
