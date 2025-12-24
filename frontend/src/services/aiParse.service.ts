import { post, put, get } from '../utils/request';
import type {
  AIParsePurchaseResult,
  CostFieldDictionary,
} from '../types/aiParse';

export interface AIParsePurchaseRequest {
  text: string;
}

export const aiParseService = {
  /**
   * 解析采购文本
   */
  async parsePurchaseText(data: AIParsePurchaseRequest): Promise<AIParsePurchaseResult> {
    const response = await post<AIParsePurchaseResult>('/api/v1/ai/parse-purchase', data);
    return response.data;
  },

  /**
   * 批量解析采购文本
   */
  async parsePurchaseTextBatch(texts: string[]): Promise<any[]> {
    const response = await post<any[]>('/api/v1/ai/parse-purchase/batch', { texts });
    return response.data;
  },

  /**
   * 获取成本字段字典
   */
  async getCostDictionary(): Promise<CostFieldDictionary> {
    const response = await get<CostFieldDictionary>('/api/v1/ai/cost-dictionary');
    return response.data;
  },

  /**
   * 更新成本字段字典
   */
  async updateCostDictionary(dictionary: CostFieldDictionary): Promise<CostFieldDictionary> {
    const response = await put<CostFieldDictionary>('/api/v1/ai/cost-dictionary', dictionary);
    return response.data;
  },
};
