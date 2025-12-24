# 🗄️ 数据库设置完整指南

## 问题诊断

你遇到的 `Unexpected token '<', "<!DOCTYPE "` 错误是因为：
1. 后端返回了 HTML 错误页面（而不是 JSON）
2. 这通常发生在数据库连接失败或数据库表不存在时
3. 数据库中缺少关键表：`purchase_orders`、`purchase_order_items`、`purchase_costs`

## 解决方案

### 方法 1: 手动在 Supabase SQL 编辑器中运行（推荐）

这是最直接的方法，适合 Supabase 用户。

**步骤：**

1. **打开 Supabase SQL 编辑器**
   - 访问 https://app.supabase.com
   - 选择你的项目
   - 左侧菜单 → SQL 编辑器

2. **创建新的查询**
   - 点击 "New query"
   - 将以下 SQL 复制粘贴到编辑器中

3. **运行以下 SQL 语句**

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

4. **点击 "Run" 按钮执行**
   - 看到 "Success!" 消息即表示成功

### 方法 2: 自动化脚本（如果你的 Supabase 项目支持）

```bash
cd backend
node init-db.js
```

## 验证数据库已正确设置

执行以下 SQL 查询来验证所有表都已创建：

```sql
-- 检查表是否存在
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('suppliers', 'purchase_orders', 'purchase_order_items', 'purchase_costs');
```

你应该看到 4 行结果，包括以上所有表。

## 其他修复

### 1. 修复前端错误处理 ✅
已在 `frontend/src/utils/request.ts` 中修复，现在能够：
- 正确处理非 JSON 响应
- 显示更友好的错误信息
- 避免 JSON 解析错误

### 2. 修复后端认证中间件 ✅
已在 `backend/src/middleware/auth.middleware.ts` 中修复，现在：
- 正确设置 `req.userId` 用于 AI 解析 API
- 改进错误处理

## 测试步骤

完成数据库设置后，按照以下步骤测试：

1. **确保后端运行**
   ```bash
   cd backend
   npm run dev
   ```

2. **确保前端运行**
   ```bash
   cd frontend
   npm run dev
   ```

3. **测试购买订单功能**
   - 访问 http://localhost:5173
   - 登录账户
   - 进入 "采购订单" 页面
   - 点击 "🤖 AI 智能创建" 或 "+ 新增订单"

4. **测试 AI 解析**
   - 在 AI 创建页面输入文本，例如：
     ```
     西瓜 13600斤 4.9元 代办费200 运费150
     ```
   - 点击 "解析" 按钮
   - 应该看到识别的数据和建议订单

## 常见问题

### Q: 仍然看到 "Unexpected token '<'" 错误？
**A:** 说明数据库表仍未创建或后端连接失败。请：
1. 确认 SUPABASE_URL 和 SUPABASE_KEY 正确
2. 重新运行 SQL 创建表
3. 在浏览器开发者工具中查看 Network 标签，看具体返回了什么

### Q: 如何检查 Supabase 连接是否正确？
**A:** 在后端运行：
```bash
curl http://localhost:3000/health
```
应该返回：`{"status":"ok"}`

### Q: 数据库表已创建，但仍有错误？
**A:** 可能是前端缓存问题，请：
1. 清理浏览器缓存
2. 运行 `npm run dev` 重新启动前端
3. 在浏览器中按 Ctrl+Shift+Delete 清空缓存

## 需要帮助？

如果仍有问题，请检查以下文件确保所有依赖都已安装：
- 后端：`backend/package.json` 的依赖
- 前端：`frontend/package.json` 的依赖

并运行：
```bash
# 后端
cd backend && npm install

# 前端
cd frontend && npm install
```

---

**最后一步**：数据库设置完成后，一定要重新启动前端和后端服务！
