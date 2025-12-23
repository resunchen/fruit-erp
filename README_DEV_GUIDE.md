# 水果供应链系统 - 开发指南

欢迎来到水果供应链全流程管理系统的开发项目！本文档将帮助你快速了解项目结构、开发流程和相关规范。

## 📋 项目文档速览

本项目包含以下重要文档，请按需查阅：

| 文档 | 说明 | 适用场景 |
|------|------|--------|
| [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) | 完整的开发计划和架构设计 | 项目经理、架构师、技术lead |
| [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) | 开发规范和代码标准 | 所有开发人员 |
| [TODO/](./TODO/) | 每周迭代的 TODO 文档 | 日常开发任务 |

## 🚀 快速开始

### 1. 理解项目结构

首先阅读 [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) 的以下部分：
- 项目概述
- 系统模块清单与优先级
- 分阶段详细开发计划

这将帮助你了解整个项目的全貌和优先级。

### 2. 遵循开发规范

开发前必须阅读 [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md)，重点关注：
- **开发流程规范**: 如何创建 TODO 文档、完成功能、标记进度
- **代码规范**: 前端、后端、数据库的编码标准
- **Git 提交规范**: commit message 的格式

### 3. 按周执行开发任务

查看 [TODO/](./TODO/) 文件夹中的 TODO 文档，每周按以下步骤执行：

```
第 1 周: TODO_P1_Week1_项目初始化_01.md
第 2 周: TODO_P1_Week2_采购管理_02.md
第 3 周: TODO_P1_Week3_仓储发货_03.md
第 4 周: TODO_P1_Week4_成本核算与集成_04.md
... (后续迭代)
```

---

## 📝 如何使用 TODO 文档

### 开发前
1. 打开当周的 TODO 文档
2. **完整阅读**功能概述和功能清单
3. 理解技术实现要点
4. 查看相关 API 端点设计

### 开发中
1. 按功能清单逐项实现
2. **每完成一个功能点，在 TODO 文档中勾选**
   ```markdown
   - [x] 已完成的功能
   - [ ] 未完成的功能
   ```
3. 遵循代码规范（见 [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md)）
4. 定期提交 Git commits

### 开发完成
1. 确保所有功能点都已勾选
2. 完成代码审查和测试
3. 更新 TODO 文档的"完成情况"部分
4. 将完成的 TODO 文档归档到 `TODO/COMPLETED/` 文件夹

---

## 🎯 开发流程（详细步骤）

### 第一步：创建 TODO 文档（已完成）
TODO 文档已经为你创建好了，位置在 `TODO/` 文件夹：
- `TODO_P1_Week1_项目初始化_01.md`
- `TODO_P1_Week2_采购管理_02.md`
- `TODO_P1_Week3_仓储发货_03.md`
- `TODO_P1_Week4_成本核算与集成_04.md`

### 第二步：开始第一周开发

打开 `TODO_P1_Week1_项目初始化_01.md`，按以下步骤执行：

```bash
# 1. 初始化前端项目
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install shadcn-ui
# ... (详见 TODO 文档)

# 2. 初始化后端项目
cd backend
npm init -y
npm install express supabase @supabase/supabase-js typescript ts-node
npm install -D @types/node @types/express
# ... (详见 TODO 文档)

# 3. 配置数据库
# 在 Supabase 中创建项目，运行 SQL 初始化脚本
# ... (详见 TODO 文档)

# 4. 提交 Git
git add .
git commit -m "chore: 项目初始化 - 完成前后端和数据库基础架构"
```

### 第三步：实现功能点

以实现"供应商增删改查"为例：

**1. 阅读 TODO 文档中的相关信息**
```markdown
- [ ] 后端：实现供应商列表查询 API（GET /api/v1/suppliers）
```

**2. 理解 API 设计**
```
GET /api/v1/suppliers
  查询参数: page, pageSize, keyword
  响应: { code, data: [suppliers], pagination }
```

**3. 实现后端代码**
```typescript
// src/services/supplierService.ts
export const getSuppliers = async (filters: any) => {
  // 实现逻辑
}

// src/controllers/supplierController.ts
export const listSuppliers = async (req, res) => {
  // 调用 service，返回响应
}

// src/routes/supplier.routes.ts
router.get('/suppliers', listSuppliers);
```

**4. 实现前端代码**
```typescript
// src/services/supplier.service.ts
export const supplierService = {
  getSuppliers: async (filters) => { /* ... */ }
}

// src/components/purchase/SupplierList.tsx
export const SupplierList = () => { /* ... */ }
```

**5. 标记完成**
```markdown
- [x] 后端：实现供应商列表查询 API（GET /api/v1/suppliers）
```

**6. 提交 Git**
```bash
git add .
git commit -m "feat(supplier): 实现供应商管理增删改查功能

- 完成 SupplierService 的 CRUD 操作
- 完成 SupplierList 和 SupplierForm 前端组件
- 添加供应商列表、新增、编辑、删除 API

Closes TODO_P1_Week2_采购管理_02.md"
```

### 第四步：测试

在标记功能点完成前，需要通过以下测试：
- ✅ 单元测试通过
- ✅ 手动功能测试通过
- ✅ API 文档已更新
- ✅ 代码符合规范（ESLint 通过）

### 第五步：进度同步

每周末或功能迭代完成后：
1. 更新 TODO 文档的"完成情况"
2. 准备周报（包含完成的功能、遇到的问题、后续计划）
3. 如有问题，与 lead 沟通

---

## 🔧 开发工具和命令

### 项目初始化命令

