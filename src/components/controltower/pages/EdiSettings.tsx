import React, { useState } from 'react';
import { Card, Button, Table, Form, Input, Select, Space, Typography, Tag, Switch, Popconfirm, Message } from '@arco-design/web-react';
import { IconPlus, IconDownload, IconEdit, IconDelete, IconEye, IconSearch, IconRefresh, IconSettings } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const FormItem = Form.Item;
const Option = Select.Option;

interface EdiConnection {
  id: string;
  name: string;
  status: boolean;
  templatePath: string;
  description: string;
  protocol: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

/**
 * EDI对接清单列表页面组件
 * @description 展示当前所有EDI对接配置的列表，支持筛选、新增、编辑等操作
 */
const EdiSettings: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // 模拟EDI对接数据
  const [ediConnections, setEdiConnections] = useState<EdiConnection[]>([
    {
      id: 'EDI001A2B',
      name: '沃尔玛EDI对接',
      status: true,
      templatePath: '/templates/walmart/order-850.xml',
      description: '沃尔玛订单确认EDI对接配置',
      protocol: 'AS2',
      createdBy: '张三',
      createdAt: '2024-01-15',
      updatedBy: '李四',
      updatedAt: '2024-01-20'
    },
    {
      id: 'EDI002C3D',
      name: '亚马逊EDI对接',
      status: true,
      templatePath: '/templates/amazon/invoice-810.xml',
      description: '亚马逊发票EDI对接配置',
      protocol: 'SFTP',
      createdBy: '王五',
      createdAt: '2024-01-10',
      updatedBy: '赵六',
      updatedAt: '2024-01-18'
    },
    {
      id: 'EDI003E4F',
      name: '家得宝EDI对接',
      status: false,
      templatePath: '/templates/homedepot/shipping-856.xml',
      description: '家得宝发货通知EDI对接配置',
      protocol: 'AS2',
      createdBy: '孙七',
      createdAt: '2024-01-05',
      updatedBy: '周八',
      updatedAt: '2024-01-12'
    },
    {
      id: 'EDI004G5H',
      name: 'Target EDI对接',
      status: true,
      templatePath: '/templates/target/receipt-861.xml',
      description: 'Target收货确认EDI对接配置',
      protocol: 'VAN',
      createdBy: '吴九',
      createdAt: '2024-01-08',
      updatedBy: '郑十',
      updatedAt: '2024-01-22'
    }
  ]);

