import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { PurchaseOrderFormData, PurchaseOrderItem, PurchaseCost } from '../../types/purchaseOrder';
import type { Supplier } from '../../types/supplier';
import { supplierService } from '../../services/supplier.service';

interface PurchaseOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PurchaseOrderFormData) => Promise<void>;
  isLoading?: boolean;
  editingOrder?: any; // PurchaseOrderDetail
}

export function PurchaseOrderFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingOrder,
}: PurchaseOrderFormModalProps) {
  const [formData, setFormData] = useState<PurchaseOrderFormData>({
    supplier_id: '',
    items: [
      {
        product_name: '',
        quantity: 1,
        unit: '',
        unit_price: 0,
      },
    ],
    costs: [],
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState('');
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  // 加载供应商列表
  useEffect(() => {
    if (!isOpen) return;

    const loadSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        const response = await supplierService.getSuppliers({ limit: 100 });
        setSuppliers(response.items);
      } catch (err) {
        setError('加载供应商列表失败');
      } finally {
        setLoadingSuppliers(false);
      }
    };

    loadSuppliers();
  }, [isOpen]);

  // 初始化或重置表单
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        supplier_id: '',
        items: [
          {
            product_name: '',
            quantity: 1,
            unit: '',
            unit_price: 0,
          },
        ],
        costs: [],
      });
      setError('');
    } else if (editingOrder) {
      // 编辑模式：加载订单数据
      setFormData({
        supplier_id: editingOrder.supplier_id || '',
        items: editingOrder.items || [
          {
            product_name: '',
            quantity: 1,
            unit: '',
            unit_price: 0,
          },
        ],
        costs: editingOrder.costs || [],
      });
      setError('');
    }
  }, [isOpen, editingOrder]);

  const validateForm = (): boolean => {
    if (!formData.supplier_id) {
      setError('请选择供应商');
      return false;
    }

    if (formData.items.length === 0) {
      setError('订单必须至少包含一项');
      return false;
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.product_name || item.product_name.trim().length === 0) {
        setError(`第 ${i + 1} 项的商品名称不能为空`);
        return false;
      }
      if (item.quantity <= 0) {
        setError(`第 ${i + 1} 项的数量必须大于0`);
        return false;
      }
      if (!item.unit || item.unit.trim().length === 0) {
        setError(`第 ${i + 1} 项的单位不能为空`);
        return false;
      }
      if (item.unit_price < 0) {
        setError(`第 ${i + 1} 项的单价不能为负数`);
        return false;
      }
    }

    for (let i = 0; i < formData.costs.length; i++) {
      const cost = formData.costs[i];
      if (!cost.cost_type || cost.cost_type.trim().length === 0) {
        setError(`第 ${i + 1} 项成本的类型不能为空`);
        return false;
      }
      if (cost.cost_amount < 0) {
        setError(`第 ${i + 1} 项成本的金额不能为负数`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      // 错误已在外部处理
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_name: '',
          quantity: 1,
          unit: '',
          unit_price: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    setError('');
  };

  const handleAddCost = () => {
    setFormData(prev => ({
      ...prev,
      costs: [
        ...prev.costs,
        {
          cost_type: '',
          cost_amount: 0,
        },
      ],
    }));
  };

  const handleRemoveCost = (index: number) => {
    setFormData(prev => ({
      ...prev,
      costs: prev.costs.filter((_, i) => i !== index),
    }));
  };

  const handleCostChange = (index: number, field: keyof PurchaseCost, value: any) => {
    setFormData(prev => ({
      ...prev,
      costs: prev.costs.map((cost, i) =>
        i === index ? { ...cost, [field]: value } : cost
      ),
    }));
    setError('');
  };

  // 计算总金额
  const calculateTotal = () => {
    let total = 0;
    formData.items.forEach(item => {
      total += item.unit_price * item.quantity;
    });
    formData.costs.forEach(cost => {
      total += cost.cost_amount;
    });
    return total.toFixed(2);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingOrder ? '编辑采购订单' : '新增采购订单'}
      width="max-w-4xl"
      footer={
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900">
            总金额: ¥{calculateTotal()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '提交中...' : editingOrder ? '保存修改' : '提交'}
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <div className="flex-shrink-0 text-red-600 mt-0.5">
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

        {/* 供应商选择 */}
        <div>
          <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 mb-2">
            供应商 <span className="text-red-500">*</span>
          </label>
          <select
            id="supplier_id"
            value={formData.supplier_id}
            onChange={e => setFormData(prev => ({ ...prev, supplier_id: e.target.value }))}
            disabled={isLoading || loadingSuppliers}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">选择供应商...</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* 订单项目 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">订单项目 <span className="text-red-500">*</span></label>
            <button
              type="button"
              onClick={handleAddItem}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              + 添加项目
            </button>
          </div>

          <div className="space-y-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
            {formData.items.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-600">项目 {index + 1}</span>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                    >
                      删除
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="商品名称"
                    value={item.product_name}
                    onChange={e => handleItemChange(index, 'product_name', e.target.value)}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="数量"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="单位"
                    value={item.unit}
                    onChange={e => handleItemChange(index, 'unit', e.target.value)}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="单价"
                    value={item.unit_price}
                    onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="text-right text-sm text-gray-600">
                  小计: ¥{(item.unit_price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 额外成本 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">额外成本（可选）</label>
            <button
              type="button"
              onClick={handleAddCost}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              + 添加成本
            </button>
          </div>

          {formData.costs.length > 0 && (
            <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
              {formData.costs.map((cost, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="成本类型（如：运费、包装费）"
                    value={cost.cost_type}
                    onChange={e => handleCostChange(index, 'cost_type', e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="金额"
                    value={cost.cost_amount}
                    onChange={e => handleCostChange(index, 'cost_amount', parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCost(index)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
