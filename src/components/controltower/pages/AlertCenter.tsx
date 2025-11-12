import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Tabs, 
  Button, 
  Table, 
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Message,
  Popconfirm,
  Tooltip,
  Avatar,
  Badge
} from '@arco-design/web-react';
import { IconCheck, IconEdit, IconDelete, IconEye, IconEyeInvisible, IconStar, IconUser, IconClockCircle, IconSend, IconInfoCircle } from '@arco-design/web-react/icon';
import NotificationSubscriptionSettings from './NotificationSubscriptionSettings';
import NotificationTemplateSettings from './NotificationTemplateSettings';

const { Title } = Typography;
const { TabPane } = Tabs;
const FormItem = Form.Item;

// 邮箱配置数据类型定义
interface EmailConfig {
  id: string;
  name: string;
  description?: string;
  senderName: string;
  senderEmail: string;
  smtpServer: string;
  smtpPort: number;
  encryption: 'none' | 'SSL' | 'TLS';
  smtpAccount: string;
  smtpPassword: string;
  replyEmail?: string;
  enableSignature: boolean;
  signature?: string;
  batchSendLimit: number; // 单次发送数量限制
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// 已发送邮件数据类型定义
interface SentEmail {
  id: string;
  subject: string;
  recipients: string[];
  sendTime: string;
  emailType: '运价推广' | '开发信' | '系统通知';
  operator: string;
  status: '处理中' | '已完成' | '失败' | '退回';
  recipientCount: number;
  failedCount?: number;
  emailContent: string;
  createdAt: string;
}

// 收件人详情数据类型定义
interface RecipientDetail {
  email: string;
  name?: string;
  company?: string;
  status: '发送中' | '成功' | '失败';
  failureReason?: string; // 失败原因
}

// 企微API配置数据类型定义
interface WeChatWorkConfig {
  id: string;
  name: string;
  corpId: string;
  agentId: string;
  secret: string;
  status: '启用' | '禁用';
  isDefault: boolean;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockEmailConfigs: EmailConfig[] = [
  {
    id: '1',
    name: '主邮箱配置',
    description: '用于系统主要通知发送',
    senderName: '系统管理员',
    senderEmail: 'admin@cargowarex.com',
    smtpServer: 'smtp.cargowarex.com',
    smtpPort: 587,
    encryption: 'TLS',
    smtpAccount: 'admin@cargowarex.com',
    smtpPassword: '********',
    replyEmail: 'support@cargowarex.com',
    enableSignature: true,
    signature: '<p>感谢使用CargoWareX系统</p>',
    batchSendLimit: 50, // 单次发送数量限制
    isDefault: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: '备用邮箱配置',
    description: '备用邮件发送配置',
    senderName: '技术支持',
    senderEmail: 'tech@cargowarex.com',
    smtpServer: 'smtp.tech.com',
    smtpPort: 465,
    encryption: 'SSL',
    smtpAccount: 'tech@cargowarex.com',
    smtpPassword: '********',
    enableSignature: false,
    batchSendLimit: 30, // 单次发送数量限制
    isDefault: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  }
];

// 企微API配置模拟数据
const mockWeChatWorkConfigs: WeChatWorkConfig[] = [
  {
    id: 'wechat-1',
    name: '主企微配置',
    corpId: 'ww1234567890abcdef',
    agentId: '1000001',
    secret: '********',
    status: '启用',
    isDefault: true,
    remark: '用于系统主要通知推送',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'wechat-2',
    name: '备用企微配置',
    corpId: 'ww9876543210fedcba',
    agentId: '1000002',
    secret: '********',
    status: '启用',
    isDefault: false,
    remark: '备用推送配置',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: 'wechat-3',
    name: '测试环境配置',
    corpId: 'wwabcdef123456789',
    agentId: '1000003',
    secret: '********',
    status: '禁用',
    isDefault: false,
    remark: '测试环境使用',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: 'wechat-4',
    name: '客户通知配置',
    corpId: 'wwfedcba987654321',
    agentId: '1000004',
    secret: '********',
    status: '启用',
    isDefault: false,
    remark: '专门用于客户通知',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-07'
  },
  {
    id: 'wechat-5',
    name: '内部通知配置',
    corpId: 'ww1234567890abc123',
    agentId: '1000005',
    secret: '********',
    status: '启用',
    isDefault: false,
    remark: '内部员工通知使用',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-04'
  }
];

// 已发送邮件模拟数据
const mockSentEmails: SentEmail[] = [
  {
    id: 'sent-1',
    subject: '2024年第一季度运价调整通知',
    recipients: ['client1@example.com', 'client2@example.com', 'client3@example.com', 'client4@example.com', 'client5@example.com'],
    sendTime: '2024-01-15 14:30:25',
    emailType: '运价推广',
    operator: '张三',
    status: '已完成',
    recipientCount: 156,
    emailContent: '<p>尊敬的客户：</p><p>感谢您一直以来对CargoWareX的支持。我们很高兴地通知您，2024年第一季度运价已进行调整...</p>',
    createdAt: '2024-01-15'
  },
  {
    id: 'sent-2',
    subject: '新功能上线通知 - 智能路线优化',
    recipients: ['user1@company.com', 'user2@company.com', 'user3@company.com'],
    sendTime: '2024-01-14 10:15:42',
    emailType: '系统通知',
    operator: '李四',
    status: '已完成',
    recipientCount: 89,
    emailContent: '<p>亲爱的用户：</p><p>我们很高兴地宣布，CargoWareX平台已上线智能路线优化功能...</p>',
    createdAt: '2024-01-14'
  },
  {
    id: 'sent-3',
    subject: '潜在客户开发信 - 物流解决方案',
    recipients: ['prospect1@target.com', 'prospect2@target.com'],
    sendTime: '2024-01-13 16:45:18',
    emailType: '开发信',
    operator: '王五',
    status: '失败',
    recipientCount: 45,
    failedCount: 12,
    emailContent: '<p>尊敬的潜在客户：</p><p>我们是CargoWareX，专注于提供智能物流解决方案...</p>',
    createdAt: '2024-01-13'
  },
  {
    id: 'sent-4',
    subject: '系统维护通知 - 2024年1月20日',
    recipients: ['admin@company1.com', 'admin@company2.com'],
    sendTime: '2024-01-12 09:00:00',
    emailType: '系统通知',
    operator: '赵六',
    status: '处理中',
    recipientCount: 234,
    emailContent: '<p>尊敬的用户：</p><p>为了提供更好的服务体验，我们计划于2024年1月20日进行系统维护...</p>',
    createdAt: '2024-01-12'
  },
  {
    id: 'sent-5',
    subject: '春节假期物流安排提醒',
    recipients: ['customer1@logistics.com', 'customer2@logistics.com'],
    sendTime: '2024-01-11 15:20:33',
    emailType: '运价推广',
    operator: '钱七',
    status: '已完成',
    recipientCount: 67,
    emailContent: '<p>尊敬的客户：</p><p>春节将至，为确保您的物流需求得到及时处理，请提前安排...</p>',
    createdAt: '2024-01-11'
  }
];

const AlertCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('email-config');
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>(mockEmailConfigs);
  const [filteredEmailConfigs, setFilteredEmailConfigs] = useState<EmailConfig[]>(mockEmailConfigs);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testResultVisible, setTestResultVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<EmailConfig | null>(null);
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  // 企微API配置相关状态
  const [wechatConfigs, setWechatConfigs] = useState<WeChatWorkConfig[]>(mockWeChatWorkConfigs);
  const [filteredWechatConfigs, setFilteredWechatConfigs] = useState<WeChatWorkConfig[]>(mockWeChatWorkConfigs);
  const [wechatFilters, setWechatFilters] = useState<Record<string, string>>({});
  const [wechatViewModalVisible, setWechatViewModalVisible] = useState(false);
  const [wechatEditModalVisible, setWechatEditModalVisible] = useState(false);
  const [wechatCreateModalVisible, setWechatCreateModalVisible] = useState(false);
  const [wechatTestSuccess, setWechatTestSuccess] = useState(false);
  const [wechatTestResultVisible, setWechatTestResultVisible] = useState(false);
  const [currentWechatConfig, setCurrentWechatConfig] = useState<WeChatWorkConfig | null>(null);
  const [showWechatSecret, setShowWechatSecret] = useState(false);
  const [wechatForm] = Form.useForm();

