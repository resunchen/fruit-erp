import React, { useEffect, useState } from 'react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { SupplierFormModal } from '../../components/suppliers/SupplierFormModal';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { SearchInput } from '../../components/ui/SearchInput';
import type { Supplier } from '../../types/supplier';

export default function SupplierListPage() {
  const { suppliers, pagination, isLoading, error, fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } =
    useSuppliers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearch = (search: string) => {
    fetchSuppliers({ search, page: 1 });
  };

  const handleCreateClick = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, data);
      } else {
        await createSupplier(data);
      }
      setIsFormOpen(false);
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setDeleteConfirm({ id: supplier.id, name: supplier.name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteSupplier(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  const columns = [
    {
      key: 'name',
      title: '供应商名称',
      width: '20%',
    },
    {
      key: 'contact_person',
      title: '联系人',
      width: '15%',
    },
    {
      key: 'phone',
      title: '电话',
      width: '15%',
    },
    {
      key: 'email',
      title: '邮箱',
      width: '20%',
    },
    {
      key: 'status',
      title: '状态',
      width: '10%',
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value === 'active' ? '活跃' : '非活跃'}
        </span>
      ),
    },
    {
      key: 'id',
      title: '操作',
      width: '20%',
      render: (_: any, record: Supplier) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditClick(record)}
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
            <h1 className="text-3xl font-bold text-gray-900">供应商管理</h1>
            <p className="text-gray-600 mt-1">管理和维护供应商信息</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + 新增供应商
          </button>
        </div>

        {/* 搜索框 */}
        <div className="mb-6">
          <SearchInput onSearch={handleSearch} />
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
        <Table columns={columns} data={suppliers} loading={isLoading} />

        {/* 分页 */}
        {suppliers.length > 0 && (
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            totalPages={pagination.totalPages}
            onChange={(page) => fetchSuppliers({ page })}
          />
        )}
      </div>

      {/* 表单弹窗 */}
      <SupplierFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        supplier={editingSupplier}
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
                  确定要删除供应商 <span className="font-medium">"{deleteConfirm.name}"</span> 吗？此操作无法撤销。
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
