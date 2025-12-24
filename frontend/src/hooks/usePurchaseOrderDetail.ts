import { useState, useCallback, useEffect } from 'react';
import { purchaseOrderService } from '../services/purchaseOrder.service';
import type { PurchaseOrderDetail, UpdatePurchaseOrderRequest } from '../types/purchaseOrder';

interface UsePurchaseOrderDetailState {
  order: PurchaseOrderDetail | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

export function usePurchaseOrderDetail(orderId?: string) {
  const [state, setState] = useState<UsePurchaseOrderDetailState>({
    order: null,
    isLoading: false,
    error: null,
    isSaving: false,
  });

  /**
   * 获取订单详情
   */
  const fetchOrderDetail = useCallback(
    async (id: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const order = await purchaseOrderService.getOrder(id);
        setState(prev => ({ ...prev, order, isLoading: false }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取订单详情失败';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        throw err;
      }
    },
    []
  );

  /**
   * 初始化时获取订单详情
   */
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId, fetchOrderDetail]);

  /**
   * 更新订单
   */
  const updateOrder = useCallback(
    async (id: string, data: UpdatePurchaseOrderRequest) => {
      try {
        setState(prev => ({ ...prev, isSaving: true, error: null }));
        await purchaseOrderService.updateOrder(id, data);
        // 重新获取订单详情
        await fetchOrderDetail(id);
        setState(prev => ({ ...prev, isSaving: false }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '更新订单失败';
        setState(prev => ({ ...prev, error: errorMessage, isSaving: false }));
        throw err;
      }
    },
    [fetchOrderDetail]
  );

  return {
    ...state,
    fetchOrderDetail,
    updateOrder,
  };
}
