import React, { useState, useEffect } from 'react';
import {
  Card,
  Space,
  Button,
  Modal,
  Tabs,
  Table,
  Typography,
  Message,
  Tooltip,
  Input,
  Form,
  Select,
  Switch,
  Popconfirm,
  Avatar,
  Tag,
  Pagination,
  Divider,
  Upload,
  Grid
} from '@arco-design/web-react';
import EmailEditor from '../components/EmailEditor';
import {
  IconPlus,
  IconEdit,
  IconEye,
  IconDelete,
  IconSearch,
  IconCheck,
  IconClose,
  IconUpload,
  IconDownload,
  IconCopy,
  IconPlayArrow
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Row, Col } = Grid;
const FormItem = Form.Item;

// 数据类型定义
interface EmailTemplate {
  id: string;
  templateName: string;
  operationId: string;
  operationName: string;
  description?: string;
  status: '启用' | '禁用';
  creator: string;
  lastUpdated: string;
  subject: string;
  content: string;
  footer?: string;
  redirectLink?: string;
  attachments?: string[];
}

interface WechatTemplate {
  id: string;
  operationId: string;
  operationName: string;
  description?: string;
  status: '启用' | '禁用';
  templateType: '纯文本' | '文本卡片' | '图文消息';
  creator: string;
  lastUpdated: string;
  content: any; // 根据模板类型动态变化
}

// 操作管理数据
const mockOperations = [
  { id: 'OP001', name: '提交询价' },
  { id: 'OP002', name: '更改询价' },
  { id: 'OP003', name: '撤回询价' },
  { id: 'OP004', name: '提交报价' },
  { id: 'OP005', name: '更改报价' },
  { id: 'OP006', name: '撤回报价' },
  { id: 'OP007', name: '确认订单' },
  { id: 'OP008', name: '取消订单' },
  { id: 'OP009', name: '发货通知' },
  { id: 'OP010', name: '签收确认' },
];

// 变量列表
const variableList = [
  "操作人姓名", "操作人邮箱", "操作时间", "接收人姓名", "接收人邮箱",
  "询价单编号", "询价客户", "询价单状态", "询价单创建日期", "业务类型",
  "报价金额", "报价货币", "报价有效期", "报价备注", "操作链接"
];

// 模拟数据
const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'EM001',
    templateName: '询价提交通知模板',
    operationId: 'OP001',
    operationName: '提交询价',
    description: '客户提交询价单时的邮件通知模板',
    status: '启用',
    creator: 'admin',
    lastUpdated: '2024-01-15 10:30:00',
    subject: '询价单已提交 - {询价单编号}',
    content: '<p>尊敬的{接收人姓名}：</p><p>您收到一个新的询价单：</p><ul><li>询价单编号：{询价单编号}</li><li>客户：{询价客户}</li><li>业务类型：{业务类型}</li></ul><p>请及时处理。</p>',
    footer: '此邮件由系统自动发送，请勿回复。'
  },
  {
    id: 'EM002',
    templateName: '报价提交通知模板',
    operationId: 'OP004',
    operationName: '提交报价',
    description: '销售提交报价给客户的邮件通知模板',
    status: '启用',
    creator: 'sales',
    lastUpdated: '2024-01-14 14:20:00',
    subject: '报价已提交 - {报价单编号}',
    content: '<p>尊敬的{接收人姓名}：</p><p>您收到一个新的报价：</p><ul><li>报价单编号：{报价单编号}</li><li>报价金额：{报价金额} {报价货币}</li><li>有效期：{报价有效期}</li></ul><p>请及时确认。</p>',
    footer: '此邮件由系统自动发送，请勿回复。'
  },
  {
    id: 'EM003',
    templateName: '询价备用模板',
    operationId: 'OP001',
    operationName: '提交询价',
    description: '备用询价邮件模板',
    status: '禁用',
    creator: 'admin',
    lastUpdated: '2024-01-13 09:15:00',
    subject: '新的询价需求 - {询价单编号}',
    content: '<p>您好：</p><p>有新的询价需求等待处理。</p>',
    footer: '此邮件由系统自动发送，请勿回复。'
  }
];

