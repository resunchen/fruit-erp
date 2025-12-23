import { get, post, put, del } from '../utils/request';
import type { Supplier, SupplierFormData, SupplierFilters, SupplierListResponse } from '../types/supplier';

export const supplierService = {
  async getSuppliers(filters?: SupplierFilters): Promise<SupplierListResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const url = params.toString() ? `/api/v1/suppliers?${params.toString()}` : '/api/v1/suppliers';
    const res = await get<SupplierListResponse>(url);
    return res.data;
  },

  async getSupplierById(id: string): Promise<Supplier> {
    const res = await get<{ supplier: Supplier }>(`/api/v1/suppliers/${id}`);
    return res.data.supplier;
  },

  async createSupplier(data: SupplierFormData): Promise<Supplier> {
    const res = await post<{ supplier: Supplier }>('/api/v1/suppliers', data);
    return res.data.supplier;
  },

  async updateSupplier(id: string, data: Partial<SupplierFormData>): Promise<Supplier> {
    const res = await put<{ supplier: Supplier }>(`/api/v1/suppliers/${id}`, data);
    return res.data.supplier;
  },

  async deleteSupplier(id: string): Promise<void> {
    await del(`/api/v1/suppliers/${id}`);
  },
};