  /**
   * 搜索EDI对接配置
   * @param values 搜索表单数据
   */
  const handleSearch = async (values: any) => {
    setSearchLoading(true);
    try {
      // 模拟搜索API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('搜索条件:', values);
      Message.success('搜索完成');
    } catch (error) {
      Message.error('搜索失败，请重试');
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * 重置搜索条件
   */
  const handleReset = () => {
    form.resetFields();
    Message.info('搜索条件已重置');
  };

  /**
   * 切换EDI对接状态
   * @param id EDI对接ID
   * @param checked 新状态
   */
  const handleStatusChange = async (id: string, checked: boolean) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setEdiConnections(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, status: checked, updatedAt: new Date().toISOString().split('T')[0] }
            : item
        )
      );
      Message.success(`EDI对接已${checked ? '启用' : '禁用'}`);
    } catch (error) {
      Message.error('状态更新失败，请重试');
    }
  };

  /**
   * 查看EDI对接详情
   * @param record EDI对接记录
   */
  const handleView = (record: EdiConnection) => {
    Message.info(`查看EDI对接: ${record.name}`);
    // 这里可以打开详情弹窗或跳转到详情页面
  };

  /**
   * 编辑EDI对接配置
   * @param record EDI对接记录
   */
  const handleEdit = (record: EdiConnection) => {
    // 跳转到EDI详细设置页面
    navigate(`/controltower/edi-settings-detail/${record.id}`);
  };

  /**
   * 删除EDI对接配置
   * @param id EDI对接ID
   */
  const handleDelete = async (id: string) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setEdiConnections(prev => prev.filter(item => item.id !== id));
      Message.success('EDI对接配置删除成功');
    } catch (error) {
      Message.error('删除失败，请重试');
    }
  };

  /**
   * 配置EDI对接
   * @param record EDI对接记录
   */
  const handleConfig = (record: EdiConnection) => {
    navigate(`/controltower/edi-config/${record.id}`);
  };

  /**
   * 新增EDI对接
   */
  const handleAdd = () => {
    // 跳转到新增EDI设置页面
    navigate('/controltower/edi-settings-detail/new');
  };

  /**
   * 导出列表
   */
  const handleExport = async () => {
    setLoading(true);
    try {
      // 模拟导出API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      Message.success('列表导出成功');
    } catch (error) {
      Message.error('导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: 'EDI名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="font-medium">{text}</div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: boolean, record: EdiConnection) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedText="启用"
          uncheckedText="禁用"
        />
      )
    },
    {
      title: '传输协议',
      dataIndex: 'protocol',
      key: 'protocol',
      width: 100,
      render: (protocol: string) => (
        <Tag size="small" color="blue">{protocol}</Tag>
      )
    },
    {
      title: '模板路径',
      dataIndex: 'templatePath',
      key: 'templatePath',
      render: (text: string) => (
        <Text code className="text-sm">{text}</Text>
      )
    },
    {
      title: '模板说明',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (text: string) => {
        const date = new Date(text);
        return (
          <div>
            <div>{date.toLocaleDateString('zh-CN')}</div>
            <div className="text-sm text-gray-500">{date.toLocaleTimeString('zh-CN', { hour12: false })}</div>
          </div>
        );
      }
    },
    {
      title: '更新人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (text: string) => {
        const date = new Date(text);
        return (
          <div>
            <div>{date.toLocaleDateString('zh-CN')}</div>
            <div className="text-sm text-gray-500">{date.toLocaleTimeString('zh-CN', { hour12: false })}</div>
          </div>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: EdiConnection) => (
        <div className="space-y-1">
          <div className="flex space-x-1">
            <Button
              type="text"
              size="small"
              icon={<IconEye />}
              onClick={() => handleView(record)}
            >
              查看
            </Button>
            <Button
              type="text"
              size="small"
              icon={<IconEdit />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button
              type="text"
              size="small"
              icon={<IconSettings />}
              onClick={() => handleConfig(record)}
            >
              配置
            </Button>
            <Popconfirm
              title="确定要删除这个EDI配置吗？"
              onOk={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                icon={<IconDelete />}
                status="danger"
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* 筛选区 */}
      <Card className="mb-4">
        <Form
          form={form}
          layout="inline"
          onSubmit={handleSearch}
          className="mb-4"
        >
          <FormItem field="name" label="EDI名称">
            <Input placeholder="请输入EDI名称" style={{ width: 200 }} />
          </FormItem>

          <FormItem field="protocol" label="传输协议">
            <Select placeholder="请选择协议" style={{ width: 120 }}>
              <Option value="AS2">AS2</Option>
              <Option value="SFTP">SFTP</Option>
              <Option value="VAN">VAN</Option>
              <Option value="HTTP">HTTP</Option>
            </Select>
          </FormItem>

          <FormItem field="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }}>
              <Option value="true">启用</Option>
              <Option value="false">禁用</Option>
            </Select>
          </FormItem>

          <FormItem>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<IconSearch />}
                loading={searchLoading}
              >
                搜索
              </Button>
              <Button 
                icon={<IconRefresh />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </FormItem>
        </Form>
      </Card>

      {/* 功能区和列表区 */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Button 
              type="primary" 
              icon={<IconPlus />}
              onClick={handleAdd}
            >
              新增EDI
            </Button>
            <Button 
              icon={<IconDownload />}
              onClick={handleExport}
              loading={loading}
            >
              导出列表
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          data={ediConnections}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default EdiSettings;