const mockWechatTemplates: WechatTemplate[] = [
  {
    id: 'WC001',
    operationId: 'OP001',
    operationName: '提交询价',
    description: '客户提交询价单时的企微通知模板',
    status: '启用',
    templateType: '文本卡片',
    creator: 'admin',
    lastUpdated: '2024-01-15 10:30:00',
    content: {
      title: '新的询价单',
      description: '客户{询价客户}提交了询价单{询价单编号}',
      url: '{操作链接}',
      btntxt: '查看详情'
    }
  },
  {
    id: 'WC002',
    operationId: 'OP004',
    operationName: '提交报价',
    description: '报价提交成功的企微通知模板',
    status: '启用',
    templateType: '纯文本',
    creator: 'sales',
    lastUpdated: '2024-01-14 14:20:00',
    content: {
      text: '报价单{报价单编号}已提交给客户{询价客户}，金额{报价金额}{报价货币}',
      safe: 0
    }
  },
  {
    id: 'WC003',
    operationId: 'OP007',
    operationName: '确认订单',
    description: '订单确认的企微图文消息模板',
    status: '禁用',
    templateType: '图文消息',
    creator: 'admin',
    lastUpdated: '2024-01-13 09:15:00',
    content: {
      title: '订单已确认',
      description: '客户已确认订单{订单编号}，金额{订单金额}',
      url: '{操作链接}',
      picurl: 'https://example.com/order.png'
    }
  }
];

const NotificationTemplateSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('email');
  
  // 邮件模板状态
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [filteredEmailTemplates, setFilteredEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [emailFilters, setEmailFilters] = useState({
    id: '',
    operationName: '',
    description: '',
    status: '',
    creator: ''
  });
  
  // 企微模板状态
  const [wechatTemplates, setWechatTemplates] = useState<WechatTemplate[]>(mockWechatTemplates);
  const [filteredWechatTemplates, setFilteredWechatTemplates] = useState<WechatTemplate[]>(mockWechatTemplates);
  const [wechatFilters, setWechatFilters] = useState({
    id: '',
    operationName: '',
    templateType: '',
    status: '',
    creator: ''
  });
  
  // 弹窗状态
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [wechatModalVisible, setWechatModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | WechatTemplate | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  
  // 表单状态
  const [emailForm] = Form.useForm();
  const [wechatForm] = Form.useForm();
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 筛选邮件模板
  useEffect(() => {
    const filtered = emailTemplates.filter(template => {
      return (
        (!emailFilters.id || template.id.toLowerCase().includes(emailFilters.id.toLowerCase())) &&
        (!emailFilters.operationName || template.operationName.toLowerCase().includes(emailFilters.operationName.toLowerCase())) &&
        (!emailFilters.description || (template.description && template.description.toLowerCase().includes(emailFilters.description.toLowerCase()))) &&
        (!emailFilters.status || template.status === emailFilters.status) &&
        (!emailFilters.creator || template.creator.toLowerCase().includes(emailFilters.creator.toLowerCase()))
      );
    });
    setFilteredEmailTemplates(filtered);
  }, [emailTemplates, emailFilters]);

  // 筛选企微模板
  useEffect(() => {
    const filtered = wechatTemplates.filter(template => {
      return (
        (!wechatFilters.id || template.id.toLowerCase().includes(wechatFilters.id.toLowerCase())) &&
        (!wechatFilters.operationName || template.operationName.toLowerCase().includes(wechatFilters.operationName.toLowerCase())) &&
        (!wechatFilters.templateType || template.templateType === wechatFilters.templateType) &&
        (!wechatFilters.status || template.status === wechatFilters.status) &&
        (!wechatFilters.creator || template.creator.toLowerCase().includes(wechatFilters.creator.toLowerCase()))
      );
    });
    setFilteredWechatTemplates(filtered);
  }, [wechatTemplates, wechatFilters]);

  // 处理邮件模板筛选变化
  const handleEmailFilterChange = (field: string, value: string) => {
    setEmailFilters(prev => ({ ...prev, [field]: value }));
  };

  // 处理企微模板筛选变化
  const handleWechatFilterChange = (field: string, value: string) => {
    setWechatFilters(prev => ({ ...prev, [field]: value }));
  };

  // 重置邮件模板筛选
  const handleResetEmailFilters = () => {
    setEmailFilters({
      id: '',
      operationName: '',
      description: '',
      status: '',
      creator: ''
    });
  };

  // 重置企微模板筛选
  const handleResetWechatFilters = () => {
    setWechatFilters({
      id: '',
      operationName: '',
      templateType: '',
      status: '',
      creator: ''
    });
  };

  // 启用邮件模板
  const handleEnableEmailTemplate = (template: EmailTemplate) => {
    // 停用同操作的其他模板
    const updatedTemplates = emailTemplates.map(t => {
      if (t.operationId === template.operationId) {
        return { ...t, status: t.id === template.id ? '启用' : '禁用' };
      }
      return t;
    });
    setEmailTemplates(updatedTemplates);
    Message.success('模板启用成功');
  };

  // 启用企微模板
  const handleEnableWechatTemplate = (template: WechatTemplate) => {
    // 停用同操作的其他模板
    const updatedTemplates = wechatTemplates.map(t => {
      if (t.operationId === template.operationId) {
        return { ...t, status: t.id === template.id ? '启用' : '禁用' };
      }
      return t;
    });
    setWechatTemplates(updatedTemplates);
    Message.success('模板启用成功');
  };

  // 删除邮件模板
  const handleDeleteEmailTemplate = (template: EmailTemplate) => {
    // 检查是否是最后一个同操作模板
    const sameOperationTemplates = emailTemplates.filter(t => t.operationId === template.operationId);
    if (sameOperationTemplates.length <= 1) {
      Message.error('不能删除最后一个同操作模板');
      return;
    }
    
    setEmailTemplates(templates => templates.filter(t => t.id !== template.id));
    Message.success('模板删除成功');
  };

  // 删除企微模板
  const handleDeleteWechatTemplate = (template: WechatTemplate) => {
    // 检查是否是最后一个同操作模板
    const sameOperationTemplates = wechatTemplates.filter(t => t.operationId === template.operationId);
    if (sameOperationTemplates.length <= 1) {
      Message.error('不能删除最后一个同操作模板');
      return;
    }
    
    setWechatTemplates(templates => templates.filter(t => t.id !== template.id));
    Message.success('模板删除成功');
  };

  // 新建邮件模板
  const handleCreateEmailTemplate = () => {
    setEditingTemplate(null);
    setIsEdit(false);
    emailForm.resetFields();
    setEmailModalVisible(true);
  };

  // 新建企微模板
  const handleCreateWechatTemplate = () => {
    setEditingTemplate(null);
    setIsEdit(false);
    wechatForm.resetFields();
    // 设置模板类型默认值为'纯文本'
    wechatForm.setFieldValue('templateType', '纯文本');
    setWechatModalVisible(true);
  };

  // 编辑邮件模板
  const handleEditEmailTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsEdit(true);
    emailForm.setFieldsValue({
      operationId: template.operationId,
      description: template.description,
      subject: template.subject,
      content: template.content,
      footer: template.footer,
      redirectLink: template.redirectLink
    });
    setEmailModalVisible(true);
  };

  // 编辑企微模板
  const handleEditWechatTemplate = (template: WechatTemplate) => {
    setEditingTemplate(template);
    setIsEdit(true);
    wechatForm.setFieldsValue({
      operationId: template.operationId,
      templateType: template.templateType,
      description: template.description,
      ...template.content
    });
    setWechatModalVisible(true);
  };

  // 预览邮件模板
  const handlePreviewEmailTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setPreviewModalVisible(true);
  };

  // 保存邮件模板
  const handleSaveEmailTemplate = async (values: any) => {
    try {
      await emailForm.validate();
      
      if (isEdit && editingTemplate) {
        // 编辑现有模板
        const updatedTemplates = emailTemplates.map(t => 
          t.id === editingTemplate.id 
            ? { 
                ...t, 
                ...values,
                operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
                lastUpdated: new Date().toLocaleString('zh-CN')
              }
            : t
        );
        setEmailTemplates(updatedTemplates);
        Message.success('邮件模板更新成功');
      } else {
        // 创建新模板
        const newTemplate: EmailTemplate = {
          id: `EM${String(emailTemplates.length + 1).padStart(3, '0')}`,
          ...values,
          operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
          status: '启用', // 新建时自动启用
          creator: 'admin',
          lastUpdated: new Date().toLocaleString('zh-CN'),
          attachments: []
        };
        
        // 停用同操作的其他模板
        const updatedTemplates = emailTemplates.map(t => 
          t.operationId === values.operationId ? { ...t, status: '禁用' } : t
        );
        
        setEmailTemplates([...updatedTemplates, newTemplate]);
        Message.success('邮件模板创建成功');
      }
      
      setEmailModalVisible(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 保存企微模板
  const handleSaveWechatTemplate = async (values: any) => {
    try {
      await wechatForm.validate();
      
      const content = values.templateType === '纯文本' 
        ? { text: values.text, safe: values.safe || 0 }
        : values.templateType === '文本卡片'
        ? { title: values.title, description: values.description, url: values.url, btntxt: values.btntxt }
        : { title: values.title, description: values.description, url: values.url, picurl: values.picurl };
      
      if (isEdit && editingTemplate) {
        // 编辑现有模板
        const updatedTemplates = wechatTemplates.map(t => 
          t.id === editingTemplate.id 
            ? { 
                ...t, 
                ...values,
                content,
                operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
                lastUpdated: new Date().toLocaleString('zh-CN')
              }
            : t
        );
        setWechatTemplates(updatedTemplates);
        Message.success('企微模板更新成功');
      } else {
        // 创建新模板
        const newTemplate: WechatTemplate = {
          id: `WC${String(wechatTemplates.length + 1).padStart(3, '0')}`,
          ...values,
          content,
          operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
          status: '启用', // 新建时自动启用
          creator: 'admin',
          lastUpdated: new Date().toLocaleString('zh-CN')
        };
        
        // 停用同操作的其他模板
        const updatedTemplates = wechatTemplates.map(t => 
          t.operationId === values.operationId ? { ...t, status: '禁用' } : t
        );
        
        setWechatTemplates([...updatedTemplates, newTemplate]);
        Message.success('企微模板创建成功');
      }
      
      setWechatModalVisible(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 插入变量
  const handleInsertVariable = (variable: string, field: string) => {
    const currentValue = emailForm.getFieldValue(field) || '';
    emailForm.setFieldValue(field, currentValue + `{${variable}}`);
  };

  // 邮件模板列定义
  const emailTemplateColumns = [
    {
      title: '模板ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 150
    },
    {
      title: '触发操作',
      dataIndex: 'operationName',
      key: 'operationName',
      width: 120
    },
    {
      title: '模板描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (value: string) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    {
      title: '模板状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => (
        <Tag color={value === '启用' ? 'green' : 'red'}>{value}</Tag>
      )
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '最近更新时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 150
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: EmailTemplate) => (
        <Space>
          <Button 
            type="text" 
            size="mini"
            disabled={record.status === '启用'}
            onClick={() => handleEnableEmailTemplate(record)}
          >
            {record.status === '启用' ? '启用' : '启用'}
          </Button>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handleEditEmailTemplate(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handlePreviewEmailTemplate(record)}
          >
            预览
          </Button>
          <Popconfirm
            title="确认删除"
            content="是否确认删除该邮件模板？"
            onOk={() => handleDeleteEmailTemplate(record)}
          >
            <Button 
              type="text" 
              size="mini" 
              disabled={emailTemplates.filter(t => t.operationId === record.operationId).length <= 1}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 企微模板列定义
  const wechatTemplateColumns = [
    {
      title: '模板ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '触发操作',
      dataIndex: 'operationName',
      key: 'operationName',
      width: 120
    },
    {
      title: '模板类型',
      dataIndex: 'templateType',
      key: 'templateType',
      width: 100,
      render: (value: string) => (
        <Tag color="blue">{value}</Tag>
      )
    },
    {
      title: '模板描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (value: string) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    {
      title: '模板状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => (
        <Tag color={value === '启用' ? 'green' : 'red'}>{value}</Tag>
      )
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '最近更新时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 150
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: WechatTemplate) => (
        <Space>
          <Button 
            type="text" 
            size="mini"
            disabled={record.status === '启用'}
            onClick={() => handleEnableWechatTemplate(record)}
          >
            {record.status === '启用' ? '启用' : '启用'}
          </Button>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handleEditWechatTemplate(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            content="是否确认删除该企微模板？"
            onOk={() => handleDeleteWechatTemplate(record)}
          >
            <Button 
              type="text" 
              size="mini" 
              disabled={wechatTemplates.filter(t => t.operationId === record.operationId).length <= 1}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 邮件模板表单弹窗
  const renderEmailTemplateModal = () => (
    <Modal
      title={
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 500, 
          padding: '16px 24px', 
          borderBottom: '1px solid #e5e6eb',
          margin: '-24px -24px 0 -24px',
          borderRadius: '8px 8px 0 0'
        }}>
          {isEdit ? '编辑邮件模板' : '新建邮件模板'}
        </div>
      }
      visible={emailModalVisible}
      onCancel={() => {
        setEmailModalVisible(false);
        setEditingTemplate(null);
      }}
      footer={[
        <Button 
          key="cancel" 
          onClick={() => {
            setEmailModalVisible(false);
            setEditingTemplate(null);
          }}
          style={{ 
            borderColor: '#e5e6eb',
            color: '#1d2129',
            borderRadius: '4px'
          }}
        >
          取消
        </Button>,
        <Button 
          key="save" 
          type="primary"
          onClick={() => emailForm.submit()}
          style={{ 
            backgroundColor: '#7466F0', 
            borderColor: '#7466F0',
            borderRadius: '4px'
          }}
        >
          确定
        </Button>
      ]}
      style={{ width: 800, borderRadius: '8px' }}
      bodyStyle={{ padding: '24px', height: '70vh', overflowY: 'auto' }}
    >
      <Form
        form={emailForm}
        layout="vertical"
        onSubmit={handleSaveEmailTemplate}
        style={{ paddingRight: '8px' }}
      >
        <FormItem
          label="模板名称"
          field="templateName"
          rules={[
            { required: true, message: '模板名称未填写' },
            { max: 50, message: '模板名称过长' }
          ]}
        >
          <Input placeholder="请输入模板名称" />
        </FormItem>
        
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label="触发操作"
              field="operationId"
              rules={[{ required: true, message: '触发操作未填写' }]}
            >
              <Select placeholder="请选择触发操作">
                {mockOperations.map(op => (
                  <Select.Option key={op.id} value={op.id}>
                    {op.name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="模板描述"
              field="description"
              rules={[{ max: 200, message: '模板描述过长' }]}
            >
              <Input.TextArea 
                placeholder="请输入模板描述" 
                rows={3}
              />
            </FormItem>
          </Col>
        </Row>
        
        <FormItem
          label="邮件主题"
          field="subject"
          rules={[
            { required: true, message: '邮件主题未填写' },
            { max: 100, message: '邮件主题过长' }
          ]}
        >
          <Input 
            placeholder="请输入邮件主题" 
            addAfter={
              <Select 
                placeholder="插入变量" 
                style={{ width: 120 }}
                onChange={(value) => handleInsertVariable(value, 'subject')}
              >
                {variableList.map(variable => (
                  <Select.Option key={variable} value={variable}>
                    {variable}
                  </Select.Option>
                ))}
              </Select>
            }
          />
        </FormItem>
        
        <div style={{ marginBottom: '8px' }}>
          <FormItem
            label="邮件内容"
            field="content"
            rules={[{ required: true, message: '邮件内容未填写' }]}
            style={{ marginBottom: '8px' }}
          >
            <EmailEditor 
              value={emailForm.getFieldValue('content') || ''}
              onChange={(value) => emailForm.setFieldValue('content', value)}
              variableList={variableList}
              onInsertVariable={handleInsertVariable}
            />
          </FormItem>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <FormItem
            label="页脚签名"
            field="footer"
            rules={[{ max: 500, message: '页脚签名过长' }]}
            style={{ marginBottom: '8px' }}
          >
            <EmailEditor 
              value={emailForm.getFieldValue('footer') || ''}
              onChange={(value) => emailForm.setFieldValue('footer', value)}
              variableList={variableList}
              onInsertVariable={handleInsertVariable}
            />
          </FormItem>
        </div>
        
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label="跳转链接"
              field="redirectLink"
              rules={[{ type: 'url', message: '跳转链接应该为URL格式' }]}
            >
              <Input placeholder="请输入跳转链接" />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="邮件附件"
              field="attachments"
            >
              <Upload
                multiple
                accept="*/*"
                listType="picture"
                action="/api/upload"
              >
                <Button>
                  <IconUpload /> 上传附件
                </Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                支持上传多个附件，单个文件大小不超过10MB
              </Text>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );

  // 企微模板表单弹窗
  const renderWechatTemplateModal = () => (
    <Modal
      title={
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 500, 
          padding: '16px 24px', 
          borderBottom: '1px solid #e5e6eb',
          margin: '-24px -24px 0 -24px',
          borderRadius: '8px 8px 0 0'
        }}>
          {isEdit ? '编辑企微模板' : '新建企微模板'}
        </div>
      }
      visible={wechatModalVisible}
      onCancel={() => {
        setWechatModalVisible(false);
        setEditingTemplate(null);
      }}
      footer={[
        <Button 
          key="cancel" 
          onClick={() => {
            setWechatModalVisible(false);
            setEditingTemplate(null);
          }}
          style={{ 
            borderColor: '#e5e6eb',
            color: '#1d2129',
            borderRadius: '4px'
          }}
        >
          取消
        </Button>,
        <Button 
          key="save" 
          type="primary"
          onClick={() => wechatForm.submit()}
          style={{ 
            backgroundColor: '#7466F0', 
            borderColor: '#7466F0',
            borderRadius: '4px'
          }}
        >
          确定
        </Button>
      ]}
      style={{ width: 600, borderRadius: '8px' }}
      bodyStyle={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form
        form={wechatForm}
        layout="vertical"
        onSubmit={handleSaveWechatTemplate}
        style={{ paddingRight: '8px' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label="触发操作"
              field="operationId"
              rules={[{ required: true, message: '触发操作未填写' }]}
            >
              <Select placeholder="请选择触发操作">
                {mockOperations.map(op => (
                  <Select.Option key={op.id} value={op.id}>
                    {op.name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="模板类型"
              field="templateType"
              rules={[{ required: true, message: '模板类型未填写' }]}
            >
              <Select placeholder="请选择模板类型">
                <Select.Option value="纯文本">纯文本</Select.Option>
                <Select.Option value="文本卡片">文本卡片</Select.Option>
                <Select.Option value="图文消息">图文消息</Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        
        <FormItem
          label="模板描述"
          field="description"
          rules={[{ max: 200, message: '模板描述过长' }]}
        >
          <Input.TextArea 
            placeholder="请输入模板描述" 
            rows={3}
            addAfter={
              <Select 
                placeholder="插入变量" 
                style={{ width: 120 }}
                onChange={(value) => {
                  const currentValue = wechatForm.getFieldValue('description') || '';
                  wechatForm.setFieldValue('description', currentValue + `{${value}}`);
                }}
              >
                {variableList.map(variable => (
                  <Select.Option key={variable} value={variable}>
                    {variable}
                  </Select.Option>
                ))}
              </Select>
            }
          />
        </FormItem>
        
        <Form.Item noStyle shouldUpdate>
          {() => {
            const templateType = wechatForm.getFieldValue('templateType');
            
            if (templateType === '纯文本') {
              return (
                <>
                  <FormItem
                    label="文本内容"
                    field="text"
                    rules={[
                      { required: true, message: '文本内容未填写' },
                      { max: 2048, message: '文本内容过长' }
                    ]}
                  >
                    <Input.TextArea 
                      placeholder="请输入文本内容" 
                      rows={4}
                      addAfter={
                        <Select 
                          placeholder="插入变量" 
                          style={{ width: 120 }}
                          onChange={(value) => {
                            const currentValue = wechatForm.getFieldValue('text') || '';
                            wechatForm.setFieldValue('text', currentValue + `{${value}}`);
                          }}
                        >
                          {variableList.map(variable => (
                            <Select.Option key={variable} value={variable}>
                              {variable}
                            </Select.Option>
                          ))}
                        </Select>
                      }
                    />
                  </FormItem>
                  <FormItem
                    label="是否是保密消息"
                    field="safe"
                    initialValue={0}
                  >
                    <Select>
                      <Select.Option value={0}>否</Select.Option>
                      <Select.Option value={1}>是</Select.Option>
                    </Select>
                  </FormItem>
                </>
              );
            } else if (templateType === '文本卡片') {
              return (
                <>
                  <FormItem
                    label="标题"
                    field="title"
                    rules={[
                      { required: true, message: '标题未填写' },
                      { max: 128, message: '标题过长' }
                    ]}
                  >
                    <Input 
                      placeholder="请输入标题" 
                      addAfter={
                        <Select 
                          placeholder="插入变量" 
                          style={{ width: 120 }}
                          onChange={(value) => {
                            const currentValue = wechatForm.getFieldValue('title') || '';
                            wechatForm.setFieldValue('title', currentValue + `{${value}}`);
                          }}
                        >
                          {variableList.map(variable => (
                            <Select.Option key={variable} value={variable}>
                              {variable}
                            </Select.Option>
                          ))}
                        </Select>
                      }
                    />
                  </FormItem>
                  <FormItem
                    label="描述"
                    field="description"
                    rules={[
                      { required: true, message: '描述未填写' },
                      { max: 512, message: '描述过长' }
                    ]}
                  >
                    <Input.TextArea 
                      placeholder="请输入描述" 
                      rows={3}
                      addAfter={
                        <Select 
                          placeholder="插入变量" 
                          style={{ width: 120 }}
                          onChange={(value) => {
                            const currentValue = wechatForm.getFieldValue('description') || '';
                            wechatForm.setFieldValue('description', currentValue + `{${value}}`);
                          }}
                        >
                          {variableList.map(variable => (
                            <Select.Option key={variable} value={variable}>
                              {variable}
                            </Select.Option>
                          ))}
                        </Select>
                      }
                    />
                  </FormItem>
                  <FormItem
                    label="链接"
                    field="url"
                    rules={[
                      { required: true, message: '链接未填写' },
                      { type: 'url', message: '链接应该为URL格式' }
                    ]}
                  >
                    <Input placeholder="请输入链接" />
                  </FormItem>
                  <FormItem
                    label="按钮文字"
                    field="btntxt"
                    rules={[{ max: 4, message: '按钮文字过长' }]}
                  >
                    <Input placeholder="请输入按钮文字" />
                  </FormItem>
                </>
              );
            } else if (templateType === '图文消息') {
              return (
                <>
                  <FormItem
                    label="标题"
                    field="title"
                    rules={[
                      { required: true, message: '标题未填写' },
                      { max: 128, message: '标题过长' }
                    ]}
                  >
                    <Input 
                      placeholder="请输入标题" 
                      addAfter={
                        <Select 
                          placeholder="插入变量" 
                          style={{ width: 120 }}
                          onChange={(value) => {
                            const currentValue = wechatForm.getFieldValue('title') || '';
                            wechatForm.setFieldValue('title', currentValue + `{${value}}`);
                          }}
                        >
                          {variableList.map(variable => (
                            <Select.Option key={variable} value={variable}>
                              {variable}
                            </Select.Option>
                          ))}
                        </Select>
                      }
                    />
                  </FormItem>
                  <FormItem
                    label="描述"
                    field="description"
                    rules={[
                      { required: true, message: '描述未填写' },
                      { max: 512, message: '描述过长' }
                    ]}
                  >
                    <Input.TextArea 
                      placeholder="请输入描述" 
                      rows={3}
                      addAfter={
                        <Select 
                          placeholder="插入变量" 
                          style={{ width: 120 }}
                          onChange={(value) => {
                            const currentValue = wechatForm.getFieldValue('description') || '';
                            wechatForm.setFieldValue('description', currentValue + `{${value}}`);
                          }}
                        >
                          {variableList.map(variable => (
                            <Select.Option key={variable} value={variable}>
                              {variable}
                            </Select.Option>
                          ))}
                        </Select>
                      }
                    />
                  </FormItem>
                  <FormItem
                    label="链接"
                    field="url"
                    rules={[
                      { required: true, message: '链接未填写' },
                      { type: 'url', message: '链接应该为URL格式' }
                    ]}
                  >
                    <Input placeholder="请输入链接" />
                  </FormItem>
                  <FormItem
                    label="图片链接"
                    field="picurl"
                    rules={[{ type: 'url', message: '图片链接应该为URL格式' }]}
                  >
                    <Input placeholder="请输入图片链接" />
                  </FormItem>
                </>
              );
            }
            
            return null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );

  // 邮件预览弹窗
  const renderPreviewModal = () => {
    if (!editingTemplate || !('subject' in editingTemplate)) return null;
    
    const template = editingTemplate as EmailTemplate;
    
    // 渲染跳转链接按钮
    const renderJumpLinkButton = () => {
      if (!template.jumpLink) return null;
      
      return (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="small"
            onClick={() => window.open(template.jumpLink, '_blank')}
            style={{ 
              backgroundColor: '#7466F0', 
              borderColor: '#7466F0',
              borderRadius: '4px'
            }}
          >
            查看详情
          </Button>
        </div>
      );
    };
    
    // 渲染附件信息
    const renderAttachments = () => {
      if (!template.attachments || template.attachments.length === 0) return null;
      
      return (
        <div style={{ 
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          border: '1px solid #e5e6eb'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#666' }}>
            附件 ({template.attachments.length}个)
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {template.attachments.map((att, index) => (
              <div key={index}>• {att.name}</div>
            ))}
          </div>
        </div>
      );
    };
    
    return (
      <Modal
        title={
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 500, 
            padding: '16px 24px', 
            borderBottom: '1px solid #e5e6eb',
            margin: '-24px -24px 0 -24px',
            borderRadius: '8px 8px 0 0'
          }}>
            邮件模板预览
          </div>
        }
        visible={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setPreviewModalVisible(false)}
            style={{ 
              backgroundColor: '#7466F0', 
              borderColor: '#7466F0',
              color: 'white',
              borderRadius: '4px'
            }}
          >
            关闭
          </Button>
        ]}
        style={{ width: 700, borderRadius: '8px' }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ 
          border: '1px solid #e5e6eb', 
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#1d2129'
          }}>
            {template.subject}
          </div>
          
          <div 
            style={{ 
              marginBottom: '16px',
              lineHeight: '1.6',
              color: '#4e5969',
              minHeight: '100px'
            }}
            dangerouslySetInnerHTML={{ __html: template.content || '<div style="color: #999; font-style: italic;">暂无邮件内容</div>' }}
          />
          
          {renderJumpLinkButton()}
          
          {template.footer && (
            <div style={{ 
              borderTop: '1px solid #e5e6eb',
              paddingTop: '16px',
              marginTop: '16px',
              fontSize: '12px',
              color: '#86909c'
            }}>
              {template.footer}
            </div>
          )}
          
          {renderAttachments()}
        </div>
      </Modal>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane key="email" title="邮件模板">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="模板ID"
                  style={{ width: 120 }}
                  value={emailFilters.id}
                  onChange={(value) => handleEmailFilterChange('id', value)}
                />
                <Input
                  placeholder="触发操作"
                  style={{ width: 120 }}
                  value={emailFilters.operationName}
                  onChange={(value) => handleEmailFilterChange('operationName', value)}
                />
                <Input
                  placeholder="模板描述"
                  style={{ width: 150 }}
                  value={emailFilters.description}
                  onChange={(value) => handleEmailFilterChange('description', value)}
                />
                <Select
                  placeholder="模板状态"
                  style={{ width: 120 }}
                  allowClear
                  value={emailFilters.status}
                  onChange={(value) => handleEmailFilterChange('status', value)}
                >
                  <Select.Option value="启用">启用</Select.Option>
                  <Select.Option value="禁用">禁用</Select.Option>
                </Select>
                <Input
                  placeholder="创建者"
                  style={{ width: 120 }}
                  value={emailFilters.creator}
                  onChange={(value) => handleEmailFilterChange('creator', value)}
                />
                <Button type="outline" onClick={handleResetEmailFilters}>
                  重置
                </Button>
              </div>
              <Button type="primary" onClick={handleCreateEmailTemplate}>
                <IconPlus /> 新建
              </Button>
            </div>
            
            <Table
              columns={emailTemplateColumns}
              data={filteredEmailTemplates}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredEmailTemplates.length,
                onChange: (page) => setCurrentPage(page),
                showTotal: true,
                showJumper: true
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          
          <TabPane key="wechat" title="企微模板">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="模板ID"
                  style={{ width: 120 }}
                  value={wechatFilters.id}
                  onChange={(value) => handleWechatFilterChange('id', value)}
                />
                <Input
                  placeholder="触发操作"
                  style={{ width: 120 }}
                  value={wechatFilters.operationName}
                  onChange={(value) => handleWechatFilterChange('operationName', value)}
                />
                <Select
                  placeholder="模板类型"
                  style={{ width: 120 }}
                  allowClear
                  value={wechatFilters.templateType}
                  onChange={(value) => handleWechatFilterChange('templateType', value)}
                >
                  <Select.Option value="纯文本">纯文本</Select.Option>
                  <Select.Option value="文本卡片">文本卡片</Select.Option>
                  <Select.Option value="图文消息">图文消息</Select.Option>
                </Select>
                <Select
                  placeholder="模板状态"
                  style={{ width: 120 }}
                  allowClear
                  value={wechatFilters.status}
                  onChange={(value) => handleWechatFilterChange('status', value)}
                >
                  <Select.Option value="启用">启用</Select.Option>
                  <Select.Option value="禁用">禁用</Select.Option>
                </Select>
                <Input
                  placeholder="创建者"
                  style={{ width: 120 }}
                  value={wechatFilters.creator}
                  onChange={(value) => handleWechatFilterChange('creator', value)}
                />
                <Button type="outline" onClick={handleResetWechatFilters}>
                  重置
                </Button>
              </div>
              <Button type="primary" onClick={handleCreateWechatTemplate}>
                <IconPlus /> 新建
              </Button>
            </div>
            
            <Table
              columns={wechatTemplateColumns}
              data={filteredWechatTemplates}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredWechatTemplates.length,
                onChange: (page) => setCurrentPage(page),
                showTotal: true,
                showJumper: true
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 弹窗组件 */}
      {renderEmailTemplateModal()}
      {renderWechatTemplateModal()}
      {renderPreviewModal()}
    </div>
  );
};

export default NotificationTemplateSettings;