import express from 'express';
import { purchaseOrderController } from '../controllers/purchaseOrderController';

const router = express.Router();

/**
 * 采购订单路由
 */

// 列表和创建
router.get('/', purchaseOrderController.getOrders);
router.post('/', purchaseOrderController.createOrder);

// 详情、更新、删除
router.get('/:id', purchaseOrderController.getOrderDetail);
router.put('/:id', purchaseOrderController.updateOrder);
router.delete('/:id', purchaseOrderController.deleteOrder);

export default router;
