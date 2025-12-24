/**
 * AI 解析相关的前端类型定义
 */

/**
 * 采购成本字段字典配置
 */
export interface CostFieldDictionary {
  [fieldName: string]: string[]; // 字段名称 -> 关键词列表
}

/**
 * AI 解析的原始匹配结果
 */
export interface RawMatchResult {
  field: string; // 字段名称
  matches: string[]; // 匹配到的关键词
  value?: string | number; // 识别到的值
  confidence: number; // 置信度 0-1
}

/**
 * AI 解析结果
 */
export interface AIParsePurchaseResult {
  parsed_fields: Record<string, any>; // 解析结果的字段
  raw_matches: RawMatchResult[]; // 原始匹配结果
  suggested_order?: {
    supplier_id?: string;
    items: Array<{
      product_name: string;
      quantity: number;
      unit: string;
      unit_price: number;
    }>;
    costs: Array<{
      cost_type: string;
      cost_amount: number;
    }>;
  }; // 建议的订单数据
  confidence: number; // 总体置信度
}

/**
 * AI 解析状态
 */
export interface AIParseState {
  parseResult: AIParsePurchaseResult | null;
  isLoading: boolean;
  error: string | null;
  inputText: string;
}

/**
 * 成本类型标签
 */
export const COST_TYPE_LABELS: Record<string, string> = {
  '采购价格': '采购价格',
  '采购数量': '采购数量',
  '代办费': '代办费',
  '选瓜人工': '选瓜人工',
  '中转运费': '中转运费',
  '中转包装': '中转包装',
  '装车费': '装车费',
  '卸车费': '卸车费',
  '网套': '网套',
  '品质折扣': '品质折扣',
};

/**
 * 单位列表
 */
export const UNITS = ['斤', '箱', '个', '公斤', '吨', '件'];
