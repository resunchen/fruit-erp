/**
 * 仓储管理 - 控制器
 */

import { Router, Request, Response } from 'express';
import { warehouseService } from '../services/warehouseService';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 所有路由都需要认证
router.use(authMiddleware);

// ============================================================================
// 仓库管理
// ============================================================================

/**
 * 获取仓库列表
 */
router.get('/warehouses', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await warehouseService.getWarehouses(
      organizationId,
      Number(page),
      Number(limit)
    );

    res.json({
      code: 200,
      data: result,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 创建仓库
 */
router.post('/warehouses', async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user?.organization_id;
    const { name, location, capacity, temperature_controlled } = req.body;

    const warehouse = await warehouseService.createWarehouse(organizationId, {
      name,
      location,
      capacity,
      temperature_controlled,
    });

    res.json({
      code: 200,
      data: warehouse,
      message: 'Warehouse created successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 获取仓库详情
 */
router.get('/warehouses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const warehouse = await warehouseService.getWarehouseById(id, organizationId);

    res.json({
      code: 200,
      data: warehouse,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

// ============================================================================
// 库位管理
// ============================================================================

/**
 * 获取库位列表
 */
router.get('/warehouses/:warehouseId/locations', async (req: Request, res: Response) => {
  try {
    const { warehouseId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await warehouseService.getWarehouseLocations(
      warehouseId,
      Number(page),
      Number(limit)
    );

    res.json({
      code: 200,
      data: result,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 创建库位
 */
router.post('/warehouses/:warehouseId/locations', async (req: Request, res: Response) => {
  try {
    const { warehouseId } = req.params;
    const { location_code, rack_number, shelf_number, capacity } = req.body;

    const location = await warehouseService.createWarehouseLocation(warehouseId, {
      location_code,
      rack_number,
      shelf_number,
      capacity,
    });

    res.json({
      code: 200,
      data: location,
      message: 'Location created successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

// ============================================================================
// 库存查询
// ============================================================================

/**
 * 获取库存列表
 */
router.get('/inventory', async (req: Request, res: Response) => {
  try {
    const {
      warehouse_id,
      location_id,
      product_name,
      batch_id,
      status,
      expiration_date_from,
      expiration_date_to,
      page = 1,
      limit = 20,
    } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await warehouseService.queryInventory(
      organizationId,
      {
        warehouse_id: warehouse_id as string,
        location_id: location_id as string,
        product_name: product_name as string,
        batch_id: batch_id as string,
        status: status as string,
        expiration_date_from: expiration_date_from as string,
        expiration_date_to: expiration_date_to as string,
        page: Number(page),
        limit: Number(limit),
      }
    );

    res.json({
      code: 200,
      data: result,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 获取库存预警列表
 */
router.get('/inventory-alerts', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, alert_level, is_resolved } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await warehouseService.getInventoryAlerts(
      organizationId,
      {
        alert_level: alert_level as string,
        is_resolved: is_resolved === 'true',
        page: Number(page),
        limit: Number(limit),
      }
    );

    res.json({
      code: 200,
      data: result,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

// ============================================================================
// 入库单
// ============================================================================

/**
 * 获取入库单列表
 */
router.get('/inbound-orders', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await warehouseService.getInboundOrders(
      organizationId,
      {
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      }
    );

    res.json({
      code: 200,
      data: result,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 创建入库单
 */
router.post('/inbound-orders', async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user?.organization_id;
    const userId = (req as any).user?.id;
    const { purchase_order_id, warehouse_id, items } = req.body;

    const inboundOrder = await warehouseService.createInboundOrder(
      organizationId,
      userId,
      {
        purchase_order_id,
        warehouse_id,
        items,
      }
    );

    res.json({
      code: 200,
      data: inboundOrder,
      message: 'Inbound order created successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 获取入库单详情
 */
router.get('/inbound-orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const inboundOrder = await warehouseService.getInboundOrderById(id, organizationId);

    res.json({
      code: 200,
      data: inboundOrder,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 确认入库单（完成入库）
 */
router.post('/inbound-orders/:id/confirm', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;
    const { items } = req.body;

    const result = await warehouseService.confirmInboundOrder(
      id,
      organizationId,
      items
    );

    res.json({
      code: 200,
      data: result,
      message: 'Inbound order confirmed successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

// ============================================================================
// 出库单
// ============================================================================

/**
 * 获取出库单列表
 */
router.get('/outbound-orders', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await warehouseService.getOutboundOrders(
      organizationId,
      {
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      }
    );

    res.json({
      code: 200,
      data: result,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 创建出库单
 */
router.post('/outbound-orders', async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user?.organization_id;
    const userId = (req as any).user?.id;
    const { warehouse_id, related_order_id, items } = req.body;

    const outboundOrder = await warehouseService.createOutboundOrder(
      organizationId,
      userId,
      {
        warehouse_id,
        related_order_id,
        items,
      }
    );

    res.json({
      code: 200,
      data: outboundOrder,
      message: 'Outbound order created successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 获取出库单详情
 */
router.get('/outbound-orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const outboundOrder = await warehouseService.getOutboundOrderById(id, organizationId);

    res.json({
      code: 200,
      data: outboundOrder,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

/**
 * 确认出库单（完成出库）
 */
router.post('/outbound-orders/:id/confirm', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;
    const { items } = req.body;

    const result = await warehouseService.confirmOutboundOrder(
      id,
      organizationId,
      items
    );

    res.json({
      code: 200,
      data: result,
      message: 'Outbound order confirmed successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: (error as Error).message,
    });
  }
});

export default router;
