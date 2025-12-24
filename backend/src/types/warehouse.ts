/**
 * 仓储模块类型定义
 */

// 仓库
export interface Warehouse {
  id: string;
  organization_id: string;
  name: string;
  location: string;
  capacity: number;
  temperature_controlled: boolean;
  created_at: string;
  updated_at: string;
}

// 库位
export interface WarehouseLocation {
  id: string;
  warehouse_id: string;
  location_code: string;
  rack_number: number;
  shelf_number: number;
  capacity: number;
  current_load: number;
  is_available: boolean;
  created_at: string;
}

// 库存（核心表）
export interface Inventory {
  id: string;
  warehouse_id: string;
  location_id?: string;
  product_name: string;
  batch_id?: string;
  purchase_order_id?: string;
  quantity: number;
  unit: string;
  status: 'available' | 'reserved' | 'damaged';
  expiration_date?: string;
  inbound_date?: string;
  created_at: string;
  updated_at: string;
}

// 库存日志
export interface InventoryLog {
  id: string;
  inventory_id?: string;
  operation_type: 'inbound' | 'outbound';
  change_quantity: number;
  before_quantity: number;
  after_quantity: number;
  reference_order_id?: string;
  operation_by?: string;
  operation_at: string;
  remark?: string;
}

// 入库单
export interface InboundOrder {
  id: string;
  organization_id: string;
  purchase_order_id: string;
  inbound_number: string;
  warehouse_id: string;
  status: 'draft' | 'confirmed' | 'completed';
  total_quantity: number;
  items: InboundOrderItem[];
  created_by?: string;
  created_at: string;
  confirmed_at?: string;
  updated_at: string;
}

// 入库单明细
export interface InboundOrderItem {
  id?: string;
  inbound_order_id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  location_id?: string;
  batch_id?: string;
  expiration_date?: string;
  remark?: string;
  created_at?: string;
}

// 出库单
export interface OutboundOrder {
  id: string;
  organization_id: string;
  outbound_number: string;
  warehouse_id: string;
  related_order_id?: string;
  status: 'draft' | 'confirmed' | 'completed';
  total_quantity: number;
  items: OutboundOrderItem[];
  created_by?: string;
  created_at: string;
  confirmed_at?: string;
  updated_at: string;
}

// 出库单明细
export interface OutboundOrderItem {
  id?: string;
  outbound_order_id?: string;
  product_name: string;
  requested_quantity: number;
  actual_quantity?: number;
  unit: string;
  batch_id?: string;
  remark?: string;
  created_at?: string;
}

// 库存预警
export interface InventoryAlert {
  id: string;
  inventory_id?: string;
  warehouse_id?: string;
  product_name: string;
  batch_id?: string;
  alert_type: 'expiration_warning' | 'low_stock';
  alert_level: 'critical' | 'warning' | 'info';
  days_until_expiration?: number;
  current_quantity: number;
  threshold_quantity?: number;
  expiration_date?: string;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// 请求/响应类型
export interface CreateInboundOrderRequest {
  purchase_order_id: string;
  warehouse_id: string;
  items: InboundOrderItem[];
}

export interface ConfirmInboundOrderRequest {
  id: string;
}

export interface CreateOutboundOrderRequest {
  warehouse_id: string;
  related_order_id?: string;
  items: OutboundOrderItem[];
}

export interface ConfirmOutboundOrderRequest {
  id: string;
}

export interface InventoryQueryFilters {
  warehouse_id?: string;
  location_id?: string;
  product_name?: string;
  batch_id?: string;
  status?: string;
  expiration_date_from?: string;
  expiration_date_to?: string;
  page?: number;
  limit?: number;
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
