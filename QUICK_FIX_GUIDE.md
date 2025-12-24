# 🚨 快速修复指南 - JSON 解析错误

## 错误症状
```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## 原因分析

| 部分 | 问题 | 修复状态 |
|------|------|--------|
| **数据库** | 表 `purchase_orders`, `purchase_order_items`, `purchase_costs` 未创建 | ❌ 需要手动创建 |
| **后端认证** | `req.userId` 未正确设置 | ✅ 已修复 |
| **前端请求** | 无法处理非 JSON 响应 | ✅ 已修复 |
| **错误处理** | HTML 错误页面而不是 JSON | ✅ 已修复 |

## 3 步快速修复

### 1️⃣ 创建数据库表（必须）

**Supabase SQL 编辑器中运行：**

访问 https://app.supabase.com → 你的项目 → SQL 编辑器 → 新建查询

```sql
-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单项目表
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  unit_price DECIMAL(10, 4) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 成本表
CREATE TABLE IF NOT EXISTS purchase_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  cost_type VARCHAR(50) NOT NULL,
  cost_amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_by ON purchase_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order_id ON purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_costs_order_id ON purchase_costs(purchase_order_id);
```

点击 **Run** ✅

### 2️⃣ 重启后端和前端

```bash
# 终止现有进程（如果有）
# Ctrl+C

# 重启后端
cd backend
npm run dev

# 新终端：重启前端
cd frontend
npm run dev
```

### 3️⃣ 清空浏览器缓存并刷新

- 按 `Ctrl+Shift+Delete` (或 `Cmd+Shift+Delete` on Mac)
- 清空所有缓存
- 刷新页面 `F5`

## 验证修复

✅ **后端正常** - 访问 http://localhost:3000/health 看到 `{"status":"ok"}`

✅ **前端连接** - 打开浏览器开发者工具 (F12)，进入 Network 标签

✅ **创建订单** - 尝试创建一个采购订单
- 点击 "🤖 AI 智能创建" 或 "+ 新增订单"
- 应该看到表单或 AI 输入界面，而不是错误

## 代码修复总结

### ✅ 已修复的文件

**前端：**
- `frontend/src/utils/request.ts` - 改进错误处理，支持非 JSON 响应

**后端：**
- `backend/src/middleware/auth.middleware.ts` - 正确设置 `req.userId`
- `backend/src/schema.sql` - 添加购买订单表定义

## 如果仍有问题

### 检查列表
- [ ] 数据库表已创建（在 Supabase SQL 编辑器中验证）
- [ ] 后端已重启（`npm run dev`）
- [ ] 前端已重启（`npm run dev`）
- [ ] 浏览器缓存已清空
- [ ] SUPABASE_URL 和 SUPABASE_KEY 正确

### 调试步骤
1. 打开浏览器开发者工具 (F12)
2. 进入 Network 标签
3. 尝试创建订单
4. 查看返回的响应：
   - 如果是 HTML，说明后端返回错误页面
   - 如果是 JSON，检查错误信息

### 获取详细帮助
查看完整指南：[DATABASE_SETUP_DETAILED.md](./DATABASE_SETUP_DETAILED.md)

---

**完成以上步骤后，错误应该被完全解决！** 🎉
