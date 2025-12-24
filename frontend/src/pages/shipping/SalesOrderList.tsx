/**
 * 销售订单列表页面
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Tag, Space } from 'antd';
import { shippingService } from '@/services/shipping.service';
import { SalesOrder, SALES_ORDER_STATUS_LABELS, SALES_ORDER_STATUS_COLORS } from '@/types/shipping';

export default function SalesOrderList() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await shippingService.getSalesOrders({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setOrders(result.items);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('Failed to fetch sales orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (values: any) => {
    try {
      // 处理items数据
      const items = values.items || [];
      await shippingService.createSalesOrder({
        customer_name: values.customer_name,
        items,
      });
      message.success('Sales order created successfully');
      form.resetFields();
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      message.error('Failed to create sales order');
    }
  };

  const columns = [
    { title: '订单号', dataIndex: 'order_number', key: 'order_number' },
    { title: '客户名称', dataIndex: 'customer_name', key: 'customer_name' },
    {
      title: '金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag className={SALES_ORDER_STATUS_COLORS[status]}>
          {SALES_ORDER_STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SalesOrder) => (
        <Space>
          <a href={`/sales-orders/${record.id}`}>详情</a>
          {record.status === 'draft' && (
            <a href={`/sales-orders/${record.id}/edit`}>编辑</a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">销售订单</h1>
        <Button type="primary" onClick={() => setShowModal(true)}>
          创建订单
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={pagination}
        onChange={(pag) => setPagination(pag)}
        rowKey="id"
      />

      <Modal
        title="创建销售订单"
        open={showModal}
        onOk={() => form.submit()}
        onCancel={() => setShowModal(false)}
        width={800}
      >
        <Form form={form} onFinish={handleCreateOrder} layout="vertical">
          <Form.Item
            label="客户名称"
            name="customer_name"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="订单明细">
            <div className="text-gray-500 text-sm">
              请在详情页面编辑订单明细
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
