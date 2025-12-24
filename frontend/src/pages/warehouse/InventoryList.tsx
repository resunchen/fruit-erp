/**
 * 库存查询页面
 */

import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Select, Button, message } from 'antd';
import { warehouseService } from '@/services/warehouse.service';
import { Inventory } from '@/types/warehouse';

export default function InventoryList() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInventories();
  }, [pagination.current, pagination.pageSize]);

  const fetchInventories = async (filters?: any) => {
    setLoading(true);
    try {
      const result = await warehouseService.queryInventory({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      });
      setInventories(result.items);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchInventories(values);
  };

  const columns = [
    { title: '产品名称', dataIndex: 'product_name', key: 'product_name' },
    { title: '仓库', dataIndex: ['warehouse', 'name'], key: 'warehouse_name' },
    { title: '库位', dataIndex: ['location', 'location_code'], key: 'location_code' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '批次', dataIndex: 'batch_id', key: 'batch_id' },
    { title: '保质期至', dataIndex: 'expiration_date', key: 'expiration_date' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = { available: '可用', reserved: '预留', damaged: '损坏' };
        return statusMap[status as keyof typeof statusMap] || status;
      },
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">库存查询</h1>

      <Form form={form} onFinish={handleFilter} layout="inline" className="mb-4">
        <Form.Item name="product_name" label="产品名称">
          <Input placeholder="输入产品名称" />
        </Form.Item>
        <Form.Item name="warehouse_id" label="仓库">
          <Select placeholder="选择仓库" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            placeholder="选择状态"
            options={[
              { label: '可用', value: 'available' },
              { label: '预留', value: 'reserved' },
              { label: '损坏', value: 'damaged' },
            ]}
            style={{ width: 150 }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={inventories}
        loading={loading}
        pagination={pagination}
        onChange={(pag) => setPagination(pag)}
        rowKey="id"
      />
    </div>
  );
}
