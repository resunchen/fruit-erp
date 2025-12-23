# 数据库设置指南

## 创建采购订单相关表

由于 Supabase 的限制，SQL 语句需要在 Supabase 控制面板中手动执行。

### 步骤 1：登录 Supabase 控制面板

1. 访问 https://app.supabase.com
2. 选择您的项目
3. 在左侧导航栏中选择 "SQL Editor"

### 步骤 2：执行 SQL 创建表

复制以下 SQL 语句，在 Supabase SQL Editor 中执行：

```sql
-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'completed', 'cancelled', 'deleted')),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 采购订单项目表
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(20) NOT NULL,
  unit_price DECIMAL(10, 4) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 采购成本表
CREATE TABLE IF NOT EXISTS purchase_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  cost_type VARCHAR(50) NOT NULL,
  cost_amount DECIMAL(12, 2) NOT NULL CHECK (cost_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_by ON purchase_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_at ON purchase_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_number ON purchase_orders(order_number);

CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order_id ON purchase_order_items(purchase_order_id);

CREATE INDEX IF NOT EXISTS idx_purchase_costs_order_id ON purchase_costs(purchase_order_id);
```

### 步骤 3：启用 RLS（行级安全）

对于每个表，建议启用 RLS 来确保数据安全。可以选择以下策略：

**对于 purchase_orders 表：**
```sql
-- 启用 RLS
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

-- 用户可以查看所有订单
CREATE POLICY "Users can view all orders" ON purchase_orders
  FOR SELECT USING (true);

-- 用户只能创建自己的订单
CREATE POLICY "Users can create their own orders" ON purchase_orders
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- 用户可以更新自己的订单
CREATE POLICY "Users can update their own orders" ON purchase_orders
  FOR UPDATE USING (created_by = auth.uid() OR current_setting('request.jwt.claims')::jsonb->>'role' = 'admin');

-- 用户可以删除自己的订单
CREATE POLICY "Users can delete their own orders" ON purchase_orders
  FOR DELETE USING (created_by = auth.uid() OR current_setting('request.jwt.claims')::jsonb->>'role' = 'admin');
```

**对于 purchase_order_items 和 purchase_costs 表：**
```sql
-- 启用 RLS
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_costs ENABLE ROW LEVEL SECURITY;

-- 创建类似的策略，基于关联的 purchase_order_id
-- （对于生产环境，建议创建更严格的访问控制）
```

### 数据库架构说明

#### purchase_orders 表（订单主表）
- `id`: UUID 主键，自动生成
- `supplier_id`: 关联供应商的 UUID，外键
- `order_number`: 订单号，唯一，格式 YY-MM-DD-xxx（例如：25-12-23-001）
- `total_amount`: 总金额，自动计算
- `status`: 订单状态（draft/pending/confirmed/completed/cancelled/deleted）
- `created_by`: 创建者用户ID
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### purchase_order_items 表（订单项目）
- `id`: UUID 主键
- `purchase_order_id`: 关联订单的 UUID，级联删除
- `product_name`: 商品名称
- `quantity`: 数量（必须 > 0）
- `unit`: 单位
- `unit_price`: 单价（必须 >= 0）
- `total_price`: 小计（quantity × unit_price）
- `created_at`: 创建时间

#### purchase_costs 表（成本汇总）
- `id`: UUID 主键
- `purchase_order_id`: 关联订单的 UUID，级联删除
- `cost_type`: 成本类型（例如：运费、包装费、代办费）
- `cost_amount`: 成本金额（必须 >= 0）
- `created_at`: 创建时间

### 验证表创建成功

执行以下 SQL 验证表是否成功创建：

```sql
-- 检查表是否存在
SELECT tablename FROM pg_tables
WHERE tablename IN ('purchase_orders', 'purchase_order_items', 'purchase_costs');

-- 检查表结构
\d purchase_orders
\d purchase_order_items
\d purchase_costs
```

## 注意事项

1. **外键约束**：采购订单表引用供应商表，确保供应商表已存在
2. **软删除**：使用 `status='deleted'` 实现软删除，不物理删除数据
3. **自动计算**：订单总金额由后端自动计算并存储
4. **索引**：已创建常用查询的索引以提高性能
5. **数据验证**：在数据库级别和应用级别都进行了验证

## 下一步

完成表创建后，可以：

1. 在 Supabase 控制面板中测试 API
2. 运行后端开发服务器
3. 在前端应用中使用采购订单功能
