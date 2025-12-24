/**
 * AI 解析相关的类型定义
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
 * AI 解析请求
 */
export interface AIParsePurchaseRequest {
  text: string;
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
 * AI 解析请求记录（用于调试和日志）
 */
export interface AIParseRequest {
  id: string;
  user_id: string;
  input_text: string;
  parse_result: AIParsePurchaseResult;
  confidence: number;
  status: 'success' | 'partial' | 'failed';
  created_at: string;
}

/**
 * 单位标准化映射
 */
export const UNIT_MAPPINGS: Record<string, string> = {
  '斤': '斤',
  'jin': '斤',
  '公斤': '公斤',
  'kg': '公斤',
  '吨': '吨',
  'ton': '吨',
  '箱': '箱',
  'box': '箱',
  '个': '个',
  'piece': '个',
  '件': '件',
  'item': '件',
  '元': '元',
  '¥': '元',
  'cny': '元',
  '块': '块',
  '袋': '袋',
};

/**
 * 数字识别模式
 */
export const NUMBER_PATTERNS = {
  // 匹配常见的数字格式：123, 123.45, 1,234.56 等
  decimal: /[\d,]+\.?\d*/g,
  // 匹配中文数字
  chinese: /[零一二三四五六七八九十百千万亿]+/g,
};

/**
 * 采购成本字段字典（默认配置）
 */
export const DEFAULT_COST_DICTIONARY: CostFieldDictionary = {
  '采购价格': ['采购价', '采购单价', '价格', '单价', '每斤', '¥/斤'],
  '采购数量': ['采购斤两', '采购数量', '斤两', '数量', '共计'],
  '代办费': ['代办费', '代理费', '手续费'],
  '选瓜人工': ['选瓜人工', '选瓜工人费', '人工费', '挑选费'],
  '中转运费': ['中转运费', '中转费', '运费', '物流费'],
  '中转包装': ['中转包装', '包装费', '中转包装费', '纸箱费'],
  '装车费': ['装车费', '中转装车费', '装卸费'],
  '卸车费': ['卸车费', '仓库卸车费', '卸车'],
  '网套': ['网套', '塑料套', '套子'],
  '品质折扣': ['品质折扣', '折扣', '减价'],
};

/**
 * 常见商品名称关键词
 */
export const COMMON_PRODUCT_KEYWORDS = [
  '瓜',
  '西瓜',
  '甜瓜',
  '哈密瓜',
  '水果',
  '果实',
  '蔬菜',
  '水果箱',
  '包装',
];
