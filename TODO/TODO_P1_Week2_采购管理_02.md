# TODO: 采购管理核心功能（第 2 周）

## 功能概述
第二周重点实现采购管理模块的核心功能，包括供应商管理（增删改查）、采购订单管理、以及 AI 语义分析录入的基础框架。这是后续成本核算、库存管理等模块的基础。

## 功能清单

### 供应商管理
- [x] 后端：实现供应商列表查询 API（GET /api/v1/suppliers）
- [x] 后端：实现供应商详情查询 API（GET /api/v1/suppliers/:id）
- [x] 后端：实现供应商新增 API（POST /api/v1/suppliers）
- [x] 后端：实现供应商更新 API（PUT /api/v1/suppliers/:id）
- [x] 后端：实现供应商删除 API（DELETE /api/v1/suppliers/:id）
- [x] 前端：实现供应商列表页面（with 搜索、分页）
- [x] 前端：实现供应商表单组件（新增/编辑）
- [x] 前端：实现供应商详情页面

### 采购订单基础功能
- [x] 后端：创建 purchase_orders 表（订单基本信息）
- [x] 后端：创建 purchase_order_items 表（订单项目明细）
- [x] 后端：创建 purchase_costs 表（采购成本汇总）
- [x] 后端：实现采购订单列表查询 API（GET /api/v1/purchase/orders）
- [x] 后端：实现采购订单详情查询 API（GET /api/v1/purchase/orders/:id）
- [x] 后端：实现采购订单新增 API（POST /api/v1/purchase/orders）
- [x] 后端：实现采购订单更新 API（PUT /api/v1/purchase/orders/:id）
- [x] 前端：实现采购订单列表页面（with 筛选）
- [x] 前端：实现采购订单表单组件（支持添加多个订单项）
- [x] 前端：实现采购订单详情页面

### AI 语义分析录入框架（基础版）
- [x] 后端：创建 ai_parse_requests 表（记录 AI 解析请求）
- [x] 后端：创建采购成本字段词典配置（可在系统配置中调整）
- [x] 后端：实现文本解析 API 基础框架（POST /api/v1/ai/parse-purchase）
- [x] 前端：实现 AI 文本录入组件（支持文本框粘贴）
- [x] 前端：实现 AI 对话录入组件（支持输入框逐行发送）
- [x] 前端：实现数据回显和确认界面（表格形式）
- [x] 前端：实现回显数据修改和补充功能

### 数据验证和校验
- [x] 后端：实现采购订单数据验证规则（完整性、合理性）
- [x] 前端：实现采购表单字段验证
- [x] 后端：实现 AI 解析结果校验（单位标准化、关键词提取）

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
- 完成时间: 2025-12-24
- 状态: 已完成基础功能，需要高级功能完善

## 注意事项

1. **AI 语义分析版本**: 这周先实现基础的本地词典匹配，后续可集成 LLM API
2. **订单号生成**: 格式为 `YY-MM-DD-序列号`，例如 `25-12-23-001`
3. **数据一致性**: 修改采购订单时需要同时更新订单项和成本数据
4. **表单重用性**: 供应商和采购订单表单应该可以在新增和编辑两种场景下使用
5. **扫码功能**: 预留扫码的 UI 占位，实际扫码功能可以后续集成

---

## 高级功能完善清单（后续迭代）

Week 2 已完成基础功能，但还需以下高级功能来完善采购管理模块：

### 1. 采购订单高级功能
- [ ] 采购订单审批流程：草稿 → 待审批 → 已批准 → 已收货
- [ ] 批量导入采购订单（Excel/CSV）
- [ ] 采购订单模板管理（快速创建常用订单）
- [ ] 采购历史统计：按供应商、商品、时间范围统计采购数据
- [ ] 采购价格趋势分析：显示同一商品的历史价格走势
- [ ] 采购订单关联：绑定到货验收单、运输单据等
- [ ] 采购订单打印/导出功能（PDF、Excel）

### 2. AI 语义分析高级功能
- [ ] 集成 LLM API（替代本地词典匹配，提升准确率）
- [ ] 多轮对话数据整合：支持跨会话的数据聚合
- [ ] 动态字段学习：根据用户修改自动优化词典
- [ ] 批量 AI 解析：支持一次性上传多个文本进行批量解析
- [ ] 解析历史记录：保存所有 AI 解析请求及修正记录
- [ ] 解析准确率统计：分析 AI 解析的准确率和高频错误

### 3. 供应商高级功能
- [ ] 供应商信用评级管理（基于交易记录自动计分）
- [ ] 供应商合作协议管理（合作条款、价格协议）
- [ ] 供应商资质审核流程（营业执照、资质证书上传）
- [ ] 供应商黑名单管理（拒付、虚假信息等）
- [ ] 供应商对账单生成（对账、付款提醒）
- [ ] 供应商业绩评分（采购量、质量、配送时效）

### 4. 到货验收管理
- [ ] 到货验收单生成（关联采购订单自动生成）
- [ ] 收货数量核对（实收 vs 订单数量）
- [ ] 质量检验记录（合格/不合格/次品处理）
- [ ] 退货管理流程（不合格品退货申请、跟踪）
- [ ] 收货异常预警（超期未收、数量不符）

### 5. 采购成本细化
- [ ] 采购单价历史记录（价格波动追踪）
- [ ] 采购优化建议（价格异常提醒、降价提示）
- [ ] 采购成本预算管理（预算 vs 实际成本对比）
- [ ] 采购毛利率分析（进价 vs 售价对比）

### 6. 扫码功能
- [ ] 条形码/二维码生成（采购订单、供应商编码）
- [ ] 扫码快速录入（扫码自动识别供应商、商品）
- [ ] 批量扫码（多个订单/供应商快速扫描）

### 7. 报表和统计
- [ ] 采购订单汇总报表（按时间、供应商、商品维度）
- [ ] 采购支出统计（按月/季度/年统计采购金额）
- [ ] 供应商排名报表（采购量、采购金额TOP N）
- [ ] 采购异常分析报表（超期订单、高价订单提醒）

### 8. 数据一致性和完整性
- [ ] 采购订单与成本模块数据同步
- [ ] 采购订单与库存模块数据同步
- [ ] 重复订单检测（防止误创建重复订单）
- [ ] 数据清理和归档（历史订单定期归档）

### 9. 权限和审计
- [ ] 采购操作权限细化（新增、编辑、删除、审批权限分离）
- [ ] 采购订单修改记录（完整的变更审计日志）
- [ ] 敏感操作预警（大额采购、价格异常等）

### 10. 移动端支持
- [ ] 采购订单移动查询（iOS/Android App）
- [ ] 扫码快速录入移动版（现场采购快速创建）
- [ ] 到货验收移动版（现场收货操作）

