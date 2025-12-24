# 📊 测试数据生成完整指南

## 📌 快速开始 (3 步)

### Step 1: 打开 Supabase SQL 编辑器
```
1. 访问 https://app.supabase.com
2. 选择你的项目
3. 左侧菜单 → SQL Editor
4. 新建 Query
```

### Step 2: 复制 SQL 语句
打开 `/Users/apple/projects/fruit-erp/SUPABASE_SQL_QUICK_COPY.md`，逐个复制粘贴 5 个 SQL 语句块

### Step 3: 点击 Run 执行
每个语句块点击 **Run** 按钮，等待完成

---

## 📂 文档位置

| 文档 | 用途 |
|------|------|
| `SUPABASE_SQL_QUICK_COPY.md` | ⭐ **推荐** - 直接复制粘贴版 |
| `SQL_EXECUTION_GUIDE.md` | 详细的图文说明 |
| `scripts/generate-test-data.sql` | 完整的 SQL 脚本文件 |

---

## 🎯 生成数据规模

```
✅ 5 个供应商
✅ 20 条采购订单
✅ 38 个订单项目
✅ 46 条成本数据
───────────────────
📊 总计: 109 条记录
```

---

## 🚀 执行流程

### 第 1 步：插入供应商 (5 个)
- 山东青岛海洋果业
- 福建漳州热带水果基地
- 云南昆明高原果园
- 浙江杭州滨江果蔬合作社
- 广西南宁东盟水果市场

**验证**: 应返回 `5`

### 第 2 步：插入订单 (20 条)
- 订单号: PO-yyyymmdd-nnn 格式
- 状态: draft/pending/confirmed/completed 随机分配
- 供应商: 随机分配给 5 个供应商
- 金额: 10,000 - 60,000 元随机

**验证**: 应返回 `20`

### 第 3 步：插入订单项目 (38 个)
- 每订单 1-3 个项目
- 8 种水果品类
- 数量: 1,000 - 5,000 斤
- 单价: 2 - 10 元/斤

**验证**: 应返回 `38` 左右

### 第 4 步：插入成本数据 (46 条)
- 每订单 1-3 条成本
- 5 种成本类型: 产地包装费、代办费、田间杂费、运输费、仓储费
- 金额: 100 - 500 元

**验证**: 应返回 `46` 左右

---

## ✅ 成功标志

- [x] 所有 SQL 语句执行无错误
- [x] 每步验证查询返回预期数据
- [x] Supabase 表浏览器能看到数据
- [x] 前端应用能显示订单列表 (20 条)
- [x] 前端搜索、编辑、删除功能正常

---

## 🔄 后续步骤

数据生成完成后：

1. **前端测试** (30-60 分钟)
   - 查看供应商列表
   - 查看采购订单列表
   - 测试 CRUD 操作
   - 测试 AI 创建功能

2. **浏览器验证** (10 分钟)
   - 打开 F12 开发者工具
   - Network 标签检查 API 请求
   - 确保所有请求返回 200 状态码（无 404）

3. **开发下一阶段** (Week 2+)
   - 仓储管理模块
   - 打包发货模块
   - 成本核算模块

---

## 🆘 故障排查

### SQL 执行出错

**可能原因**:
- 表不存在
- 字段名拼写错误
- UUID 格式不对

**解决方案**:
1. 检查 schema 是否已创建 (backend/src/schema.sql)
2. 验证表名和字段名是否正确
3. 逐步执行而不是一次执行全部

### 数据生成不完整

**可能原因**:
- 某个步骤执行失败
- 网络中断

**解决方案**:
1. 查看验证查询的结果
2. 如果某步失败，清空重来
3. 分步骤执行，不要一次全部运行

### 前端看不到数据

**可能原因**:
- 前端未重启
- 浏览器缓存
- API 未刷新

**解决方案**:
1. 重启前端: `npm run dev`
2. 清空浏览器缓存: `Ctrl+Shift+Delete`
3. 刷新页面: `F5`

---

## 📊 SQL 验证查询速查表

### 查看所有供应商
```sql
SELECT id, name, contact_person FROM suppliers;
```

### 查看所有订单
```sql
SELECT order_number, total_amount, status FROM purchase_orders;
```

### 查看订单和项目的关系
```sql
SELECT
  po.order_number,
  COUNT(poi.id) as item_count,
  SUM(poi.total_price) as items_total
FROM purchase_orders po
LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
GROUP BY po.id;
```

### 查看订单和成本的关系
```sql
SELECT
  po.order_number,
  COUNT(pc.id) as cost_count,
  SUM(pc.cost_amount) as total_costs
FROM purchase_orders po
LEFT JOIN purchase_costs pc ON po.id = pc.purchase_order_id
GROUP BY po.id;
```

### 计算订单总成本
```sql
SELECT
  po.order_number,
  po.total_amount as order_subtotal,
  SUM(pc.cost_amount) as total_costs,
  po.total_amount + SUM(pc.cost_amount) as grand_total
FROM purchase_orders po
LEFT JOIN purchase_costs pc ON po.id = pc.purchase_order_id
GROUP BY po.id;
```

---

## 💡 提示

### 如何快速执行全部 SQL？

如果你想一次性执行所有 SQL：
1. 打开 `scripts/generate-test-data.sql`
2. 全选所有内容 (Ctrl+A)
3. 复制 (Ctrl+C)
4. 在 Supabase SQL Editor 中粘贴
5. 点击 Run

**注意**: 如果中间出错，可能需要分步骤执行修复

### 如何修改生成数据？

如果你想修改某些参数（如订单数量、单价范围等）：
1. 编辑 `scripts/generate-test-data.sql` 或 `SUPABASE_SQL_QUICK_COPY.md`
2. 修改相关参数（如 `generate_series(1, 20)` 改为 `generate_series(1, 50)` 生成 50 条订单）
3. 重新执行

### 如何导出数据？

在 Supabase 表浏览器中：
1. 选择表
2. 右上角 "..." 菜单
3. Export → 选择格式 (CSV/JSON/Excel)

---

## 📝 执行检查清单

- [ ] Supabase SQL Editor 已打开
- [ ] 新建 Query 已创建
- [ ] 第 1 个 SQL (供应商) 已执行，验证返回 5
- [ ] 第 2 个 SQL (订单) 已执行，验证返回 20
- [ ] 第 3 个 SQL (项目) 已执行，验证返回 38
- [ ] 第 4 个 SQL (成本) 已执行，验证返回 46
- [ ] 第 5 个 SQL (验证) 已执行，看到全部数据
- [ ] 前端应用能显示 20 条订单
- [ ] 所有功能正常运行

---

## 🎉 完成！

数据生成完成后，你可以：
- ✅ 立即开始前端功能测试
- ✅ 验证 API 是否正常工作
- ✅ 进行端到端的业务流程测试
- ✅ 为下一阶段开发准备充足的测试数据

---

**准备完成时间**: 2025-12-24
**所需时间**: 5-10 分钟 (SQL 执行)
**难度**: 简单 (复制粘贴)
**下一步**: 开始前端测试！

祝你顺利！🚀
