import type { Request, Response, NextFunction } from 'express';
import { purchaseOrderService } from '../services/purchaseOrderService';
import { AppError } from '../utils/errors';
import type {
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  PurchaseOrderFilters,
} from '../types/purchaseOrder';

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const purchaseOrderController = {
  /**
   * GET /api/v1/purchase/orders
   * 获取采购订单列表
   */
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: PurchaseOrderFilters = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        status: req.query.status as string,
        supplier_id: req.query.supplier_id as string,
        created_by: req.query.created_by as string,
        sortBy: (req.query.sortBy as string) || 'created_at',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
      };

      const result = await purchaseOrderService.getOrders(filters);

      res.json({
        code: 200,
        data: result,
        message: '获取采购订单列表成功',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/purchase/orders/:id
   * 获取采购订单详情
   */
  async getOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('订单ID不能为空', 400, 400);
      }

      const result = await purchaseOrderService.getOrderDetail(id);

      res.json({
        code: 200,
        data: result,
        message: '获取采购订单详情成功',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/purchase/orders
   * 创建采购订单
   */
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AppError('用户信息不存在', 401, 401);
      }

      const request = req.body as CreatePurchaseOrderRequest;

      // 验证必填字段
      if (!request.supplier_id) {
        throw new AppError('供应商ID不能为空', 400, 400);
      }

      if (!request.items || request.items.length === 0) {
        throw new AppError('订单必须至少包含一项', 400, 400);
      }

      // 验证项目数据
      for (const item of request.items) {
        if (!item.product_name || item.product_name.trim().length === 0) {
          throw new AppError('商品名称不能为空', 400, 400);
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          throw new AppError('数量必须大于0', 400, 400);
        }
        if (!item.unit || item.unit.trim().length === 0) {
          throw new AppError('单位不能为空', 400, 400);
        }
        if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
          throw new AppError('单价不能为负数', 400, 400);
        }
      }

      // 验证成本数据
      if (request.costs) {
        for (const cost of request.costs) {
          if (!cost.cost_type || cost.cost_type.trim().length === 0) {
            throw new AppError('成本类型不能为空', 400, 400);
          }
          if (typeof cost.cost_amount !== 'number' || cost.cost_amount < 0) {
            throw new AppError('成本金额不能为负数', 400, 400);
          }
        }
      }

      const result = await purchaseOrderService.createOrder(request, userId);

      res.status(201).json({
        code: 201,
        data: result,
        message: '创建采购订单成功',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/v1/purchase/orders/:id
   * 更新采购订单
   */
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('订单ID不能为空', 400, 400);
      }

      const request = req.body as UpdatePurchaseOrderRequest;

      // 验证项目数据（如果有）
      if (request.items) {
        for (const item of request.items) {
          if (!item.product_name || item.product_name.trim().length === 0) {
            throw new AppError('商品名称不能为空', 400, 400);
          }
          if (typeof item.quantity !== 'number' || item.quantity <= 0) {
            throw new AppError('数量必须大于0', 400, 400);
          }
          if (!item.unit || item.unit.trim().length === 0) {
            throw new AppError('单位不能为空', 400, 400);
          }
          if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
            throw new AppError('单价不能为负数', 400, 400);
          }
        }
      }

      // 验证成本数据（如果有）
      if (request.costs) {
        for (const cost of request.costs) {
          if (!cost.cost_type || cost.cost_type.trim().length === 0) {
            throw new AppError('成本类型不能为空', 400, 400);
          }
          if (typeof cost.cost_amount !== 'number' || cost.cost_amount < 0) {
            throw new AppError('成本金额不能为负数', 400, 400);
          }
        }
      }

      const result = await purchaseOrderService.updateOrder(id, request);

      res.json({
        code: 200,
        data: result,
        message: '更新采购订单成功',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/purchase/orders/:id
   * 删除采购订单
   */
  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('订单ID不能为空', 400, 400);
      }

      await purchaseOrderService.deleteOrder(id);

      res.json({
        code: 200,
        data: null,
        message: '删除采购订单成功',
      });
    } catch (error) {
      next(error);
    }
  },
};
