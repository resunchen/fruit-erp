/**
 * 入库单列表页面
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, message, Tag, Space } from 'antd';
import { warehouseService } from '@/services/warehouse.service';
import { InboundOrder, INBOUND_STATUS_LABELS } from '@/types/warehouse';

export default function InboundOrderList() {
  const [orders, setOrders] = useState<InboundOrder[]>([]);
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
      const result = await warehouseService.getInboundOrders({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setOrders(result.items);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('Failed to fetch inbound orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (values: any) => {
    try {
      await warehouseService.createInboundOrder(values);
      message.success('Inbound order created successfully');
      form.resetFields();
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      message.error('Failed to create inbound order');
    }
  };

  const columns = [
    { title: '入库单号', dataIndex: 'inbound_number', key: 'inbound_number' },
    {
      title: '采购订单',
      dataIndex: ['purchase_order', 'order_number'],
      key: 'purchase_order_number',
    },
    {
      title: '仓库',
      dataIndex: ['warehouse', 'name'],
      key: 'warehouse_name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag>{INBOUND_STATUS_LABELS[status] || status}</Tag>
      ),
    },
    {
      title: '总数量',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: InboundOrder) => (
        <Space>
          <a href={`/inbound-orders/${record.id}`}>详情</a>
          {record.status === 'draft' && (
            <a href={`/inbound-orders/${record.id}/edit`}>编辑</a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">入库单管理</h1>
        <Button type="primary" onClick={() => setShowModal(true)}>
          创建入库单
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
        title="创建入库单"
        open={showModal}
        onOk={() => form.submit()}
        onCancel={() => setShowModal(false)}
      >
        <Form form={form} onFinish={handleCreateOrder} layout="vertical">
          <Form.Item
            label="采购订单"
            name="purchase_order_id"
            rules={[{ required: true, message: '请选择采购订单' }]}
          >
            <Select placeholder="选择采购订单" />
          </Form.Item>
          <Form.Item
            label="仓库"
            name="warehouse_id"
            rules={[{ required: true, message: '请选择仓库' }]}
          >
            <Select placeholder="选择仓库" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
