# TODO: 成本核算与系统集成（第 4 周）

## 功能概述
第四周重点实现成本核算模块和系统集成。成本核算是财务管理的核心，需要从采购、运输、仓储、打包等各环节自动归集成本数据。本周还要完成第一阶段的集成测试和性能优化，确保核心业务闭环（采购→仓储→发货）能正常运转。

## 功能清单

### 成本核算 - 数据集成
- [ ] 后端：创建 cost_collection 表（成本归集记录）
- [ ] 后端：创建 batch_costs 表（批次成本汇总）
- [ ] 后端：创建 product_costs 表（产品维度成本：每箱、每车）
- [ ] 后端：实现采购成本自动归集（从 purchase_orders 和 purchase_costs）
- [ ] 后端：实现运输成本自动归集（后续迭代，本周预留框架）
- [ ] 后端：实现仓储成本自动归集（后续迭代，本周预留框架）
- [ ] 后端：实现打包成本自动归集（后续迭代，本周预留框架）

### 成本核算 - 计算逻辑
- [ ] 后端：实现批次总成本计算逻辑
  - 批次总成本 = 采购成本 + 运输成本 + 仓储成本 + 打包成本
- [ ] 后端：实现每箱成本计算逻辑
  - 每箱成本 = (批次总成本 / 总箱数) + 分摊的其他成本
- [ ] 后端：实现每车成本计算逻辑
  - 每车成本 = (装载产品的每箱成本总和) + 整车运费
- [ ] 后端：实现利润计算逻辑
  - 利润 = 销售价格 - 总成本
  - 利润率 = (利润 / 销售价格) × 100%

### 成本核算 - 查询和展示
- [ ] 后端：实现成本汇总查询 API（GET /api/v1/cost/batch-costs）
- [ ] 后端：实现成本详情查询 API（GET /api/v1/cost/batch-costs/:batchId）
- [ ] 后端：实现成本趋势查询 API（按品类、日期）
- [ ] 前端：实现成本列表页面（支持按批次、品类、日期筛选）
- [ ] 前端：实现成本详情页面（展示成本构成、利润等）
- [ ] 前端：实现成本统计仪表板（关键指标展示）

### 系统配置 - 成本规则配置
- [ ] 后端：创建 system_config 表（系统配置）
- [ ] 后端：实现成本计算规则配置 API
- [ ] 后端：实现采购成本字段词典配置 API
- [ ] 后端：实现预警阈值配置 API
- [ ] 前端：实现系统配置页面（成本规则、字段词典等）

### 系统管理 - 数据备份与恢复
- [ ] 后端：实现自动备份机制框架
- [ ] 后端：实现手动备份 API（POST /api/v1/system/backup）
- [ ] 后端：实现备份列表 API（GET /api/v1/system/backups）
- [ ] 后端：实现恢复机制框架（POST /api/v1/system/restore）
- [ ] 前端：实现备份管理页面

### 全系统集成和测试
- [ ] 采购订单创建→自动归集采购成本
- [ ] 入库→库存数据准确
- [ ] 出库→库存减少
- [ ] 发货单生成→自动计算发货成本
- [ ] 成本从采购→发货全链路准确
- [ ] 执行端到端（E2E）流程测试
- [ ] 执行压力测试（50 并发用户）
- [ ] 执行安全测试（权限、数据隔离）

### 性能优化
- [ ] 数据库查询优化（添加必要的索引）
- [ ] API 响应时间优化（目标：≤ 2 秒）
- [ ] 前端页面加载优化（代码分割、懒加载）
- [ ] 缓存策略优化（Redis 或内存缓存）

### 文档和培训准备
- [ ] 编写系统配置操作手册
- [ ] 编写成本核算操作指南
- [ ] 编写 API 完整文档
- [ ] 准备用户培训材料（采购、仓库、财务岗位）

## 技术实现要点

### 成本自动归集机制
1. **触发时机**
   - 采购订单确认时，自动计算采购成本
   - 入库时，关联批次号和库存数量
   - 出库时，更新库存
   - 发货时，自动计算发货成本

2. **数据流向**
   ```
   采购订单 → 采购成本表 → 批次成本表 → 产品成本表
   库存变化 → 库存日志 → 成本分摊
   发货订单 → 发货成本表 → 批次成本更新
   ```

3. **成本分摊规则**
   - 仓储成本按库存天数和数量分摊
   - 运输成本按产品箱数分摊
   - 打包成本按出库数量分摊

### 数据库索引优化
```sql
-- 关键查询索引
CREATE INDEX idx_cost_batch_id ON cost_collection(batch_id);
CREATE INDEX idx_cost_created_date ON cost_collection(created_at DESC);
CREATE INDEX idx_batch_cost_date ON batch_costs(batch_date DESC);
CREATE INDEX idx_product_cost_category ON product_costs(product_category);
```

### 缓存策略
- 成本汇总数据（日级别更新，缓存 1 小时）
- 库存数据（实时更新，缓存 5 分钟）
- 供应商和客户信息（静态数据，缓存 1 天）

### 并发控制
- 库存操作使用乐观锁（version 字段）
- 成本计算使用事务保证原子性

## 文件列表

