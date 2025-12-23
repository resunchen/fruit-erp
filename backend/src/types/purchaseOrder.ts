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
  id: string;
  purchase_order_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface PurchaseCost {
  id: string;
  purchase_order_id: string;
  cost_type: string;
  cost_amount: number;
  created_at: string;
}

export interface PurchaseOrderDetail extends PurchaseOrder {
  supplier_name?: string;
  items: PurchaseOrderItem[];
  costs: PurchaseCost[];
}

export interface CreatePurchaseOrderRequest {
  supplier_id: string;
  items: Array<{
    product_name: string;
    quantity: number;
    unit: string;
    unit_price: number;
  }>;
  costs?: Array<{
    cost_type: string;
    cost_amount: number;
  }>;
}

export interface UpdatePurchaseOrderRequest {
  supplier_id?: string;
  status?: string;
  items?: Array<{
    product_name: string;
    quantity: number;
    unit: string;
    unit_price: number;
  }>;
  costs?: Array<{
    cost_type: string;
    cost_amount: number;
  }>;
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
