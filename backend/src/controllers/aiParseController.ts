import type { Request, Response, NextFunction } from 'express';
import { aiParseService } from '../services/aiParseService';
import { AppError } from '../utils/errors';
import type { AIParsePurchaseRequest } from '../types/aiParse';

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const aiParseController = {
  /**
   * POST /api/v1/ai/parse-purchase
   * 解析采购文本
   */
  async parsePurchaseText(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as AIParsePurchaseRequest;

      // 验证必填字段
      if (!request.text || request.text.trim().length === 0) {
        throw new AppError('文本内容不能为空', 400, 400);
      }

      if (request.text.length > 5000) {
        throw new AppError('文本内容不能超过5000字符', 400, 400);
      }

      // 解析文本
      const result = aiParseService.parsePurchaseText(request);

      res.json({
        code: 200,
        data: result,
        message: '解析采购文本成功',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/ai/parse-purchase/batch
   * 批量解析采购文本（支持多行输入）
   */
  async parsePurchaseTextBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { texts } = req.body as { texts: string[] };

      // 验证必填字段
      if (!Array.isArray(texts) || texts.length === 0) {
        throw new AppError('texts 必须是非空数组', 400, 400);
      }

      if (texts.length > 100) {
        throw new AppError('单次最多处理 100 条文本', 400, 400);
      }

      // 解析所有文本
      const results = texts.map((text, index) => {
        if (!text || text.trim().length === 0) {
          return {
            index,
            error: '文本内容不能为空',
          };
        }

        if (text.length > 5000) {
          return {
            index,
            error: '文本内容不能超过5000字符',
          };
        }

        try {
          return {
            index,
            result: aiParseService.parsePurchaseText({ text }),
          };
        } catch (error) {
          return {
            index,
            error: error instanceof Error ? error.message : '解析失败',
          };
        }
      });

      res.json({
        code: 200,
        data: results,
        message: '批量解析采购文本成功',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/ai/cost-dictionary
   * 获取成本字段字典
   */
  async getCostDictionary(req: Request, res: Response, next: NextFunction) {
    try {
      // 返回默认字典
      // 在实际应用中，这里应该从数据库获取
      const { DEFAULT_COST_DICTIONARY } = await import('../types/aiParse');

      res.json({
        code: 200,
        data: DEFAULT_COST_DICTIONARY,
        message: '获取成本字段字典成功',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/v1/ai/cost-dictionary
   * 更新成本字段字典
   */
  async updateCostDictionary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AppError('用户信息不存在', 401, 401);
      }

      const updatedDictionary = req.body;

      // 验证字典格式
      if (!updatedDictionary || typeof updatedDictionary !== 'object') {
        throw new AppError('字典格式不正确', 400, 400);
      }

      // 更新字典
      const result = aiParseService.updateCostDictionary(updatedDictionary);

      res.json({
        code: 200,
        data: result,
        message: '更新成本字段字典成功',
      });
    } catch (error) {
      next(error);
    }
  },
};
