import React, { useState } from 'react';
import { useAIParse } from '../../hooks/useAIParse';
import type { AIParsePurchaseResult } from '../../types/aiParse';

interface AITextInputProps {
  onParseResult?: (result: AIParsePurchaseResult) => void;
  onClose?: () => void;
}

type InputMode = 'text' | 'dialogue';

export function AITextInput({ onParseResult, onClose }: AITextInputProps) {
  const { parseResult, isLoading, error, parseText, clearResult } = useAIParse();
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [dialogueLines, setDialogueLines] = useState<string[]>(['']);

  const handleTextParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) {
      return;
    }
    try {
      const result = await parseText(textInput);
      onParseResult?.(result);
    } catch (err) {
      // 错误已在Hook中处理
    }
  };

  const handleDialogueLine = (index: number, value: string) => {
    const newLines = [...dialogueLines];
    newLines[index] = value;
    setDialogueLines(newLines);
  };

  const handleAddDialogueLine = () => {
    setDialogueLines([...dialogueLines, '']);
  };

  const handleRemoveDialogueLine = (index: number) => {
    if (dialogueLines.length > 1) {
      setDialogueLines(dialogueLines.filter((_, i) => i !== index));
    }
  };

  const handleDialogueParse = async (index: number) => {
    const line = dialogueLines[index].trim();
    if (!line) {
      return;
    }
    try {
      const result = await parseText(line);
      onParseResult?.(result);
    } catch (err) {
      // 错误已在Hook中处理
    }
  };

  const handleClearAll = () => {
    setTextInput('');
    setDialogueLines(['']);
    clearResult();
  };

  if (parseResult) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">解析结果</h3>
          <button
            onClick={clearResult}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* 识别信心度 */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">识别信心度</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(parseResult.confidence || 0) * 100}%` }}
                />
              </div>
              <span className="text-sm text-blue-900">
                {((parseResult.confidence || 0) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* 解析的字段 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">识别字段</h4>
          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
            {Object.entries(parseResult.parsed_fields).map(([key, value]) => (
              value !== null && value !== undefined && (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-700">{key}</span>
                  <span className="font-medium text-gray-900">{String(value)}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* 建议的订单 */}
        {parseResult.suggested_order && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">建议订单</h4>
            <div className="bg-green-50 rounded-lg p-3">
              {parseResult.suggested_order.items.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">订单项目</p>
                  {parseResult.suggested_order.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-900">
                      {item.product_name} - {item.quantity}{item.unit} @ ¥{item.unit_price}/单位
                    </div>
                  ))}
                </div>
              )}
              {parseResult.suggested_order.costs.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">成本</p>
                  {parseResult.suggested_order.costs.map((cost, idx) => (
                    <div key={idx} className="text-sm text-gray-900">
                      {cost.cost_type} - ¥{cost.cost_amount}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">AI 采购文本解析</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        )}
      </div>

      {/* 输入模式选择 */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setInputMode('text')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            inputMode === 'text'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          文本粘贴
        </button>
        <button
          onClick={() => setInputMode('dialogue')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            inputMode === 'dialogue'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          对话录入
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 文本粘贴模式 */}
      {inputMode === 'text' && (
        <form onSubmit={handleTextParse} className="space-y-3">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              粘贴采购相关文本（支持多行）
            </label>
            <textarea
              id="text-input"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              disabled={isLoading}
              placeholder="粘贴采购文本，系统会自动识别采购价、数量、成本等信息..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              rows={6}
            />
            <div className="mt-1 text-xs text-gray-500">
              已输入 {textInput.length} / 5000 字符
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !textInput.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? '解析中...' : '解析'}
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              清空
            </button>
          </div>
        </form>
      )}

      {/* 对话录入模式 */}
      {inputMode === 'dialogue' && (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-3">
            逐行输入采购信息，系统会实时识别和解析
          </div>

          {dialogueLines.map((line, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={line}
                onChange={e => handleDialogueLine(index, e.target.value)}
                disabled={isLoading}
                placeholder={`行 ${index + 1}: 如 "西瓜 1300斤 4.9元/斤"`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
              <button
                onClick={() => handleDialogueParse(index)}
                disabled={isLoading || !line.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-medium text-sm"
              >
                解析
              </button>
              {dialogueLines.length > 1 && (
                <button
                  onClick={() => handleRemoveDialogueLine(index)}
                  disabled={isLoading}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 font-medium text-sm"
                >
                  删除
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleAddDialogueLine}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium text-sm"
          >
            + 添加行
          </button>

          <button
            onClick={handleClearAll}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            清空所有
          </button>
        </div>
      )}
    </div>
  );
}
