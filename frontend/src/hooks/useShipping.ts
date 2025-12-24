/**
 * 发货管理 - React hooks
 */

import { useState, useCallback } from 'react';
import { shippingService } from '@/services/shipping.service';
import { SalesOrder, PackingOrder, ShippingOrder } from '@/types/shipping';

export const useSalesOrders = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
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
      const result = await shippingService.getSalesOrders(filters);
      setOrders(result.items);
      setPagination(result.pagination);
      return result;
    } catch (error) {
      console.error('Failed to fetch sales orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: any) => {
    try {
      const result = await shippingService.createSalesOrder(data);
      return result;
    } catch (error) {
      console.error('Failed to create sales order:', error);
      throw error;
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    try {
      const result = await shippingService.updateSalesOrderStatus(id, status);
      return result;
    } catch (error) {
      console.error('Failed to update sales order status:', error);
      throw error;
    }
  }, []);

  return {
    orders,
    loading,
    pagination,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  };
};

export const usePackingOrders = () => {
  const [orders, setOrders] = useState<PackingOrder[]>([]);
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
      const result = await shippingService.getPackingOrders(filters);
      setOrders(result.items);
      setPagination(result.pagination);
      return result;
    } catch (error) {
      console.error('Failed to fetch packing orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: any) => {
    try {
      const result = await shippingService.createPackingOrder(data);
      return result;
    } catch (error) {
      console.error('Failed to create packing order:', error);
      throw error;
    }
  }, []);

  const completeOrder = useCallback(async (id: string, data: any) => {
    try {
      const result = await shippingService.completePackingOrder(id, data);
      return result;
    } catch (error) {
      console.error('Failed to complete packing order:', error);
      throw error;
    }
  }, []);

  return {
    orders,
    loading,
    pagination,
    fetchOrders,
    createOrder,
    completeOrder,
  };
};

export const useShippingOrders = () => {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
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
      const result = await shippingService.getShippingOrders(filters);
      setOrders(result.items);
      setPagination(result.pagination);
      return result;
    } catch (error) {
      console.error('Failed to fetch shipping orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: any) => {
    try {
      const result = await shippingService.createShippingOrder(data);
      return result;
    } catch (error) {
      console.error('Failed to create shipping order:', error);
      throw error;
    }
  }, []);

  const confirmShipping = useCallback(async (id: string) => {
    try {
      const result = await shippingService.confirmShipping(id);
      return result;
    } catch (error) {
      console.error('Failed to confirm shipping:', error);
      throw error;
    }
  }, []);

  const confirmDelivery = useCallback(async (id: string) => {
    try {
      const result = await shippingService.confirmDelivery(id);
      return result;
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
      throw error;
    }
  }, []);

  return {
    orders,
    loading,
    pagination,
    fetchOrders,
    createOrder,
    confirmShipping,
    confirmDelivery,
  };
};
