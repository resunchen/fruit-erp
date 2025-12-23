import { Request, Response, NextFunction } from 'express';
import { supplierService } from '../services/supplierService';
import { AppError } from '../utils/errors';

export const supplierController = {
  async getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, sortBy, sortOrder } = req.query;

      // 参数验证
      if (page && (isNaN(Number(page)) || Number(page) < 1)) {
        throw new AppError('页码必须是正整数', 400, 400);
      }
      if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        throw new AppError('每页数量必须在1-100之间', 400, 400);
      }
      if (sortOrder && !['asc', 'desc'].includes(sortOrder as string)) {
        throw new AppError('排序方向只能是 asc 或 desc', 400, 400);
      }

      const result = await supplierService.getSuppliers({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search as string,
        status: status as string,
        sortBy: sortBy as string,
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
      });

      return res.json({
        code: 200,
        data: result,
        message: '获取供应商列表成功',
      });
    } catch (error) {
      next(error);
    }
  },

  async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('供应商ID不能为空', 400, 400);
      }

      const supplier = await supplierService.getSupplierById(id);

      return res.json({
        code: 200,
        data: { supplier },
        message: '获取供应商详情成功',
      });
    } catch (error) {
      next(error);
    }
  },

  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, contact_person, phone, email, address, status } = req.body;

      // 参数验证
      if (!name) {
        throw new AppError('供应商名称不能为空', 400, 400);
      }
      if (typeof name !== 'string' || name.trim().length < 2 || name.length > 255) {
        throw new AppError('供应商名称长度必须在2-255个字符之间', 400, 400);
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError('邮箱格式不正确', 400, 400);
      }
      if (phone && (phone.length < 7 || phone.length > 20)) {
        throw new AppError('电话号码长度不正确', 400, 400);
      }
      if (contact_person && contact_person.length > 255) {
        throw new AppError('联系人名称不能超过255个字符', 400, 400);
      }
      if (status && !['active', 'inactive'].includes(status)) {
        throw new AppError('供应商状态只能是 active 或 inactive', 400, 400);
      }

      const supplier = await supplierService.createSupplier({
        name: name.trim(),
        contact_person: contact_person?.trim(),
        phone: phone?.trim(),
        email: email?.trim(),
        address: address?.trim(),
        status,
      });

      return res.status(201).json({
        code: 201,
        data: { supplier },
        message: '供应商创建成功',
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, contact_person, phone, email, address, status } = req.body;

      // 参数验证
      if (!id) {
        throw new AppError('供应商ID不能为空', 400, 400);
      }

      // 至少更新一个字段
      if (!name && !contact_person && !phone && !email && !address && !status) {
        throw new AppError('至少需要更新一个字段', 400, 400);
      }

      if (name && (typeof name !== 'string' || name.trim().length < 2 || name.length > 255)) {
        throw new AppError('供应商名称长度必须在2-255个字符之间', 400, 400);
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError('邮箱格式不正确', 400, 400);
      }
      if (phone && (phone.length < 7 || phone.length > 20)) {
        throw new AppError('电话号码长度不正确', 400, 400);
      }
      if (contact_person && contact_person.length > 255) {
        throw new AppError('联系人名称不能超过255个字符', 400, 400);
      }
      if (status && !['active', 'inactive'].includes(status)) {
        throw new AppError('供应商状态只能是 active 或 inactive', 400, 400);
      }

      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name.trim();
      if (contact_person !== undefined) updateData.contact_person = contact_person?.trim();
      if (phone !== undefined) updateData.phone = phone?.trim();
      if (email !== undefined) updateData.email = email?.trim();
      if (address !== undefined) updateData.address = address?.trim();
      if (status !== undefined) updateData.status = status;

      const supplier = await supplierService.updateSupplier(id, updateData);

      return res.json({
        code: 200,
        data: { supplier },
        message: '供应商信息更新成功',
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('供应商ID不能为空', 400, 400);
      }

      await supplierService.deleteSupplier(id);

      return res.json({
        code: 200,
        data: null,
        message: '供应商删除成功',
      });
    } catch (error) {
      next(error);
    }
  },
};
