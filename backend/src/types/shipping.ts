/**
 * 发货模块类型定义
 */

// 销售订单
export interface SalesOrder {
  id: string;
  organization_id: string;
  order_number: string;
  customer_id?: string;
  customer_name?: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'packing' | 'packed' | 'shipping' | 'shipped' | 'cancelled';
  items: SalesOrderItem[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// 销售订单项目
export interface SalesOrderItem {
  id?: string;
  sales_order_id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  remark?: string;
  created_at?: string;
}

// 打包单
export interface PackingOrder {
  id: string;
  organization_id: string;
  packing_number: string;
  sales_order_id: string;
  status: 'pending' | 'packing' | 'packed' | 'shipped';
  total_boxes: number;
  items: PackingOrderItem[];
  packing_date?: string;
  packed_by?: string;
  created_at: string;
  updated_at: string;
}

// 打包单明细
export interface PackingOrderItem {
  id?: string;
  packing_order_id?: string;
  product_name: string;
  planned_quantity: number;
  actual_quantity?: number;
  unit: string;
  batch_id?: string;
  boxes_count?: number;
  remark?: string;
  created_at?: string;
}

// 发货单
export interface ShippingOrder {
  id: string;
  organization_id: string;
  shipping_number: string;
  packing_order_id: string;
  shipping_method: 'truck' | 'express';
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';

  // 整车发货信息
  truck_plate_number?: string;
  driver_name?: string;
  driver_phone?: string;
  truck_fee?: number;

  // 快递发货信息
  express_company?: string;
  express_number?: string;
  express_fee?: number;

  total_boxes: number;
  total_weight?: number;
  items: ShippingOrderItem[];
  shipped_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// 发货单项目
export interface ShippingOrderItem {
  id?: string;
  shipping_order_id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  batch_id?: string;
  boxes_count?: number;
  remark?: string;
  created_at?: string;
}

// 请求类型
export interface CreateSalesOrderRequest {
  customer_name?: string;
  customer_id?: string;
  items: SalesOrderItem[];
}

export interface CreatePackingOrderRequest {
  sales_order_id: string;
  items: PackingOrderItem[];
}

export interface CompletePackingOrderRequest {
  id: string;
  items: PackingOrderItem[];
}

export interface CreateShippingOrderRequest {
  packing_order_id: string;
  shipping_method: 'truck' | 'express';

  // 整车发货
  truck_plate_number?: string;
  driver_name?: string;
  driver_phone?: string;
  truck_fee?: number;

  // 快递发货
  express_company?: string;
  express_number?: string;
  express_fee?: number;

  total_boxes: number;
  total_weight?: number;
  items: ShippingOrderItem[];
}

// 查询过滤
export interface SalesOrderFilters {
  status?: string;
  customer_name?: string;
  page?: number;
  limit?: number;
}

export interface SalesOrderListResponse {
  items: SalesOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PackingOrderFilters {
  status?: string;
  sales_order_id?: string;
  page?: number;
  limit?: number;
}

export interface ShippingOrderFilters {
  status?: string;
  shipping_method?: string;
  page?: number;
  limit?: number;
}