  // 已发送邮件相关状态
  const [sentEmails, setSentEmails] = useState<SentEmail[]>(mockSentEmails);
  const [filteredSentEmails, setFilteredSentEmails] = useState<SentEmail[]>(mockSentEmails);
  const [sentEmailFilters, setSentEmailFilters] = useState<Record<string, string>>({});
  const [viewSentModalVisible, setViewSentModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [currentSentEmail, setCurrentSentEmail] = useState<SentEmail | null>(null);
  const [recipientModalVisible, setRecipientModalVisible] = useState(false);
  const [currentRecipients, setCurrentRecipients] = useState<RecipientDetail[]>([]);

  // 企微API配置列表列定义
  const wechatConfigColumns = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (value: string, record: WeChatWorkConfig) => (
        <Space>
          {record.isDefault && (
            <Tooltip content="默认配置">
              <IconStar style={{ color: '#ff7d00' }} />
            </Tooltip>
          )}
          <span>{value}</span>
        </Space>
      )
    },
    {
      title: '企业ID',
      dataIndex: 'corpId',
      key: 'corpId',
      width: 180
    },
    {
      title: '应用ID',
      dataIndex: 'agentId',
      key: 'agentId',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (value: string) => (
        <Tag color={value === '启用' ? 'green' : 'gray'}>
          {value}
        </Tag>
      )
    },
    {
      title: '是否默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: 80,
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'gray'}>
          {value ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      render: (value: string) => value || '-'
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: WeChatWorkConfig) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEye />}
            onClick={() => handleWechatView(record)}
          >
            查看
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEdit />}
            onClick={() => handleWechatEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<IconStar />}
            onClick={() => handleWechatSetDefault(record.id)}
          >
            设为默认
          </Button>
          <Popconfirm
            title="确认删除"
            content="确定要删除这个企微API配置吗？"
            onOk={() => handleWechatDelete(record.id)}
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
        </Space>
      )
    }
  ];

  // 邮箱配置列表列定义
  const emailConfigColumns = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (value: string, record: EmailConfig) => (
        <Space>
          {record.isDefault && (
            <Tooltip content="默认配置">
              <IconStar style={{ color: '#ff7d00' }} />
            </Tooltip>
          )}
          <span>{value}</span>
        </Space>
      )
    },
    {
      title: '配置描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (value: string) => value || '-'
    },
    {
      title: '发件人名称',
      dataIndex: 'senderName',
      key: 'senderName',
      width: 120
    },
    {
      title: '发件人邮箱',
      dataIndex: 'senderEmail',
      key: 'senderEmail',
      width: 180
    },
    {
      title: 'SMTP服务器',
      dataIndex: 'smtpServer',
      key: 'smtpServer',
      width: 150
    },
    {
      title: '加密方式',
      dataIndex: 'encryption',
      key: 'encryption',
      width: 100,
      render: (value: string) => (
        <Tag color={value === 'none' ? 'gray' : value === 'SSL' ? 'blue' : 'green'}>
          {value === 'none' ? '无' : value}
        </Tag>
      )
    },
    {
      title: '是否为默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: 100,
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'gray'}>
          {value ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: EmailConfig) => (
        <Space>
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
          <Button 
            type="text" 
            size="small" 
            icon={<IconStar />}
            onClick={() => handleSetDefault(record.id)}
          >
            设为默认
          </Button>
          <Popconfirm
            title="确认删除"
            content="确定要删除这个邮箱配置吗？"
            onOk={() => handleDelete(record.id)}
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
        </Space>
      )
    }
  ];

  // 查看详情
  const handleView = (config: EmailConfig) => {
    setCurrentConfig(config);
    setViewModalVisible(true);
  };

  // 编辑配置
  const handleEdit = (config: EmailConfig) => {
    setCurrentConfig(config);
    form.setFieldsValue(config);
    setEditModalVisible(true);
  };

  // 删除配置
  const handleDelete = (id: string) => {
    setEmailConfigs(configs => configs.filter(config => config.id !== id));
    Message.success('删除成功');
  };

  // 设为默认
  const handleSetDefault = (id: string) => {
    setEmailConfigs(configs => 
      configs.map(config => ({
        ...config,
        isDefault: config.id === id
      }))
    );
    Message.success('设置默认成功');
  };

  // 处理筛选变化
  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // 应用筛选
    const filtered = emailConfigs.filter(config => {
      return Object.entries(newFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const configValue = (config as any)[key];
        return configValue && configValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
    
    setFilteredEmailConfigs(filtered);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({});
    setFilteredEmailConfigs(emailConfigs);
  };

  // 测试配置
  const handleTestConfig = () => {
    // 模拟测试过程
    setTestSuccess(Math.random() > 0.3); // 70%成功率
    setTestResultVisible(true);
    
    setTimeout(() => {
      setTestResultVisible(false);
      if (testSuccess) {
        Message.success('测试通过');
      }
    }, 2000);
  };

  // 创建新配置
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 保存配置
  const handleSaveConfig = async (values: any) => {
    try {
      await form.validate();
      
      if (!testSuccess && !currentConfig) {
        Message.error('该配置尚未通过测试');
        return;
      }

      if (currentConfig) {
        // 编辑现有配置
        setEmailConfigs(configs => 
          configs.map(config => 
            config.id === currentConfig.id 
              ? { ...config, ...values, updatedAt: new Date().toISOString().split('T')[0] }
              : config
          )
        );
        Message.success('更新成功');
        setEditModalVisible(false);
      } else {
        // 创建新配置
        const newConfig: EmailConfig = {
          ...values,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          isDefault: false
        };
        setEmailConfigs(configs => [...configs, newConfig]);
        Message.success('创建成功');
        setCreateModalVisible(false);
      }
      
      setCurrentConfig(null);
      setTestSuccess(false);
    } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// ========== 已发送邮件相关处理函数 ==========

// 查看已发送邮件详情
const handleViewSentEmail = (email: SentEmail) => {
  setCurrentSentEmail(email);
  setViewSentModalVisible(true);
};

// 删除已发送邮件
const handleDeleteSentEmail = (id: string) => {
  setSentEmails(emails => emails.filter(email => email.id !== id));
  Message.success('删除成功');
  setDeleteConfirmVisible(false);
};

// 处理已发送邮件筛选变化
const handleSentEmailFilterChange = (field: string, value: string) => {
  const newFilters = { ...sentEmailFilters, [field]: value };
  setSentEmailFilters(newFilters);
  
  // 应用筛选
  const filtered = sentEmails.filter(email => {
    return Object.entries(newFilters).every(([key, filterValue]) => {
      if (!filterValue) return true;
      const emailValue = (email as any)[key];
      return emailValue && emailValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  });
  
  setFilteredSentEmails(filtered);
};

// 重置已发送邮件筛选
  const handleResetSentEmailFilters = () => {
    setSentEmailFilters({});
    setFilteredSentEmails(sentEmails);
  };

  // 企微API配置相关函数
  // 查看详情
  const handleWechatView = (config: WeChatWorkConfig) => {
    setCurrentWechatConfig(config);
    setWechatViewModalVisible(true);
  };

  // 编辑配置
  const handleWechatEdit = (config: WeChatWorkConfig) => {
    setCurrentWechatConfig(config);
    wechatForm.setFieldsValue(config);
    setWechatEditModalVisible(true);
  };

  // 删除配置
  const handleWechatDelete = (id: string) => {
    setWechatConfigs(configs => configs.filter(config => config.id !== id));
    Message.success('删除成功');
  };

  // 设为默认
  const handleWechatSetDefault = (id: string) => {
    setWechatConfigs(configs => 
      configs.map(config => ({
        ...config,
        isDefault: config.id === id
      }))
    );
    Message.success('设置默认成功');
  };

  // 处理筛选变化
  const handleWechatFilterChange = (field: string, value: string) => {
    const newFilters = { ...wechatFilters, [field]: value };
    setWechatFilters(newFilters);
    
    // 应用筛选
    const filtered = wechatConfigs.filter(config => {
      return Object.entries(newFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const configValue = (config as any)[key];
        return configValue && configValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
    
    setFilteredWechatConfigs(filtered);
  };

  // 重置筛选
  const handleWechatResetFilters = () => {
    setWechatFilters({});
    setFilteredWechatConfigs(wechatConfigs);
  };

  // 测试配置
  const handleWechatTestConfig = () => {
    // 先验证表单
    wechatForm.validate().then(() => {
      // 模拟测试过程 - 随机成功/失败
      const success = Math.random() > 0.3; // 70%成功率
      setWechatTestSuccess(success);
      setWechatTestResultVisible(true);
      
      // 显示2秒测试结果提示
      if (success) {
        Message.success('测试成功');
      } else {
        Message.error('测试失败');
      }
      
      setTimeout(() => {
        setWechatTestResultVisible(false);
      }, 2000);
    }).catch((error) => {
      Message.error('请先填写完整的配置信息');
    });
  };

  // 创建新配置
  const handleWechatCreate = () => {
    wechatForm.resetFields();
    setWechatCreateModalVisible(true);
  };

  // 保存配置
  const handleWechatSaveConfig = async (values: any) => {
    try {
      await wechatForm.validate();
      
      if (!wechatTestSuccess && !currentWechatConfig) {
        Message.error('该配置尚未通过测试');
        return;
      }

      if (currentWechatConfig) {
        // 编辑现有配置
        setWechatConfigs(configs => 
          configs.map(config => 
            config.id === currentWechatConfig.id 
              ? { ...config, ...values, updatedAt: new Date().toISOString().split('T')[0] }
              : config
          )
        );
        Message.success('更新成功');
        setWechatEditModalVisible(false);
      } else {
        // 创建新配置
        const newConfig: WeChatWorkConfig = {
          ...values,
          id: 'wechat-' + Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          isDefault: false
        };
        setWechatConfigs(configs => [...configs, newConfig]);
        Message.success('创建成功');
        setWechatCreateModalVisible(false);
      }
      
      setCurrentWechatConfig(null);
      setWechatTestSuccess(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

// 查看收件人详情
const handleViewRecipients = (email: SentEmail) => {
  // 生成收件人详情数据
  const recipientDetails: RecipientDetail[] = email.recipients.map((recipient, index) => {
    const status = email.status === '已完成' ? '成功' : 
                   email.status === '失败' ? '失败' : '发送中';
    
    // 为失败状态的收件人添加失败原因
    let failureReason = undefined;
    if (status === '失败') {
      // 模拟不同的失败原因
      const failureReasons = [
        '无效收件地址',
        '无效收件域名',
        '邮件被拒收',
        '收件人邮箱已满',
        '网络连接失败',
        '达到单次发送邮件数量上限',
        '邮箱配置问题'
      ];
      // 随机选择一个失败原因
      failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
    }
    
    return {
      email: recipient,
      name: `收件人${index + 1}`,
      company: `公司${index + 1}`,
      status,
      failureReason
    };
  });
  
  setCurrentRecipients(recipientDetails);
  setRecipientModalVisible(true);
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case '已完成': return 'green';
    case '失败': return 'red';
    case '处理中': return 'orange';
    case '退回': return 'purple';
    default: return 'gray';
  }
};

// 获取邮件类型颜色
  const getEmailTypeColor = (type: string) => {
    switch (type) {
      case '运价推广': return 'arcoblue';
      case '开发信': return 'green';
      case '系统通知': return 'orange';
      default: return 'gray';
    }
  };

  // 权限控制 - 检查用户是否有删除权限
  const hasDeletePermission = () => {
    // 这里可以根据实际业务逻辑判断用户权限
    // 暂时模拟为管理员有权限，普通用户无权限
    const userRole = 'admin'; // 可以从用户信息中获取
    return userRole === 'admin';
  };

  // 已发送邮件列表列定义
  const sentEmailColumns = [
    {
      title: '邮件主题',
      dataIndex: 'subject',
      key: 'subject',
      width: 200,
      render: (value: string) => (
        <Tooltip content={value}>
          <span style={{ 
            maxWidth: '180px', 
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {value}
          </span>
        </Tooltip>
      )
    },
    {
      title: '收件人',
      dataIndex: 'recipients',
      key: 'recipients',
      width: 180,
      render: (recipients: string[]) => {
        const displayText = recipients.slice(0, 3).join(', ');
        const truncatedText = displayText.length > 50 ? 
          displayText.substring(0, 47) + '...' : displayText;
        
        return (
          <Tooltip content={recipients.join(', ')}>
            <span 
              style={{ 
                cursor: 'pointer',
                color: '#7466F0',
                textDecoration: 'underline'
              }}
              onClick={() => handleViewRecipients({ recipients } as SentEmail)}
            >
              {truncatedText}
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 150,
      sorter: (a: SentEmail, b: SentEmail) => 
        new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime(),
      render: (value: string) => (
        <Space>
          <IconClockCircle style={{ color: '#86909c' }} />
          <span>{value}</span>
        </Space>
      )
    },
    {
      title: '邮件类型',
      dataIndex: 'emailType',
      key: 'emailType',
      width: 100,
      render: (value: string) => (
        <Tag color={getEmailTypeColor(value)}>
          {value}
        </Tag>
      )
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
      render: (value: string) => (
        <Space>
          <Avatar size={24} style={{ backgroundColor: '#7466F0' }}>
            <IconUser />
          </Avatar>
          <span>{value}</span>
        </Space>
      )
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: string, record: SentEmail) => (
        <Badge 
          status={value === '已完成' ? 'success' : 
                  value === '失败' ? 'error' : 
                  value === '处理中' ? 'processing' : 'default'}
          text={
            <span style={{ color: getStatusColor(value) }}>
              {value === '失败' && record.failedCount ? 
                `${record.failedCount}封邮件发送失败` : value
              }
            </span>
          }
        />
      )
    },
    {
      title: '收件人数量',
      dataIndex: 'recipientCount',
      key: 'recipientCount',
      width: 100,
      render: (value: number) => (
        <Tag color="blue">{value}</Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: SentEmail) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEye />}
            onClick={() => handleViewSentEmail(record)}
          >
            查看
          </Button>
          <Popconfirm
            title="确认删除"
            content="确定要删除这条发送记录吗？此操作不可恢复。"
            onOk={() => handleDeleteSentEmail(record.id)}
            disabled={!hasDeletePermission()}
          >
            <Button 
              type="text" 
              size="small" 
              icon={<IconDelete />} 
              status="danger"
              disabled={!hasDeletePermission()}
              title={!hasDeletePermission() ? '无删除权限' : ''}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 已发送邮件详情弹窗
  const renderSentEmailModal = () => (
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
          已发送邮件详情
        </div>
      }
      visible={viewSentModalVisible}
      onCancel={() => setViewSentModalVisible(false)}
      footer={[
        <Button 
          key="close" 
          onClick={() => setViewSentModalVisible(false)}
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
      style={{ width: 800, borderRadius: '8px' }}
      bodyStyle={{ padding: '24px', maxHeight: '600px', overflowY: 'auto' }}
    >
      {currentSentEmail && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              邮件基本信息
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>邮件主题</div>
            <div style={{ fontSize: '14px', color: '#1d2129', fontWeight: 500 }}>{currentSentEmail.subject}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>邮件类型</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color={getEmailTypeColor(currentSentEmail.emailType)}>
                {currentSentEmail.emailType}
              </Tag>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>发送时间</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Space>
                <IconClockCircle style={{ color: '#86909c' }} />
                <span>{currentSentEmail.sendTime}</span>
              </Space>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>操作人</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Space>
                <Avatar size={24} style={{ backgroundColor: '#7466F0' }}>
                  <IconUser />
                </Avatar>
                <span>{currentSentEmail.operator}</span>
              </Space>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>发送状态</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Badge 
                status={currentSentEmail.status === '已完成' ? 'success' : 
                        currentSentEmail.status === '失败' ? 'error' : 
                        currentSentEmail.status === '处理中' ? 'processing' : 'default'}
                text={
                  <span style={{ color: getStatusColor(currentSentEmail.status) }}>
                    {currentSentEmail.status === '失败' && currentSentEmail.failedCount ? 
                      `${currentSentEmail.failedCount}封邮件发送失败` : currentSentEmail.status
                    }
                  </span>
                }
              />
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>收件人数量</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color="blue">{currentSentEmail.recipientCount}</Tag>
            </div>
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>
              收件人列表
              <Button 
                type="text" 
                size="small" 
                style={{ marginLeft: '8px' }}
                onClick={() => handleViewRecipients(currentSentEmail)}
              >
                查看详情
              </Button>
            </div>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #e5e6eb'
            }}>
              {currentSentEmail.recipients.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentSentEmail.recipients.slice(0, 3).map((recipient, index) => (
                    <div 
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e6eb',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        color: '#1d2129',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      {recipient}
                    </div>
                  ))}
                  {currentSentEmail.recipients.length > 3 && (
                    <div
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e6eb',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        color: '#86909c',
                        fontStyle: 'italic'
                      }}
                    >
                      +{currentSentEmail.recipients.length - 3} 更多
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ 
                  fontSize: '14px', 
                  color: '#86909c', 
                  fontStyle: 'italic',
                  padding: '8px 0'
                }}>
                  无收件人
                </div>
              )}
            </div>
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              邮件内容预览
            </div>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '4px',
              border: '1px solid #e5e6eb',
              minHeight: '200px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <div dangerouslySetInnerHTML={{ __html: currentSentEmail.emailContent }} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  // 收件人详情弹窗
  const renderRecipientModal = () => (
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
          收件人详情
        </div>
      }
      visible={recipientModalVisible}
      onCancel={() => setRecipientModalVisible(false)}
      footer={[
        <Button 
          key="close" 
          onClick={() => setRecipientModalVisible(false)}
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
      <Table
        columns={[
          {
            title: '邮箱地址',
            dataIndex: 'email',
            key: 'email',
            width: 200
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 120
          },
          {
            title: '公司',
            dataIndex: 'company',
            key: 'company',
            width: 150
          },
          {
            title: '发送状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (value: string, record: RecipientDetail) => (
              <Space direction="vertical" size="mini">
                <Tag color={value === '成功' ? 'green' : value === '失败' ? 'red' : 'orange'}>
                  {value}
                </Tag>
                {value === '失败' && record.failureReason && (
                  <Tag color="red" style={{ fontSize: '12px' }}>
                    {record.failureReason}
                  </Tag>
                )}
              </Space>
            )
          }
        ]}
        data={currentRecipients}
        rowKey="email"
        pagination={{
          pageSize: 10,
          showTotal: true
        }}
      />
    </Modal>
  );

  // 邮箱配置详情弹窗
  const renderViewModal = () => (
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
          邮箱配置详情
        </div>
      }
      visible={viewModalVisible}
      onCancel={() => {
        setViewModalVisible(false);
        setShowPassword(false);
      }}
      footer={[
        <Button 
          key="close" 
          onClick={() => {
            setViewModalVisible(false);
            setShowPassword(false);
          }}
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
      style={{ width: 600, borderRadius: '8px' }}
      bodyStyle={{ padding: '24px' }}
    >
      {currentConfig && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              基本信息
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>配置名称</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.name}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>配置描述</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.description || '-'}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>发件人名称</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.senderName}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>发件人邮箱</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.senderEmail}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>SMTP服务器</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.smtpServer}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>SMTP端口</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.smtpPort}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>加密方式</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color={currentConfig.encryption === 'none' ? 'gray' : currentConfig.encryption === 'SSL' ? 'blue' : 'green'}>
                {currentConfig.encryption === 'none' ? '无' : currentConfig.encryption}
              </Tag>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>SMTP账号</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.smtpAccount}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>授权码/SMTP密码</div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px', 
              color: '#1d2129' 
            }}>
              <span>{showPassword ? currentConfig.smtpPassword : '********'}</span>
              <Button 
                type="text" 
                size="mini" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  padding: '4px', 
                  minWidth: 'auto',
                  color: '#86909c'
                }}
              >
                {showPassword ? <IconEyeInvisible /> : <IconEye />}
              </Button>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>回复邮箱</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentConfig.replyEmail || '-'}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>是否启用签名</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color={currentConfig.enableSignature ? 'green' : 'gray'}>
                {currentConfig.enableSignature ? '是' : '否'}
              </Tag>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>是否为默认</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color={currentConfig.isDefault ? 'green' : 'gray'}>
                {currentConfig.isDefault ? '是' : '否'}
              </Tag>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
              单次发送数量限制
              <Tooltip content="避免一次性发送过多邮件导致邮箱被封，建议根据邮箱服务商限制合理设置">
                <IconInfoCircle style={{ marginLeft: '4px', color: '#86909c', cursor: 'pointer' }} />
              </Tooltip>
            </div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color="blue">
                {currentConfig.batchSendLimit} 封/次
              </Tag>
            </div>
          </div>
          
          {currentConfig.enableSignature && (
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>签名设置</div>
              <div 
                style={{ 
                  padding: '12px', 
                  border: '1px solid #e5e6eb', 
                  borderRadius: '4px',
                  minHeight: '80px',
                  backgroundColor: '#fafafa'
                }}
                dangerouslySetInnerHTML={{ __html: currentConfig.signature || '' }}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );

  // 邮箱配置表单弹窗
  const renderConfigFormModal = (isEdit: boolean) => (
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
          {isEdit ? '编辑邮箱配置' : '新建邮箱配置'}
        </div>
      }
      visible={isEdit ? editModalVisible : createModalVisible}
      onCancel={() => {
        if (isEdit) setEditModalVisible(false);
        else setCreateModalVisible(false);
        setCurrentConfig(null);
        setTestSuccess(false);
      }}
      footer={[
        <Button 
          key="test" 
          onClick={handleTestConfig}
          style={{ 
            marginRight: 'auto',
            borderColor: '#7466F0',
            color: '#7466F0',
            borderRadius: '4px'
          }}
        >
          测试配置
        </Button>,
        <Button 
          key="cancel" 
          onClick={() => {
            if (isEdit) setEditModalVisible(false);
            else setCreateModalVisible(false);
            setCurrentConfig(null);
            setTestSuccess(false);
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
          key="submit" 
          type="primary" 
          onClick={() => form.submit()}
          style={{ 
            backgroundColor: '#7466F0', 
            borderColor: '#7466F0',
            borderRadius: '4px'
          }}
        >
          确定
        </Button>
      ]}
      style={{ width: 700, borderRadius: '8px' }}
      bodyStyle={{ padding: '24px' }}
    >
      {testSuccess && (
        <div style={{ 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          borderRadius: '4px', 
          padding: '12px 16px', 
          marginBottom: '16px',
          color: '#52c41a',
          display: 'flex',
          alignItems: 'center'
        }}>
          <IconCheck style={{ marginRight: '8px', fontSize: '18px' }} />
          <span style={{ fontWeight: 500 }}>测试通过</span>
        </div>
      )}
      
      <Form
        form={form}
        layout="vertical"
        onSubmit={handleSaveConfig}
        autoComplete="off"
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px',
          maxHeight: '500px',
          overflowY: 'auto',
          paddingRight: '8px'
        }}>
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                配置名称
              </span>
            }
            field="name"
            rules={[
              { required: true, message: '配置名称未填写' },
              { max: 50, message: '配置名称过长' }
            ]}
          >
            <Input 
              placeholder="请输入配置名称" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                配置描述
              </span>
            }
            field="description"
            rules={[{ max: 250, message: '配置描述过长' }]}
          >
            <Input 
              placeholder="请输入配置描述" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                发件人名称
              </span>
            }
            field="senderName"
            rules={[
              { required: true, message: '发件人名称未填写' },
              { max: 50, message: '发件人名称过长' }
            ]}
          >
            <Input 
              placeholder="请输入发件人名称" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                发件人邮箱
              </span>
            }
            field="senderEmail"
            rules={[
              { required: true, message: '发件人邮箱未填写' },
              { type: 'email', message: '发件人邮箱格式不正确' }
            ]}
          >
            <Input 
              placeholder="请输入发件人邮箱" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                SMTP服务器地址
              </span>
            }
            field="smtpServer"
            rules={[{ required: true, message: 'SMTP服务器地址未填写' }]}
          >
            <Input 
              placeholder="请输入SMTP服务器地址" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                SMTP端口
              </span>
            }
            field="smtpPort"
            rules={[
              { required: true, message: 'SMTP端口未填写' },
              { type: 'number', min: 1, max: 65535, message: 'SMTP端口应该为1-65535之间的数字' }
            ]}
          >
            <InputNumber 
              placeholder="请输入SMTP端口" 
              min={1} 
              max={65535}
              style={{ width: '100%', borderRadius: '4px' }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                加密方式
              </span>
            }
            field="encryption"
            rules={[{ required: true, message: '加密方式未选择' }]}
          >
            <Select 
              placeholder="请选择加密方式"
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            >
              <Select.Option value="none">无</Select.Option>
              <Select.Option value="SSL">SSL</Select.Option>
              <Select.Option value="TLS">TLS</Select.Option>
            </Select>
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                SMTP账号
              </span>
            }
            field="smtpAccount"
            rules={[{ required: true, message: 'SMTP账号未填写' }]}
          >
            <Input 
              placeholder="请输入SMTP账号" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                授权码/SMTP密码
              </span>
            }
            field="smtpPassword"
            rules={[{ required: true, message: '授权码/SMTP密码未填写' }]}
          >
            <Input.Password 
              placeholder="请输入授权码/SMTP密码" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <span style={{ 
                fontSize: '14px', 
                color: '#1d2129',
                fontWeight: 500
              }}>
                回复邮箱
              </span>
            }
            field="replyEmail"
            rules={[{ type: 'email', message: '回复邮箱格式不正确' }]}
          >
            <Input 
              placeholder="请输入回复邮箱" 
              style={{ 
                borderRadius: '4px',
                borderColor: '#e5e6eb'
              }}
            />
          </FormItem>
          
          <FormItem
            label={
              <Space>
                <span style={{ 
                  fontSize: '14px', 
                  color: '#1d2129',
                  fontWeight: 500
                }}>
                  单次发送数量限制
                </span>
                <Tooltip content="设置单次邮件发送的最大收件人数量，避免一次性发送过多邮件导致邮箱被封">
                  <Button 
                    type="text" 
                    size="mini" 
                    style={{ 
                      padding: '2px', 
                      minWidth: 'auto',
                      color: '#86909c'
                    }}
                  >
                    <IconInfoCircle />
                  </Button>
                </Tooltip>
              </Space>
            }
            field="batchSendLimit"
            rules={[
              { required: true, message: '单次发送数量限制未填写' },
              { type: 'number', min: 1, max: 1000, message: '单次发送数量限制应该为1-1000之间的整数' }
            ]}
          >
            <InputNumber 
              placeholder="请输入单次发送数量限制" 
              min={1} 
              max={1000}
              precision={0}
              style={{ width: '100%', borderRadius: '4px' }}
            />
          </FormItem>
        </div>
        
        <FormItem
          label={
            <span style={{ 
              fontSize: '14px', 
              color: '#1d2129',
              fontWeight: 500
            }}>
              是否启用签名
            </span>
          }
          field="enableSignature"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>
        
        <Form.Item noStyle shouldUpdate>
          {() => {
            const enableSignature = form.getFieldValue('enableSignature');
            return enableSignature ? (
              <FormItem
                label={
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#1d2129',
                    fontWeight: 500
                  }}>
                    签名设置
                  </span>
                }
                field="signature"
                rules={[{ max: 5000, message: '签名设置过长' }]}
              >
                <Input.TextArea 
                  placeholder="请输入签名内容（支持HTML格式）" 
                  rows={4}
                  style={{ 
                    borderRadius: '4px',
                    borderColor: '#e5e6eb'
                  }}
                />
              </FormItem>
            ) : null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );

  // 测试结果弹窗
  const renderTestResultModal = () => (
    <Modal
      title="测试结果"
      visible={testResultVisible}
      footer={null}
      closable={false}
      style={{ width: 300 }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ 
          fontSize: '48px', 
          color: testSuccess ? '#52c41a' : '#ff4d4f',
          marginBottom: '16px'
        }}>
          {testSuccess ? '✓' : '✗'}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {testSuccess ? '测试成功' : '测试失败'}
        </div>
      </div>
    </Modal>
  );

  // 企微API配置测试结果弹窗
  const renderWechatTestResultModal = () => (
    <Modal
      title="测试结果"
      visible={wechatTestResultVisible}
      footer={null}
      closable={false}
      style={{ width: 300 }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ 
          fontSize: '48px', 
          color: wechatTestSuccess ? '#52c41a' : '#ff4d4f',
          marginBottom: '16px'
        }}>
          {wechatTestSuccess ? '✓' : '✗'}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {wechatTestSuccess ? '测试成功' : '测试失败'}
        </div>
      </div>
    </Modal>
  );

  // 企微API配置表单弹窗
  const renderWechatConfigFormModal = (isEdit: boolean) => (
    <Modal
      title={
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 500, 
          padding: '16px 24px', 
          borderBottom: '1px solid #e5e6eb',
          margin: '-24px -24px 0 -24px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{isEdit ? '编辑企微API配置' : '新建企微API配置'}</span>
          {wechatTestSuccess && (
            <Tag color="green" style={{ marginLeft: '8px' }}>
              测试通过
            </Tag>
          )}
        </div>
      }
      visible={isEdit ? wechatEditModalVisible : wechatCreateModalVisible}
      onCancel={() => {
        if (isEdit) setWechatEditModalVisible(false);
        else setWechatCreateModalVisible(false);
        setCurrentWechatConfig(null);
        setWechatTestSuccess(false);
      }}
      footer={[
        <Button 
          key="test" 
          onClick={handleWechatTestConfig}
          style={{ 
            marginRight: 'auto',
            borderColor: '#7466F0',
            color: '#7466F0',
            borderRadius: '4px'
          }}
        >
          测试配置
        </Button>,
        <Button 
          key="cancel" 
          onClick={() => {
            if (isEdit) setWechatEditModalVisible(false);
            else setWechatCreateModalVisible(false);
            setCurrentWechatConfig(null);
            setWechatTestSuccess(false);
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
          key="confirm" 
          type="primary" 
          onClick={() => handleWechatSaveConfig(wechatForm.getFieldsValue())}
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
      bodyStyle={{ padding: '24px' }}
    >
      <Form
        form={wechatForm}
        layout="vertical"
        style={{ maxHeight: '500px', overflowY: 'auto' }}
      >
        <FormItem
          label={
            <span style={{ 
              fontSize: '14px', 
              color: '#1d2129',
              fontWeight: 500
            }}>
              配置名称
            </span>
          }
          field="name"
          rules={[
            { required: true, message: '配置名称未填写' },
            { max: 50, message: '配置名称过长' }
          ]}
        >
          <Input 
            placeholder="请输入配置名称（1-50字符）" 
            style={{ 
              borderRadius: '4px',
              borderColor: '#e5e6eb'
            }}
            onChange={() => setWechatTestSuccess(false)}
          />
        </FormItem>
        
        <FormItem
          label={
            <span style={{ 
              fontSize: '14px', 
              color: '#1d2129',
              fontWeight: 500
            }}>
              企业ID
            </span>
          }
          field="corpId"
          rules={[
            { max: 250, message: '企业ID过长' }
          ]}
        >
          <Input 
            placeholder="请输入企业ID（≤250字符）" 
            style={{ 
              borderRadius: '4px',
              borderColor: '#e5e6eb'
            }}
            onChange={() => setWechatTestSuccess(false)}
          />
        </FormItem>
        
        <FormItem
          label={
            <span style={{ 
              fontSize: '14px', 
              color: '#1d2129',
              fontWeight: 500
            }}>
              应用ID
            </span>
          }
          field="agentId"
          rules={[
            { required: true, message: '应用ID未填写' },
            { max: 50, message: '应用ID过长' }
          ]}
        >
          <Input 
            placeholder="请输入应用ID（1-50字符）" 
            style={{ 
              borderRadius: '4px',
              borderColor: '#e5e6eb'
            }}
            onChange={() => setWechatTestSuccess(false)}
          />
        </FormItem>
        
        <FormItem
          label={
            <span style={{ 
              fontSize: '14px', 
              color: '#1d2129',
              fontWeight: 500
            }}>
              API密钥
            </span>
          }
          field="secret"
          rules={[
            { required: true, message: 'API密钥未填写' }
          ]}
        >
          <Input.Password 
            placeholder={isEdit ? "如需修改请输入新密钥" : "请输入API密钥"} 
            style={{ 
              borderRadius: '4px',
              borderColor: '#e5e6eb'
            }}
            onChange={() => setWechatTestSuccess(false)}
          />
        </FormItem>
        
        <FormItem
          label={
            <span style={{ 
              fontSize: '14px', 
              color: '#1d2129',
              fontWeight: 500
            }}>
              状态
            </span>
          }
          field="status"
          rules={[
            { required: true, message: '状态未选择' }
          ]}
        >
          <Select 
            placeholder="请选择状态"
            style={{ 
              borderRadius: '4px',
              borderColor: '#e5e6eb'
            }}
            onChange={() => setWechatTestSuccess(false)}
          >
            <Select.Option value="启用">启用</Select.Option>
            <Select.Option value="禁用">禁用</Select.Option>
          </Select>
        </FormItem>
        
        <FormItem
          label={
            <span style={{ 
              fontSize: '14px', 
              color: '#1d2129',
              fontWeight: 500
            }}>
              备注
            </span>
          }
          field="remark"
        >
          <Input.TextArea 
            placeholder="请输入备注信息" 
            rows={3}
            style={{ 
              borderRadius: '4px',
              borderColor: '#e5e6eb'
            }}
          />
        </FormItem>
      </Form>
    </Modal>
  );

  // 企微API配置详情弹窗
  const renderWechatViewModal = () => (
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
          企微API配置详情
        </div>
      }
      visible={wechatViewModalVisible}
      onCancel={() => {
        setWechatViewModalVisible(false);
        setShowWechatSecret(false);
      }}
      footer={[
        <Button 
          key="close" 
          onClick={() => {
            setWechatViewModalVisible(false);
            setShowWechatSecret(false);
          }}
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
      style={{ width: 600, borderRadius: '8px' }}
      bodyStyle={{ padding: '24px' }}
    >
      {currentWechatConfig && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              基本信息
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>配置名称</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentWechatConfig.name}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>企业ID</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentWechatConfig.corpId}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>应用ID</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentWechatConfig.agentId}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
              API密钥
              <Tooltip content="点击查看密钥">
                <Button 
                  type="text" 
                  size="mini" 
                  icon={showWechatSecret ? <IconEyeInvisible /> : <IconEye />}
                  onClick={() => setShowWechatSecret(!showWechatSecret)}
                  style={{ marginLeft: '4px' }}
                />
              </Tooltip>
            </div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              {showWechatSecret ? currentWechatConfig.secret : '********'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>状态</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color={currentWechatConfig.status === '启用' ? 'green' : 'gray'}>
                {currentWechatConfig.status}
              </Tag>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>是否默认</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>
              <Tag color={currentWechatConfig.isDefault ? 'green' : 'gray'}>
                {currentWechatConfig.isDefault ? '是' : '否'}
              </Tag>
            </div>
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>备注</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentWechatConfig.remark || '-'}</div>
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0',
              marginTop: '16px'
            }}>
              时间信息
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>创建时间</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentWechatConfig.createdAt}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>更新时间</div>
            <div style={{ fontSize: '14px', color: '#1d2129' }}>{currentWechatConfig.updatedAt}</div>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane key="notification-subscription" title="通知/订阅设置">
            <NotificationSubscriptionSettings />
          </TabPane>
          <TabPane key="template-settings" title="通知模板设置">
            <NotificationTemplateSettings />
          </TabPane>
          <TabPane key="email-config" title="邮箱配置">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="配置名称"
                  style={{ width: 180 }}
                  onChange={(value) => handleFilterChange('name', value)}
                />
                <Input
                  placeholder="配置描述"
                  style={{ width: 180 }}
                  onChange={(value) => handleFilterChange('description', value)}
                />
                <Input
                  placeholder="发件人名称"
                  style={{ width: 180 }}
                  onChange={(value) => handleFilterChange('senderName', value)}
                />
                <Input
                  placeholder="发件人邮箱"
                  style={{ width: 180 }}
                  onChange={(value) => handleFilterChange('senderEmail', value)}
                />
                <Input
                  placeholder="SMTP服务器"
                  style={{ width: 180 }}
                  onChange={(value) => handleFilterChange('smtpServer', value)}
                />
                <Button type="outline" onClick={handleResetFilters}>
                  重置
                </Button>
              </div>
              <Button type="primary" onClick={handleCreate}>
                新建
              </Button>
            </div>
            <Table
              columns={emailConfigColumns}
              data={filteredEmailConfigs}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: true,
                showJumper: true
              }}
            />
          </TabPane>
          
          <TabPane key="wechat-config" title="企微API配置">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="配置名称"
                  style={{ width: 180 }}
                  onChange={(value) => handleWechatFilterChange('name', value)}
                />
                <Input
                  placeholder="企业ID"
                  style={{ width: 180 }}
                  onChange={(value) => handleWechatFilterChange('corpId', value)}
                />
                <Input
                  placeholder="应用ID"
                  style={{ width: 180 }}
                  onChange={(value) => handleWechatFilterChange('agentId', value)}
                />
                <Select
                  placeholder="状态"
                  style={{ width: 120 }}
                  allowClear
                  onChange={(value) => handleWechatFilterChange('status', value)}
                >
                  <Select.Option value="启用">启用</Select.Option>
                  <Select.Option value="禁用">禁用</Select.Option>
                </Select>
                <Input
                  placeholder="备注"
                  style={{ width: 180 }}
                  onChange={(value) => handleWechatFilterChange('remark', value)}
                />
                <Button type="outline" onClick={handleWechatResetFilters}>
                  重置
                </Button>
              </div>
              <Button type="primary" onClick={handleWechatCreate}>
                新建
              </Button>
            </div>
            <Table
              columns={wechatConfigColumns}
              data={filteredWechatConfigs}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: true,
                showJumper: true
              }}
            />
          </TabPane>
          
          <TabPane key="sent" title="已发邮件">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="邮件主题"
                  style={{ width: 180 }}
                  onChange={(value) => handleSentEmailFilterChange('subject', value)}
                />
                <Input
                  placeholder="收件人"
                  style={{ width: 180 }}
                  onChange={(value) => handleSentEmailFilterChange('recipients', value)}
                />
                <Input
                  placeholder="操作人"
                  style={{ width: 150 }}
                  onChange={(value) => handleSentEmailFilterChange('operator', value)}
                />
                <Select
                  placeholder="发送状态"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) => handleSentEmailFilterChange('status', value)}
                >
                  <Select.Option value="处理中">处理中</Select.Option>
                  <Select.Option value="已完成">已完成</Select.Option>
                  <Select.Option value="失败">失败</Select.Option>
                  <Select.Option value="退回">退回</Select.Option>
                </Select>
                <Select
                  placeholder="邮件类型"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) => handleSentEmailFilterChange('emailType', value)}
                >
                  <Select.Option value="运价推广">运价推广</Select.Option>
                  <Select.Option value="开发信">开发信</Select.Option>
                  <Select.Option value="系统通知">系统通知</Select.Option>
                </Select>
                <Button type="outline" onClick={handleResetSentEmailFilters}>
                  重置
                </Button>
              </div>
              <div style={{ fontSize: '14px', color: '#86909c' }}>
                共 {filteredSentEmails.length} 条记录
              </div>
            </div>
            <Table
              columns={sentEmailColumns}
              data={filteredSentEmails}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: true,
                showJumper: true,
                showSizeChanger: true
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 弹窗组件 */}
      {renderViewModal()}
      {renderConfigFormModal(false)}
      {renderConfigFormModal(true)}
      {renderTestResultModal()}
      {renderSentEmailModal()}
      {renderRecipientModal()}
      {renderWechatTestResultModal()}
      {renderWechatViewModal()}
      {renderWechatConfigFormModal(false)}
      {renderWechatConfigFormModal(true)}
    </div>
  );
};

export default AlertCenter;