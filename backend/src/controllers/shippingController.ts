/**
 * 发货管理 - 控制器
 */

import { Router, Request, Response } from 'express';
import { shippingService } from '../services/shippingService';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 所有路由都需要认证
router.use(authMiddleware);

// ============================================================================
// 销售订单
// ============================================================================

/**
 * 获取销售订单列表
 */
router.get('/sales-orders', async (req: Request, res: Response) => {
  try {
    const { status, customer_name, page = 1, limit = 20 } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await shippingService.getSalesOrders(
      organizationId,
      {
        status: status as string,
        customer_name: customer_name as string,
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
 * 创建销售订单
 */
router.post('/sales-orders', async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user?.organization_id;
    const userId = (req as any).user?.id;
    const { customer_name, customer_id, items } = req.body;

    const salesOrder = await shippingService.createSalesOrder(
      organizationId,
      userId,
      {
        customer_name,
        customer_id,
        items,
      }
    );

    res.json({
      code: 200,
      data: salesOrder,
      message: 'Sales order created successfully',
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
 * 获取销售订单详情
 */
router.get('/sales-orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const salesOrder = await shippingService.getSalesOrderById(id, organizationId);

    res.json({
      code: 200,
      data: salesOrder,
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
 * 更新销售订单状态
 */
router.put('/sales-orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;
    const { status } = req.body;

    const result = await shippingService.updateSalesOrderStatus(
      id,
      organizationId,
      status
    );

    res.json({
      code: 200,
      data: result,
      message: 'Sales order status updated successfully',
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
// 打包单
// ============================================================================

/**
 * 获取打包单列表
 */
router.get('/packing-orders', async (req: Request, res: Response) => {
  try {
    const { status, sales_order_id, page = 1, limit = 20 } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await shippingService.getPackingOrders(
      organizationId,
      {
        status: status as string,
        sales_order_id: sales_order_id as string,
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
 * 创建打包单
 */
router.post('/packing-orders', async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user?.organization_id;
    const userId = (req as any).user?.id;
    const { sales_order_id, items } = req.body;

    const packingOrder = await shippingService.createPackingOrder(
      organizationId,
      userId,
      {
        sales_order_id,
        items,
      }
    );

    res.json({
      code: 200,
      data: packingOrder,
      message: 'Packing order created successfully',
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
 * 获取打包单详情
 */
router.get('/packing-orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const packingOrder = await shippingService.getPackingOrderById(id, organizationId);

    res.json({
      code: 200,
      data: packingOrder,
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
 * 完成打包单
 */
router.post('/packing-orders/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;
    const userId = (req as any).user?.id;
    const { items, total_boxes } = req.body;

    const result = await shippingService.completePackingOrder(
      id,
      organizationId,
      userId,
      { items, total_boxes }
    );

    res.json({
      code: 200,
      data: result,
      message: 'Packing order completed successfully',
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
// 发货单
// ============================================================================

/**
 * 获取发货单列表
 */
router.get('/shipping-orders', async (req: Request, res: Response) => {
  try {
    const { status, shipping_method, page = 1, limit = 20 } = req.query;
    const organizationId = (req as any).user?.organization_id;

    const result = await shippingService.getShippingOrders(
      organizationId,
      {
        status: status as string,
        shipping_method: shipping_method as string,
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
 * 创建发货单
 */
router.post('/shipping-orders', async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user?.organization_id;
    const userId = (req as any).user?.id;
    const body = req.body;

    const shippingOrder = await shippingService.createShippingOrder(
      organizationId,
      userId,
      body
    );

    res.json({
      code: 200,
      data: shippingOrder,
      message: 'Shipping order created successfully',
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
 * 获取发货单详情
 */
router.get('/shipping-orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const shippingOrder = await shippingService.getShippingOrderById(id, organizationId);

    res.json({
      code: 200,
      data: shippingOrder,
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
 * 确认发货
 */
router.post('/shipping-orders/:id/ship', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const result = await shippingService.confirmShipping(id, organizationId);

    res.json({
      code: 200,
      data: result,
      message: 'Shipping confirmed successfully',
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
 * 确认收货
 */
router.post('/shipping-orders/:id/deliver', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = (req as any).user?.organization_id;

    const result = await shippingService.confirmDelivery(id, organizationId);

    res.json({
      code: 200,
      data: result,
      message: 'Delivery confirmed successfully',
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
