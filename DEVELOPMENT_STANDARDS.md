# 水果供应链系统 - 开发规范

## 一、开发流程规范

### 1.1 开发前准备

每次开始新功能开发前，必须执行以下流程：

1. **创建 TODO 文档**
   - 文件名格式: `TODO_[阶段]_[模块名]_[功能序号].md`
   - 示例: `TODO_P1_Week1_采购管理_01.md`
   - 位置: 项目根目录 `/TODO/` 文件夹
   - 最多包含 15-20 个功能点（过多则拆分）

2. **TODO 文档内容结构**
   ```markdown
   # TODO: [功能模块名称]

   ## 功能概述
   [2-3 句话说明本次迭代的功能]

   ## 功能清单
   - [ ] 功能点 1
   - [ ] 功能点 2
   - [ ] ...

   ## 技术实现要点
   [关键的技术点和实现思路]

   ## 文件列表
   - 前端: [涉及的文件]
   - 后端: [涉及的文件]
   - 数据库: [涉及的表]

   ## 相关 API 端点
   - POST /api/xxx - 说明
   - GET /api/xxx - 说明

   ## 测试检查清单
   - [ ] 单元测试通过
   - [ ] 集成测试通过
   - [ ] 功能验证通过

   ## 完成情况
   - 开始时间: YYYY-MM-DD HH:MM
   - 完成时间: YYYY-MM-DD HH:MM
   - 状态: 进行中 / 已完成
   ```

3. **列出所有功能点**
   - 每个功能点前添加 `- [ ]` 复选框
   - 功能点需要具体、可度量
   - 不超过 15-20 个点，过多则拆分文档

### 1.2 开发执行

1. **功能点实现顺序**
   - 按 TODO 文档中的顺序逐项实现
   - 实现时遵循代码规范（见下文）
   - 每完成 1-2 个功能点后进行小型测试

2. **完成标记**
   - 每完成一个功能点，在 TODO 文档中勾选对应项
   - 格式: `- [x] 功能点`
   - 同时在 Git commit 信息中引用功能点

3. **代码提交**
   - Commit message 格式: `feat: [功能名] - 完成 TODO 中的第 N 个功能点`
   - 示例: `feat: 采购订单 - 完成供应商管理增删改查`
   - 频率: 每完成 2-3 个功能点提交一次

### 1.3 开发完成

1. **最终检查**
   - 所有功能点都已勾选
   - 代码通过代码审查
   - 单元测试和集成测试通过
   - 功能验证通过

2. **更新状态**
   - 在 TODO 文档中更新"完成情况"部分
   - 标记状态为"已完成"
   - 记录实际完成时间

3. **文档归档**
   - 将完成的 TODO 文档归档到 `/TODO/COMPLETED/` 文件夹
   - 保留文件原始名称便于查询

---

## 二、代码规范

### 2.1 前端规范（React + TypeScript）

#### 文件组织
```
src/
├── components/
│   └── [模块名]/
│       ├── [ComponentName].tsx
│       ├── [ComponentName].module.css
│       ├── index.ts (导出组件)
│       └── types.ts (类型定义)
├── pages/
│   └── [ModuleName]/
│       ├── index.tsx
│       └── [DetailPage].tsx
├── services/
│   └── [moduleName].service.ts
├── store/
│   └── [moduleName]Store.ts
└── types/
    └── [moduleName].ts
```

#### 命名规范
- 组件文件: PascalCase (e.g., `PurchaseOrderForm.tsx`)
- 函数/变量: camelCase (e.g., `calculateCost`, `orderList`)
- 常量: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- 类型文件: 同组件名 (e.g., `PurchaseOrder.ts`)

#### 代码编写规范

**组件模板**
```typescript
import React, { useState, useEffect } from 'react';
import { Button, Input, Table } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { purchaseService } from '@/services/purchase.service';
import type { PurchaseOrder } from '@/types/purchase';
import styles from './PurchaseOrderList.module.css';

interface PurchaseOrderListProps {
  supplierId?: string;
  onSelect?: (order: PurchaseOrder) => void;
}

export const PurchaseOrderList: React.FC<PurchaseOrderListProps> = ({
  supplierId,
  onSelect,
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [supplierId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await purchaseService.getOrders({ supplierId });
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

export default PurchaseOrderList;
```

**类型定义规范**
```typescript
// src/types/purchase.ts
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: 'draft' | 'confirmed' | 'received' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreatePurchaseOrderInput {
  supplierId: string;
  items: Omit<PurchaseOrderItem, 'id' | 'totalPrice'>[];
}
```

