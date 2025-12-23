# TODO: 采购管理核心功能（第 2 周）

## 功能概述
第二周重点实现采购管理模块的核心功能，包括供应商管理（增删改查）、采购订单管理、以及 AI 语义分析录入的基础框架。这是后续成本核算、库存管理等模块的基础。

## 功能清单

### 供应商管理
- [ ] 后端：实现供应商列表查询 API（GET /api/v1/suppliers）
- [ ] 后端：实现供应商详情查询 API（GET /api/v1/suppliers/:id）
- [ ] 后端：实现供应商新增 API（POST /api/v1/suppliers）
- [ ] 后端：实现供应商更新 API（PUT /api/v1/suppliers/:id）
- [ ] 后端：实现供应商删除 API（DELETE /api/v1/suppliers/:id）
- [ ] 前端：实现供应商列表页面（with 搜索、分页）
- [ ] 前端：实现供应商表单组件（新增/编辑）
- [ ] 前端：实现供应商详情页面

### 采购订单基础功能
- [ ] 后端：创建 purchase_orders 表（订单基本信息）
- [ ] 后端：创建 purchase_order_items 表（订单项目明细）
- [ ] 后端：创建 purchase_costs 表（采购成本汇总）
- [ ] 后端：实现采购订单列表查询 API（GET /api/v1/purchase/orders）
- [ ] 后端：实现采购订单详情查询 API（GET /api/v1/purchase/orders/:id）
- [ ] 后端：实现采购订单新增 API（POST /api/v1/purchase/orders）
- [ ] 后端：实现采购订单更新 API（PUT /api/v1/purchase/orders/:id）
- [ ] 前端：实现采购订单列表页面（with 筛选）
- [ ] 前端：实现采购订单表单组件（支持添加多个订单项）
- [ ] 前端：实现采购订单详情页面

### AI 语义分析录入框架（基础版）
- [ ] 后端：创建 ai_parse_requests 表（记录 AI 解析请求）
- [ ] 后端：创建采购成本字段词典配置（可在系统配置中调整）
- [ ] 后端：实现文本解析 API 基础框架（POST /api/v1/ai/parse-purchase）
- [ ] 前端：实现 AI 文本录入组件（支持文本框粘贴）
- [ ] 前端：实现 AI 对话录入组件（支持输入框逐行发送）
- [ ] 前端：实现数据回显和确认界面（表格形式）
- [ ] 前端：实现回显数据修改和补充功能

### 数据验证和校验
- [ ] 后端：实现采购订单数据验证规则（完整性、合理性）
- [ ] 前端：实现采购表单字段验证
- [ ] 后端：实现 AI 解析结果校验（单位标准化、关键词提取）

## 技术实现要点

### 供应商管理（Supplier）
- 数据模型包括：name、address、contact_person、phone、email、status、created_at 等
- 列表页面支持关键词搜索、分页（每页 20 条）
- 表单验证：名称、联系方式必填
- API 响应统一格式：{ code, data, message }

### 采购订单数据结构
```typescript
interface PurchaseOrder {
  id: string;
  supplier_id: string;
  order_number: string; // 自动生成：YY-MM-DD-001
  total_amount: number;
  status: 'draft' | 'confirmed' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit: string; // '斤' | '箱' | '个' 等
  unit_price: number;
  total_price: number;
  remark: string;
}
```

### AI 解析基础框架
- 先实现本地词典匹配，不调用 LLM
- 支持关键词识别：「采购价」、「数量」、「代办费」等
- 单位识别：自动识别「元」、「斤」、「箱」等单位
- 返回解析结果和置信度（仅用于调试）

### 采购成本字段字典（示例）
```json
{
  "采购价格": ["采购价", "采购单价", "价格"],
  "采购数量": ["采购斤两", "采购数量", "斤两"],
  "代办费": ["代办费", "代理费"],
  "选瓜人工": ["选瓜人工", "选瓜工人费", "人工费"],
  "中转运费": ["中转运费", "中转费", "运费"],
  "中转包装": ["中转包装", "包装费", "中转包装费"],
  "装车费": ["装车费", "中转装车费"],
  "卸车费": ["卸车费", "仓库卸车费"],
  "网套": ["网套", "塑料套"]
}
```

## 文件列表

