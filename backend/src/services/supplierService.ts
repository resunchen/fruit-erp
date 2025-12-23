import { supabase } from '../config/supabase';
import { AppError } from '../utils/errors';
import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SupplierFilters,
  SupplierListResponse,
} from '../types/supplier';

export const supplierService = {
  async getSuppliers(filters: SupplierFilters): Promise<SupplierListResponse> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const offset = (page - 1) * limit;
    const search = filters.search?.trim();
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';

    try {
      let query = supabase
        .from('suppliers')
        .select('*', { count: 'exact' })
        .neq('status', 'deleted');

      // 搜索：支持按名称和联系人搜索
      if (search) {
        query = query.or(`name.ilike.%${search}%,contact_person.ilike.%${search}%`);
      }

      // 状态筛选
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // 排序
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // 分页
      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        throw new AppError('获取供应商列表失败', 500, 500);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        items: data || [],
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('获取供应商列表失败', 500, 500);
    }
  },

  async getSupplierById(id: string): Promise<Supplier> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .neq('status', 'deleted')
        .single();

      if (error || !data) {
        throw new AppError('供应商不存在', 404, 404);
      }

      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('获取供应商信息失败', 500, 500);
    }
  },

  async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    const { name, contact_person, phone, email, address, status = 'active' } = data;

    try {
      const { data: newSupplier, error } = await supabase
        .from('suppliers')
        .insert([
          {
            name,
            contact_person: contact_person || null,
            phone: phone || null,
            email: email || null,
            address: address || null,
            status,
          },
        ])
        .select()
        .single();

      if (error || !newSupplier) {
        throw new AppError('创建供应商失败，请稍后重试', 500, 500);
      }

      return newSupplier;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('创建供应商失败，请稍后重试', 500, 500);
    }
  },

  async updateSupplier(id: string, data: UpdateSupplierRequest): Promise<Supplier> {
    try {
      // 检查供应商是否存在
      const { data: existingSupplier, error: checkError } = await supabase
        .from('suppliers')
        .select('id')
        .eq('id', id)
        .neq('status', 'deleted')
        .single();

      if (checkError || !existingSupplier) {
        throw new AppError('供应商不存在', 404, 404);
      }

      // 构建更新数据，只包含提供的字段
      const updateData: Record<string, any> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.contact_person !== undefined) updateData.contact_person = data.contact_person;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.status !== undefined) updateData.status = data.status;
      updateData.updated_at = new Date().toISOString();

      const { data: updatedSupplier, error } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !updatedSupplier) {
        throw new AppError('更新供应商失败，请稍后重试', 500, 500);
      }

      return updatedSupplier;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('更新供应商失败，请稍后重试', 500, 500);
    }
  },

  async deleteSupplier(id: string): Promise<void> {
    try {
      // 检查供应商是否存在
      const { data: existingSupplier, error: checkError } = await supabase
        .from('suppliers')
        .select('id')
        .eq('id', id)
        .neq('status', 'deleted')
        .single();

      if (checkError || !existingSupplier) {
        throw new AppError('供应商不存在', 404, 404);
      }

      // 软删除：更新status为deleted
      const { error } = await supabase
        .from('suppliers')
        .update({
          status: 'deleted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw new AppError('删除供应商失败，请稍后重试', 500, 500);
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('删除供应商失败，请稍后重试', 500, 500);
    }
  },
};
