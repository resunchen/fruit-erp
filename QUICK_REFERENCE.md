# 开发规范 - 快速查询表

这是一个快速查询文档，包含开发过程中最常用的规范和模板。详细内容见 DEVELOPMENT_STANDARDS.md。

---

## 📋 开发流程检查清单

### 开发前
- [ ] 打开当周的 TODO 文档
- [ ] 完整阅读功能概述和清单
- [ ] 理解技术实现要点
- [ ] 了解 API 设计和数据库表结构

### 开发中
- [ ] 按照功能清单顺序实现
- [ ] 遵循命名和文件夹结构规范
- [ ] 编写必要的类型定义和验证
- [ ] 添加错误处理和日志
- [ ] 完成单元测试
- [ ] 每完成 1-2 个功能点就 commit 一次

### 开发完成
- [ ] 所有功能点都已在 TODO 中勾选
- [ ] 代码通过 ESLint（零警告）
- [ ] TypeScript 编译通过（零错误）
- [ ] 测试覆盖率 ≥ 70%
- [ ] API 文档已更新
- [ ] 在 TODO 中更新"完成情况"

---

## 🏗️ 项目结构速查

### 前端项目结构
```
src/
├── components/          # React 组件（按模块分文件夹）
│   ├── purchase/       # 采购模块组件
│   ├── warehouse/      # 仓储模块组件
│   ├── shipping/       # 发货模块组件
│   ├── cost/          # 成本模块组件
│   └── common/        # 通用组件（Header、Modal 等）
├── pages/             # 页面级组件
├── hooks/             # 自定义 Hook
├── services/          # API 请求服务
├── store/             # Zustand 状态管理
├── types/             # TypeScript 类型定义
├── utils/             # 工具函数
├── styles/            # 全局样式
└── App.tsx
```

### 后端项目结构
```
src/
├── controllers/       # 控制器层（处理请求响应）
├── services/         # 服务层（核心业务逻辑）
├── repositories/     # 数据访问层
├── routes/          # API 路由定义
├── middleware/      # 中间件（auth、error、logger）
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数（errors、validators）
├── config/          # 配置文件
└── app.ts          # Express 应用入口
```

---

## 📝 命名规范

### 前端
| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `PurchaseOrderForm.tsx` |
| 页面文件 | PascalCase | `PurchaseOrderList.tsx` |
| 函数/变量 | camelCase | `calculateCost` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 类型文件 | PascalCase | `PurchaseOrder.ts` |
| 类 | PascalCase | `PurchaseService` |
| 私有方法 | camelCase(带_前缀) | `_formatDate()` |

### 后端
| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | camelCase | `purchaseController.ts` |
| 类名 | PascalCase | `PurchaseService` |
| 方法名 | camelCase | `createOrder()` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 路由 | /api/v1/resource | `/api/v1/purchase/orders` |

### 数据库
| 类型 | 规范 | 示例 |
|------|------|------|
| 表名 | snake_case 复数 | `purchase_orders` |
| 字段名 | snake_case | `supplier_id` |
| 主键 | `id` | UUID |
| 外键 | {table}_id | `supplier_id` |
| 时间戳 | `created_at`, `updated_at` | TIMESTAMPTZ |

---

## 📖 代码模板速查

### React 组件模板（函数组件）
```typescript
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

interface ComponentProps {
  title?: string;
  onSubmit?: (data: any) => void;
}

const Component: FC<ComponentProps> = ({ title, onSubmit }) => {
  const [state, setState] = useState('');

  useEffect(() => {
    // 初始化逻辑
  }, []);

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### Express 路由模板
```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { controller } from '@/controllers/xxx';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

export default router;
```

### Service 服务层模板
```typescript
export const xxxService = {
  async getAll(filters: any) {
    // 实现逻辑
    return data;
  },

  async getById(id: string) {
    // 实现逻辑
    return data;
  },

  async create(input: any) {
    // 验证
    // 创建
    return data;
  },
};
```

### 数据库 SQL 模板
```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_1 VARCHAR(100) NOT NULL,
  field_2 DECIMAL(10, 2),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT check_constraint CHECK (condition),
  INDEX idx_field_1 (field_1),
  INDEX idx_created_date (created_at DESC)
);
```

---

## 🔄 Git 提交规范

### Commit Message 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型和示例
```bash
# 新功能
git commit -m "feat(purchase): 实现供应商管理功能

- 完成供应商 CRUD 操作
- 添加供应商验证规则

Closes #123"

# 修复 Bug
git commit -m "fix(cost): 修复批次成本计算错误

修改每箱成本的计算逻辑，确保分摊成本正确"

# 重构代码
git commit -m "refactor(auth): 简化认证中间件逻辑"

