import { create } from 'zustand';
import type { Supplier, SupplierFilters } from '../types/supplier';

interface SupplierState {
  suppliers: Supplier[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
  };

  // Actions
  setSuppliers: (suppliers: Supplier[]) => void;
  setPagination: (pagination: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SupplierFilters>) => void;
  reset: () => void;
}

const defaultFilters = {
  search: '',
  status: '',
  sortBy: 'created_at',
  sortOrder: 'desc' as const,
  page: 1,
  limit: 10,
};

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  filters: defaultFilters,

  setSuppliers: (suppliers) => set({ suppliers }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  reset: () =>
    set({
      suppliers: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      isLoading: false,
      error: null,
      filters: defaultFilters,
    }),
}));
