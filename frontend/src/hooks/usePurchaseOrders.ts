import { useCallback } from 'react';
import { usePurchaseOrderStore } from '../store/purchaseOrderStore';
import { purchaseOrderService } from '../services/purchaseOrder.service';
import type {
  PurchaseOrderFilters,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from '../types/purchaseOrder';

export function usePurchaseOrders() {
  const { orders, pagination, isLoading, error, filters, setOrders, setPagination, setLoading, setError, setFilters } =
    usePurchaseOrderStore();

  /**
   * 获取订单列表
   */
  const fetchOrders = useCallback(
    async (customFilters?: Partial<PurchaseOrderFilters>) => {
      try {
        setLoading(true);
        setError(null);

        const newFilters = customFilters ? { ...filters, ...customFilters } : filters;
        if (customFilters) {
          setFilters(newFilters);
        }

        const response = await purchaseOrderService.getOrders(newFilters);
        setOrders(response.items);
        setPagination(response.pagination);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取采购订单列表失败';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters, setOrders, setPagination, setLoading, setError, setFilters]
  );

  /**
   * 创建订单
   */
  const createOrder = useCallback(
    async (data: CreatePurchaseOrderRequest) => {
      try {
        setLoading(true);
        setError(null);
        await purchaseOrderService.createOrder(data);
        // 重新获取列表
        await fetchOrders({ page: 1 });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '创建采购订单失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, fetchOrders]
  );

  /**
   * 更新订单
   */
  const updateOrder = useCallback(
    async (id: string, data: UpdatePurchaseOrderRequest) => {
      try {
        setLoading(true);
        setError(null);
        await purchaseOrderService.updateOrder(id, data);
        // 重新获取列表
        await fetchOrders();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '更新采购订单失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, fetchOrders]
  );

  /**
   * 删除订单
   */
  const deleteOrder = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await purchaseOrderService.deleteOrder(id);
        // 重新获取列表
        await fetchOrders();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '删除采购订单失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, fetchOrders]
  );

  /**
   * 更新过滤条件
   */
  const updateFilters = useCallback(
    async (newFilters: Partial<PurchaseOrderFilters>) => {
      const combined = { ...filters, ...newFilters, page: 1 };
      setFilters(combined);
      await fetchOrders(combined);
    },
    [filters, setFilters, fetchOrders]
  );

  /**
   * 跳转到指定页面
   */
  const goToPage = useCallback(
    async (page: number) => {
      await fetchOrders({ page });
    },
    [fetchOrders]
  );

  return {
    orders,
    pagination,
    isLoading,
    error,
    filters,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateFilters,
    goToPage,
  };
}
