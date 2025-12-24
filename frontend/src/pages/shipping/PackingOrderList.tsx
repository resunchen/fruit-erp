/**
 * 打包单列表页面
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, message, Tag, Space } from 'antd';
import { shippingService } from '@/services/shipping.service';
import { PackingOrder, PACKING_ORDER_STATUS_LABELS } from '@/types/shipping';

export default function PackingOrderList() {
  const [orders, setOrders] = useState<PackingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await shippingService.getPackingOrders({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setOrders(result.items);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('Failed to fetch packing orders');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '打包单号', dataIndex: 'packing_number', key: 'packing_number' },
    {
      title: '销售订单',
      dataIndex: ['sales_order', 'order_number'],
      key: 'sales_order_number',
    },
    {
      title: '客户名称',
      dataIndex: ['sales_order', 'customer_name'],
      key: 'customer_name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag>{PACKING_ORDER_STATUS_LABELS[status] || status}</Tag>
      ),
    },
    {
      title: '纸箱数量',
      dataIndex: 'total_boxes',
      key: 'total_boxes',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PackingOrder) => (
        <Space>
          <a href={`/packing-orders/${record.id}`}>详情</a>
          {record.status === 'pending' && (
            <a href={`/packing-orders/${record.id}/edit`}>编辑</a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">打包单管理</h1>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={pagination}
        onChange={(pag) => setPagination(pag)}
        rowKey="id"
      />
    </div>
  );
}
