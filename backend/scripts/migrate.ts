import fs from 'fs';
import path from 'path';
import { supabase } from '../src/config/supabase';

async function runMigrations() {
  try {
    console.log('开始执行数据库迁移...');

    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, '../migrations/create_purchase_order_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // 分割 SQL 语句（简单的分割，不处理复杂情况）
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`找到 ${statements.length} 条 SQL 语句`);

    // 执行每条 SQL 语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`执行语句 ${i + 1}/${statements.length}...`);
      console.log(statement.substring(0, 50) + '...\n');

      const { error } = await supabase.rpc('exec_sql', {
        sql: statement,
      }).catch(() => {
        // 如果 exec_sql 不存在，尝试直接执行
        return { error: 'exec_sql not available' };
      });

      if (error) {
        console.warn(`警告：可能无法执行，错误: ${error}`);
        console.log('请在 Supabase 控制面板中手动执行以下 SQL：\n');
        console.log(sql);
        return;
      }
    }

    console.log('✅ 数据库迁移完成！');
  } catch (error) {
    console.error('❌ 迁移失败：', error);
    console.log('\n请在 Supabase 控制面板中手动执行以下 SQL：\n');
    try {
      const sqlPath = path.join(__dirname, '../migrations/create_purchase_order_tables.sql');
      const sql = fs.readFileSync(sqlPath, 'utf-8');
      console.log(sql);
    } catch (e) {
      console.error('无法读取 SQL 文件');
    }
  }
}

runMigrations();
