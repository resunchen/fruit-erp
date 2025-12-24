# 🔧 API 404 错误修复总结

## 问题诊断

**错误信息**：`Server error (404): <!DOCTYPE html> ...`

**根本原因**：前端发送的 API 请求缺少 `/api/v1` URL 前缀

### 请求 URL 对比

| 部分 | 前端请求（错误） | 后端实际路由（正确） |
|------|----------------|-----------------|
| 采购订单列表 | `/purchase/orders` | `/api/v1/purchase/orders` |
| 采购订单详情 | `/purchase/orders/:id` | `/api/v1/purchase/orders/:id` |
| AI 文本解析 | `/ai/parse-purchase` | `/api/v1/ai/parse-purchase` |
| 成本字典 | `/ai/cost-dictionary` | `/api/v1/ai/cost-dictionary` |

## ✅ 已修复的文件

### 1. 采购订单服务
**文件**：`frontend/src/services/purchaseOrder.service.ts`

修改的方法：
- ✅ `getOrders()` - 添加 `/api/v1` 前缀
- ✅ `getOrder(id)` - 添加 `/api/v1` 前缀
- ✅ `createOrder(data)` - 添加 `/api/v1` 前缀
- ✅ `updateOrder(id, data)` - 添加 `/api/v1` 前缀
- ✅ `deleteOrder(id)` - 添加 `/api/v1` 前缀

### 2. AI 解析服务
**文件**：`frontend/src/services/aiParse.service.ts`

修改的方法：
- ✅ `parsePurchaseText(data)` - `/ai/parse-purchase` → `/api/v1/ai/parse-purchase`
- ✅ `parsePurchaseTextBatch(texts)` - `/ai/parse-purchase/batch` → `/api/v1/ai/parse-purchase/batch`
- ✅ `getCostDictionary()` - `/ai/cost-dictionary` → `/api/v1/ai/cost-dictionary`
- ✅ `updateCostDictionary(dict)` - `/ai/cost-dictionary` → `/api/v1/ai/cost-dictionary`

## 🚀 应用修复

### 步骤 1：确认修复已应用

修复已在以下两个文件中应用：
1. `frontend/src/services/purchaseOrder.service.ts` ✅
2. `frontend/src/services/aiParse.service.ts` ✅

### 步骤 2：重启前端服务

```bash
# 进入前端目录
cd /Users/apple/projects/fruit-erp/frontend

# 停止现有的前端服务（如果有的话）
# Ctrl+C

# 重新启动前端
npm run dev
```

### 步骤 3：清空浏览器缓存

1. 打开浏览器开发者工具（F12）
2. 进入 **Application** 标签
3. 左侧选择 **Clear storage**
4. 点击 **Clear all**
5. 或者按 `Ctrl+Shift+Delete` 清空缓存
6. 刷新页面（F5 或 Ctrl+R）

## ✅ 验证修复

### 测试 1：采购订单列表

1. 访问 http://localhost:5173
2. 登录你的账户
3. 进入 "采购订单" 页面
4. ✅ 应该看到订单列表或"暂无订单"提示（不再是 404 错误）

### 测试 2：创建采购订单

1. 点击 "+ 新增订单" 按钮
2. 填写表单数据：
   - 选择供应商
   - 添加订单项目
   - 添加成本（可选）
3. 点击 "提交" 按钮
4. ✅ 应该成功创建订单（不再是 404 错误）

### 测试 3：AI 智能创建

1. 点击 "🤖 AI 智能创建" 按钮
2. 输入采购文本，例如：
   ```
   西瓜 13600斤 4.9元 代办费200 运费150
   ```
3. 点击 "解析" 按钮
4. ✅ 应该看到识别的数据（不再是 404 错误）
5. 点击 "确认并创建订单"
6. ✅ 应该成功创建订单

### 检查浏览器网络请求

1. 打开浏览器开发者工具（F12）
2. 进入 **Network** 标签
3. 清空请求日志
4. 在应用中执行操作（如创建订单）
5. 检查请求 URL：
   - ✅ 应该看到 `http://localhost:3000/api/v1/purchase/orders`
   - ✅ 应该看到 `http://localhost:3000/api/v1/ai/parse-purchase`
   - ✅ 响应状态应该是 200、201 或 4xx（但不是 404）

## 📊 总结

### 修复前后对比

| 功能 | 修复前 | 修复后 |
|------|--------|--------|
| 查看订单列表 | ❌ 404 错误 | ✅ 成功 |
| 查看订单详情 | ❌ 404 错误 | ✅ 成功 |
| 创建订单 | ❌ 404 错误 | ✅ 成功 |
| 编辑订单 | ❌ 404 错误 | ✅ 成功 |
| 删除订单 | ❌ 404 错误 | ✅ 成功 |
| AI 文本解析 | ❌ 404 错误 | ✅ 成功 |
| 获取成本字典 | ❌ 404 错误 | ✅ 成功 |

## 🎯 下一步

修复完成后，你可以：
1. ✅ 继续测试采购模块的所有功能
2. ✅ 测试数据库持久化（创建的订单应该能在刷新后仍然存在）
3. ✅ 测试 AI 解析的准确度
4. ✅ 开始开发第 3 周的功能（仓储与发货）

## 如果仍有问题

### 检查列表

- [ ] 前端已重新启动（`npm run dev`）
- [ ] 浏览器缓存已清空
- [ ] 浏览器开发者工具显示请求 URL 包含 `/api/v1` 前缀
- [ ] 后端仍在运行（`npm run dev` in backend 目录）
- [ ] 数据库表已创建（`purchase_orders`, `purchase_order_items`, `purchase_costs`）

### 调试建议

1. **查看具体请求 URL**：在浏览器 Network 标签中确认请求 URL
2. **查看响应状态码**：应该是 200/201（成功）或 401（认证错误），不应该是 404
3. **查看响应体**：应该是 JSON 格式，不应该是 HTML
4. **查看浏览器控制台**：查看是否有 JavaScript 错误

---

**修复完成！🎉 采购模块应该现在可以正常工作了。**
