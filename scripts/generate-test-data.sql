-- ============================================================================
-- 水果供应链管理系统 - 测试数据生成脚本 (Supabase SQL 版)
-- ============================================================================
-- 说明: 在 Supabase SQL 编辑器中按顺序执行每个 SQL 语句块
--
-- 执行步骤:
-- 1. 复制下面的 SQL 语句
-- 2. 打开 Supabase 项目 → SQL Editor
-- 3. 新建 Query，粘贴相应的 SQL 语句块
-- 4. 点击 Run 执行
-- ============================================================================

-- ============================================================================
-- 步骤 1: 插入 5 个供应商
-- ============================================================================
INSERT INTO suppliers (id, name, contact_person, phone, email, address, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), '山东青岛海洋果业', '张经理', '18566778899', 'info@qingdaofruit.com', '山东省青岛市城阳区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '福建漳州热带水果基地', '李总', '13812345678', 'sales@zhangzhoufruits.com', '福建省漳州市开发区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '云南昆明高原果园', '王农场主', '15987654321', 'yunnan@gaoyuanfruit.com', '云南省昆明市呈贡区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '浙江杭州滨江果蔬合作社', '陈理事长', '18888888888', 'service@hangzhoufruits.com', '浙江省杭州市滨江区', 'active', NOW(), NOW()),
  (gen_random_uuid(), '广西南宁东盟水果市场', '黄经理', '13333333333', 'trade@nanninge-fruits.com', '广西南宁市五象新区', 'active', NOW(), NOW());

-- 验证: 应显示已插入 5 行
SELECT COUNT(*) as suppliers_count FROM suppliers;

-- ============================================================================
-- 步骤 2: 获取供应商 ID (供后续使用)
-- ============================================================================
-- 执行下面的查询，将返回的 5 个 ID 记录下来
SELECT id, name FROM suppliers ORDER BY created_at DESC LIMIT 5;

-- ============================================================================
-- 步骤 3: 插入 20 条采购订单
-- 说明: 请先执行步骤 2 获取供应商 ID，然后替换下面的 supplier_id 值
-- ============================================================================

-- 获取第一个供应商 ID
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

-- 验证: 应显示已插入 20 行
SELECT COUNT(*) as orders_count FROM purchase_orders;

-- ============================================================================
-- 步骤 4: 插入订单项目 (每个订单 1-3 个项目)
-- ============================================================================

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

-- 验证: 应显示已插入约 38 行
SELECT COUNT(*) as items_count FROM purchase_order_items;

-- ============================================================================
-- 步骤 5: 插入成本数据 (每个订单 1-3 条成本)
-- ============================================================================

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

-- 验证: 应显示已插入约 46 行
SELECT COUNT(*) as costs_count FROM purchase_costs;

-- ============================================================================
-- 步骤 6: 数据验证和统计
-- ============================================================================

-- 显示完整的数据统计
SELECT
  (SELECT COUNT(*) FROM suppliers) as suppliers_count,
  (SELECT COUNT(*) FROM purchase_orders) as orders_count,
  (SELECT COUNT(*) FROM purchase_order_items) as items_count,
  (SELECT COUNT(*) FROM purchase_costs) as costs_count;

-- 显示供应商列表
SELECT id, name, contact_person, phone FROM suppliers LIMIT 5;

-- 显示订单列表 (前 5 条)
SELECT id, order_number, total_amount, status, created_at FROM purchase_orders LIMIT 5;

-- 显示订单项目统计
SELECT
  purchase_order_id,
  COUNT(*) as item_count,
  SUM(total_price) as items_total_price
FROM purchase_order_items
GROUP BY purchase_order_id
LIMIT 5;

-- 显示成本统计
SELECT
  purchase_order_id,
  COUNT(*) as cost_count,
  SUM(cost_amount) as total_costs
FROM purchase_costs
GROUP BY purchase_order_id
LIMIT 5;

-- ============================================================================
-- 步骤 7: 清空数据 (如需重新生成，执行下面的语句)
-- ============================================================================
-- 注意: 只有在需要清空所有数据重新开始时才执行以下语句
/*
DELETE FROM purchase_costs;
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM suppliers;
*/
