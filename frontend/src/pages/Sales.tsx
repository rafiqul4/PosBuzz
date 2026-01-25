import React, { useState } from 'react';
import { 
  Layout, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Select, 
  InputNumber, 
  message, 
  Space,
  Typography,
  Card,
  Row,
  Col,
  Tag
} from 'antd';
import { PlusOutlined, ShoppingCartOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi, CreateSaleDto, Sale } from '../api/sales';
import { productsApi, Product } from '../api/products';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Sales: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: salesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success('Sale created successfully');
      handleCancel();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create sale');
    },
  });

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createMutation.mutate(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const calculateTotal = (items?: Array<{ productId: number; quantity: number }>) => {
    if (!items || !products) return 0;
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const columns = [
    {
      title: 'ID',
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
      title: 'User',
      dataIndex: ['user', 'email'],
      key: 'user',
    },
    {
      title: 'Items',
      dataIndex: 'saleItems',
      key: 'items',
      render: (items: any[]) => items.length,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
  ];

  const expandedRowRender = (record: Sale) => {
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
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => `$${price.toFixed(2)}`,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Subtotal',
        key: 'subtotal',
        render: (_: any, item: any) => `$${(item.price * item.quantity).toFixed(2)}`,
      },
    ];

    return (
      <Table
        columns={itemColumns}
        dataSource={record.saleItems}
        pagination={false}
        rowKey="id"
        size="small"
      />
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#001529'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          PosBuzz
        </Title>
        <Space>
          <Button onClick={() => navigate('/products')}>Products</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Title level={2}>Sales</Title>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAdd}
          >
            New Sale
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={sales}
          rowKey="id"
          loading={salesLoading}
          expandable={{ expandedRowRender }}
          style={{ background: 'white' }}
        />
        <Modal
          title="Create Sale"
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          confirmLoading={createMutation.isPending}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            name="saleForm"
            initialValues={{ items: [{}] }}
          >
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: 8 }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'productId']}
                            label="Product"
                            rules={[{ required: true, message: 'Please select a product!' }]}
                          >
                            <Select 
                              placeholder="Select product"
                              showSearch
                              filterOption={(input, option: any) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                              }
                            >
                              {products?.map((product: Product) => (
                                <Option key={product.id} value={product.id}>
                                  {product.name} - ${product.price} (Stock: {product.stock_quantity})
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={9}>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            label="Quantity"
                            rules={[{ required: true, message: 'Please input quantity!' }]}
                          >
                            <InputNumber min={1} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col span={3} style={{ display: 'flex', alignItems: 'center', paddingTop: 30 }}>
                          {fields.length > 1 && (
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{ fontSize: 20, color: 'red' }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Item
                    </Button>
                  </Form.Item>
                  <Form.Item shouldUpdate>
                    {() => {
                      const items = form.getFieldValue('items');
                      const total = calculateTotal(items);
                      return (
                        <Card size="small">
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 'bold' }}>
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </Card>
                      );
                    }}
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Sales;
