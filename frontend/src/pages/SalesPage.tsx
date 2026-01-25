import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, InputNumber, Space, message, Card } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi, type CreateSaleDto } from '../api/sales';
import { productsApi, type Product } from '../api/products';

const SalesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });

  const createSaleMutation = useMutation({
    mutationFn: salesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success('Sale created successfully');
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create sale');
    },
  });

  const handleCreateSale = (values: { items: Array<{ productId: number; quantity: number }> }) => {
    createSaleMutation.mutate(values as CreateSaleDto);
  };

  const columns = [
    {
      title: 'Sale ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Items',
      dataIndex: 'saleItems',
      key: 'saleItems',
      render: (items: any[]) => items.length,
    },
  ];

  const expandedRowRender = (record: any) => {
    const itemColumns = [
      {
        title: 'Product',
        dataIndex: ['product', 'name'],
        key: 'product',
      },
      {
        title: 'SKU',
        dataIndex: ['product', 'sku'],
        key: 'sku',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => `$${price.toFixed(2)}`,
      },
      {
        title: 'Subtotal',
        key: 'subtotal',
        render: (_: any, record: any) => `$${(record.price * record.quantity).toFixed(2)}`,
      },
    ];

    return <Table columns={itemColumns} dataSource={record.saleItems} rowKey="id" pagination={false} />;
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Sales</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          New Sale
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={sales}
        rowKey="id"
        loading={isLoading}
        expandable={{ expandedRowRender }}
      />

      <Modal
        title="Create Sale"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleCreateSale} layout="vertical">
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    title={`Item ${index + 1}`}
                    extra={fields.length > 1 ? <Button type="link" danger onClick={() => remove(field.name)}>Remove</Button> : null}
                    style={{ marginBottom: 16 }}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'productId']}
                      label="Product"
                      rules={[{ required: true, message: 'Please select a product!' }]}
                    >
                      <Select
                        placeholder="Select product"
                        showSearch
                        optionFilterProp="children"
                      >
                        {products?.map((product: Product) => (
                          <Select.Option key={product.id} value={product.id}>
                            {product.name} - ${product.price.toFixed(2)} (Stock: {product.stock_quantity})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'quantity']}
                      label="Quantity"
                      rules={[{ required: true, message: 'Please input quantity!' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createSaleMutation.isPending}>
                Create Sale
              </Button>
              <Button onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesPage;