```bash
# 前端项目初始化
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npm install shadcn-ui @hookform/resolvers zod react-query

# 后端项目初始化
mkdir backend && cd backend
npm init -y
npm install express supabase @supabase/supabase-js cors dotenv
npm install -D typescript ts-node @types/node @types/express
```

### 常用 NPM 命令

```bash
# 前端开发
npm run dev          # 启动开发服务器
npm run build        # 打包生产版本
npm run lint         # ESLint 检查
npm run test         # 运行测试

# 后端开发
npm run dev          # 启动开发服务器（使用 ts-node）
npm run build        # 编译 TypeScript
npm run lint         # ESLint 检查
npm run test         # 运行测试
```

### Git 常用命令

```bash
# 创建分支
git checkout -b feature/supplier-management

# 查看状态
git status

# 提交更改
git add .
git commit -m "feat: 供应商管理"

# 推送分支
git push origin feature/supplier-management

# 合并到主分支（完成 PR 后）
git checkout main
git merge feature/supplier-management
git push origin main
```

---

## 📊 项目优先级和阶段

### P1 优先级（第 1-4 周）- 核心业务闭环 ⭐⭐⭐

```
第 1 周: 项目初始化
  ↓
第 2 周: 采购管理
  ↓
第 3 周: 仓储 + 发货
  ↓
第 4 周: 成本核算 + 集成测试
  ↓
目标: 采购→仓储→发货完整流程可运行
```

### P2 优先级（第 5-8 周）- 核心管控

```
第 5-6 周: 追溯 + 物料 + 通知
第 7 周: 采购/仓储功能优化
第 8 周: 集成测试
↓
目标: 管控功能完整可用
```

### P3 优先级（第 9-10 周）- 补充功能

```
第 9 周: 客户 + 人员 + 运输
第 10 周: 成本分析优化
↓
目标: 补充模块功能完成
```

### P4 优先级（第 11-12 周）- 高级功能

```
第 11 周: 权限 + 素材 + 数据分析
第 12 周: 上线准备
↓
目标: 系统正式上线
```

---

## 💡 常见问题和最佳实践

### Q: 应该从哪个 TODO 开始？
A: **第 1 周（项目初始化）**。完成后再开始第 2 周。不能跳过任何一周，因为后续阶段依赖前面的基础。

### Q: TODO 文档中有太多功能点，应该怎么办？
A: 这很正常。建议：
1. 阅读整个文档，理解全局
2. 按照列出的顺序逐项实现
3. 每完成 2-3 个功能点就提交一次 commit
4. 遇到困难时，先完成基础部分，复杂部分可以标记为"TODO: 后续优化"

### Q: 如果发现某个功能需要修改设计怎么办？
A:
1. 停止当前任务
2. 记录问题和建议
3. 与 lead 或架构师沟通
4. 根据决策更新 TODO 文档
5. 继续开发

### Q: 代码应该多"完美"才能提交？
A: 遵循以下检查清单：
- [ ] 代码通过 ESLint（零警告）
- [ ] TypeScript 编译通过（零错误）
- [ ] 单元测试覆盖率 ≥ 70%
- [ ] 功能手动测试通过
- [ ] 符合命名规范和项目结构
- [ ] 有合理的错误处理

### Q: 如何处理跨功能点的依赖？
A: 例如，采购订单依赖供应商表：
1. 先完成供应商相关的功能点
2. 再实现采购订单
3. 这就是为什么 TODO 文档有顺序的原因

---

## 📚 深入阅读

### 推荐阅读顺序

1. **本文档** (README_DEV_GUIDE.md) - 5 分钟快速了解
2. **DEVELOPMENT_PLAN.md** - 15 分钟了解全局
3. **DEVELOPMENT_STANDARDS.md** - 30 分钟学习代码规范
4. **当周 TODO 文档** - 15 分钟理解本周任务
5. **代码实现** - 参考现有代码和组件库文档

### 相关技术文档

- [React 官方文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [Supabase 文档](https://supabase.com/docs)
- [Express.js 文档](https://expressjs.com/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

---

## ✅ 检查清单

在开始开发前，确认以下事项：

- [ ] 已读 DEVELOPMENT_PLAN.md
- [ ] 已读 DEVELOPMENT_STANDARDS.md
- [ ] 理解了项目的分阶段计划
- [ ] 理解了开发流程规范
- [ ] 已安装项目所需的依赖
- [ ] 已配置开发环境（Node.js、npm、Git）
- [ ] 已访问 Supabase 项目并获取 API key
- [ ] 已克隆项目仓库并创建本地分支

---

## 📞 获取帮助

遇到问题时：

1. **查看 TODO 文档** - 相关的 API 设计、表结构都有
2. **查看 DEVELOPMENT_STANDARDS.md** - 代码规范和最佳实践
3. **查看注释和类型提示** - 代码中有详细说明
4. **Google 或搜索相关技术文档** - 大多数问题都有现成答案
5. **与 lead 或团队沟通** - 遇到设计问题或卡顿时

---

## 🎉 开发完成后

当功能开发完成并通过所有测试后：

1. ✅ 更新 TODO 文档的"完成情况"字段
2. ✅ 提交最终的 Git commit
3. ✅ 创建 Pull Request（如使用 GitHub）
4. ✅ 标记为 code review ready
5. ✅ 根据反馈进行修改
6. ✅ 合并到主分支

---

**祝你开发顺利！** 🚀

如有任何问题或建议，欢迎反馈。让我们一起构建一个优秀的水果供应链管理系统！

