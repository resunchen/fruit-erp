import { Router } from 'express';
import { aiParseController } from '../controllers/aiParseController';

const router = Router();

/**
 * AI 解析路由
 */

// 解析采购文本
router.post('/parse-purchase', aiParseController.parsePurchaseText);

// 批量解析采购文本
router.post('/parse-purchase/batch', aiParseController.parsePurchaseTextBatch);

// 获取成本字段字典
router.get('/cost-dictionary', aiParseController.getCostDictionary);

// 更新成本字段字典
router.put('/cost-dictionary', aiParseController.updateCostDictionary);

export default router;