### 前端文件
```
src/
├── components/
│   ├── purchase/
│   │   ├── SupplierForm.tsx         # 供应商表单
│   │   ├── SupplierList.tsx         # 供应商列表
│   │   ├── SupplierDetail.tsx       # 供应商详情
│   │   ├── PurchaseOrderForm.tsx    # 采购订单表单
│   │   ├── PurchaseOrderList.tsx    # 采购订单列表
│   │   ├── PurchaseOrderDetail.tsx  # 采购订单详情
│   │   ├── AIParseInput.tsx         # AI 录入组件（文本/对话）
│   │   ├── AIParseResult.tsx        # AI 结果回显和确认
│   │   └── index.ts
│   └── [其他模块]
├── pages/
│   └── purchase/
│       ├── SupplierManagement.tsx
│       ├── PurchaseOrderList.tsx
│       └── PurchaseOrderCreate.tsx
├── services/
│   └── purchase.service.ts           # 采购模块 API 服务
├── types/
│   └── purchase.ts                   # 采购模块类型定义
└── [其他文件]
```

### 后端文件
```
src/
├── controllers/
│   └── purchaseController.ts
├── services/
│   ├── supplierService.ts
│   ├── purchaseOrderService.ts
│   └── aiParseService.ts            # AI 解析服务
├── repositories/
│   ├── supplierRepository.ts
│   └── purchaseOrderRepository.ts
├── routes/
│   ├── supplier.routes.ts
│   └── purchaseOrder.routes.ts
├── types/
│   ├── supplier.ts
│   ├── purchaseOrder.ts
│   └── aiParse.ts
└── [其他文件]
```

### 数据库 SQL
```sql
-- suppliers 表
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- purchase_orders 表
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(12, 2),
  status VARCHAR(20) DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- purchase_order_items 表
CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id),
  product_id UUID,
  product_name VARCHAR(100),
  quantity DECIMAL(10, 2),
  unit VARCHAR(20),
  unit_price DECIMAL(10, 4),
  total_price DECIMAL(12, 2),
  remark TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- purchase_costs 表
CREATE TABLE purchase_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id),
  cost_type VARCHAR(50),
  cost_amount DECIMAL(12, 2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ai_parse_requests 表（调试用）
CREATE TABLE ai_parse_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  input_text TEXT,
  parse_result JSONB,
  confidence DECIMAL(3, 2),
  status VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 相关 API 端点

### 供应商管理
```
GET /api/v1/suppliers
  查询参数: page, pageSize, keyword
  响应: { code, data: [suppliers], pagination }

GET /api/v1/suppliers/:id
  响应: { code, data: supplier }

POST /api/v1/suppliers
  请求体: { name, contact_person, phone, email, address, status }
  响应: { code, data: supplier }

PUT /api/v1/suppliers/:id
  请求体: { name, contact_person, ... }
  响应: { code, data: supplier }

DELETE /api/v1/suppliers/:id
  响应: { code, message }
```

### 采购订单管理
```
GET /api/v1/purchase/orders
  查询参数: page, pageSize, supplierId, status, dateRange
  响应: { code, data: [orders], pagination }

GET /api/v1/purchase/orders/:id
  响应: { code, data: order (with items) }

POST /api/v1/purchase/orders
  请求体: { supplierId, items: [{ productName, quantity, unit, unitPrice }] }
  响应: { code, data: order }

PUT /api/v1/purchase/orders/:id
  请求体: { status, items, ... }
  响应: { code, data: order }

DELETE /api/v1/purchase/orders/:id
  响应: { code, message }
```

### AI 解析
```
POST /api/v1/ai/parse-purchase
  请求体: { text }
  响应: {
    code,
    data: {
      parsed_fields: { 采购价: 4.9, 数量: 13600, ... },
      raw_matches: { ... },
      suggested_order: { ... }
    }
  }

POST /api/v1/purchase/orders/from-ai
  请求体: { supplierId, aiParseResult, manualAdjustments }
  响应: { code, data: order }
```

## 测试检查清单
- [ ] 供应商增删改查功能通过
- [ ] 采购订单增删改查功能通过
- [ ] AI 文本解析功能通过（本地词典匹配）
- [ ] AI 结果回显和修改功能通过
- [ ] 采购订单表单验证通过
- [ ] 支持扫码关联供应商
- [ ] API 文档已更新
- [ ] 前端表单提交和错误处理正常
- [ ] 后端错误处理完善
- [ ] 单元测试通过率 ≥ 70%

## 完成情况
- 开始时间: -
- 完成时间: -
- 状态: 待开发

## 注意事项

1. **AI 语义分析版本**: 这周先实现基础的本地词典匹配，后续可集成 LLM API
2. **订单号生成**: 格式为 `YY-MM-DD-序列号`，例如 `25-12-23-001`
3. **数据一致性**: 修改采购订单时需要同时更新订单项和成本数据
4. **表单重用性**: 供应商和采购订单表单应该可以在新增和编辑两种场景下使用
5. **扫码功能**: 预留扫码的 UI 占位，实际扫码功能可以后续集成

