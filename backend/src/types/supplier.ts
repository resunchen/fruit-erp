export interface Supplier {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierRequest {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

export interface SupplierFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SupplierListResponse {
  items: Supplier[];
  pagination: PaginationInfo;
}
