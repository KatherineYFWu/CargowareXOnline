import React, { useState } from 'react';
import { Card, Button, Table, Form, Input, Select, Modal, Message, Space, Typography, Tag, Popconfirm } from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete, IconDownload, IconUpload, IconFile } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  format: string;
  version: string;
  status: 'active' | 'inactive';
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 模板配置页面组件
 * @description 用于管理EDI数据交换模板的配置
 */
const TemplateConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [templates, setTemplates] = useState<TemplateItem[]>([
    {
      id: '1',
      name: '订单确认模板',
      type: 'Order Confirmation',
      format: 'X12-850',
      version: '1.0.0',
      status: 'active',
      description: '用于订单确认的EDI模板',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: '发货通知模板',
      type: 'Shipping Notice',
      format: 'X12-856',
      version: '1.2.0',
      status: 'active',
      description: '用于发货通知的EDI模板',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20'
    },
    {
      id: '3',
      name: '发票模板',
      type: 'Invoice',
      format: 'X12-810',
      version: '1.1.0',
      status: 'inactive',
      description: '用于发票的EDI模板',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-18'
    }
  ]);

  /**
   * 打开新增/编辑模板弹窗
   * @param template 编辑的模板数据，为空时表示新增
   */
  const handleOpenModal = (template?: TemplateItem) => {
    setEditingTemplate(template || null);
    setModalVisible(true);
    if (template) {
      form.setFieldsValue(template);
    } else {
      form.resetFields();
    }
  };

  /**
   * 关闭弹窗
   */
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTemplate(null);
    form.resetFields();
  };

  /**
   * 保存模板
   * @param values 表单数据
   */
  const handleSaveTemplate = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingTemplate) {
        // 编辑模式
        setTemplates(prev => prev.map(item => 
          item.id === editingTemplate.id 
            ? { ...item, ...values, updatedAt: new Date().toISOString().split('T')[0] }
            : item
        ));
        Message.success('模板更新成功');
      } else {
        // 新增模式
        const newTemplate: TemplateItem = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setTemplates(prev => [...prev, newTemplate]);
        Message.success('模板创建成功');
      }
      
      handleCloseModal();
    } catch (error) {
      Message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除模板
   * @param id 模板ID
   */
  const handleDeleteTemplate = async (id: string) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setTemplates(prev => prev.filter(item => item.id !== id));
      Message.success('模板删除成功');
    } catch (error) {
      Message.error('删除失败，请重试');
    }
  };

  /**
   * 下载模板
   * @param template 模板数据
   */
  const handleDownloadTemplate = (template: TemplateItem) => {
    // 模拟下载
    Message.info(`正在下载模板: ${template.name}`);
  };

  /**
   * 上传模板
   */
  const handleUploadTemplate = () => {
    // 模拟上传
    Message.info('请选择要上传的模板文件');
  };

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TemplateItem) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.description}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '格式',
      dataIndex: 'format',
      key: 'format',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: TemplateItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEdit />}
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<IconDownload />}
            onClick={() => handleDownloadTemplate(record)}
          >
            下载
          </Button>
          <Popconfirm
            title="确定要删除这个模板吗？"
            onOk={() => handleDeleteTemplate(record.id)}
          >
            <Button 
              type="text" 
              size="small" 
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title heading={4} className="flex items-center">
          <IconFile className="mr-2" />
          模板配置
        </Title>
        <Text type="secondary">
          管理EDI数据交换模板，包括订单、发货、发票等业务单据模板
        </Text>
      </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Text className="text-lg font-medium">模板列表</Text>
          </div>
          <Space>
            <Button 
              icon={<IconUpload />}
              onClick={handleUploadTemplate}
            >
              上传模板
            </Button>
            <Button 
              type="primary" 
              icon={<IconPlus />}
              onClick={() => handleOpenModal()}
            >
              新增模板
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          data={templates}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true
          }}
        />
      </Card>

      {/* 新增/编辑模板弹窗 */}
      <Modal
        title={editingTemplate ? '编辑模板' : '新增模板'}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        style={{ width: 600 }}
      >
        <Form
          form={form}
          layout="vertical"
          onSubmit={handleSaveTemplate}
        >
          <FormItem 
            label="模板名称" 
            field="name"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </FormItem>

          <FormItem 
            label="模板类型" 
            field="type"
            rules={[{ required: true, message: '请选择模板类型' }]}
          >
            <Select placeholder="请选择模板类型">
              <Option value="Order Confirmation">订单确认</Option>
              <Option value="Shipping Notice">发货通知</Option>
              <Option value="Invoice">发票</Option>
              <Option value="Purchase Order">采购订单</Option>
              <Option value="Receipt Notice">收货通知</Option>
              <Option value="Payment Advice">付款通知</Option>
            </Select>
          </FormItem>

          <FormItem 
            label="数据格式" 
            field="format"
            rules={[{ required: true, message: '请选择数据格式' }]}
          >
            <Select placeholder="请选择数据格式">
              <Option value="X12-850">X12-850 (Purchase Order)</Option>
              <Option value="X12-856">X12-856 (Ship Notice)</Option>
              <Option value="X12-810">X12-810 (Invoice)</Option>
              <Option value="EDIFACT-ORDERS">EDIFACT-ORDERS</Option>
              <Option value="EDIFACT-DESADV">EDIFACT-DESADV</Option>
              <Option value="EDIFACT-INVOIC">EDIFACT-INVOIC</Option>
            </Select>
          </FormItem>

          <FormItem 
            label="版本号" 
            field="version"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如: 1.0.0" />
          </FormItem>

          <FormItem 
            label="状态" 
            field="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </FormItem>

          <FormItem 
            label="描述" 
            field="description"
          >
            <TextArea 
              placeholder="请输入模板描述" 
              rows={3}
            />
          </FormItem>

          <div className="flex justify-end space-x-2">
            <Button onClick={handleCloseModal}>
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {editingTemplate ? '更新' : '创建'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateConfig;