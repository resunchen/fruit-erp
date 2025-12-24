import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePurchaseOrders } from '../../hooks/usePurchaseOrders';
import { AITextInput } from '../../components/purchaseOrders/AITextInput';
import { AIParseResult } from '../../components/purchaseOrders/AIParseResult';
import type { AIParsePurchaseResult } from '../../types/aiParse';
import type { PurchaseOrderItem, PurchaseCost } from '../../types/purchaseOrder';

type Step = 'input' | 'result' | 'selectSupplier';

export default function PurchaseOrderAICreatePage() {
  const navigate = useNavigate();
  const { createOrder, isLoading, error } = usePurchaseOrders();
  const [step, setStep] = useState<Step>('input');
  const [parseResult, setParseResult] = useState<AIParsePurchaseResult | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [costs, setCosts] = useState<PurchaseCost[]>([]);

  const handleParseResult = (result: AIParsePurchaseResult) => {
    setParseResult(result);
    setStep('result');
    // 设置初始项目和成本
    if (result.suggested_order) {
      setItems(result.suggested_order.items);
      setCosts(result.suggested_order.costs);
    }
  };

  const handleConfirmResult = async (order: { items: PurchaseOrderItem[]; costs: PurchaseCost[] }) => {
    setItems(order.items);
    setCosts(order.costs);
    setStep('selectSupplier');
  };

  const handleCreateOrder = async () => {
    if (!selectedSupplierId || items.length === 0) {
      return;
    }

    try {
      await createOrder({
        supplier_id: selectedSupplierId,
        items,
        costs,
      });
      // 创建成功，返回列表页面
      navigate('/purchase-orders');
    } catch (err) {
      // 错误已在Hook中处理
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 头部 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/purchase-orders')}
            className="text-gray-600 hover:text-gray-900 mb-2"
          >
            ← 返回列表
          </button>
          <h1 className="text-3xl font-bold text-gray-900">AI 智能创建采购订单</h1>
          <p className="text-gray-600 mt-2">
            使用 AI 技术快速识别采购文本中的关键信息，智能提取采购价、数量、成本等数据
          </p>
        </div>

        {/* 步骤指示 */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              step === 'input' || step === 'result' || step === 'selectSupplier'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
              1
            </div>
            <span className="font-medium">输入文本</span>
          </div>

          <div className="flex-1 h-1 bg-gray-200" />

          <div
            className={`flex items-center gap-2 ${
              step === 'result' || step === 'selectSupplier' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'result' || step === 'selectSupplier'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              } font-bold text-sm`}
            >
              2
            </div>
            <span className="font-medium">确认数据</span>
          </div>

          <div className="flex-1 h-1 bg-gray-200" />

          <div
            className={`flex items-center gap-2 ${step === 'selectSupplier' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'selectSupplier' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              } font-bold text-sm`}
            >
              3
            </div>
            <span className="font-medium">选择供应商</span>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 内容区域 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {step === 'input' && (
            <AITextInput
              onParseResult={handleParseResult}
              onClose={() => navigate('/purchase-orders')}
            />
          )}

          {step === 'result' && parseResult && (
            <AIParseResult
              result={parseResult}
              onConfirm={handleConfirmResult}
              onCancel={() => setStep('input')}
              isLoading={isLoading}
            />
          )}

          {step === 'selectSupplier' && (
            <SupplierSelector
              selectedId={selectedSupplierId}
              onSelect={setSelectedSupplierId}
              items={items}
              costs={costs}
              onBack={() => setStep('result')}
              onCreateOrder={handleCreateOrder}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface SupplierSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  items: PurchaseOrderItem[];
  costs: PurchaseCost[];
  onBack: () => void;
  onCreateOrder: () => void;
  isLoading?: boolean;
}

function SupplierSelector({
  selectedId,
  onSelect,
  items,
  costs,
  onBack,
  onCreateOrder,
  isLoading,
}: SupplierSelectorProps) {
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  React.useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        // 这里应该调用 API 获取供应商列表
        // 目前为了演示，我们使用空列表
        setSuppliers([]);
      } catch (err) {
        console.error('加载供应商失败:', err);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    loadSuppliers();
  }, []);

  const itemsTotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const costsTotal = costs.reduce((sum, cost) => sum + cost.cost_amount, 0);
  const totalAmount = itemsTotal + costsTotal;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">选择供应商</h2>
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">
            供应商 <span className="text-red-500">*</span>
          </label>
          <select
            id="supplier"
            value={selectedId}
            onChange={e => onSelect(e.target.value)}
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
          {suppliers.length === 0 && !loadingSuppliers && (
            <p className="mt-2 text-sm text-gray-600">
              暂无供应商，请先在<a href="/suppliers" className="text-blue-600 hover:underline">供应商管理</a>中添加
            </p>
          )}
        </div>
      </div>

      {/* 订单摘要 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">订单摘要</h3>

        {items.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">订单项目</p>
            {items.map((item, idx) => (
              <div key={idx} className="text-sm text-gray-900">
                {item.product_name} - {item.quantity}{item.unit} @ ¥{item.unit_price}/单位
              </div>
            ))}
          </div>
        )}

        {costs.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">成本</p>
            {costs.map((cost, idx) => (
              <div key={idx} className="text-sm text-gray-900">
                {cost.cost_type} - ¥{cost.cost_amount}
              </div>
            ))}
          </div>
        )}

        <div className="text-right font-bold text-gray-900">
          订单总额: ¥{totalAmount.toFixed(2)}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          上一步
        </button>
        <button
          onClick={onCreateOrder}
          disabled={isLoading || !selectedId || items.length === 0}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '创建中...' : '确认创建'}
        </button>
      </div>
    </div>
  );
}
