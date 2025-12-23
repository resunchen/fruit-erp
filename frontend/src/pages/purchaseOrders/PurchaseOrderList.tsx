import React, { useEffect, useState } from 'react';
import { usePurchaseOrders } from '../../hooks/usePurchaseOrders';
import { PurchaseOrderFormModal } from '../../components/purchaseOrders/PurchaseOrderFormModal';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { SearchInput } from '../../components/ui/SearchInput';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/purchaseOrder';
import type { PurchaseOrder, PurchaseOrderFormData } from '../../types/purchaseOrder';

export default function PurchaseOrderListPage() {
  const {
    orders,
    pagination,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    deleteOrder,
  } = usePurchaseOrders();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; order_number: string } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (search: string) => {
    fetchOrders({ search, page: 1 });
  };

  const handleCreateClick = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: PurchaseOrderFormData) => {
    try {
      await createOrder({
        supplier_id: data.supplier_id,
        items: data.items,
        costs: data.costs,
      });
      setIsFormOpen(false);
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  const handleDeleteClick = (order: PurchaseOrder) => {
    setDeleteConfirm({ id: order.id, order_number: order.order_number });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteOrder(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  const columns = [
    {
      key: 'order_number',
      title: '订单号',
      width: '15%',
    },
    {
      key: 'supplier_id',
      title: '供应商',
      width: '20%',
      render: (value: string) => {
        // 如果后续API返回supplier_name，可以直接使用
        return value;
      },
    },
    {
      key: 'total_amount',
      title: '总金额',
      width: '12%',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      key: 'status',
      title: '状态',
      width: '15%',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[value] || STATUS_COLORS.draft}`}>
          {STATUS_LABELS[value] || value}
        </span>
      ),
    },
    {
      key: 'created_at',
      title: '创建时间',
      width: '15%',
      render: (value: string) => new Date(value).toLocaleDateString('zh-CN'),
    },
    {
      key: 'id',
      title: '操作',
      width: '23%',
      render: (_: any, record: PurchaseOrder) => (
        <div className="flex gap-2">
          <button
            onClick={() => {}}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            查看
          </button>
          <button
            onClick={() => {}}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            编辑
          </button>
          <button
            onClick={() => handleDeleteClick(record)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            删除
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">采购订单</h1>
            <p className="text-gray-600 mt-1">管理和维护采购订单</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + 新增订单
          </button>
        </div>

        {/* 搜索框 */}
        <div className="mb-6">
          <SearchInput onSearch={handleSearch} placeholder="按订单号搜索..." />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <div className="flex-shrink-0 text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* 表格 */}
        <Table columns={columns} data={orders} loading={isLoading} />

        {/* 分页 */}
        {orders.length > 0 && (
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            totalPages={pagination.totalPages}
            onChange={(page) => fetchOrders({ page })}
          />
        )}

        {/* 空状态 */}
        {!isLoading && orders.length === 0 && !error && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无采购订单</h3>
            <p className="mt-1 text-sm text-gray-500">开始创建您的第一个采购订单</p>
          </div>
        )}
      </div>

      {/* 表单弹窗 */}
      <PurchaseOrderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      {/* 删除确认弹窗 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDeleteConfirm(null)}></div>
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">确认删除</h3>
                <p className="text-gray-600 mb-6">
                  确定要删除采购订单 <span className="font-medium">"{deleteConfirm.order_number}"</span> 吗？此操作无法撤销。
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isLoading ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
