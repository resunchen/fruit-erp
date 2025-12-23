import { Router } from 'express';
import { supplierController } from '../controllers/supplierController';

const router = Router();

// 获取供应商列表
router.get('/', supplierController.getSuppliers);

// 获取单个供应商详情
router.get('/:id', supplierController.getSupplierById);

// 创建供应商
router.post('/', supplierController.createSupplier);

// 更新供应商
router.put('/:id', supplierController.updateSupplier);

// 删除供应商
router.delete('/:id', supplierController.deleteSupplier);

export default router;
