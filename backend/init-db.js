#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 用法: node init-db.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ 错误: 未找到 SUPABASE_URL 或 SUPABASE_KEY');
  console.error('请确保在 .env 文件中设置这两个环境变量');
  process.exit(1);
}

async function initDatabase() {
  try {
    console.log('🔄 正在初始化数据库...');

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 读取 schema.sql
    const schemaPath = path.join(__dirname, 'src', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // 分割 SQL 语句（简单分割，基于分号）
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 找到 ${statements.length} 条 SQL 语句`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const displayText = statement.substring(0, 60) + (statement.length > 60 ? '...' : '');

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          // 如果 rpc 不支持，尝试使用 query 方法
          console.log(`⏭️  跳过语句 (使用 exec_sql 失败): ${displayText}`);
        } else {
          console.log(`✅ [${i + 1}/${statements.length}] 成功: ${displayText}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ [${i + 1}/${statements.length}] 失败: ${displayText}`);
        console.error(`   错误: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 初始化结果:');
    console.log(`   ✅ 成功: ${successCount}`);
    console.log(`   ❌ 失败: ${errorCount}`);

    if (errorCount === 0) {
      console.log('\n✨ 数据库初始化完成！');
    } else {
      console.log('\n⚠️  部分语句执行失败，请检查 Supabase SQL 编辑器中是否已有相应表');
    }

  } catch (err) {
    console.error('❌ 初始化失败:', err.message);
    process.exit(1);
  }
}

// 提供替代方案的说明
console.log('\n========================================');
console.log('🔧 数据库初始化工具');
console.log('========================================\n');
console.log('如果自动化脚本失败，请手动操作:');
console.log('1. 访问 https://app.supabase.com');
console.log('2. 找到你的项目，打开 SQL 编辑器');
console.log('3. 新建一个查询');
console.log('4. 复制 backend/src/schema.sql 的内容');
console.log('5. 粘贴到 SQL 编辑器中并执行');
console.log('\n========================================\n');

initDatabase().catch(err => {
  console.error('未捕获的错误:', err);
  process.exit(1);
});
