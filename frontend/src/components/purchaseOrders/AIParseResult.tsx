import React, { useState } from 'react';
import type { AIParsePurchaseResult } from '../../types/aiParse';
import type { PurchaseOrderItem, PurchaseCost } from '../../types/purchaseOrder';
import { UNITS, COST_TYPE_LABELS } from '../../types/aiParse';

interface AIParseResultProps {
  result: AIParsePurchaseResult;
  onConfirm?: (order: { items: PurchaseOrderItem[]; costs: PurchaseCost[] }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AIParseResult({ result, onConfirm, onCancel, isLoading }: AIParseResultProps) {
  const [items, setItems] = useState<PurchaseOrderItem[]>(result.suggested_order?.items || []);
  const [costs, setCosts] = useState<PurchaseCost[]>(result.suggested_order?.costs || []);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingCostIndex, setEditingCostIndex] = useState<number | null>(null);

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...items];
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index][field] = parseFloat(value) || 0;
      // 自动更新total_price
      if (field === 'quantity' || field === 'unit_price') {
        newItems[index].total_price = (newItems[index].quantity || 0) * (newItems[index].unit_price || 0);
      }
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    const newItem: PurchaseOrderItem = {
      product_name: '',
      quantity: 1,
      unit: '斤',
      unit_price: 0,
      total_price: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCostChange = (index: number, field: keyof PurchaseCost, value: any) => {
    const newCosts = [...costs];
    if (field === 'cost_amount') {
      newCosts[index][field] = parseFloat(value) || 0;
    } else {
      newCosts[index][field] = value;
    }
    setCosts(newCosts);
  };

  const handleAddCost = () => {
    const newCost: PurchaseCost = {
      cost_type: '',
      cost_amount: 0,
    };
    setCosts([...costs, newCost]);
  };

  const handleRemoveCost = (index: number) => {
    setCosts(costs.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    onConfirm?.({ items, costs });
  };

  const itemsTotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const costsTotal = costs.reduce((sum, cost) => sum + cost.cost_amount, 0);
  const totalAmount = itemsTotal + costsTotal;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* 信心度 */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">识别准确度</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${(result.confidence || 0) * 100}%` }}
              />
            </div>
            <span className="text-sm text-blue-900">
              {((result.confidence || 0) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* 订单项目 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-900">订单项目</h3>
          <button
            onClick={handleAddItem}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            + 添加项目
          </button>
        </div>

        <div className="space-y-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">项目 {index + 1}</span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="商品名称"
                    value={item.product_name}
                    onChange={e => handleItemChange(index, 'product_name', e.target.value)}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="数量"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={item.unit}
                    onChange={e => handleItemChange(index, 'unit', e.target.value)}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="单价"
                    value={item.unit_price}
                    onChange={e => handleItemChange(index, 'unit_price', e.target.value)}
                    disabled={isLoading}
                    step="0.01"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="text-right text-sm text-gray-600">
                  小计: ¥{((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">暂无订单项目</div>
          )}
        </div>

        <div className="mt-2 text-right font-semibold text-gray-900">
          项目合计: ¥{itemsTotal.toFixed(2)}
        </div>
      </div>

      {/* 成本明细 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-900">成本明细</h3>
          <button
            onClick={handleAddCost}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            + 添加成本
          </button>
        </div>

        {costs.length > 0 && (
          <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
            {costs.map((cost, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-2 flex gap-2 items-end">
                <select
                  value={cost.cost_type}
                  onChange={e => handleCostChange(index, 'cost_type', e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">选择成本类型</option>
                  {Object.entries(COST_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="金额"
                  value={cost.cost_amount}
                  onChange={e => handleCostChange(index, 'cost_amount', e.target.value)}
                  disabled={isLoading}
                  step="0.01"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => handleRemoveCost(index)}
                  disabled={isLoading}
                  className="px-2 py-2 text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}

        {costs.length > 0 && (
          <div className="mt-2 text-right font-semibold text-gray-900">
            成本合计: ¥{costsTotal.toFixed(2)}
          </div>
        )}
      </div>

      {/* 总金额 */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-right">
        <div className="text-lg font-bold text-blue-900">
          订单总额: ¥{totalAmount.toFixed(2)}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          取消
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading || items.length === 0}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '提交中...' : '确认并创建订单'}
        </button>
      </div>
    </div>
  );
}
