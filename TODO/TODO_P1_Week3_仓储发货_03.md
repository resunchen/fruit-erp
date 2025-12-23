# TODO: 仓储和打包发货核心功能（第 3 周）

## 功能概述
第三周实现仓储管理和打包发货的核心流程，包括入库、库存、出库、临期预警等仓储核心功能，以及订单、打包、发货的基础流程。完成后形成"采购→仓储→发货"的完整业务闭环。

## 功能清单

### 仓储管理 - 入库
- [ ] 后端：创建 warehouses 表（仓库基础信息）
- [ ] 后端：创建 warehouse_locations 表（库位/货架信息）
- [ ] 后端：创建 inbound_orders 表（入库单）
- [ ] 后端：实现入库单列表 API（GET /api/v1/warehouse/inbound-orders）
- [ ] 后端：实现入库单详情 API（GET /api/v1/warehouse/inbound-orders/:id）
- [ ] 后端：实现创建入库单 API（POST /api/v1/warehouse/inbound-orders）
- [ ] 前端：实现入库单表单组件（关联采购订单）
- [ ] 前端：实现入库列表页面
- [ ] 前端：实现扫码入库功能（二维码识别）

### 仓储管理 - 库存
- [ ] 后端：创建 inventory 表（库存主表）
- [ ] 后端：创建 inventory_batches 表（库存批次详情）
- [ ] 后端：实现库存列表 API（GET /api/v1/warehouse/inventory）
- [ ] 后端：实现库存详情 API（GET /api/v1/warehouse/inventory/:id）
- [ ] 后端：实现库存多维度查询（按品类、批次、库位）
- [ ] 前端：实现库存列表页面（with 搜索、筛选、分页）
- [ ] 前端：实现库存详情页面（展示保质期、存储位置等）
- [ ] 后端：实现库存变化日志记录

### 仓储管理 - 出库
- [ ] 后端：创建 outbound_orders 表（出库单）
- [ ] 后端：实现出库单列表 API（GET /api/v1/warehouse/outbound-orders）
- [ ] 后端：实现出库单详情 API（GET /api/v1/warehouse/outbound-orders/:id）
- [ ] 后端：实现创建出库单 API（POST /api/v1/warehouse/outbound-orders）
- [ ] 前端：实现出库单表单组件（关联发货订单）
- [ ] 前端：实现出库列表页面
- [ ] 前端：实现扫码出库功能

### 仓储管理 - 临期预警
- [ ] 后端：创建 inventory_alerts 表（库存预警记录）
- [ ] 后端：实现临期检查逻辑（保质期 ≤ 7 天预警）
- [ ] 后端：实现库存预警列表 API（GET /api/v1/warehouse/alerts）
- [ ] 前端：实现预警列表展示

### 打包发货 - 订单管理
- [ ] 后端：创建 sales_orders 表（销售/发货订单）
- [ ] 后端：实现销售订单列表 API（GET /api/v1/shipping/orders）
- [ ] 后端：实现销售订单详情 API（GET /api/v1/shipping/orders/:id）
- [ ] 后端：实现创建销售订单 API（POST /api/v1/shipping/orders）
- [ ] 前端：实现销售订单表单组件
- [ ] 前端：实现销售订单列表页面

### 打包发货 - 打包管理
- [ ] 后端：创建 packing_orders 表（打包单）
- [ ] 后端：创建 packing_details 表（打包项目详情）
- [ ] 后端：实现打包单列表 API（GET /api/v1/shipping/packing-orders）
- [ ] 后端：实现打包单详情 API（GET /api/v1/shipping/packing-orders/:id）
- [ ] 后端：实现创建打包单 API（POST /api/v1/shipping/packing-orders）
- [ ] 前端：实现打包单表单组件
- [ ] 前端：实现打包列表页面

### 打包发货 - 发货管理
- [ ] 后端：创建 shipping_orders 表（发货单）
- [ ] 后端：实现发货单列表 API（GET /api/v1/shipping/shipments）
- [ ] 后端：实现发货单详情 API（GET /api/v1/shipping/shipments/:id）
- [ ] 后端：实现创建发货单 API（POST /api/v1/shipping/shipments）
- [ ] 后端：支持整车和快递两种发货方式区分
- [ ] 前端：实现发货单表单组件（支持方式选择）
- [ ] 前端：实现发货列表页面

## 技术实现要点

### 库存管理核心逻辑
- 入库时库存增加，出库时库存减少
- 库存使用 FIFO（先进先出）原则
- 库存由品类、等级、批次、库位等多维度组成
- 库存数据需要实时准确（考虑并发控制）

