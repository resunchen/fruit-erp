# 🚀 Supabase SQL - 快速复制粘贴版

**说明**: 打开 Supabase → SQL Editor → 新建 Query，逐个复制粘贴以下 SQL 语句块，点击 Run 执行

---

## 1️⃣ 插入 5 个供应商

```sql
INSERT INTO suppliers (id, name, contact_person, phone, email, address, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), '山东青岛海洋果业', '张经理', '18566778899', 'info@qingdaofruit.com', '山东省青岛市城阳区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '福建漳州热带水果基地', '李总', '13812345678', 'sales@zhangzhoufruits.com', '福建省漳州市开发区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '云南昆明高原果园', '王农场主', '15987654321', 'yunnan@gaoyuanfruit.com', '云南省昆明市呈贡区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '浙江杭州滨江果蔬合作社', '陈理事长', '18888888888', 'service@hangzhoufruits.com', '浙江省杭州市滨江区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '广西南宁东盟水果市场', '黄经理', '13333333333', 'trade@nanninge-fruits.com', '广西南宁市五象新区', 'active', NOW(), NOW());

SELECT COUNT(*) FROM suppliers;
```

**预期结果**: `5`

---

## 2️⃣ 插入 20 条采购订单

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

SELECT COUNT(*) FROM purchase_orders;
```

**预期结果**: `20`

---

## 3️⃣ 插入 38 个订单项目

```sql
WITH order_list AS (
  SELECT id FROM purchase_orders ORDER BY created_at DESC LIMIT 20
),
item_data AS (
  SELECT
    ol.id as order_id,
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

SELECT COUNT(*) FROM purchase_order_items;
```

**预期结果**: `38` (约)

---

## 4️⃣ 插入 46 条成本数据

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

SELECT COUNT(*) FROM purchase_costs;
```

**预期结果**: `46` (约)

---

## 5️⃣ 验证全部数据

```sql
SELECT
  (SELECT COUNT(*) FROM suppliers) as suppliers_count,
  (SELECT COUNT(*) FROM purchase_orders) as orders_count,
  (SELECT COUNT(*) FROM purchase_order_items) as items_count,
  (SELECT COUNT(*) FROM purchase_costs) as costs_count;
```

**预期结果**:
```
suppliers_count: 5
orders_count: 20
items_count: 38
costs_count: 46
```

---

## 清空数据 (如需重新生成)

```sql
DELETE FROM purchase_costs;
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM suppliers;

-- 验证
SELECT COUNT(*) FROM suppliers;  -- 应返回 0
```

---

**完成！** 现在你可以访问前端应用看到这些数据了 🎉
