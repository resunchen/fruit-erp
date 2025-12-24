/**
 * 前端仓储模块类型定义
 */

// 仓库
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  temperature_controlled: boolean;
  created_at: string;
}

// 库位
export interface WarehouseLocation {
  id: string;
  warehouse_id: string;
  location_code: string;
  capacity: number;
  current_load: number;
  is_available: boolean;
}

// 库存
export interface Inventory {
  id: string;
  product_name: string;
  batch_id?: string;
  quantity: number;
  unit: string;
  status: 'available' | 'reserved' | 'damaged';
  expiration_date?: string;
  inbound_date?: string;
  location_code?: string;
  warehouse_name?: string;
  days_until_expiration?: number;
}

// 入库单
export interface InboundOrder {
  id: string;
  inbound_number: string;
  purchase_order_id: string;
  warehouse_id: string;
  status: 'draft' | 'confirmed' | 'completed';
  total_quantity: number;
  items: InboundOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface InboundOrderItem {
  id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  location_id?: string;
  batch_id?: string;
  expiration_date?: string;
}

// 出库单
export interface OutboundOrder {
  id: string;
  outbound_number: string;
  warehouse_id: string;
  status: 'draft' | 'confirmed' | 'completed';
  total_quantity: number;
  items: OutboundOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OutboundOrderItem {
  id?: string;
  product_name: string;
  requested_quantity: number;
  actual_quantity?: number;
  unit: string;
  batch_id?: string;
}

// 库存预警
export interface InventoryAlert {
  id: string;
  product_name: string;
  alert_type: 'expiration_warning' | 'low_stock';
  alert_level: 'critical' | 'warning' | 'info';
  days_until_expiration?: number;
  current_quantity: number;
  expiration_date?: string;
  warehouse_name?: string;
  location_code?: string;
}

// 表单数据
export interface InboundOrderFormData {
  purchase_order_id: string;
  warehouse_id: string;
  items: InboundOrderItem[];
}

export interface OutboundOrderFormData {
  warehouse_id: string;
  items: OutboundOrderItem[];
}

// 列表响应
export interface InboundOrderListResponse {
  items: InboundOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InventoryListResponse {
  items: Inventory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InventoryAlertListResponse {
  items: InventoryAlert[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 状态和颜色定义
export const INBOUND_STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  confirmed: '已确认',
  completed: '已完成',
};

export const OUTBOUND_STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  confirmed: '已确认',
  completed: '已完成',
};

export const INVENTORY_ALERT_LEVEL_LABELS: Record<string, string> = {
  critical: '严重',
  warning: '警告',
  info: '信息',
};

export const INVENTORY_ALERT_LEVEL_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
};
