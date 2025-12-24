/**
 * 仓储管理 - 路由配置
 */

import express from 'express';
import warehouseController from '../controllers/warehouseController';

const router = express.Router();

// 仓库管理
router.get('/warehouses', warehouseController);
router.post('/warehouses', warehouseController);
router.get('/warehouses/:id', warehouseController);

// 库位管理
router.get('/warehouses/:warehouseId/locations', warehouseController);
router.post('/warehouses/:warehouseId/locations', warehouseController);

// 库存查询
router.get('/inventory', warehouseController);
router.get('/inventory-alerts', warehouseController);

// 入库单
router.get('/inbound-orders', warehouseController);
router.post('/inbound-orders', warehouseController);
router.get('/inbound-orders/:id', warehouseController);
router.post('/inbound-orders/:id/confirm', warehouseController);

// 出库单
router.get('/outbound-orders', warehouseController);
router.post('/outbound-orders', warehouseController);
router.get('/outbound-orders/:id', warehouseController);
router.post('/outbound-orders/:id/confirm', warehouseController);

export default router;