### 临期预警机制
- 保质期 ≤ 7 天时自动生成预警
- 预警优先级：严重、中等、轻微
- 支持预警消息推送（后续迭代）

### 扫码功能
- 使用二维码库：jsqr（前端识别）
- 后端支持二维码解析

### 发货方式区分
- 整车发货：记录车辆、司机、运费
- 快递发货：记录快递公司、快递单号、费用

## 文件列表

### 前端文件
```
src/components/warehouse/
├── WarehouseList.tsx
├── WarehouseLocationForm.tsx
├── InboundOrderForm.tsx
├── InboundOrderList.tsx
├── InventoryList.tsx
├── InventoryDetail.tsx
├── OutboundOrderForm.tsx
├── OutboundOrderList.tsx
├── InventoryAlertList.tsx
└── QRCodeScanner.tsx       # 扫码组件

src/components/shipping/
├── SalesOrderForm.tsx
├── SalesOrderList.tsx
├── PackingOrderForm.tsx
├── PackingOrderList.tsx
├── ShippingOrderForm.tsx
├── ShippingOrderList.tsx
└── ShippingMethodSelector.tsx

src/services/
├── warehouse.service.ts
└── shipping.service.ts

src/types/
├── warehouse.ts
└── shipping.ts
```

### 后端文件
```
src/controllers/
├── warehouseController.ts
└── shippingController.ts

src/services/
├── warehouseService.ts
└── shippingService.ts

src/repositories/
├── warehouseRepository.ts
└── shippingRepository.ts

src/routes/
├── warehouse.routes.ts
└── shipping.routes.ts

src/types/
├── warehouse.ts
└── shipping.ts
```

### 数据库 SQL
```sql
-- warehouses 表
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  location TEXT,
  capacity INTEGER,
  temperature_controlled BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- warehouse_locations 表
CREATE TABLE warehouse_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  location_code VARCHAR(50),
  rack_number INTEGER,
  shelf_number INTEGER,
  capacity INTEGER,
  current_load INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- inventory 表
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL,
  location_id UUID REFERENCES warehouse_locations(id),
  product_id UUID,
  batch_id UUID,
  quantity DECIMAL(10, 2),
  unit VARCHAR(20),
  expiration_date DATE,
  status VARCHAR(20), -- 'available', 'reserved', 'damaged'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- inbound_orders, outbound_orders, sales_orders 等
-- (详见 DEVELOPMENT_PLAN.md)
```

## 相关 API 端点

### 仓储相关
```
POST /api/v1/warehouse/inbound-orders
GET /api/v1/warehouse/inbound-orders
GET /api/v1/warehouse/inbound-orders/:id

GET /api/v1/warehouse/inventory
GET /api/v1/warehouse/inventory/:id
GET /api/v1/warehouse/inventory/query (支持多维度查询)

POST /api/v1/warehouse/outbound-orders
GET /api/v1/warehouse/outbound-orders
GET /api/v1/warehouse/outbound-orders/:id

GET /api/v1/warehouse/alerts
GET /api/v1/warehouse/alerts/:id
```

### 打包发货相关
```
POST /api/v1/shipping/orders
GET /api/v1/shipping/orders
GET /api/v1/shipping/orders/:id

POST /api/v1/shipping/packing-orders
GET /api/v1/shipping/packing-orders
GET /api/v1/shipping/packing-orders/:id

POST /api/v1/shipping/shipments
GET /api/v1/shipping/shipments
GET /api/v1/shipping/shipments/:id
```

## 测试检查清单
- [ ] 入库、库存、出库流程能正常运行
- [ ] 库存数据准确（增加、减少）
- [ ] 临期预警能正确识别和显示
- [ ] 扫码入库和出库功能正常
- [ ] 发货订单支持整车和快递两种方式
- [ ] 打包单和发货单能正确生成
- [ ] 全流程数据一致性检查通过
- [ ] API 文档已更新
- [ ] 并发操作测试通过
- [ ] 单元和集成测试覆盖率 ≥ 70%

## 完成情况
- 开始时间: -
- 完成时间: -
- 状态: 待开发

## 注意事项

1. **库存并发控制**: 多人同时操作库存时需要考虑数据一致性，建议使用数据库锁或乐观锁
2. **FIFO 原则**: 出库时需要优先选择最早的批次，避免库存积压
3. **二维码集成**: 可以使用 qrcode.react 生成、jsqr 识别
4. **扫码界面**: 需要提供良好的反馈（成功/失败提示）
5. **库位管理**: 考虑库位的自动分配逻辑（最近、容量最大等）

