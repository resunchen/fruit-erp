export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  order_number: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'deleted';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id?: string;
  purchase_order_id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price?: number;
  created_at?: string;
}

export interface PurchaseCost {
  id?: string;
  purchase_order_id?: string;
  cost_type: string;
  cost_amount: number;
  created_at?: string;
}

export interface PurchaseOrderDetail extends PurchaseOrder {
  supplier_name?: string;
  items: PurchaseOrderItem[];
  costs: PurchaseCost[];
}

export interface PurchaseOrderFormData {
  supplier_id: string;
  items: PurchaseOrderItem[];
  costs: PurchaseCost[];
  status?: string;
}

export interface CreatePurchaseOrderRequest {
  supplier_id: string;
  items: PurchaseOrderItem[];
  costs?: PurchaseCost[];
}

export interface UpdatePurchaseOrderRequest {
  supplier_id?: string;
  status?: string;
  items?: PurchaseOrderItem[];
  costs?: PurchaseCost[];
}

export interface PurchaseOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  supplier_id?: string;
  created_by?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  start_date?: string;
  end_date?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PurchaseOrderListResponse {
  items: PurchaseOrder[];
  pagination: PaginationInfo;
}

// 状态映射
export const STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  pending: '待审批',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
  deleted: '已删除',
};

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  deleted: 'bg-gray-100 text-gray-500',
};