# 文档更新
git commit -m "docs: 更新 API 文档"
```

### Branch 命名
```bash
feature/purchase-order-management
bugfix/cost-calculation
refactor/error-handling
docs/api-documentation
```

---

## ✅ 代码审查检查清单

### 功能完整性
- [ ] 所有计划的功能点都已实现
- [ ] 功能逻辑正确，符合需求
- [ ] 边界情况已处理（空数据、错误情况等）

### 代码质量
- [ ] 代码易读，变量名清晰
- [ ] 没有重复代码（DRY 原则）
- [ ] 复杂逻辑有注释说明
- [ ] 函数职责单一（SRP 原则）

### 类型安全
- [ ] TypeScript 编译通过（无错误和警告）
- [ ] 所有参数都有类型定义
- [ ] 没有 `any` 类型（特殊情况除外）

### 错误处理
- [ ] 异常情况都有 try-catch
- [ ] 用户输入都有验证
- [ ] API 错误有统一处理
- [ ] 错误信息清晰有帮助

### 安全性
- [ ] 没有硬编码敏感信息（密钥、密码）
- [ ] SQL 注入防护（使用参数化查询）
- [ ] 跨域请求有 CORS 配置
- [ ] 敏感数据加密存储

### 性能
- [ ] 数据库查询有索引
- [ ] 避免 N+1 查询问题
- [ ] 大列表有分页或虚拟滚动
- [ ] 没有内存泄漏

### 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 测试覆盖率 ≥ 70%
- [ ] 关键路径都有测试

### 文档
- [ ] API 文档已更新
- [ ] 复杂函数有 JSDoc 注释
- [ ] 数据结构有类型说明
- [ ] README 或使用文档已完成

---

## 🧪 测试命令速查

### 前端测试
```bash
# 运行所有测试
npm run test

# 运行特定测试文件
npm run test -- src/__tests__/Component.test.tsx

# 生成覆盖率报告
npm run test:coverage

# 监听模式（开发时）
npm run test -- --watch
```

### 后端测试
```bash
# 运行所有测试
npm run test

# 运行特定测试文件
npm run test -- --testPathPattern=purchase

# 生成覆盖率报告
npm run test -- --coverage

# 集成测试（需要测试数据库）
npm run test:integration
```

### 代码质量检查
```bash
# ESLint 检查
npm run lint

# 自动修复 ESLint 问题
npm run lint -- --fix

# 类型检查
npm run type-check

# 构建检查
npm run build
```

---

## 🚀 常用命令速查

### 项目启动
```bash
# 前端开发
cd frontend && npm run dev

# 后端开发
cd backend && npm run dev

# 同时启动前后端
# 需要在两个终端分别运行
```

### 数据库操作
```bash
# 创建新表（Supabase SQL Editor）
# 1. 登录 Supabase
# 2. 进入 SQL Editor
# 3. 粘贴 SQL 脚本
# 4. 点击 Run

# 查看表结构
# 在 Supabase Dashboard 的 Tables 标签页查看
```

### 依赖管理
```bash
# 安装依赖
npm install package-name

# 安装开发依赖
npm install -D package-name

# 更新依赖
npm update

# 检查过时的依赖
npm outdated
```

---

## 📊 关键指标和阈值

| 指标 | 目标 | 检查方法 |
|------|------|--------|
| 代码覆盖率 | ≥ 70% | `npm run test:coverage` |
| ESLint 警告 | 0 | `npm run lint` |
| TypeScript 错误 | 0 | `npm run type-check` |
| 页面加载时间 | ≤ 2 秒 | 浏览器开发工具 |
| API 响应时间 | ≤ 2 秒 | 网络标签页 |
| 构建大小 | ≤ 500 KB | `npm run build` |
| 并发用户 | ≥ 50 | 压力测试 |

---

## 🎯 周度开发规范

### 每周开发流程（共 5 天）

**周一**
- [ ] 阅读当周 TODO 文档
- [ ] 理解功能清单和架构
- [ ] 建立本地开发分支

**周二-周四**
- [ ] 每天完成 5-8 个功能点
- [ ] 每完成 2-3 个功能点提交一次 commit
- [ ] 及时修复 test 失败

**周五**
- [ ] 完成剩余功能点
- [ ] 全面测试和代码审查
- [ ] 更新 TODO 文档的完成情况
- [ ] 准备周报（完成内容、遇到问题、后续计划）

---

## 🔧 常见问题速查

| 问题 | 解决方案 |
|------|--------|
| ESLint 错误太多 | 运行 `npm run lint -- --fix` 自动修复 |
| TypeScript 找不到模块 | 检查 `tsconfig.json` 的 `baseUrl` 和 `paths` 配置 |
| 数据库连接失败 | 检查 `.env` 中的 Supabase URL 和 key |
| 前端样式不生效 | 确保 Tailwind CSS 的 `content` 配置包含了文件 |
| API 404 错误 | 检查后端路由是否正确注册，URL 是否匹配 |
| 测试超时 | 增加 Jest 的 timeout：`jest.setTimeout(10000)` |
| 权限问题 | 检查 Supabase RLS 政策是否配置正确 |
| 性能慢 | 检查 N+1 查询、添加索引、使用缓存 |

---

## 📚 推荐资源

### 文档
- [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) - 完整规范
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - 完整计划
- [README_DEV_GUIDE.md](./README_DEV_GUIDE.md) - 快速入门

### 官方文档
- [React](https://react.dev/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Supabase](https://supabase.com/docs) - 数据库
- [Express](https://expressjs.com/) - 后端框架
- [TypeScript](https://www.typescriptlang.org/docs/) - 类型系统

### 代码库示例
- Supabase 官方示例
- React Router 官方示例
- Express 官方示例

---

**版本**: v1.0
**最后更新**: 2025-12-23
**快速查询，详细内容见规范文档！**

