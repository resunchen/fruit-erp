/**
 * 仓库管理 - React hooks
 */

import { useState, useCallback } from 'react';
import { warehouseService } from '@/services/warehouse.service';
import { InboundOrder, InboundOrderListResponse } from '@/types/warehouse';

export const useInboundOrders = () => {
  const [orders, setOrders] = useState<InboundOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const fetchOrders = useCallback(async (filters?: any) => {
    setLoading(true);
    try {
      const result = await warehouseService.getInboundOrders(filters);
      setOrders(result.items);
      setPagination(result.pagination);
      return result;
    } catch (error) {
      console.error('Failed to fetch inbound orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: any) => {
    try {
      const result = await warehouseService.createInboundOrder(data);
      return result;
    } catch (error) {
      console.error('Failed to create inbound order:', error);
      throw error;
    }
  }, []);

  const confirmOrder = useCallback(async (id: string, items: any[]) => {
    try {
      const result = await warehouseService.confirmInboundOrder(id, items);
      return result;
    } catch (error) {
      console.error('Failed to confirm inbound order:', error);
      throw error;
    }
  }, []);

  return {
    orders,
    loading,
    pagination,
    fetchOrders,
    createOrder,
    confirmOrder,
  };
};

export const useInventory = () => {
  const [inventories, setInventories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const queryInventory = useCallback(async (filters?: any) => {
    setLoading(true);
    try {
      const result = await warehouseService.queryInventory(filters);
      setInventories(result.items);
      setPagination(result.pagination);
      return result;
    } catch (error) {
      console.error('Failed to query inventory:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    inventories,
    loading,
    pagination,
    queryInventory,
  };
};

export const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWarehouses = useCallback(async (page?: number, limit?: number) => {
    setLoading(true);
    try {
      const result = await warehouseService.getWarehouses(page, limit);
      setWarehouses(result.items);
      return result;
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createWarehouse = useCallback(async (data: any) => {
    try {
      const result = await warehouseService.createWarehouse(data);
      return result;
    } catch (error) {
      console.error('Failed to create warehouse:', error);
      throw error;
    }
  }, []);

  return {
    warehouses,
    loading,
    fetchWarehouses,
    createWarehouse,
  };
};
