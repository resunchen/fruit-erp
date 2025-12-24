import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseOrderDetail } from '../../hooks/usePurchaseOrderDetail';
import { PurchaseOrderFormModal } from '../../components/purchaseOrders/PurchaseOrderFormModal';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/purchaseOrder';
import type { UpdatePurchaseOrderRequest } from '../../types/purchaseOrder';

const COST_TYPE_LABELS: Record<string, string> = {
  '采购价格': '采购价格',
  '采购数量': '采购数量',
  '代办费': '代办费',
  '选瓜人工': '选瓜人工',
  '中转运费': '中转运费',
  '中转包装': '中转包装',
  '装车费': '装车费',
  '卸车费': '卸车费',
  '网套': '网套',
};

const UNITS = ['斤', '箱', '个', '公斤', '吨', '件'];

export default function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, isLoading, error, isSaving, fetchOrderDetail, updateOrder } = usePurchaseOrderDetail(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusChangeModal, setStatusChangeModal] = useState<{ isOpen: boolean; newStatus?: string }>({
    isOpen: false,
  });

  useEffect(() => {
    if (id) {
      fetchOrderDetail(id);
    }
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">订单不存在</h1>
          <button
            onClick={() => navigate('/purchase-orders')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">获取订单失败</h1>
          <p className="text-gray-600 mb-4">{error || '订单不存在'}</p>
          <button
            onClick={() => navigate('/purchase-orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const handleEditSubmit = async (formData: any) => {
    try {
      await updateOrder(id, {
        supplier_id: formData.supplier_id,
        items: formData.items,
        costs: formData.costs,
      });
      setIsEditModalOpen(false);
    } catch (err) {
      // 错误已在Hook中处理
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOrder(id, { status: newStatus });
      setStatusChangeModal({ isOpen: false });
    } catch (err) {
      // 错误已在Hook中处理
    }
  };

  // 可用的状态转移（简单规则）
  const getAvailableStatuses = () => {
    const statuses: string[] = [];
    switch (order.status) {
      case 'draft':
        statuses.push('confirmed');
        statuses.push('cancelled');
        break;
      case 'confirmed':
        statuses.push('completed');
        statuses.push('cancelled');
        break;
      case 'completed':
      case 'cancelled':
        break;
    }
    return statuses;
  };

  const itemsTotal = order.items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const costsTotal = order.costs.reduce((sum, cost) => sum + cost.cost_amount, 0);
  const totalAmount = itemsTotal + costsTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => navigate('/purchase-orders')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← 返回列表
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">订单详情</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              编辑
            </button>
            {getAvailableStatuses().length > 0 && (
              <button
                onClick={() => setStatusChangeModal({ isOpen: true })}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                更改状态
              </button>
            )}
          </div>
        </div>

        {/* 基本信息卡片 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">订单号</p>
              <p className="text-lg font-semibold text-gray-900">{order.order_number}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">供应商</p>
              <p className="text-lg font-semibold text-gray-900">{order.supplier_name || '未知'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">状态</p>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  STATUS_COLORS[order.status] || STATUS_COLORS.draft
                }`}
              >
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">创建时间</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(order.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
        </div>

        {/* 订单项目 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">订单项目</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">商品名称</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">数量</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">单位</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">单价 (¥)</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">小计 (¥)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={item.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {typeof item.quantity === 'number' ? item.quantity.toFixed(2) : item.quantity}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">{item.unit}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {typeof item.unit_price === 'number' ? item.unit_price.toFixed(4) : item.unit_price}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        ¥{((item.total_price || item.unit_price * item.quantity) as number).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      暂无订单项目
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right text-lg font-semibold text-gray-900">
            项目合计: ¥{itemsTotal.toFixed(2)}
          </div>
        </div>

        {/* 成本明细 */}
        {order.costs && order.costs.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">成本明细</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">成本类型</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">金额 (¥)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.costs.map((cost, index) => (
                    <tr key={cost.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {COST_TYPE_LABELS[cost.cost_type] || cost.cost_type}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        ¥{typeof cost.cost_amount === 'number' ? cost.cost_amount.toFixed(2) : cost.cost_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right text-lg font-semibold text-gray-900">
              成本合计: ¥{costsTotal.toFixed(2)}
            </div>
          </div>
        )}

        {/* 总金额 */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="text-right text-3xl font-bold text-blue-900">
            订单总额: ¥{totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 编辑模态框 */}
      <PurchaseOrderFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingOrder={order}
        onSubmit={handleEditSubmit}
        isLoading={isSaving}
      />

      {/* 状态变更确认模态框 */}
      {statusChangeModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setStatusChangeModal({ isOpen: false })} />
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">更改订单状态</h3>
                <div className="space-y-2 mb-6">
                  {getAvailableStatuses().map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={isSaving}
                      className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStatusChangeModal({ isOpen: false })}
                  disabled={isSaving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
