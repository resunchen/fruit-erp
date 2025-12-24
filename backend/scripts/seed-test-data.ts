/**
 * 测试数据生成脚本
 * 生成 5 条供应商信息和 20 条采购订单信息
 *
 * 使用方法: ts-node scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../src/config/env';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.key;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少 Supabase 配置');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 生成随机 UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 供应商名称和描述
const supplierData = [
  {
    name: '山东青岛海洋果业',
    contact_person: '张经理',
    phone: '18566778899',
    email: 'info@qingdaofruit.com',
    address: '山东省青岛市城阳区',
  },
  {
    name: '福建漳州热带水果基地',
    contact_person: '李总',
    phone: '13812345678',
    email: 'sales@zhangzhoufruits.com',
    address: '福建省漳州市开发区',
  },
  {
    name: '云南昆明高原果园',
    contact_person: '王农场主',
    phone: '15987654321',
    email: 'yunnan@gaoyuanfruit.com',
    address: '云南省昆明市呈贡区',
  },
  {
    name: '浙江杭州滨江果蔬合作社',
    contact_person: '陈理事长',
    phone: '18888888888',
    email: 'service@hangzhoufruits.com',
    address: '浙江省杭州市滨江区',
  },
  {
    name: '广西南宁东盟水果市场',
    contact_person: '黄经理',
    phone: '13333333333',
    email: 'trade@nanninge-fruits.com',
    address: '广西南宁市五象新区',
  },
];

// 水果品类和等级
const productTypes = [
  { name: '西瓜', grades: ['特选', '一级', '二级'] },
  { name: '芒果', grades: ['优选', '一级', '二级'] },
  { name: '葡萄', grades: ['精品', '特选', '一级'] },
  { name: '苹果', grades: ['一级', '二级', '三级'] },
  { name: '橙子', grades: ['特选', '一级', '二级'] },
  { name: '香蕉', grades: ['优选', '一级', '二级'] },
  { name: '樱桃', grades: ['精品', '特选', '一级'] },
  { name: '桃子', grades: ['特选', '一级', '二级'] },
];

// 订单状态
const orderStatuses = ['draft', 'pending', 'confirmed', 'completed'];

async function seedTestData() {
  try {
    console.log('开始生成测试数据...\n');

    // 获取当前认证用户（需要使用管理员密钥）
    // 这里我们使用一个测试 UUID，在实际应用中应该是真实用户ID
    const testUserId = generateUUID();

    // ============ 第 1 步：生成供应商 ============
    console.log('📝 第 1 步：生成 5 条供应商信息...');

    const suppliersToInsert = supplierData.map((supplier) => ({
      id: generateUUID(),
      ...supplier,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data: insertedSuppliers, error: supplierError } = await supabase
      .from('suppliers')
      .insert(suppliersToInsert)
      .select();

    if (supplierError) {
      console.error('❌ 插入供应商失败:', supplierError.message);
      return;
    }

    if (!insertedSuppliers || insertedSuppliers.length === 0) {
      console.error('❌ 没有成功插入任何供应商');
      return;
    }

    console.log(`✅ 成功生成 ${insertedSuppliers.length} 条供应商信息\n`);
    console.log('供应商列表:');
    insertedSuppliers.forEach((supplier, index) => {
      console.log(`  ${index + 1}. ${supplier.name} (ID: ${supplier.id.substring(0, 8)}...)`);
    });
    console.log();

    // ============ 第 2 步：生成采购订单 ============
    console.log('📝 第 2 步：生成 20 条采购订单...');

    const purchaseOrders: any[] = [];
    const purchaseOrderItems: any[] = [];
    const purchaseCosts: any[] = [];

    for (let i = 0; i < 20; i++) {
      // 随机选择供应商、水果类型和等级
      const supplier = insertedSuppliers[Math.floor(Math.random() * insertedSuppliers.length)];
      const product = productTypes[Math.floor(Math.random() * productTypes.length)];
      const grade = product.grades[Math.floor(Math.random() * product.grades.length)];
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

      // 生成订单
      const orderId = generateUUID();
      const orderNumber = `PO-${Date.now()}-${String(i + 1).padStart(3, '0')}`;

      // 随机生成采购数据
      const quantity = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 斤
      const unitPrice = (Math.random() * 8 + 2).toFixed(2); // 2-10 元/斤
      const totalPrice = (parseFloat(unitPrice) * quantity).toFixed(2);

      purchaseOrders.push({
        id: orderId,
        supplier_id: supplier.id,
        order_number: orderNumber,
        total_amount: parseFloat(totalPrice),
        status: status,
        created_by: testUserId,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // 最近7天内
        updated_at: new Date().toISOString(),
      });

      // 订单项目（每个订单1-3个项目）
      const itemCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < itemCount; j++) {
        const itemQuantity = Math.floor(quantity / itemCount);
        purchaseOrderItems.push({
          id: generateUUID(),
          purchase_order_id: orderId,
          product_name: `${product.name}(${grade})`,
          quantity: itemQuantity,
          unit: '斤',
          unit_price: parseFloat(unitPrice),
          total_price: (parseFloat(unitPrice) * itemQuantity).toFixed(2),
          created_at: new Date().toISOString(),
        });
      }

      // 成本项目（1-3个成本项）
      const costCount = Math.floor(Math.random() * 3) + 1;
      const costTypes = ['产地包装费', '代办费', '田间杂费', '运输费', '仓储费'];
      const costAmounts = [100, 200, 300, 400, 500];

      for (let j = 0; j < costCount; j++) {
        const costType = costTypes[Math.floor(Math.random() * costTypes.length)];
        const costAmount = costAmounts[Math.floor(Math.random() * costAmounts.length)];

        purchaseCosts.push({
          id: generateUUID(),
          purchase_order_id: orderId,
          cost_type: costType,
          cost_amount: costAmount,
          created_at: new Date().toISOString(),
        });
      }
    }

    // 插入采购订单
    const { data: insertedOrders, error: orderError } = await supabase
      .from('purchase_orders')
      .insert(purchaseOrders)
      .select();

    if (orderError) {
      console.error('❌ 插入采购订单失败:', orderError.message);
      return;
    }

    console.log(`✅ 成功生成 ${insertedOrders?.length || 0} 条采购订单\n`);

    // 插入订单项目
    const { error: itemError } = await supabase
      .from('purchase_order_items')
      .insert(purchaseOrderItems);

    if (itemError) {
      console.error('❌ 插入订单项目失败:', itemError.message);
      return;
    }

    console.log(`✅ 成功生成 ${purchaseOrderItems.length} 个订单项目\n`);

    // 插入成本数据
    const { error: costError } = await supabase
      .from('purchase_costs')
      .insert(purchaseCosts);

    if (costError) {
      console.error('❌ 插入成本数据失败:', costError.message);
      return;
    }

    console.log(`✅ 成功生成 ${purchaseCosts.length} 条成本数据\n`);

    // ============ 总结 ============
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ 测试数据生成完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`
📊 生成数据统计:
  • 供应商: ${insertedSuppliers.length} 条
  • 采购订单: ${insertedOrders?.length || 0} 条
  • 订单项目: ${purchaseOrderItems.length} 个
  • 成本数据: ${purchaseCosts.length} 条

🧪 现在你可以:
  1. 重启前端应用
  2. 访问采购订单页面看到生成的数据
  3. 测试订单查看、编辑、删除等功能
  4. 测试 AI 创建订单功能
    `);

  } catch (error) {
    console.error('❌ 发生错误:', error);
  }
}

// 执行脚本
seedTestData();