**Service 模式**
```typescript
// src/services/purchase.service.ts
import { apiClient } from '@/utils/request';
import type { PurchaseOrder, CreatePurchaseOrderInput } from '@/types/purchase';

class PurchaseService {
  async getOrders(filters?: Record<string, any>): Promise<PurchaseOrder[]> {
    const response = await apiClient.get('/purchase/orders', { params: filters });
    return response.data;
  }

  async getOrderById(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.get(`/purchase/orders/${id}`);
    return response.data;
  }

  async createOrder(input: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
    const response = await apiClient.post('/purchase/orders', input);
    return response.data;
  }

  async updateOrder(id: string, input: Partial<CreatePurchaseOrderInput>): Promise<PurchaseOrder> {
    const response = await apiClient.put(`/purchase/orders/${id}`, input);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete(`/purchase/orders/${id}`);
  }
}

export const purchaseService = new PurchaseService();
```

#### 样式规范
- 使用 Tailwind CSS 优先
- 复杂样式使用 CSS Module (.module.css)
- 不使用 inline styles（特殊情况除外）
- 使用 shadcn/ui 组件库

```css
/* PurchaseOrderList.module.css */
.container {
  @apply flex flex-col gap-4 p-6 bg-white rounded-lg shadow;
}

.header {
  @apply flex justify-between items-center;
}

.table {
  @apply w-full border-collapse;
}
```

#### 最佳实践
- 优先使用函数组件和 Hooks
- 使用 TypeScript 全量覆盖，无 `any` 类型
- 定义清晰的 Props 接口
- 错误处理完善（try-catch, error boundaries）
- 使用自定义 Hooks 复用逻辑

---

### 2.2 后端规范（Node.js + Express）

#### 项目结构
```
src/
├── controllers/
│   └── purchaseController.ts
├── services/
│   └── purchaseService.ts
├── repositories/
│   └── purchaseRepository.ts
├── routes/
│   └── purchaseRoutes.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── logger.middleware.ts
├── types/
│   └── purchase.ts
├── utils/
│   ├── errors.ts
│   ├── validators.ts
│   └── helpers.ts
└── app.ts
```

#### 命名规范
- 文件名: camelCase (e.g., `purchaseController.ts`)
- 类名: PascalCase (e.g., `PurchaseService`)
- 函数名: camelCase (e.g., `getOrders`)
- 路由: /api/v1/resource (e.g., `/api/v1/purchase/orders`)

#### 控制器层
```typescript
// src/controllers/purchaseController.ts
import { Request, Response, NextFunction } from 'express';
import { purchaseService } from '@/services/purchaseService';
import { ValidationError, NotFoundError } from '@/utils/errors';

export const purchaseController = {
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplierId, status, page = 1, pageSize = 20 } = req.query;

      const orders = await purchaseService.getOrders({
        supplierId: supplierId as string,
        status: status as string,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
      });

      res.json({ code: 0, data: orders, message: 'Success' });
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const order = await purchaseService.getOrderById(id);
      if (!order) {
        throw new NotFoundError('Purchase order not found');
      }

      res.json({ code: 0, data: order, message: 'Success' });
    } catch (error) {
      next(error);
    }
  },

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body;

      // 验证
      const errors = purchaseService.validateCreateInput(input);
      if (errors.length > 0) {
        throw new ValidationError('Invalid input', errors);
      }

      const order = await purchaseService.createOrder(input);

      res.status(201).json({ code: 0, data: order, message: 'Created' });
    } catch (error) {
      next(error);
    }
  },
};
```

#### 服务层
```typescript
// src/services/purchaseService.ts
import { purchaseRepository } from '@/repositories/purchaseRepository';
import { costService } from '@/services/costService';
import type { CreatePurchaseOrderInput, PurchaseOrder } from '@/types/purchase';

export const purchaseService = {
  async getOrders(filters: Record<string, any>) {
    return await purchaseRepository.findMany(filters);
  },

  async getOrderById(id: string) {
    return await purchaseRepository.findById(id);
  },

  async createOrder(input: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
    // 1. 验证供应商存在
    const supplier = await purchaseRepository.findSupplier(input.supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    // 2. 创建采购订单
    const order = await purchaseRepository.create({
      ...input,
      status: 'draft',
    });

    // 3. 初始化成本归集
    await costService.initiatePurchaseCost(order.id, input);

    return order;
  },

  validateCreateInput(input: any): string[] {
    const errors: string[] = [];

    if (!input.supplierId) {
      errors.push('supplierId is required');
    }

    if (!Array.isArray(input.items) || input.items.length === 0) {
      errors.push('items must be a non-empty array');
    }

    // 更多验证逻辑...

    return errors;
  },
};
```

