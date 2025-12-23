import { useCallback } from 'react';
import { useSupplierStore } from '../store/supplierStore';
import { supplierService } from '../services/supplier.service';
import type { SupplierFilters, Supplier } from '../types/supplier';

export const useSuppliers = () => {
  const {
    suppliers,
    pagination,
    isLoading,
    error,
    filters,
    setSuppliers,
    setPagination,
    setLoading,
    setError,
    setFilters,
    reset,
  } = useSupplierStore();

  const fetchSuppliers = useCallback(
    async (customFilters?: Partial<SupplierFilters>) => {
      setLoading(true);
      setError(null);
      try {
        const currentFilters = { ...filters, ...customFilters };
        const result = await supplierService.getSuppliers(currentFilters);
        setSuppliers(result.items);
        setPagination(result.pagination);
      } catch (err) {
        const message = err instanceof Error ? err.message : '加载供应商列表失败';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [filters, setSuppliers, setPagination, setLoading, setError]
  );

  const createSupplier = useCallback(
    async (data: any) => {
      setLoading(true);
      setError(null);
      try {
        const newSupplier = await supplierService.createSupplier(data);
        // 刷新列表
        await fetchSuppliers();
        return newSupplier;
      } catch (err) {
        const message = err instanceof Error ? err.message : '创建供应商失败';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSuppliers, setLoading, setError]
  );

  const updateSupplier = useCallback(
    async (id: string, data: any) => {
      setLoading(true);
      setError(null);
      try {
        const updatedSupplier = await supplierService.updateSupplier(id, data);
        // 刷新列表
        await fetchSuppliers();
        return updatedSupplier;
      } catch (err) {
        const message = err instanceof Error ? err.message : '更新供应商失败';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSuppliers, setLoading, setError]
  );

  const deleteSupplier = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await supplierService.deleteSupplier(id);
        // 刷新列表
        await fetchSuppliers();
      } catch (err) {
        const message = err instanceof Error ? err.message : '删除供应商失败';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSuppliers, setLoading, setError]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<SupplierFilters>) => {
      setFilters({ ...newFilters, page: 1 }); // 重置到第一页
      fetchSuppliers({ ...newFilters, page: 1 });
    },
    [setFilters, fetchSuppliers]
  );

  const goToPage = useCallback(
    (page: number) => {
      setFilters({ page });
      fetchSuppliers({ page });
    },
    [setFilters, fetchSuppliers]
  );

  return {
    suppliers,
    pagination,
    isLoading,
    error,
    filters,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    updateFilters,
    goToPage,
    reset,
  };
};
