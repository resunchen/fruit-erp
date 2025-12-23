# TODO: 项目初始化与基础架构搭建（第 1 周）

## 功能概述
本周主要完成项目的基础架构搭建，包括前端项目初始化（React + Tailwind + shadcn）、后端项目初始化（Node.js + Express）、数据库基础表创建，以及用户认证系统的基础框架搭建。

## 功能清单

### 前端项目初始化
- [ ] 使用 Vite 初始化 React + TypeScript 项目
- [ ] 安装配置 Tailwind CSS
- [ ] 安装配置 shadcn/ui 组件库
- [ ] 配置项目文件夹结构（components、pages、hooks、services 等）
- [ ] 设置 ESLint 和 Prettier
- [ ] 配置 TypeScript 编译选项
- [ ] 创建基础的应用主文件和路由框架

### 后端项目初始化
- [ ] 初始化 Node.js + Express 项目结构
- [ ] 安装 Supabase JS Client、Express、中间件等依赖
- [ ] 配置环境变量文件（.env.example）
- [ ] 设置 TypeScript 编译配置
- [ ] 配置 ESLint 和 Prettier
- [ ] 创建全局错误处理中间件
- [ ] 创建日志中间件（Winston 或 Pino）

### 数据库和 Supabase 配置
- [ ] 配置 Supabase 项目连接
- [ ] 创建基础数据库表：users、roles、permissions、user_roles、role_permissions
- [ ] 创建 suppliers（供应商）表
- [ ] 设置 Supabase RLS 基础策略
- [ ] 创建数据库初始化脚本

### 用户认证系统（基础框架）
- [ ] 实现用户注册 API（POST /api/v1/auth/register）
- [ ] 实现用户登录 API（POST /api/v1/auth/login）
- [ ] 实现用户登出 API（POST /api/v1/auth/logout）
- [ ] 实现 JWT Token 生成和验证
- [ ] 创建认证中间件（验证 token 和权限）
- [ ] 前端实现登录页面和基础路由保护

### API 和文档框架
- [ ] 配置 Swagger/OpenAPI 文档框架
- [ ] 创建 API 请求拦截器和错误处理工具
- [ ] 编写基础 API 文档模板

### 项目配置和工具
- [ ] 配置 Git 工作流（分支、commit 规范）
- [ ] 创建 .gitignore 文件
- [ ] 配置开发/测试/生产环境变量
- [ ] 创建 Docker 配置文件（可选）
- [ ] 配置项目的启动脚本（package.json scripts）

## 技术实现要点

### 前端技术栈配置
- Vite: 快速构建工具，配置 React Fast Refresh
- React Router: v6 版本，实现页面路由
- Tailwind CSS: 实用优先的 CSS 框架
- shadcn/ui: 基于 Radix UI 的组件库，直接集成到项目
- Zustand: 轻量级状态管理库
- TanStack Query: 数据请求和缓存管理

### 后端技术栈配置
- Express: 轻量级 Node.js Web 框架
- Supabase JS Client: PostgreSQL 数据库和认证服务
- JWT: Token 认证机制
- 中间件: 错误处理、日志、CORS、认证
- 数据验证: Zod 或 Joi

### 数据库设计要点
- 使用 UUID 作为主键
- 添加 created_at、updated_at 时间戳
- 为常用查询字段添加索引
- 配置 RLS 实现行级安全

## 文件列表

### 前端（src/）
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── NotFound.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useRequest.ts
├── services/
│   └── auth.service.ts
├── store/
│   └── authStore.ts
├── types/
│   ├── auth.ts
│   └── common.ts
├── utils/
│   ├── request.ts (API 请求配置)
│   └── validators.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

### 后端（src/）
```
src/
├── config/
│   ├── database.ts
│   ├── env.ts
│   └── supabase.ts
├── controllers/
│   └── authController.ts
├── services/
│   └── authService.ts
├── repositories/
│   └── userRepository.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── logger.middleware.ts
├── routes/
│   ├── index.ts
│   └── auth.routes.ts
├── types/
│   ├── auth.ts
│   ├── express.d.ts (扩展 Express Request)
│   └── index.ts
├── utils/
│   ├── errors.ts
│   ├── jwt.ts
│   └── validators.ts
└── app.ts
```

### 数据库（SQL 初始化脚本）
```sql
-- schema.sql
-- 包含以下表的创建语句：
-- users, roles, permissions, user_roles, role_permissions, suppliers
```

## 相关 API 端点

### 认证相关
```
POST /api/v1/auth/register
  请求: { email, password, name }
  响应: { code, data: { user, token }, message }

POST /api/v1/auth/login
  请求: { email, password }
  响应: { code, data: { user, token }, message }

POST /api/v1/auth/logout
  请求: {}
  响应: { code, message }

POST /api/v1/auth/refresh
  请求: { refreshToken }
  响应: { code, data: { token }, message }
```

### 基础用户相关
```
GET /api/v1/users/me
  响应: { code, data: { user }, message }

GET /api/v1/roles
  响应: { code, data: [ roles ], message }

GET /api/v1/permissions
  响应: { code, data: [ permissions ], message }
```

## 测试检查清单
- [ ] 前端项目能成功运行（npm run dev）
- [ ] 后端项目能成功运行（npm run dev）
- [ ] 数据库表创建成功
- [ ] 用户注册 API 可正常调用
- [ ] 用户登录 API 可正常调用
- [ ] Token 生成和验证正确
- [ ] 路由保护能正常工作
- [ ] 错误处理和日志正常记录
- [ ] API 文档框架可访问

## 完成情况
- 开始时间: 2025-12-23 10:00
- 完成时间: -
- 状态: 待开发

## 注意事项

1. **环境配置优先级**: 先配置本地开发环境，确保所有依赖正确安装
2. **Supabase 配置**: 需要创建 Supabase 项目，获取 API key 和 URL
3. **数据库初始化**: 建议创建初始化脚本，便于后续环境配置
4. **代码生成**: shadcn/ui 需要通过 CLI 命令集成组件，不要手动复制
5. **错误处理**: 后端需要实现完善的错误处理机制，避免直接返回数据库错误