#### 数据库操作层
```typescript
// src/repositories/purchaseRepository.ts
import { supabase } from '@/config/supabase';
import type { PurchaseOrder } from '@/types/purchase';

export const purchaseRepository = {
  async findMany(filters: Record<string, any>) {
    let query = supabase
      .from('purchase_orders')
      .select('*, items:purchase_order_items(*)');

    if (filters.supplierId) {
      query = query.eq('supplier_id', filters.supplierId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query
      .range((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*, items:purchase_order_items(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: any) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
```

#### 错误处理
```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', 400, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super('NOT_FOUND', 404, message);
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('AUTH_ERROR', 401, message);
  }
}

// 全局错误处理中间件
export const errorHandler = (
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  });
};
```

---

### 2.3 数据库规范（Supabase PostgreSQL）

#### 表设计原则
1. **命名规范**
   - 表名: snake_case 复数形式 (e.g., `purchase_orders`)
   - 字段名: snake_case (e.g., `supplier_id`)
   - 主键: `id` (UUID)
   - 外键: `{table}_id` (e.g., `supplier_id`)
   - 时间戳: `created_at`, `updated_at`

2. **字段设置**
   ```sql
   CREATE TABLE purchase_orders (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     supplier_id UUID NOT NULL REFERENCES suppliers(id),
     order_number VARCHAR(50) NOT NULL UNIQUE,
     total_amount DECIMAL(12, 2) NOT NULL,
     status VARCHAR(20) NOT NULL DEFAULT 'draft',

     -- 时间戳
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

     -- 审计字段
     created_by UUID NOT NULL REFERENCES users(id),
     updated_by UUID REFERENCES users(id),

     -- 索引
     CONSTRAINT valid_status CHECK (status IN ('draft', 'confirmed', 'received')),
     INDEX idx_supplier_id (supplier_id),
     INDEX idx_status (status),
     INDEX idx_created_at (created_at DESC)
   );
   ```

3. **RLS 策略**
   ```sql
   -- 基于用户角色的行级安全
   ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view their org's orders"
     ON purchase_orders
     FOR SELECT
     USING (organization_id = auth.jwt() ->> 'org_id');

   CREATE POLICY "Managers can update orders"
     ON purchase_orders
     FOR UPDATE
     USING (
       EXISTS (
         SELECT 1 FROM user_roles
         WHERE user_id = auth.uid()
         AND role_id IN (SELECT id FROM roles WHERE name = 'manager')
       )
     );
   ```

---

## 三、Git 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: 新功能
- `fix`: 修复 Bug
- `refactor`: 代码重构（不影响功能）
- `style`: 代码风格（空格、格式等）
- `docs`: 文档更新
- `test`: 测试相关
- `chore`: 工程化（依赖更新等）

**示例**:
```
feat(purchase): 完成供应商管理增删改查功能

- 实现 Supplier CRUD API
- 添加供应商信息验证
- 集成前端表单组件

Closes #123
```

### Branch 命名

```
<type>/<feature-name>

feature/purchase-order-management
bugfix/cost-calculation
docs/api-documentation
```

---

## 四、测试规范

### 前端测试

**单元测试**（使用 Vitest + React Testing Library）
```typescript
// __tests__/PurchaseOrderForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PurchaseOrderForm } from '@/components/purchase/PurchaseOrderForm';

describe('PurchaseOrderForm', () => {
  it('should render form fields', () => {
    render(<PurchaseOrderForm />);

    expect(screen.getByLabelText(/supplier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<PurchaseOrderForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/supplier/i), {
      target: { value: 'supplier-1' },
    });

    fireEvent.click(screen.getByText(/submit/i));

    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### 后端测试

**集成测试**（使用 Jest）
```typescript
// __tests__/purchase.routes.test.ts
import request from 'supertest';
import { app } from '@/app';

