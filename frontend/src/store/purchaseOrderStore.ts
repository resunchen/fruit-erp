import { create } from 'zustand';
import type {
  PurchaseOrder,
  PurchaseOrderFilters,
  PaginationInfo,
} from '../types/purchaseOrder';

interface PurchaseOrderState {
  orders: PurchaseOrder[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;
  filters: PurchaseOrderFilters;

  setOrders: (orders: PurchaseOrder[]) => void;
  setPagination: (pagination: PaginationInfo) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: PurchaseOrderFilters) => void;
  reset: () => void;
}

const defaultFilters: PurchaseOrderFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  supplier_id: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const defaultPagination: PaginationInfo = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

export const usePurchaseOrderStore = create<PurchaseOrderState>((set) => ({
  orders: [],
  pagination: defaultPagination,
  isLoading: false,
  error: null,
  filters: defaultFilters,

  setOrders: (orders) => set({ orders }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  reset: () => set({
    orders: [],
    pagination: defaultPagination,
    isLoading: false,
    error: null,
    filters: defaultFilters,
  }),
}));
