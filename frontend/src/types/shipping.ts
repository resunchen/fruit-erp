/**
 * 前端发货模块类型定义
 */

// 销售订单
export interface SalesOrder {
  id: string;
  order_number: string;
  customer_name?: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'packing' | 'packed' | 'shipping' | 'shipped' | 'cancelled';
  items: SalesOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface SalesOrderItem {
  id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

// 打包单
export interface PackingOrder {
  id: string;
  packing_number: string;
  sales_order_id: string;
  status: 'pending' | 'packing' | 'packed' | 'shipped';
  total_boxes: number;
  items: PackingOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PackingOrderItem {
  id?: string;
  product_name: string;
  planned_quantity: number;
  actual_quantity?: number;
  unit: string;
  batch_id?: string;
  boxes_count?: number;
}

// 发货单
export interface ShippingOrder {
  id: string;
  shipping_number: string;
  packing_order_id: string;
  shipping_method: 'truck' | 'express';
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';

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
  items: ShippingOrderItem[];
  created_at: string;
}

export interface ShippingOrderItem {
  id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  batch_id?: string;
  boxes_count?: number;
}

// 表单数据
export interface SalesOrderFormData {
  customer_name?: string;
  items: SalesOrderItem[];
}

export interface PackingOrderFormData {
  sales_order_id: string;
  items: PackingOrderItem[];
}

export interface ShippingOrderFormData {
  packing_order_id: string;
  shipping_method: 'truck' | 'express';
  truck_plate_number?: string;
  driver_name?: string;
  driver_phone?: string;
  truck_fee?: number;
  express_company?: string;
  express_number?: string;
  express_fee?: number;
  total_boxes: number;
}

// 列表响应
export interface SalesOrderListResponse {
  items: SalesOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PackingOrderListResponse {
  items: PackingOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ShippingOrderListResponse {
  items: ShippingOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 状态标签和颜色
export const SALES_ORDER_STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  pending: '待处理',
  packing: '打包中',
  packed: '已打包',
  shipping: '运输中',
  shipped: '已发货',
  cancelled: '已取消',
};

export const SALES_ORDER_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  packing: 'bg-blue-100 text-blue-800',
  packed: 'bg-blue-100 text-blue-800',
  shipping: 'bg-purple-100 text-purple-800',
  shipped: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const PACKING_ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待打包',
  packing: '打包中',
  packed: '已打包',
  shipped: '已发货',
};

export const SHIPPING_METHOD_LABELS: Record<string, string> = {
  truck: '整车发货',
  express: '快递发货',
};