describe('Purchase Routes', () => {
  describe('GET /api/v1/purchase/orders', () => {
    it('should return list of orders', async () => {
      const response = await request(app)
        .get('/api/v1/purchase/orders')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/v1/purchase/orders', () => {
    it('should create a new order', async () => {
      const response = await request(app)
        .post('/api/v1/purchase/orders')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          supplierId: 'supplier-1',
          items: [
            { productId: 'prod-1', quantity: 100, unitPrice: 5.0 },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
    });
  });
});
```

---

## 五、文档规范

### API 文档（Swagger/OpenAPI）

```yaml
/api/v1/purchase/orders:
  get:
    summary: 获取采购订单列表
    tags:
      - Purchase
    parameters:
      - name: supplierId
        in: query
        type: string
        description: 供应商 ID
      - name: status
        in: query
        type: string
        enum: [draft, confirmed, received]
    responses:
      200:
        description: 成功返回订单列表
        schema:
          type: object
          properties:
            code:
              type: integer
            data:
              type: array
              items:
                $ref: '#/components/schemas/PurchaseOrder'

  post:
    summary: 创建采购订单
    tags:
      - Purchase
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreatePurchaseOrderInput'
    responses:
      201:
        description: 订单创建成功
```

### 功能文档

每个模块完成后，需要编写简单的使用文档：

```markdown
# 采购订单管理功能文档

## 功能概述
采购订单管理模块用于管理水果采购流程，支持订单创建、修改、验收等操作。

## 用户角色
- 采购员：可创建、修改、查看采购订单
- 采购经理：可审批、验收采购订单

## 主要功能

### 1. 订单列表
- URL: `/purchase/orders`
- 功能: 展示所有采购订单
- 支持筛选: 供应商、状态、日期

### 2. 创建订单
- URL: `/purchase/orders/create`
- 功能: 创建新的采购订单
- 必填字段: 供应商、物品、数量、价格

### 3. 订单详情
- URL: `/purchase/orders/:id`
- 功能: 查看订单详细信息、修改、删除

## 工作流程
1. 采购员创建订单（status: draft）
2. 采购经理审批（status: confirmed）
3. 供应商发货
4. 采购员验收（status: received）
```

---

## 六、测试清单

在完成每个 TODO 文档前，需要检查以下项目：

- [ ] 代码通过 ESLint 检查（无警告）
- [ ] 代码符合命名规范
- [ ] TypeScript 编译无错误和警告
- [ ] 单元测试通过率 ≥ 80%
- [ ] 集成测试通过
- [ ] API 文档已更新
- [ ] 功能已在本地测试通过
- [ ] 没有硬编码值（除了配置）
- [ ] 错误处理完善
- [ ] 性能符合预期

---

## 七、检查清单（Code Review）

开发完成后，进行自我 review：

### 功能完整性
- [ ] 所有计划的功能点都已实现
- [ ] 功能逻辑正确
- [ ] 边界情况已考虑

### 代码质量
- [ ] 代码易读易维护
- [ ] 没有重复代码
- [ ] 复杂逻辑有注释说明
- [ ] 类型安全（TypeScript）

### 性能和安全
- [ ] 数据库查询已优化（有索引）
- [ ] 敏感数据已加密
- [ ] API 有认证和授权
- [ ] 输入已验证

### 测试覆盖
- [ ] 主要功能有测试
- [ ] 异常情况有测试
- [ ] 测试覆盖率 ≥ 70%

### 文档完整
- [ ] API 文档已更新
- [ ] 代码注释清晰
- [ ] README 或使用文档已完成

---

## 八、常见问题

**Q: 如果一个功能点需要跨多个文件修改怎么办？**
A: 这属于正常情况。每个功能点可能涉及前端、后端、数据库多个部分，同时修改即可。

**Q: 如果在开发中发现需要调整设计怎么办？**
A: 立即停止当前任务，与产品或技术lead沟通。如果是小调整，更新 TODO 文档后继续。

**Q: TODO 文档应该多细致？**
A: 足够让别人理解你要做什么就行。通常每个功能点 1-2 句话描述。

**Q: 如果某个功能点花的时间比预期多得多怎么办？**
A: 更新 TODO 文档中的"完成情况"，记录实际耗时，后续进度评审会讨论原因。

**Q: 是否需要每完成一个功能点就提交一次 commit？**
A: 不需要。2-3 个相关的功能点可以合并为一次提交，但要在 commit message 中说明完成的内容。

---

## 九、持续改进

这个规范文档会根据实际开发情况不断迭代。欢迎提出改进建议！

**版本历史**：
- v1.0 - 2025-12-23 - 初版发布

