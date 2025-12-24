/**
 * 仓库列表页面
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Checkbox, message } from 'antd';
import { warehouseService } from '@/services/warehouse.service';
import { Warehouse } from '@/types/warehouse';

export default function WarehouseList() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWarehouses();
  }, [pagination.current, pagination.pageSize]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const result = await warehouseService.getWarehouses(
        pagination.current,
        pagination.pageSize
      );
      setWarehouses(result.items);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarehouse = async (values: any) => {
    try {
      await warehouseService.createWarehouse(values);
      message.success('Warehouse created successfully');
      form.resetFields();
      setShowModal(false);
      fetchWarehouses();
    } catch (error) {
      message.error('Failed to create warehouse');
    }
  };

  const columns = [
    { title: '仓库名称', dataIndex: 'name', key: 'name' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '容量', dataIndex: 'capacity', key: 'capacity' },
    {
      title: '温控',
      dataIndex: 'temperature_controlled',
      key: 'temperature_controlled',
      render: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Warehouse) => (
        <a href={`/warehouse/${record.id}`}>详情</a>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">仓库管理</h1>
        <Button type="primary" onClick={() => setShowModal(true)}>
          添加仓库
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={warehouses}
        loading={loading}
        pagination={pagination}
        onChange={(pag) => setPagination(pag)}
        rowKey="id"
      />

      <Modal
        title="添加仓库"
        open={showModal}
        onOk={() => form.submit()}
        onCancel={() => setShowModal(false)}
      >
        <Form form={form} onFinish={handleCreateWarehouse} layout="vertical">
          <Form.Item
            label="仓库名称"
            name="name"
            rules={[{ required: true, message: '请输入仓库名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="位置" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="容量" name="capacity">
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="温控"
            name="temperature_controlled"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
