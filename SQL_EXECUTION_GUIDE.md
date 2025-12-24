# 📝 Supabase SQL 数据生成指南

## 🎯 目标

在 Supabase 中直接执行 SQL 脚本生成测试数据：
- **5 个供应商**
- **20 条采购订单**
- **38 个订单项目**
- **46 条成本数据**

---

## 📍 访问 Supabase SQL 编辑器

1. 打开 [Supabase 控制台](https://app.supabase.com)
2. 选择你的项目 (fruit-erp)
3. 左侧菜单 → **SQL Editor**
4. 点击 **New Query** 创建新查询

---

## 📋 执行步骤

### 步骤 1️⃣：插入 5 个供应商

在 SQL Editor 中新建查询，复制以下代码：

```sql
INSERT INTO suppliers (id, name, contact_person, phone, email, address, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), '山东青岛海洋果业', '张经理', '18566778899', 'info@qingdaofruit.com', '山东省青岛市城阳区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '福建漳州热带水果基地', '李总', '13812345678', 'sales@zhangzhoufruits.com', '福建省漳州市开发区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '云南昆明高原果园', '王农场主', '15987654321', 'yunnan@gaoyuanfruit.com', '云南省昆明市呈贡区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '浙江杭州滨江果蔬合作社', '陈理事长', '18888888888', 'service@hangzhoufruits.com', '浙江省杭州市滨江区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '广西南宁东盟水果市场', '黄经理', '13333333333', 'trade@nanninge-fruits.com', '广西南宁市五象新区', 'active', NOW(), NOW());

-- 验证插入
SELECT COUNT(*) as suppliers_count FROM suppliers;
```

**操作**：
1. 复制上面的 SQL
2. 粘贴到 SQL Editor
3. 点击 **Run** 按钮
4. 右下角应显示 `5 rows inserted`

✅ **预期结果**:
```
suppliers_count
5
```

---

### 步骤 2️⃣：插入 20 条采购订单

新建查询，复制以下代码：

```sql
WITH supplier_list AS (
  SELECT id FROM suppliers ORDER BY created_at DESC LIMIT 5
)
INSERT INTO purchase_orders (id, supplier_id, order_number, total_amount, status, created_by, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (ARRAY(SELECT id FROM supplier_list))[((generate_series(1, 20) - 1) % 5) + 1],
  'PO-' || to_char(NOW() - (generate_series(1, 20) || ' day')::interval, 'YYYYMMDD') || '-' || LPAD((generate_series(1, 20))::text, 3, '0'),
  ROUND((RANDOM() * 50000 + 10000)::numeric, 2),
  (ARRAY['draft', 'pending', 'confirmed', 'completed'])[FLOOR(RANDOM() * 4)::int + 1],
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  NOW() - (RANDOM() * 6 || ' day')::interval,
  NOW()
FROM generate_series(1, 20);

-- 验证插入
SELECT COUNT(*) as orders_count FROM purchase_orders;
```

✅ **预期结果**:
```
orders_count
20
```

---

### 步骤 3️⃣：插入订单项目 (38 个)

新建查询，复制以下代码：

```sql
WITH order_list AS (
  SELECT id FROM purchase_orders ORDER BY created_at DESC LIMIT 20
),
item_data AS (
  SELECT
    ol.id as order_id,
    ROW_NUMBER() OVER (PARTITION BY ol.id ORDER BY generate_series) as item_num,
    (ARRAY['西瓜(特选)', '西瓜(一级)', '芒果(优选)', '芒果(一级)', '葡萄(精品)', '葡萄(特选)', '苹果(一级)', '苹果(二级)', '橙子(特选)', '香蕉(优选)', '樱桃(精品)', '桃子(一级)'])[FLOOR(RANDOM() * 12)::int + 1] as product,
    FLOOR(RANDOM() * 4000 + 1000)::int as qty,
    ROUND((RANDOM() * 8 + 2)::numeric, 2) as price
  FROM order_list ol
  CROSS JOIN generate_series(1, FLOOR(RANDOM() * 3)::int + 1)
)
INSERT INTO purchase_order_items (id, purchase_order_id, product_name, quantity, unit, unit_price, total_price, created_at)
SELECT
  gen_random_uuid(),
  order_id,
  product,
  qty,
  '斤',
  price,
  ROUND((qty * price)::numeric, 2),
  NOW()
FROM item_data;

-- 验证插入
SELECT COUNT(*) as items_count FROM purchase_order_items;
```

✅ **预期结果**:
```
items_count
38 (约)
```

---

### 步骤 4️⃣：插入成本数据 (46 条)

新建查询，复制以下代码：

```sql
WITH order_list AS (
  SELECT id FROM purchase_orders ORDER BY created_at DESC LIMIT 20
),
cost_data AS (
  SELECT
    ol.id as order_id,
    (ARRAY['产地包装费', '代办费', '田间杂费', '运输费', '仓储费'])[FLOOR(RANDOM() * 5)::int + 1] as cost_type,
    FLOOR(RANDOM() * 400 + 100)::numeric as cost_amount
  FROM order_list ol
  CROSS JOIN generate_series(1, FLOOR(RANDOM() * 3)::int + 1)
)
INSERT INTO purchase_costs (id, purchase_order_id, cost_type, cost_amount, created_at)
SELECT
  gen_random_uuid(),
  order_id,
  cost_type,
  cost_amount,
  NOW()
FROM cost_data;

-- 验证插入
SELECT COUNT(*) as costs_count FROM purchase_costs;
```

✅ **预期结果**:
```
costs_count
46 (约)
```

---

### 步骤 5️⃣：验证数据完整性

新建查询，复制以下代码查看数据统计：

```sql
-- 数据总体统计
SELECT
  (SELECT COUNT(*) FROM suppliers) as suppliers_count,
  (SELECT COUNT(*) FROM purchase_orders) as orders_count,
  (SELECT COUNT(*) FROM purchase_order_items) as items_count,
  (SELECT COUNT(*) FROM purchase_costs) as costs_count;

-- 供应商列表
SELECT id, name, contact_person, phone FROM suppliers;

-- 订单样例 (前 3 条)
SELECT id, order_number, total_amount, status FROM purchase_orders LIMIT 3;

-- 订单项目统计
SELECT
  COUNT(*) as total_items,
  COUNT(DISTINCT purchase_order_id) as orders_with_items
FROM purchase_order_items;

-- 成本统计
SELECT
  COUNT(*) as total_costs,
  COUNT(DISTINCT purchase_order_id) as orders_with_costs
FROM purchase_costs;
```

✅ **预期结果**:
```
suppliers_count: 5
orders_count: 20
items_count: 38
costs_count: 46
```

---

## 🎬 完整一键执行方案

如果你想一次性执行所有 SQL，可以按以下方式：

1. 打开 `/Users/apple/projects/fruit-erp/scripts/generate-test-data.sql`
2. 复制整个文件的内容
3. 在 Supabase SQL Editor 中新建查询
4. 粘贴所有内容
5. 点击 **Run** 执行

**注意**:
- 如果中间出错，可能需要分步骤执行
- 建议逐步执行更安全

---

## 🔍 验证数据是否生成成功

### 方法 1：在 SQL Editor 中查询

```sql
-- 显示所有数据统计
SELECT
  (SELECT COUNT(*) FROM suppliers) as 供应商数,
  (SELECT COUNT(*) FROM purchase_orders) as 订单数,
  (SELECT COUNT(*) FROM purchase_order_items) as 订单项目数,
  (SELECT COUNT(*) FROM purchase_costs) as 成本数据数;
```

### 方法 2：在前端应用中查看

1. 重启前端应用: `npm run dev`
2. 访问 `http://localhost:5173`
3. 导航到 "采购订单" 页面
4. 应该看到 20 条订单

---

## 🔄 如何清空并重新生成数据

### 清空所有数据

在 SQL Editor 中运行：

```sql
DELETE FROM purchase_costs;
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM suppliers;
```

验证清空成功：

```sql
SELECT
  COUNT(*) FROM suppliers as s,
  COUNT(*) FROM purchase_orders as o,
  COUNT(*) FROM purchase_order_items as i,
  COUNT(*) FROM purchase_costs as c;
```

应该全部显示 0。

### 重新生成

然后从 **步骤 1** 开始重新执行。

---

## 📊 生成的数据示例

### 供应商示例
```
ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
名称: 山东青岛海洋果业
联系人: 张经理
电话: 18566778899
邮箱: info@qingdaofruit.com
地址: 山东省青岛市城阳区
```

### 订单示例
```
ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
订单号: PO-20251224-001
供应商: 山东青岛海洋果业
总金额: 45230.50 元
状态: pending
创建时间: 2025-12-24 10:30:00
```

### 订单项目示例
```
ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
订单: PO-20251224-001
商品: 西瓜(特选)
数量: 2500 斤
单价: 4.90 元
小计: 12250.00 元
```

### 成本数据示例
```
ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
订单: PO-20251224-001
成本类型: 产地包装费
金额: 250.00 元
```

---

## ⚠️ 常见问题

### Q: 执行 SQL 时报错怎么办？

**A**:
1. 检查 SQL 语法是否正确
2. 确认表名和字段名拼写正确
3. 如果是中文相关错误，检查编码设置
4. 尝试分步骤执行

### Q: 数据生成不完整怎么办？

**A**:
1. 检查每一步的验证查询结果
2. 确保前一步成功后再执行后一步
3. 如果某步失败，先清空数据重新来

### Q: 如何确认数据已生成？

**A**:
1. 在 SQL Editor 运行验证查询
2. 查看 Supabase 表浏览器中的数据
3. 在前端应用中查看数据

---

## 📁 相关文件

- **SQL 脚本**: `/Users/apple/projects/fruit-erp/scripts/generate-test-data.sql`
- **测试指南**: `/Users/apple/projects/fruit-erp/TESTING_GUIDE.md`
- **快速启动**: `/Users/apple/projects/fruit-erp/QUICK_START_TESTING.md`

---

## ✅ 完成检查清单

- [ ] 供应商插入成功 (5 个)
- [ ] 订单插入成功 (20 个)
- [ ] 订单项目插入成功 (38 个)
- [ ] 成本数据插入成功 (46 个)
- [ ] 所有验证查询正常
- [ ] 前端应用能显示数据
- [ ] 可以搜索和编辑订单

---

**准备完成**：可以开始测试了！🎉
