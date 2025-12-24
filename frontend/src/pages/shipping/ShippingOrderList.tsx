/**
 * 发货单列表页面
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, message, Tag, Space } from 'antd';
import { shippingService } from '@/services/shipping.service';
import { ShippingOrder, SHIPPING_METHOD_LABELS } from '@/types/shipping';

export default function ShippingOrderList() {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await shippingService.getShippingOrders({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setOrders(result.items);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('Failed to fetch shipping orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'blue', text: '待发货' },
      shipped: { color: 'green', text: '已发货' },
      delivered: { color: 'cyan', text: '已收货' },
      cancelled: { color: 'red', text: '已取消' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'gray', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    { title: '发货单号', dataIndex: 'shipping_number', key: 'shipping_number' },
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
      title: '发货方式',
      dataIndex: 'shipping_method',
      key: 'shipping_method',
      render: (method: string) => SHIPPING_METHOD_LABELS[method] || method,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '纸箱数量',
      dataIndex: 'total_boxes',
      key: 'total_boxes',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ShippingOrder) => (
        <Space>
          <a href={`/shipping-orders/${record.id}`}>详情</a>
          {record.status === 'pending' && (
            <Button type="link" size="small" onClick={() => handleShip(record.id)}>
              发货
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleShip = async (id: string) => {
    try {
      await shippingService.confirmShipping(id);
      message.success('Shipping confirmed');
      fetchOrders();
    } catch (error) {
      message.error('Failed to confirm shipping');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">发货单管理</h1>
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
