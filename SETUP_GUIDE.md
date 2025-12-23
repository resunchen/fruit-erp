# 项目初始化说明

本文档说明如何设置开发环境并运行项目。

## 前置要求

- Node.js 18+ 和 npm
- Supabase 账户和项目
- Git

## 快速开始

### 1. 配置环境变量

#### 前端配置

在 `frontend/.env` 中配置：

```bash
VITE_API_URL=http://localhost:3000
```

#### 后端配置

在 `backend/.env` 中配置：

```bash
NODE_ENV=development
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_JWT_SECRET=your_jwt_secret
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 2. Supabase 初始化

1. 创建 Supabase 项目
2. 在 Supabase SQL 编辑器中执行 `backend/src/schema.sql` 的内容
3. 复制 URL 和 Key 到后端 .env 文件

### 3. 安装依赖并启动

#### 后端

```bash
cd backend
npm install
npm run dev
```

后端将在 `http://localhost:3000` 运行

#### 前端

```bash
cd frontend
npm install
npm run dev
```

前端将在 `http://localhost:5173` 运行

### 4. 测试

访问 `http://localhost:5173` 应该会看到登录页面

测试用户：
- 先注册一个账户
- 或在 Supabase 中手动创建用户

## 项目结构

```
fruit-erp/
├── frontend/                 # React 前端项目
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义 Hook
│   │   ├── services/        # API 服务
│   │   ├── store/           # 状态管理（Zustand）
│   │   ├── types/           # TypeScript 类型
│   │   ├── utils/           # 工具函数
│   │   └── styles/          # 样式文件
│   └── package.json
│
├── backend/                  # Node.js 后端项目
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── services/        # 业务逻辑
│   │   ├── middleware/      # 中间件
│   │   ├── routes/          # 路由定义
│   │   ├── types/           # TypeScript 类型
│   │   ├── utils/           # 工具函数
│   │   ├── app.ts           # Express 应用
│   │   ├── server.ts        # 服务器入口
│   │   └── schema.sql       # 数据库初始化脚本
│   └── package.json
│
├── TODO/                     # 周度任务列表
└── 文档文件
```

## 开发流程

1. 阅读本周的 TODO 文档
2. 实现功能
3. 提交 git commit
4. 更新 TODO 中的进度

## 常见问题

### 前端无法连接后端

- 检查后端是否运行在 3000 端口
- 检查 CORS 配置是否包含前端地址

### Supabase 连接失败

- 检查 .env 中的 URL 和 Key
- 验证 Supabase 项目是否正确创建

### 数据库表未创建

- 在 Supabase SQL 编辑器中运行 `backend/src/schema.sql`
- 查看 Supabase 的 Tables 页面确认表已创建

## 下一步

按照 TODO_P1_Week1_项目初始化_01.md 继续开发：

- [ ] 配置 ESLint 和 Prettier
- [ ] 实现完整认证系统（注册/登录/登出）
- [ ] 创建基础 UI 组件
- [ ] 编写 API 文档
- [ ] 编写测试

更多信息请参考项目文档。
