import {
  DEFAULT_COST_DICTIONARY,
  UNIT_MAPPINGS,
  NUMBER_PATTERNS,
  COMMON_PRODUCT_KEYWORDS,
} from '../types/aiParse';
import type {
  AIParsePurchaseRequest,
  AIParsePurchaseResult,
  RawMatchResult,
  CostFieldDictionary,
} from '../types/aiParse';

/**
 * AI 采购文本解析服务
 * 实现本地词典匹配，不调用 LLM
 */
export const aiParseService = {
  /**
   * 将文本转换为小写并移除空白
   */
  normalizeText(text: string): string {
    return text.toLowerCase().trim();
  },

  /**
   * 提取文本中的数字
   */
  extractNumbers(text: string): number[] {
    const matches = text.match(NUMBER_PATTERNS.decimal);
    if (!matches) return [];

    return matches
      .map(match => {
        // 移除逗号
        const cleaned = match.replace(/,/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      })
      .filter((n): n is number => n !== null);
  },

  /**
   * 识别单位
   */
  identifyUnit(text: string): string | null {
    const normalized = this.normalizeText(text);

    for (const [original, standardized] of Object.entries(UNIT_MAPPINGS)) {
      if (normalized.includes(original.toLowerCase())) {
        return standardized;
      }
    }

    return null;
  },

  /**
   * 识别商品名称
   */
  identifyProductName(text: string): string | null {
    const normalized = this.normalizeText(text);

    // 查找常见的商品关键词
    for (const keyword of COMMON_PRODUCT_KEYWORDS) {
      if (normalized.includes(keyword)) {
        // 尝试提取包含这个关键词的最长子句
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.toLowerCase().includes(keyword)) {
            return line.trim();
          }
        }
      }
    }

    return null;
  },

  /**
   * 匹配成本字段
   */
  matchCostFields(
    text: string,
    dictionary: CostFieldDictionary = DEFAULT_COST_DICTIONARY
  ): Map<string, RawMatchResult> {
    const normalized = this.normalizeText(text);
    const results = new Map<string, RawMatchResult>();

    for (const [fieldName, keywords] of Object.entries(dictionary)) {
      for (const keyword of keywords) {
        if (normalized.includes(keyword.toLowerCase())) {
          // 计算置信度（根据关键词长度）
          const confidence = Math.min(1, keyword.length / 10);

          results.set(fieldName, {
            field: fieldName,
            matches: [keyword],
            confidence,
          });

          // 尝试从匹配的关键词后面提取数字
          const lines = text.split(/[,，\n]/);
          for (const line of lines) {
            if (line.toLowerCase().includes(keyword.toLowerCase())) {
              const numbers = this.extractNumbers(line);
              if (numbers.length > 0) {
                const result = results.get(fieldName)!;
                result.value = numbers[0];
              }
            }
          }

          break;
        }
      }
    }

    return results;
  },

  /**
   * 解析采购文本
   */
  parsePurchaseText(request: AIParsePurchaseRequest): AIParsePurchaseResult {
    const text = request.text;
    const normalized = this.normalizeText(text);

    // 1. 匹配成本字段
    const costMatches = this.matchCostFields(text);
    const parsed_fields: Record<string, any> = {};
    const rawMatches: RawMatchResult[] = [];

    // 处理成本字段
    for (const [fieldName, match] of costMatches) {
      parsed_fields[fieldName] = match.value || null;
      rawMatches.push(match);
    }

    // 2. 提取所有数字
    const numbers = this.extractNumbers(text);

    // 3. 尝试识别关键字段
    // - 采购价格：通常是第一个或与"价"相关的数字
    if (!parsed_fields['采购价格'] && numbers.length > 0) {
      if (normalized.includes('价') || normalized.includes('元')) {
        parsed_fields['采购价格'] = numbers[0];
      }
    }

    // - 采购数量：通常是较大的数字或与"斤"、"数量"相关
    if (!parsed_fields['采购数量'] && numbers.length > 0) {
      if (normalized.includes('斤') || normalized.includes('数量')) {
        // 查找与"斤"或"数量"相近的数字
        const lines = text.split(/[,，\n]/);
        for (const line of lines) {
          if (line.includes('斤') || line.includes('数量')) {
            const lineNumbers = this.extractNumbers(line);
            if (lineNumbers.length > 0) {
              parsed_fields['采购数量'] = lineNumbers[0];
              break;
            }
          }
        }
      }
    }

    // 4. 识别单位
    let unit = this.identifyUnit(text);
    if (!unit) {
      unit = '斤'; // 默认单位
    }

    // 5. 识别商品名称
    const productName = this.identifyProductName(text) || '商品';

    // 6. 尝试构建建议的订单数据
    const suggestedOrder: any = {
      items: [],
      costs: [],
    };

    // 如果有采购价格和数量，创建订单项
    if (parsed_fields['采购价格'] && parsed_fields['采购数量']) {
      suggestedOrder.items.push({
        product_name: productName,
        quantity: parsed_fields['采购数量'],
        unit: unit,
        unit_price: parsed_fields['采购价格'],
      });
    }

    // 添加成本数据
    const costFields = [
      '代办费',
      '选瓜人工',
      '中转运费',
      '中转包装',
      '装车费',
      '卸车费',
      '网套',
      '品质折扣',
    ];

    for (const costField of costFields) {
      if (parsed_fields[costField] !== undefined && parsed_fields[costField] !== null) {
        suggestedOrder.costs.push({
          cost_type: costField,
          cost_amount: parsed_fields[costField],
        });
      }
    }

    // 7. 计算总体置信度
    const totalConfidence = rawMatches.length > 0 ? rawMatches.reduce((sum, m) => sum + m.confidence, 0) / rawMatches.length : 0;

    return {
      parsed_fields,
      raw_matches: rawMatches,
      suggested_order: suggestedOrder.items.length > 0 || suggestedOrder.costs.length > 0 ? suggestedOrder : undefined,
      confidence: Math.min(1, totalConfidence + 0.2), // 提升基础置信度以鼓励使用
    };
  },

  /**
   * 更新成本字典
   */
  updateCostDictionary(updatedDictionary: CostFieldDictionary): CostFieldDictionary {
    // 在实际应用中，这里应该保存到数据库
    return { ...DEFAULT_COST_DICTIONARY, ...updatedDictionary };
  },
};
