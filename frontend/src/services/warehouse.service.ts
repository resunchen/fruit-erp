/**
 * 仓储管理 - 前端服务
 */

import { request, get, post, put } from '@/utils/request';
import {
  Warehouse,
  InboundOrder,
  OutboundOrder,
  Inventory,
  InventoryAlert,
  InboundOrderListResponse,
} from '@/types/warehouse';

class WarehouseService {
  /**
   * 仓库管理
   */
  async getWarehouses(page: number = 1, limit: number = 20) {
    const response = await get<any>('/api/v1/warehouse/warehouses', {
      params: { page, limit },
    });
    return response.data;
  }

  async createWarehouse(data: {
    name: string;
    location?: string;
    capacity?: number;
    temperature_controlled?: boolean;
  }) {
    const response = await post<Warehouse>('/api/v1/warehouse/warehouses', data);
    return response.data;
  }

  async getWarehouseById(id: string) {
    const response = await get<Warehouse>(`/api/v1/warehouse/warehouses/${id}`);
    return response.data;
  }

  /**
   * 库位管理
   */
  async getWarehouseLocations(warehouseId: string, page: number = 1, limit: number = 20) {
    const response = await get<any>(
      `/api/v1/warehouse/warehouses/${warehouseId}/locations`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  async createWarehouseLocation(
    warehouseId: string,
    data: {
      location_code: string;
      rack_number?: number;
      shelf_number?: number;
      capacity?: number;
    }
  ) {
    const response = await post<any>(
      `/api/v1/warehouse/warehouses/${warehouseId}/locations`,
      data
    );
    return response.data;
  }

  /**
   * 库存查询
   */
  async queryInventory(filters: {
    warehouse_id?: string;
    location_id?: string;
    product_name?: string;
    batch_id?: string;
    status?: string;
    expiration_date_from?: string;
    expiration_date_to?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await get<any>('/api/v1/warehouse/inventory', {
      params: filters,
    });
    return response.data;
  }

  async getInventoryAlerts(page: number = 1, limit: number = 20, filters?: any) {
    const response = await get<any>('/api/v1/warehouse/inventory-alerts', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  /**
   * 入库单
   */
  async getInboundOrders(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await get<InboundOrderListResponse>(
      '/api/v1/warehouse/inbound-orders',
      {
        params: filters,
      }
    );
    return response.data;
  }

  async createInboundOrder(data: {
    purchase_order_id: string;
    warehouse_id: string;
    items: any[];
  }) {
    const response = await post<InboundOrder>(
      '/api/v1/warehouse/inbound-orders',
      data
    );
    return response.data;
  }

  async getInboundOrderById(id: string) {
    const response = await get<InboundOrder>(
      `/api/v1/warehouse/inbound-orders/${id}`
    );
    return response.data;
  }

  async confirmInboundOrder(id: string, items: any[]) {
    const response = await post<InboundOrder>(
      `/api/v1/warehouse/inbound-orders/${id}/confirm`,
      { items }
    );
    return response.data;
  }

  /**
   * 出库单
   */
  async getOutboundOrders(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await get<any>('/api/v1/warehouse/outbound-orders', {
      params: filters,
    });
    return response.data;
  }

  async createOutboundOrder(data: {
    warehouse_id: string;
    related_order_id?: string;
    items: any[];
  }) {
    const response = await post<OutboundOrder>(
      '/api/v1/warehouse/outbound-orders',
      data
    );
    return response.data;
  }

  async getOutboundOrderById(id: string) {
    const response = await get<OutboundOrder>(
      `/api/v1/warehouse/outbound-orders/${id}`
    );
    return response.data;
  }

  async confirmOutboundOrder(id: string, items: any[]) {
    const response = await post<OutboundOrder>(
      `/api/v1/warehouse/outbound-orders/${id}/confirm`,
      { items }
    );
    return response.data;
  }
}

export const warehouseService = new WarehouseService();