### 前端文件
```
src/components/cost/
├── CostList.tsx
├── CostDetail.tsx
├── CostDashboard.tsx
├── CostChart.tsx (成本趋势图)
└── CostConfigForm.tsx

src/components/system/
├── ConfigForm.tsx (系统配置)
├── CostRuleConfig.tsx (成本规则配置)
├── FieldDictConfig.tsx (字段词典配置)
├── BackupManagement.tsx
└── ThresholdConfig.tsx (预警阈值配置)

src/pages/
├── cost/
│   ├── CostDashboard.tsx
│   ├── BatchCostsList.tsx
│   └── CostDetail.tsx
└── system/
    ├── Configuration.tsx
    └── BackupManagement.tsx

src/services/
├── cost.service.ts
└── system.service.ts
```

### 后端文件
```
src/controllers/
├── costController.ts
└── systemController.ts

src/services/
├── costService.ts
├── costCalculationService.ts (成本计算核心逻辑)
└── systemService.ts

src/repositories/
├── costRepository.ts
└── systemRepository.ts

src/routes/
├── cost.routes.ts
└── system.routes.ts

src/types/
├── cost.ts
└── system.ts
```

### 数据库 SQL
```sql
-- cost_collection 表
CREATE TABLE cost_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID,
  order_id UUID,
  cost_type VARCHAR(50), -- 'purchase', 'transport', 'storage', 'packing'
  cost_item VARCHAR(100), -- '采购价', '代办费', '中转费'等
  amount DECIMAL(12, 2),
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- batch_costs 表
CREATE TABLE batch_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL UNIQUE,
  purchase_cost DECIMAL(12, 2),
  transport_cost DECIMAL(12, 2),
  storage_cost DECIMAL(12, 2),
  packing_cost DECIMAL(12, 2),
  total_cost DECIMAL(12, 2),
  total_quantity DECIMAL(10, 2),
  unit_cost DECIMAL(10, 4), -- 每斤/每箱成本
  batch_date DATE,
  status VARCHAR(20), -- 'draft', 'confirmed', 'closed'
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- product_costs 表
CREATE TABLE product_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID,
  product_id UUID,
  product_name VARCHAR(100),
  category VARCHAR(50),
  grade VARCHAR(20),
  quantity_per_box DECIMAL(10, 2), -- 每箱斤两
  cost_per_box DECIMAL(10, 4),
  cost_per_kg DECIMAL(10, 4),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- system_config 表
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  config_key VARCHAR(100) NOT NULL,
  config_value JSONB,
  description TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, config_key)
);

-- 备份相关表
CREATE TABLE system_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name VARCHAR(100),
  backup_type VARCHAR(20), -- 'manual', 'auto'
  backup_size BIGINT,
  backup_path TEXT,
  status VARCHAR(20), -- 'success', 'failed'
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 相关 API 端点

### 成本相关
```
GET /api/v1/cost/batch-costs
  查询参数: batchId, category, dateRange, page, pageSize
  响应: { code, data: [batchCosts], pagination }

GET /api/v1/cost/batch-costs/:id
  响应: { code, data: batchCost (with 详细成本构成) }

GET /api/v1/cost/product-costs/:batchId
  响应: { code, data: [productCosts] }

GET /api/v1/cost/trends
  查询参数: dimension (category, date), dateRange
  响应: { code, data: { trend_data, avg_cost, max_cost } }
```

### 系统配置相关
```
GET /api/v1/system/config
  查询参数: configKey
  响应: { code, data: config }

POST /api/v1/system/config
  请求体: { configKey, configValue, description }
  响应: { code, data: config }

POST /api/v1/system/backup
  请求体: { backupName, backupType }
  响应: { code, data: backup }

GET /api/v1/system/backups
  响应: { code, data: [backups] }

POST /api/v1/system/restore/:backupId
  响应: { code, message }
```

## 集成测试场景

### 场景 1：采购→库存→发货成本流转
1. 采购员创建采购订单（包含各项成本）
2. 系统自动计算采购成本和批次成本
3. 货物入库，关联批次号
4. 库存展示正确的成本信息
5. 出库生成发货单
6. 发货成本自动计算
7. 最终的每箱成本、利润正确

### 场景 2：并发操作测试
1. 5 个采购员同时创建采购订单
2. 10 个仓库员同时操作库存
3. 3 个打包员同时生成发货单
4. 系统数据准确无误

### 场景 3：数据备份和恢复
1. 执行数据备份
2. 修改数据
3. 恢复备份
4. 验证数据恢复正确

## 测试检查清单
- [ ] 采购成本自动归集正确
- [ ] 批次成本计算逻辑正确
- [ ] 每箱成本、每车成本计算正确
- [ ] 利润计算正确
- [ ] 成本查询 API 返回数据正确
- [ ] 系统配置可正常修改和保存
- [ ] 备份和恢复功能正常
- [ ] 并发操作测试通过（50 用户）
- [ ] 数据库查询性能达标（≤ 2 秒）
- [ ] 端到端流程测试通过
- [ ] API 文档完整
- [ ] 用户培训材料已准备

## 完成情况
- 开始时间: -
- 完成时间: -
- 状态: 待开发

## 注意事项

1. **成本计算的准确性**: 这是财务系统的核心，需要多次验证逻辑正确性
2. **数据一致性**: 成本数据涉及多个表，需要使用数据库事务保证原子性
3. **历史数据处理**: 成本是累计的，修改历史订单时需要重新计算相关成本
4. **性能考虑**: 成本查询可能涉及大量数据，需要合理使用索引和缓存
5. **备份策略**: 建议自动备份（每天夜间），同时支持手动备份
6. **培训准备**: 财务人员需要理解成本计算逻辑，培训材料很重要

