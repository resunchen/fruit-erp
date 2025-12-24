/**
 * 发货管理 - 路由配置
 */

import express from 'express';
import shippingController from '../controllers/shippingController';

const router = express.Router();

// 销售订单
router.get('/sales-orders', shippingController);
router.post('/sales-orders', shippingController);
router.get('/sales-orders/:id', shippingController);
router.put('/sales-orders/:id/status', shippingController);

// 打包单
router.get('/packing-orders', shippingController);
router.post('/packing-orders', shippingController);
router.get('/packing-orders/:id', shippingController);
router.post('/packing-orders/:id/complete', shippingController);

// 发货单
router.get('/shipping-orders', shippingController);
router.post('/shipping-orders', shippingController);
router.get('/shipping-orders/:id', shippingController);
router.post('/shipping-orders/:id/ship', shippingController);
router.post('/shipping-orders/:id/deliver', shippingController);

export default router;
