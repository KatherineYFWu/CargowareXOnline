import React, { useState } from 'react';
import { 
  Card, 
  Space, 
  Button, 
  Modal, 
  Tabs, 
  Switch, 
  Typography,
  Message,
  Tooltip,
  Input,
  Form,
  Select,
  Pagination,
  Cascader
} from '@arco-design/web-react';
import { IconSettings, IconCopy, IconPaste, IconPlus, IconEdit, IconSearch, IconDelete, IconExclamationCircleFill } from '@arco-design/web-react/icon';
import { useTemplateContext } from '../../../contexts/TemplateContext';

const { Text } = Typography;
const { TabPane } = Tabs;

// 数据类型定义
interface Role {
  id: string;
  name: string;
  description?: string;
}



interface SubscriptionSetting {
  operationId: string;
  emailEnabled: boolean;
  wechatEnabled: boolean;
  smsEnabled: boolean;
  editable: boolean;
}

interface PermissionSetting {
  roleId: string;
  operationId: string;
  receiverRoleId?: string;
  emailEnabled: boolean;
  wechatEnabled: boolean;
  smsEnabled: boolean;
  configurable: boolean;
}

// 操作管理数据类型定义
interface OperationManagement {
  id: string;
  name: string;
  source: string;
  status: '启用' | '停用';
  creator: string;
  lastUpdated: string;
  remark?: string;
  variables: Record<string, string>;
}

// 模拟角色数据
const mockRoles: Role[] = [
  { id: '1', name: '销售' },
  { id: '2', name: '商务' },
  { id: '3', name: '营销' },
  { id: '4', name: '运营' },
  { id: '5', name: '客服' },
  { id: '6', name: '询价人' },
];



// 生成初始的权限设置数据
const generateInitialPermissionSettings = (): PermissionSetting[] => {
  const settings: PermissionSetting[] = [];
  const operationIds = ['OP001', 'OP002', 'OP003', 'OP004', 'OP005', 'OP006', 'OP007', 'OP008', 'OP009', 'OP010'];
  
  // 为每个角色生成设置
  mockRoles.forEach(role => {
    operationIds.forEach(opId => {
      // 为每个操作添加总开关(没有receiverRoleId)
      // 这个开关控制该角色的该操作是否启用通知功能
      settings.push({
        roleId: role.id,
        operationId: opId,
        emailEnabled: true, // 默认启用
        wechatEnabled: true, // 默认启用
        smsEnabled: false, // 默认不启用短信
        configurable: true
      });
      
      // 为每个操作添加订阅角色设置
      mockRoles.forEach(receiverRole => {
        // 默认规则: 
        // 1. 销售的提交询价/提交报价操作默认通知商务
        // 2. 商务的提交询价操作默认通知销售
        // 3. 运营的发货通知默认通知所有角色
        const isDefaultEnabled = 
          (role.id === '1' && opId === 'OP001' && receiverRole.id === '2') || // 销售提交询价→商务
          (role.id === '1' && opId === 'OP004' && receiverRole.id === '2') || // 销售提交报价→商务
          (role.id === '2' && opId === 'OP001' && receiverRole.id === '1') || // 商务提交询价→销售
          (role.id === '4' && opId === 'OP009');                               // 运营发货通知→所有人
        
        settings.push({
          roleId: role.id,
          operationId: opId,
          receiverRoleId: receiverRole.id,
          emailEnabled: isDefaultEnabled,
          wechatEnabled: isDefaultEnabled,
          smsEnabled: false,
          configurable: true
        });
      });
    });
  });
  
  return settings;
};

// 生成初始的订阅设置数据
const generateInitialSubscriptionSettings = (permissionSettings: PermissionSetting[]): SubscriptionSetting[] => {
  const settings: SubscriptionSetting[] = [];
  const operationIds = ['OP001', 'OP002', 'OP003', 'OP004', 'OP005', 'OP006', 'OP007', 'OP008', 'OP009', 'OP010'];
  
  // 假设当前用户是商务(roleId='2')
  const currentUserRoleId = '2';
  
  operationIds.forEach(opId => {
    // 检查是否有任何角色的该操作向当前用户角色发送通知
    const hasEmailEnabled = permissionSettings.some(
      setting => setting.operationId === opId && 
                 setting.receiverRoleId === currentUserRoleId && 
                 setting.emailEnabled
    );
    const hasWechatEnabled = permissionSettings.some(
      setting => setting.operationId === opId && 
                 setting.receiverRoleId === currentUserRoleId && 
                 setting.wechatEnabled
    );
    const hasSmsEnabled = permissionSettings.some(
      setting => setting.operationId === opId && 
                 setting.receiverRoleId === currentUserRoleId && 
                 setting.smsEnabled
    );
    
    settings.push({
      operationId: opId,
      emailEnabled: hasEmailEnabled, 
      wechatEnabled: hasWechatEnabled,
      smsEnabled: hasSmsEnabled, 
      editable: !(hasEmailEnabled || hasWechatEnabled || hasSmsEnabled) // 如果全局设置中有启用,则不可编辑
    });
  });
  
  return settings;
};

// 权限设置模拟数据
const mockPermissionSettings: PermissionSetting[] = generateInitialPermissionSettings();

// 订阅设置模拟数据
const mockSubscriptionSettings: SubscriptionSetting[] = generateInitialSubscriptionSettings(mockPermissionSettings);

// 操作点三级数据结构 - 用于级联选择器
interface OperationPoint {
  value: string;
  label: string;
  children?: OperationPoint[];
}

const mockOperationPointsData: OperationPoint[] = [
  {
    value: 'super-freight',
    label: '超级运价',
    children: [
      {
        value: 'inquiry-quote',
        label: '询价报价',
        children: [
          { value: 'add-inquiry', label: '新增询价' },
          { value: 'add-quote', label: '新增报价' },
          { value: 'edit-inquiry', label: '编辑询价' },
          { value: 'edit-quote', label: '编辑报价' }
        ]
      },
      {
        value: 'freight-management',
        label: '运价管理',
        children: [
          { value: 'create-freight', label: '创建运价' },
          { value: 'update-freight', label: '更新运价' },
          { value: 'delete-freight', label: '删除运价' }
        ]
      }
    ]
  },
  {
    value: 'quote-management',
    label: '报价管理',
    children: [
      {
        value: 'quote-operations',
        label: '报价操作',
        children: [
          { value: 'submit-quote', label: '提交报价' },
          { value: 'modify-quote', label: '更改报价' },
          { value: 'withdraw-quote', label: '撤回报价' }
        ]
      },
      {
        value: 'quote-review',
        label: '报价审核',
        children: [
          { value: 'approve-quote', label: '审核通过' },
          { value: 'reject-quote', label: '审核驳回' }
        ]
      }
    ]
  },
  {
    value: 'order-system',
    label: '订单管理',
    children: [
      {
        value: 'order-ops',
        label: '订单操作',
        children: [
          { value: 'order-create', label: '创建' },
          { value: 'order-modify', label: '修改' },
          { value: 'order-delete', label: '删除' },
          { value: 'order-confirm', label: '确认' },
          { value: 'order-cancel', label: '取消' }
        ]
      },
      {
        value: 'order-tracking',
        label: '订单跟踪',
        children: [
          { value: 'track-status', label: '状态更新' },
          { value: 'track-logistics', label: '物流更新' }
        ]
      }
    ]
  },
  {
    value: 'customer-management',
    label: '客户管理',
    children: [
      {
        value: 'customer-info',
        label: '客户信息',
        children: [
          { value: 'add-customer', label: '新增客户' },
          { value: 'edit-customer', label: '编辑客户' },
          { value: 'delete-customer', label: '删除客户' }
        ]
      }
    ]
  },
  {
    value: 'finance-management',
    label: '财务管理',
    children: [
      {
        value: 'invoice-ops',
        label: '发票操作',
        children: [
          { value: 'create-invoice', label: '开具发票' },
          { value: 'void-invoice', label: '作废发票' }
        ]
      },
      {
        value: 'payment-ops',
        label: '付款操作',
        children: [
          { value: 'confirm-payment', label: '确认付款' },
          { value: 'refund-payment', label: '退款' }
        ]
      }
    ]
  }
];

// 可用变量列表数据 - 用于多选选择器
interface Variable {
  name: string;
  type: string;
}

const mockAvailableVariables: Variable[] = [
  { name: '操作人姓名', type: 'string' },
  { name: '操作人邮箱', type: 'string' },
  { name: '操作时间', type: 'datetime' },
  { name: '询价单编号', type: 'string' },
  { name: '询价客户', type: 'string' },
  { name: '报价单编号', type: 'string' },
  { name: '报价金额', type: 'float' },
  { name: '订单编号', type: 'string' },
  { name: '订单金额', type: 'float' },
  { name: '修改内容', type: 'string' },
  { name: '撤回原因', type: 'string' },
  { name: '取消原因', type: 'string' },
  { name: '原报价金额', type: 'float' },
  { name: '新报价金额', type: 'float' },
  { name: '客户名称', type: 'string' },
  { name: '联系人', type: 'string' },
  { name: '联系电话', type: 'string' }
];

// 操作管理模拟数据
const mockOperationManagement: OperationManagement[] = [
  {
    id: 'OP001',
    name: '提交询价',
    source: '超级运价/询价报价/新增询价',
    status: '启用',
    creator: 'admin',
    lastUpdated: '2024-01-15 10:30:00',
    remark: '客户提交询价单操作',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string", 
      "操作时间": "datetime",
      "询价单编号": "string",
      "询价客户": "string"
    }
  },
  {
    id: 'OP002',
    name: '更改询价',
    source: '超级运价/询价报价/新增报价',
    status: '启用',
    creator: 'admin',
    lastUpdated: '2024-01-14 14:20:00',
    remark: '修改已提交的询价单',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "询价单编号": "string",
      "修改内容": "string"
    }
  },
  {
    id: 'OP003',
    name: '撤回询价',
    source: '超级运价/询价报价/修改询价',
    status: '停用',
    creator: 'admin',
    lastUpdated: '2024-01-13 09:15:00',
    remark: '客户撤回已提交的询价单',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "询价单编号": "string",
      "撤回原因": "string"
    }
  },
  {
    id: 'OP004',
    name: '提交报价',
    source: '超级运价/询价报价/修改询价',
    status: '启用',
    creator: 'sales',
    lastUpdated: '2024-01-12 16:45:00',
    remark: '销售提交报价给客户',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "报价单编号": "string",
      "报价金额": "float"
    }
  },
  {
    id: 'OP005',
    name: '更改报价',
    source: '超级运价/询价报价/撤回询价',
    status: '启用',
    creator: 'sales',
    lastUpdated: '2024-01-11 11:20:00',
    remark: '修改已提交的报价单',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "报价单编号": "string",
      "原报价金额": "float",
      "新报价金额": "float"
    }
  },
  {
    id: 'OP006',
    name: '撤回报价',
    source: '超级运价/询价报价/撤回报价',
    status: '停用',
    creator: 'sales',
    lastUpdated: '2024-01-10 08:30:00',
    remark: '销售撤回已提交的报价',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "报价单编号": "string",
      "撤回原因": "string"
    }
  },
  {
    id: 'OP007',
    name: '确认订单',
    source: '超级运价/运价管理/创建运价',
    status: '启用',
    creator: 'customer',
    lastUpdated: '2024-01-09 15:10:00',
    remark: '客户确认报价并生成订单',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "订单编号": "string",
      "订单金额": "float"
    }
  },
  {
    id: 'OP008',
    name: '取消订单',
    source: '超级运价/运价管理/更新运价',
    status: '启用',
    creator: 'customer',
    lastUpdated: '2024-01-08 13:25:00',
    remark: '客户取消已确认的订单',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "订单编号": "string",
      "取消原因": "string"
    }
  },
];

const NotificationSubscriptionSettings: React.FC = () => {
  const { hasTemplates } = useTemplateContext();
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [copiedSettings, setCopiedSettings] = useState<PermissionSetting[]>([]);
  
  // 操作管理状态
  const [operationModalVisible, setOperationModalVisible] = useState(false);
  const [operationEditModalVisible, setOperationEditModalVisible] = useState(false);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false);
  const [operationToDelete, setOperationToDelete] = useState<OperationManagement | null>(null);
  const [operations, setOperations] = useState<OperationManagement[]>(mockOperationManagement);
  const [filteredOperations, setFilteredOperations] = useState<OperationManagement[]>(mockOperationManagement);
  // Separate state for filter inputs (not applied until search is clicked)
  const [filterInputs, setFilterInputs] = useState({
    id: '',
    source: '',
    status: '',
    creator: ''
  });
  // Applied filters state
  const [filters, setFilters] = useState({
    id: '',
    source: '',
    status: '',
    creator: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingOperation, setEditingOperation] = useState<OperationManagement | null>(null);
  const [isAdmin] = useState(true); // 模拟管理员权限
  
  // 操作编辑表单错误状态
  const [operationFormErrors, setOperationFormErrors] = useState<Record<string, string>>({});
  
  // 级联选择器值状态 - 存储选中的路径数组
  const [cascaderValue, setCascaderValue] = useState<string[]>([]);
  
  // 变量选择器值状态 - 存储选中的变量名数组
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  
  // 订阅设置状态
  const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSetting[]>(mockSubscriptionSettings);
  
  // 权限设置状态
  const [permissionSettings, setPermissionSettings] = useState<PermissionSetting[]>(mockPermissionSettings);
  

  
  // 搜索状态 - 输入框的值
  const [roleSearchInput, setRoleSearchInput] = useState('');
  const [operationSearchInput, setOperationSearchInput] = useState('');
  const [subscriberSearchInput, setSubscriberSearchInput] = useState('');
  
  // 搜索状态 - 实际用于过滤的值
  const [roleSearchText, setRoleSearchText] = useState('');
  const [operationSearchText, setOperationSearchText] = useState('');
  const [subscriberSearchText, setSubscriberSearchText] = useState('');
  
  // 主内容区域的选择状态
  const [localSelectedRole, setLocalSelectedRole] = useState<string | null>(null);
  const [localSelectedOperation, setLocalSelectedOperation] = useState<string | null>(null);
  
  // 权限模态框的选择状态
  const [modalSelectedRole, setModalSelectedRole] = useState<string | null>(null);
  const [modalSelectedOperation, setModalSelectedOperation] = useState<string | null>(null);

  // 通知配置管理弹窗状态
  const [notificationConfigModalVisible, setNotificationConfigModalVisible] = useState(false);
  const [notificationConfigActiveTab, setNotificationConfigActiveTab] = useState('email');
  
  // 邮箱配置状态
  const [emailConfig, setEmailConfig] = useState({
    configName: '消息通知邮箱',
    configDescription: '',
    senderName: '',
    senderEmail: 'notifications@company.com',
    replyEmail: '', // 回复邮箱字段
    smtpServer: 'smtp.notice.example.com',
    port: 587,
    securityProtocol: 'SSL',
    smtpAccount: 'notify_user',
    password: '********',
    isDefault: false
  });
  
  // 企微配置状态
  const [wechatConfig, setWechatConfig] = useState({
    configName: '通知企微配置',
    corpId: 'ww1234567890abcdef',
    agentId: '1000001',
    apiSecret: '********',
    status: '启用',
    isDefault: true,
    remark: '用于系统通知推送'
  });


  // 级联选择器值转换函数
  // 将选中的路径数组转换为显示字符串（用"-"连接）
  const formatCascaderValue = (values: string[], options: OperationPoint[]): string => {
    if (!values || values.length === 0) return '';
    
    const labels: string[] = [];
    let currentOptions = options;
    
    for (const value of values) {
      const option = currentOptions.find(opt => opt.value === value);
      if (option) {
        labels.push(option.label);
        currentOptions = option.children || [];
      }
    }
    
    return labels.join('-');
  };
  
  // 将显示字符串解析为级联选择器值数组
  const parseCascaderValue = (displayValue: string, options: OperationPoint[]): string[] => {
    if (!displayValue) return [];
    
    const labels = displayValue.split('-');
    const values: string[] = [];
    let currentOptions = options;
    
    for (const label of labels) {
      const option = currentOptions.find(opt => opt.label === label);
      if (option) {
        values.push(option.value);
        currentOptions = option.children || [];
      }
    }
    
    return values;
  };

  // 将变量数组转换为Record格式（用于保存）
  const variablesToRecord = (variables: string[]): Record<string, string> => {
    const record: Record<string, string> = {};
    variables.forEach(varName => {
      const variable = mockAvailableVariables.find(v => v.name === varName);
      if (variable) {
        record[varName] = variable.type;
      }
    });
    return record;
  };

  // 将Record格式转换为变量数组（用于表单回显）
  const recordToVariables = (record: Record<string, string>): string[] => {
    return Object.keys(record);
  };

  // 处理订阅设置切换
  const handleSubscriptionToggle = (operationId: string, enabled: boolean, type: 'email' | 'wechat' | 'sms') => {
    const setting = subscriptionSettings.find(s => s.operationId === operationId);
    
    // 如果要开启开关，检查是否有模板
    if (enabled && !hasTemplates(operationId, type)) {
      Message.warning('该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板');
      return;
    }
    
    if (setting && setting.editable) {
      setSubscriptionSettings(prev => 
        prev.map(s => {
          if (s.operationId === operationId) {
            const newSetting = { ...s };
            if (type === 'email') newSetting.emailEnabled = enabled;
            else if (type === 'wechat') newSetting.wechatEnabled = enabled;
            else if (type === 'sms') newSetting.smsEnabled = enabled;
            return newSetting;
          }
          return s;
        })
      );
      Message.success('订阅设置已更新');
    }
  };

  // 处理权限设置切换
  const handlePermissionToggle = (setting: PermissionSetting, field: 'emailEnabled' | 'wechatEnabled' | 'smsEnabled' | 'configurable', value: boolean) => {
    setPermissionSettings(prev => 
      prev.map(s => {
        if (s.roleId === setting.roleId && 
            s.operationId === setting.operationId && 
            s.receiverRoleId === setting.receiverRoleId) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };



  // 复制设置
  const handleCopySettings = () => {
    setCopiedSettings([...permissionSettings]);
    Message.success('设置已复制');
  };

  // 粘贴设置
  const handlePasteSettings = (targetRoleId: string) => {
    if (copiedSettings.length === 0) {
      Message.warning('请先复制设置');
      return;
    }

    const newSettings = permissionSettings.map(setting => {
      if (setting.roleId === targetRoleId) {
        const copiedSetting = copiedSettings.find(
          s => s.operationId === setting.operationId && s.receiverRoleId === setting.receiverRoleId
        );
        if (copiedSetting) {
          return { 
            ...setting, 
            emailEnabled: copiedSetting.emailEnabled, 
            wechatEnabled: copiedSetting.wechatEnabled,
            smsEnabled: copiedSetting.smsEnabled,
            configurable: copiedSetting.configurable 
          };
        }
      }
      return setting;
    });

    setPermissionSettings(newSettings);
    Message.success('设置已粘贴');
  };

  // 操作管理相关函数

  // Apply filters when search button is clicked
  const handleSearchFilters = () => {
    setFilters(filterInputs);
    const filtered = operations.filter(operation => {
      return (
        (!filterInputs.id || operation.id.toLowerCase().includes(filterInputs.id.toLowerCase())) &&
        (!filterInputs.source || operation.source.toLowerCase().includes(filterInputs.source.toLowerCase())) &&
        (!filterInputs.status || operation.status === filterInputs.status) &&
        (!filterInputs.creator || operation.creator.toLowerCase().includes(filterInputs.creator.toLowerCase()))
      );
    });
    setFilteredOperations(filtered);
    setCurrentPage(1);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilterInputs({
      id: '',
      source: '',
      status: '',
      creator: ''
    });
    setFilters({
      id: '',
      source: '',
      status: '',
      creator: ''
    });
    setFilteredOperations(operations);
    setCurrentPage(1);
  };

  // 切换操作状态
  const handleToggleOperationStatus = (operation: OperationManagement) => {
    const newStatus: '启用' | '停用' = operation.status === '启用' ? '停用' : '启用';
    
    const updatedOperations = operations.map(op => 
      op.id === operation.id ? { ...op, status: newStatus } : op
    );
    setOperations(updatedOperations);
    setFilteredOperations(updatedOperations);
    
    Message.success(`操作${newStatus}`);
  };

  // 删除操作
  const handleDeleteOperation = (operation: OperationManagement) => {
    // 检查是否是最后一个操作
    if (operations.length === 1) {
      Message.error('无法删除最后一个操作');
      return;
    }
    
    // 显示确认对话框
    setOperationToDelete(operation);
    setDeleteConfirmModalVisible(true);
  };

  // 确认删除操作
  const handleConfirmDelete = () => {
    if (!operationToDelete) return;
    
    const updatedOperations = operations.filter(op => op.id !== operationToDelete.id);
    setOperations(updatedOperations);
    setFilteredOperations(updatedOperations.filter(operation => {
      return (
        (!filters.id || operation.id.toLowerCase().includes(filters.id.toLowerCase())) &&
        (!filters.source || operation.source.toLowerCase().includes(filters.source.toLowerCase())) &&
        (!filters.status || operation.status === filters.status) &&
        (!filters.creator || operation.creator.toLowerCase().includes(filters.creator.toLowerCase()))
      );
    }));
    
    Message.success('操作删除成功');
    setDeleteConfirmModalVisible(false);
    setOperationToDelete(null);
  };

  // 取消删除操作
  const handleCancelDelete = () => {
    setDeleteConfirmModalVisible(false);
    setOperationToDelete(null);
  };

  // 新建操作
  const handleCreateOperation = (values: any) => {
    const newOperation: OperationManagement = {
      id: `OP${String(operations.length + 1).padStart(3, '0')}`,
      name: '', // 操作名称字段已移除，设为空字符串
      source: values.source,
      status: values.status as '启用' | '停用',
      creator: 'admin',
      lastUpdated: new Date().toLocaleString('zh-CN'),
      remark: values.remark,
      variables: values.variables || {}
    };
    
    const finalOperations = [...operations, newOperation];
    setOperations(finalOperations);
    setFilteredOperations(finalOperations);
    
    // 关闭弹窗并重置所有状态
    setOperationEditModalVisible(false);
    setEditingOperation(null);
    setCascaderValue([]);
    setSelectedVariables([]);
    setOperationFormErrors({});
    
    // 显示详细的成功提示
    const variableCount = Object.keys(values.variables || {}).length;
    Message.success(`操作创建成功！操作来源：${values.source}，已关联${variableCount}个变量`);
  };

  // 编辑操作
  const handleEditOperation = (values: any) => {
    if (!editingOperation) return;
    
    const updatedOperations = operations.map(op => {
      if (op.id === editingOperation.id) {
        return {
          ...op,
          source: values.source,
          status: values.status as '启用' | '停用',
          remark: values.remark,
          variables: values.variables || {},
          lastUpdated: new Date().toLocaleString('zh-CN')
        };
      }
      return op;
    });
    
    setOperations(updatedOperations);
    setFilteredOperations(updatedOperations);
    
    // 关闭弹窗并重置所有状态
    setOperationEditModalVisible(false);
    setEditingOperation(null);
    setCascaderValue([]);
    setSelectedVariables([]);
    setOperationFormErrors({});
    
    // 显示详细的成功提示
    const variableCount = Object.keys(values.variables || {}).length;
    Message.success(`操作编辑成功！操作来源：${values.source}，已关联${variableCount}个变量`);
  };

  // 表单校验
  const validateForm = (values: any, isEdit: boolean = false): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // 1. 字段类型校验
    if (values.source && typeof values.source !== 'string') {
      errors.source = '操作来源应该为字符串类型';
    }
    
    if (values.status && typeof values.status !== 'string') {
      errors.status = '操作状态应该为字符串类型';
    }
    
    if (values.variables && typeof values.variables !== 'object') {
      errors.variables = '关联变量应该为对象类型';
    }
    
    if (values.remark && values.remark !== undefined && typeof values.remark !== 'string') {
      errors.remark = '备注应该为字符串类型';
    }
    
    // 2. 必填字段校验（只有在字段类型正确时才检查）
    if (typeof values.source === 'string' && (!values.source || values.source.trim() === '')) {
      errors.source = '请选择操作来源';
    }
    
    if (typeof values.status === 'string' && (!values.status || values.status.trim() === '')) {
      errors.status = '请选择操作状态';
    }
    
    // 支持新的变量数组格式和旧的Record格式
    if (typeof values.variables === 'object') {
      if (!values.variables || Object.keys(values.variables).length === 0) {
        errors.variables = '请至少选择一个关联变量';
      }
    } else {
      errors.variables = '请至少选择一个关联变量';
    }
    
    // 3. 字段长度校验（只有在字段类型正确且不为空时才检查）
    if (typeof values.source === 'string' && values.source && values.source.length > 500) {
      errors.source = '操作来源不能超过500个字符';
    }
    
    if (typeof values.remark === 'string' && values.remark && values.remark.length > 5000) {
      errors.remark = '备注不能超过5000个字符';
    }
    
    return errors;
  };



  // 渲染订阅设置 - 重新设计支持多触达方式
  const renderSubscriptionSettings = () => {
    // 触达方式列表
    const deliveryMethods = ['邮件', '企微', '短信'];
    
    // 获取启用的操作列表
    const enabledOperations = operations.filter(op => op.status === '启用');
    
    // 处理全选/反选
    const handleSelectAllForMethod = (selectAll: boolean, methodName: string) => {
      enabledOperations.forEach(operation => {
        const subscription = subscriptionSettings.find(s => s.operationId === operation.id);
        if (subscription && subscription.editable) {
          let type: 'email' | 'wechat' | 'sms' = 'email';
          if (methodName === '邮件') type = 'email';
          else if (methodName === '企微') type = 'wechat';
          else if (methodName === '短信') type = 'sms';
          
          handleSubscriptionToggle(operation.id, selectAll, type);
        }
      });
    };
    
    return (
      <div style={{ 
        border: '1px solid #e5e6eb', 
        borderRadius: '8px', 
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f7f8fa', 
                  borderBottom: '1px solid #e5e6eb',
                  fontWeight: 500,
                  textAlign: 'left',
                  position: 'sticky',
                  left: 0,
                  zIndex: 2
                }}>
                  操作名称
                </th>
                {deliveryMethods.map((methodName) => (
                  <th key={methodName} style={{ 
                    padding: '12px 16px', 
                    backgroundColor: '#f7f8fa', 
                    borderBottom: '1px solid #e5e6eb',
                    fontWeight: 500,
                    textAlign: 'center',
                    minWidth: '120px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                      <span>{methodName}</span>
                      <Space size="mini">
                        <Button 
                          size="mini" 
                          onClick={() => handleSelectAllForMethod(true, methodName)}
                        >
                          全选
                        </Button>
                        <Button 
                          size="mini" 
                          onClick={() => handleSelectAllForMethod(false, methodName)}
                        >
                          反选
                        </Button>
                      </Space>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enabledOperations.map(operation => {
                const subscription = subscriptionSettings.find(s => s.operationId === operation.id);
                
                return (
                  <tr key={operation.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ 
                      padding: '12px 16px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: 'white',
                      zIndex: 1
                    }}>
                      <Text>{operation.name}</Text>
                    </td>
                    {deliveryMethods.map((methodName) => {
                      let type: 'email' | 'wechat' | 'sms' = 'email';
                      if (methodName === '邮件') type = 'email';
                      else if (methodName === '企微') type = 'wechat';
                      else if (methodName === '短信') type = 'sms';
                      
                      const hasTemplate = hasTemplates(operation.id, type);
                      
                      let isEnabled = false;
                      if (type === 'email') isEnabled = subscription?.emailEnabled || false;
                      else if (type === 'wechat') isEnabled = subscription?.wechatEnabled || false;
                      else if (type === 'sms') isEnabled = subscription?.smsEnabled || false;
                      
                      // 如果没有模板，显示禁用的开关和提示
                      if (!hasTemplate) {
                        return (
                          <td key={methodName} style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <Tooltip content="该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板">
                              <span style={{ display: 'inline-block', cursor: 'not-allowed' }}>
                                <Switch
                                  checked={false}
                                  disabled={true}
                                  style={{ pointerEvents: 'none' }}
                                />
                              </span>
                            </Tooltip>
                          </td>
                        );
                      }
                      
                      // 有模板的正常开关
                      return (
                        <td key={methodName} style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <Switch
                            checked={isEnabled}
                            disabled={!subscription?.editable}
                            onChange={(checked) => handleSubscriptionToggle(operation.id, checked, type)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染权限范围设置弹窗 - 重新设计
  const renderPermissionModal = () => {
    // 过滤后的角色列表
    const filteredRoles = mockRoles.filter(role => 
      role.name.toLowerCase().includes(roleSearchText.toLowerCase())
    );
    
    // 过滤后的操作列表
    const filteredOperationsList = operations.filter(op => 
      op.status === '启用' && op.name.toLowerCase().includes(operationSearchText.toLowerCase())
    );
    
    // 过滤后的订阅角色列表
    const filteredSubscribers = mockRoles.filter(role => 
      role.name.toLowerCase().includes(subscriberSearchText.toLowerCase())
    );

    return (
      <Modal
        title="全局通知订阅管理"
        visible={permissionModalVisible}
        onCancel={() => {
          setPermissionModalVisible(false);
          setRoleSearchText('');
          setOperationSearchText('');
          setSubscriberSearchText('');
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setPermissionModalVisible(false);
            setRoleSearchText('');
            setOperationSearchText('');
            setSubscriberSearchText('');
          }}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={() => {
            setPermissionModalVisible(false);
            setRoleSearchText('');
            setOperationSearchText('');
            setSubscriberSearchText('');
          }}>
            确定
          </Button>
        ]}
        style={{ width: '90%', maxWidth: '1600px' }}
      >
        <div style={{ position: 'relative', padding: '20px' }}>
          {/* 复制粘贴按钮 - 窗口内部右上角 */}
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '20px', 
            zIndex: 10 
          }}>
            <Space>
              <Tooltip content="复制当前所有设置">
                <Button 
                  icon={<IconCopy />} 
                  onClick={handleCopySettings}
                  type="outline"
                  size="small"
                >
                  复制设置
                </Button>
              </Tooltip>
              <Tooltip content="将复制的设置粘贴到选中角色">
                <Button 
                  icon={<IconPaste />} 
                  onClick={() => modalSelectedRole && handlePasteSettings(modalSelectedRole)}
                  type="outline"
                  size="small"
                  disabled={!modalSelectedRole}
                >
                  粘贴设置
                </Button>
              </Tooltip>
            </Space>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', height: '600px', marginTop: '30px' }}>
              {/* 通知角色 */}
              <div style={{ 
                flex: '0 0 200px', 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f7f8fa', 
                  borderBottom: '1px solid #e5e6eb',
                  fontWeight: 500
                }}>
                  通知角色
                </div>
                <div style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr 60px 60px',
                  gap: '8px',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>角色</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {filteredRoles.map(role => (
                    <div
                      key={role.id}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: modalSelectedRole === role.id ? '#f0f5ff' : 'transparent',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => {
                        setModalSelectedRole(role.id);
                        setModalSelectedOperation(null);
                      }}
                    >
                      <Text>{role.name}</Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作名称 */}
              <div style={{ 
                flex: '0 0 400px', 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden',
                opacity: modalSelectedRole ? 1 : 0.5,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f7f8fa', 
                  borderBottom: '1px solid #e5e6eb',
                  fontWeight: 500,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>操作名称</span>
                  <Space size="small">
                    <Button size="mini" onClick={() => {
                      if (!modalSelectedRole) return;
                      filteredOperationsList.forEach(op => {
                        permissionSettings.forEach(setting => {
                          if (setting.roleId === modalSelectedRole && setting.operationId === op.id && setting.receiverRoleId) {
                            handlePermissionToggle(setting, 'enabled', true);
                          }
                        });
                      });
                    }}>全选</Button>
                    <Button size="mini" onClick={() => {
                      if (!modalSelectedRole) return;
                      filteredOperationsList.forEach(op => {
                        permissionSettings.forEach(setting => {
                          if (setting.roleId === modalSelectedRole && setting.operationId === op.id && setting.receiverRoleId) {
                            handlePermissionToggle(setting, 'enabled', false);
                          }
                        });
                      });
                    }}>反选</Button>
                  </Space>
                </div>
                <div style={{ padding: '8px', borderBottom: '1px solid #e5e6eb' }}>
                  <Input
                    placeholder="搜索操作"
                    value={operationSearchText}
                    onChange={setOperationSearchText}
                    suffix={
                      <Space size="mini">
                        {operationSearchText && (
                          <Button
                            type="text"
                            size="mini"
                            icon={<IconDelete />}
                            onClick={() => setOperationSearchText('')}
                            style={{ padding: '2px' }}
                          />
                        )}
                        <IconSearch />
                      </Space>
                    }
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr 60px 60px',
                  gap: '8px',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>操作</span>
                  <span style={{ textAlign: 'center' }}>邮件</span>
                  <span style={{ textAlign: 'center' }}>企微</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {modalSelectedRole ? (
                    filteredOperationsList.map(operation => {
                      // 获取邮件和企微的设置
                      const emailSetting = permissionSettings.find(
                        s => s.roleId === modalSelectedRole && 
                             s.operationId === operation.id && 
                             !s.receiverRoleId
                      );
                      
                      // 检查是否有模板
                      const hasTemplate = hasTemplates(operation.id);
                      
                      return (
                        <div
                          key={operation.id}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            backgroundColor: modalSelectedOperation === operation.id ? '#f0f5ff' : 'transparent',
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'background-color 0.2s',
                            display: 'grid',
                            gridTemplateColumns: '1fr 60px 60px',
                            gap: '8px',
                            alignItems: 'center'
                          }}
                          onClick={() => setModalSelectedOperation(operation.id)}
                        >
                          <Text>{operation.name}</Text>
                          <div style={{ textAlign: 'center' }}>
                            {!hasTemplate ? (
                              <Tooltip content="该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板">
                                <span style={{ display: 'inline-block', cursor: 'not-allowed' }} onClick={(e) => e.stopPropagation()}>
                                  <Switch
                                    size="small"
                                    checked={false}
                                    disabled={true}
                                    style={{ pointerEvents: 'none' }}
                                  />
                                </span>
                              </Tooltip>
                            ) : (
                              <Switch
                                size="small"
                                checked={emailSetting?.enabled || false}
                                onChange={(checked) => emailSetting && handlePermissionToggle(emailSetting, 'enabled', checked)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            {!hasTemplate ? (
                              <Tooltip content="该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板">
                                <span style={{ display: 'inline-block', cursor: 'not-allowed' }} onClick={(e) => e.stopPropagation()}>
                                  <Switch
                                    size="small"
                                    checked={false}
                                    disabled={true}
                                    style={{ pointerEvents: 'none' }}
                                  />
                                </span>
                              </Tooltip>
                            ) : (
                              <Switch
                                size="small"
                                checked={emailSetting?.enabled || false}
                                onChange={(checked) => emailSetting && handlePermissionToggle(emailSetting, 'enabled', checked)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ 
                      padding: '40px 16px', 
                      textAlign: 'center', 
                      color: '#86909c',
                      fontSize: '14px'
                    }}>
                      请先选择通知角色
                    </div>
                  )}
                </div>
              </div>

              {/* 订阅角色 */}
              <div style={{ 
                flex: 1, 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden',
                opacity: modalSelectedRole && modalSelectedOperation ? 1 : 0.5,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f7f8fa', 
                  borderBottom: '1px solid #e5e6eb',
                  fontWeight: 500,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>订阅角色</span>
                  <Space size="small">
                    <Button size="mini" onClick={() => {
                      if (!modalSelectedRole || !modalSelectedOperation) return;
                      filteredSubscribers.forEach(role => {
                        const setting = permissionSettings.find(
                          s => s.roleId === modalSelectedRole && 
                               s.operationId === modalSelectedOperation && 
                               s.receiverRoleId === role.id
                        );
                        if (setting) {
                          handlePermissionToggle(setting, 'enabled', true);
                        }
                      });
                    }}>全选</Button>
                    <Button size="mini" onClick={() => {
                      if (!modalSelectedRole || !modalSelectedOperation) return;
                      filteredSubscribers.forEach(role => {
                        const setting = permissionSettings.find(
                          s => s.roleId === modalSelectedRole && 
                               s.operationId === modalSelectedOperation && 
                               s.receiverRoleId === role.id
                        );
                        if (setting) {
                          handlePermissionToggle(setting, 'enabled', false);
                        }
                      });
                    }}>反选</Button>
                  </Space>
                </div>
                <div style={{ padding: '8px', borderBottom: '1px solid #e5e6eb' }}>
                  <Input
                    placeholder="搜索角色"
                    value={subscriberSearchText}
                    onChange={setSubscriberSearchText}
                    suffix={
                      <Space size="mini">
                        {subscriberSearchText && (
                          <Button
                            type="text"
                            size="mini"
                            icon={<IconDelete />}
                            onClick={() => setSubscriberSearchText('')}
                            style={{ padding: '2px' }}
                          />
                        )}
                        <IconSearch />
                      </Space>
                    }
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr 60px 60px',
                  gap: '8px',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>角色</span>
                  <span style={{ textAlign: 'center' }}>邮件</span>
                  <span style={{ textAlign: 'center' }}>企微</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {modalSelectedRole && modalSelectedOperation ? (
                    filteredSubscribers.map(receiverRole => {
                      const setting = permissionSettings.find(
                        s => s.roleId === modalSelectedRole && 
                             s.operationId === modalSelectedOperation && 
                             s.receiverRoleId === receiverRole.id
                      );
                      
                      return (
                        <div key={receiverRole.id} style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          display: 'grid',
                          gridTemplateColumns: '1fr 60px 60px',
                          gap: '8px',
                          alignItems: 'center'
                        }}>
                          <Text>{receiverRole.name}</Text>
                          <div style={{ textAlign: 'center' }}>
                            <Switch
                              size="small"
                              checked={setting?.enabled || false}
                              onChange={(checked) => setting && handlePermissionToggle(setting, 'enabled', checked)}
                            />
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Switch
                              size="small"
                              checked={setting?.enabled || false}
                              onChange={(checked) => setting && handlePermissionToggle(setting, 'enabled', checked)}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ 
                      padding: '40px 16px', 
                      textAlign: 'center', 
                      color: '#86909c',
                      fontSize: '14px'
                    }}>
                      {!modalSelectedRole ? '请先选择通知角色' : '请选择操作名称'}
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </Modal>
    );
  };

  // 渲染操作管理弹窗
  const renderOperationModal = () => {
    return (
      <Modal
        title="操作管理"
        visible={operationModalVisible}
        onCancel={() => setOperationModalVisible(false)}
        footer={null}
        style={{ width: '1600px', maxWidth: '98vw', minWidth: '1200px' }}
      >
        {/* 筛选栏 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr) auto auto', 
          gap: '12px', 
          marginBottom: '20px',
          alignItems: 'end'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>操作ID</div>
            <Input
              placeholder="请输入操作ID"
              value={filterInputs.id || ''}
              onChange={(value) => {
                setFilterInputs({ ...filterInputs, id: value });
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>操作来源</div>
            <Input
              placeholder="请输入操作来源"
              value={filterInputs.source || ''}
              onChange={(value) => {
                setFilterInputs({ ...filterInputs, source: value });
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>操作状态</div>
            <Select
              placeholder="请选择操作状态"
              value={filterInputs.status || ''}
              onChange={(value) => {
                setFilterInputs({ ...filterInputs, status: value });
              }}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="启用">启用</Select.Option>
              <Select.Option value="停用">停用</Select.Option>
            </Select>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>创建者</div>
            <Input
              placeholder="请输入创建者"
              value={filterInputs.creator || ''}
              onChange={(value) => {
                setFilterInputs({ ...filterInputs, creator: value });
              }}
            />
          </div>
          <Button type="primary" icon={<IconSearch />} onClick={handleSearchFilters}>搜索</Button>
          <Button onClick={handleResetFilters}>重置</Button>
        </div>

        {/* 操作列表 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '12px' 
          }}>
            <span style={{ fontWeight: 500 }}>操作列表</span>
            <Button 
              type="primary" 
              icon={<IconPlus />}
              onClick={() => {
                // 初始化新建操作的空数据
                setEditingOperation({
                  id: '',
                  name: '', // 保留name字段以兼容数据结构，但不在表单中显示
                  source: '',
                  status: '启用',
                  creator: 'admin',
                  lastUpdated: '',
                  remark: '',
                  variables: {}
                });
                
                // 清空级联选择器值
                setCascaderValue([]);
                
                // 清空变量选择器值
                setSelectedVariables([]);
                
                // 清空错误状态
                setOperationFormErrors({});
                
                // 打开新建弹窗
                setOperationEditModalVisible(true);
              }}
            >
              新建
            </Button>
          </div>
          
          <div style={{ 
            border: '1px solid #e5e6eb', 
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            {/* 表头 */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '80px 1fr 80px 100px 120px 1fr 160px',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#f7f8fa',
              borderBottom: '1px solid #e5e6eb',
              fontWeight: 500,
              fontSize: '14px'
            }}>
              <div>操作ID</div>
              <div>操作来源</div>
              <div>状态</div>
              <div>更新者</div>
              <div>最近更新时间</div>
              <div>备注</div>
              <div style={{ textAlign: 'center' }}>操作</div>
            </div>
            
            {/* 表格内容 */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredOperations.length > 0 ? (
                filteredOperations
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((operation) => (
                    <div
                      key={operation.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr 80px 100px 120px 1fr 160px',
                        gap: '12px',
                        padding: '12px 16px',
                        borderBottom: '1px solid #f0f0f0',
                        alignItems: 'center',
                        fontSize: '14px'
                      }}
                    >
                      <div style={{ color: '#666' }}>{operation.id}</div>
                      <div style={{ color: '#666' }}>{operation.source}</div>
                      <div>
                        <span 
                          style={{ 
                            color: operation.status === '启用' ? '#00b42a' : '#86909c',
                            fontWeight: 500 
                          }}
                        >
                          {operation.status}
                        </span>
                      </div>
                      <div style={{ color: '#666' }}>{operation.creator}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>{operation.lastUpdated}</div>
                      <div style={{ 
                        color: '#666', 
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {operation.remark || '-'}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Button 
                          type="text" 
                          size="mini" 
                          icon={<IconEdit />}
                          onClick={() => {
                            // 先设置编辑的操作数据
                            setEditingOperation(operation);
                            
                            // 解析操作来源字符串为级联选择器值以便回显
                            const parsedValue = parseCascaderValue(operation.source, mockOperationPointsData);
                            setCascaderValue(parsedValue);
                            
                            // 将Record格式的variables转换为变量名数组用于回显
                            const variablesArray = recordToVariables(operation.variables);
                            setSelectedVariables(variablesArray);
                            
                            // 清空错误状态
                            setOperationFormErrors({});
                            
                            // 打开编辑弹窗
                            setOperationEditModalVisible(true);
                          }}
                        >
                          编辑
                        </Button>
                        <div style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 12px',
                          height: '28px',
                          minWidth: '50px',
                          borderRadius: '4px',
                          backgroundColor: operation.status === '启用' ? '#fff7e8' : '#f6ffed',
                          border: `1px solid ${operation.status === '启用' ? '#ffd588' : '#b7eb8f'}`,
                          color: operation.status === '启用' ? '#ff7d00' : '#00b42a',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleToggleOperationStatus(operation)}
                        >
                          {operation.status === '启用' ? '停用' : '启用'}
                        </div>
                        <Button 
                          type="text" 
                          size="mini" 
                          icon={<IconDelete />}
                          status="danger"
                          onClick={() => handleDeleteOperation(operation)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ 
                  padding: '40px 16px', 
                  textAlign: 'center', 
                  color: '#86909c',
                  fontSize: '14px'
                }}>
                  暂无数据
                </div>
              )}
            </div>
          </div>
          
          {/* 分页 */}
          {filteredOperations.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '16px' 
            }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredOperations.length}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 10);
                }}
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // 渲染新建/编辑操作弹窗
  const renderOperationEditModal = () => {
    const isEdit = !!editingOperation && !!editingOperation.id;
    
    return (
      <Modal
        title={isEdit ? '编辑操作' : '新建操作'}
        visible={operationEditModalVisible}
        onCancel={() => {
          setOperationEditModalVisible(false);
          setEditingOperation(null);
          setCascaderValue([]);
          setSelectedVariables([]);
          setOperationFormErrors({});
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setOperationEditModalVisible(false);
            setEditingOperation(null);
            setCascaderValue([]);
            setSelectedVariables([]);
            setOperationFormErrors({});
          }}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => {
              // 获取表单数据
              const formData = {
                id: editingOperation?.id || '',  // 添加id字段用于编辑时的重复校验
                source: editingOperation?.source || '',
                remark: editingOperation?.remark || '',
                status: editingOperation?.status || '启用',
                variables: editingOperation?.variables || {}
              };
              
              // 表单校验
              const errors = validateForm(formData, isEdit);
              setOperationFormErrors(errors);
              
              if (Object.keys(errors).length > 0) {
                // 有错误，不提交表单
                return;
              }
              
              // 清空错误状态
              setOperationFormErrors({});
              
              if (isEdit) {
                // 编辑操作
                handleEditOperation(formData);
              } else {
                // 新建操作
                handleCreateOperation(formData);
              }
            }}
          >
            确定
          </Button>
        ]}
        style={{ width: '600px', minWidth: '600px', maxWidth: '800px' }}
      >
        <div style={{ 
          maxHeight: 'calc(100vh - 200px)', 
          overflowY: 'auto',
          padding: '20px 24px'
        }}>
        <Form layout="vertical">
          <Form.Item 
            label={<span style={{ fontWeight: 500, fontSize: '14px', color: '#1d2129' }}>操作来源</span>}
            required
            validateStatus={operationFormErrors.source ? 'error' : undefined}
            help={operationFormErrors.source ? <span style={{ color: '#f53f3f', fontSize: '12px' }}>{operationFormErrors.source}</span> : undefined}
            style={{ marginBottom: '24px' }}
          >
            <Cascader
              placeholder="请选择操作来源"
              options={mockOperationPointsData}
              value={cascaderValue}
              showSearch
              allowClear
              onChange={(value, selectedOptions) => {
                // 更新级联选择器的值
                setCascaderValue(value as string[]);
                
                // 将选中的路径转换为显示字符串
                const displayValue = (selectedOptions as OperationPoint[]).map((opt: OperationPoint) => opt.label).join('-');
                
                // 更新表单数据
                setEditingOperation({
                  ...editingOperation!,
                  source: displayValue
                });
                
                // 清除该字段的错误状态
                if (operationFormErrors.source) {
                  setOperationFormErrors(prev => ({
                    ...prev,
                    source: ''
                  }));
                }
              }}
              style={{ width: '100%', height: '36px', fontSize: '14px' }}
              dropdownMenuColumnStyle={{ maxHeight: 300 }}
            />
          </Form.Item>
          
          <Form.Item 
            label={<span style={{ fontWeight: 500, fontSize: '14px', color: '#1d2129' }}>操作状态</span>}
            required
            validateStatus={operationFormErrors.status ? 'error' : undefined}
            help={operationFormErrors.status ? <span style={{ color: '#f53f3f', fontSize: '12px' }}>{operationFormErrors.status}</span> : undefined}
            style={{ marginBottom: '24px' }}
          >
            <Select
              placeholder="请选择操作状态"
              value={editingOperation?.status || '启用'}
              onChange={(value) => {
                setEditingOperation({
                  ...editingOperation!,
                  status: value
                });
                // 清除该字段的错误状态
                if (operationFormErrors.status) {
                  setOperationFormErrors(prev => ({
                    ...prev,
                    status: ''
                  }));
                }
              }}
              style={{ width: '100%', height: '36px', fontSize: '14px' }}
            >
              <Select.Option value="启用">启用</Select.Option>
              <Select.Option value="停用">停用</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            label={<span style={{ fontWeight: 500, fontSize: '14px', color: '#1d2129' }}>关联变量</span>}
            required
            validateStatus={operationFormErrors.variables ? 'error' : undefined}
            help={operationFormErrors.variables ? <span style={{ color: '#f53f3f', fontSize: '12px' }}>{operationFormErrors.variables}</span> : undefined}
            style={{ marginBottom: '24px' }}
          >
            <Select
              mode="multiple"
              placeholder="请选择关联变量"
              showSearch
              allowClear
              maxTagCount={3}
              value={selectedVariables}
              onChange={(newSelectedVariables: string[]) => {
                // 更新selectedVariables状态
                setSelectedVariables(newSelectedVariables);
                
                // 将变量数组转换为Record格式用于保存
                const variablesRecord = variablesToRecord(newSelectedVariables);
                
                setEditingOperation({
                  ...editingOperation!,
                  variables: variablesRecord
                });
                
                // 清除该字段的错误状态
                if (operationFormErrors.variables) {
                  setOperationFormErrors(prev => ({
                    ...prev,
                    variables: ''
                  }));
                }
              }}
              filterOption={(inputValue, option) => {
                const children = (option as any)?.props?.children;
                if (typeof children === 'string') {
                  return children.toLowerCase().includes(inputValue.toLowerCase());
                }
                return false;
              }}
              dropdownMenuStyle={{ maxHeight: 300 }}
              style={{ width: '100%', fontSize: '14px' }}
            >
              {mockAvailableVariables.map(variable => (
                <Select.Option key={variable.name} value={variable.name}>
                  {variable.name} ({variable.type})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            label={<span style={{ fontWeight: 500, fontSize: '14px', color: '#1d2129' }}>备注</span>}
            validateStatus={operationFormErrors.remark ? 'error' : undefined}
            help={operationFormErrors.remark ? <span style={{ color: '#f53f3f', fontSize: '12px' }}>{operationFormErrors.remark}</span> : undefined}
            style={{ marginBottom: '24px' }}
          >
            <Input.TextArea
              placeholder="请输入备注信息"
              value={editingOperation?.remark || ''}
              onChange={(value) => {
                setEditingOperation({
                  ...editingOperation!,
                  remark: value
                });
                // 清除该字段的错误状态
                if (operationFormErrors.remark) {
                  setOperationFormErrors(prev => ({
                    ...prev,
                    remark: ''
                  }));
                }
              }}
              rows={3}
              maxLength={5000}
              style={{ fontSize: '14px' }}
            />
          </Form.Item>
          
          
          {/* 新建操作时不显示操作ID、更新者、最近更新时间字段 */}
        </Form>
        </div>
      </Modal>
    );
  };

  // 渲染删除确认对话框
  const renderDeleteConfirmModal = () => {
    return (
      <Modal
        title={null}
        visible={deleteConfirmModalVisible}
        onCancel={handleCancelDelete}
        footer={null}
        style={{ width: '400px' }}
        alignCenter
      >
        <div style={{ 
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '16px',
            fontWeight: 500,
            color: '#1d2129',
            marginBottom: '24px'
          }}>
            是否确定删除该操作？
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center' 
          }}>
            <Button 
              onClick={handleCancelDelete}
              style={{ minWidth: '80px' }}
            >
              取消
            </Button>
            <Button 
              type="primary" 
              status="danger"
              onClick={handleConfirmDelete}
              style={{ minWidth: '80px' }}
            >
              确定
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  // 渲染通知配置管理弹窗
  const renderNotificationConfigModal = () => {
    return (
      <Modal
        title="通知配置管理"
        visible={notificationConfigModalVisible}
        onCancel={() => setNotificationConfigModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setNotificationConfigModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            onClick={() => {
              // 表单验证
              if (!emailConfig.configName.trim()) {
                Message.error('邮箱配置名称未填写');
                return;
              }
              if (!emailConfig.smtpServer.trim()) {
                Message.error('发件服务器未填写');
                return;
              }
              if (!emailConfig.port || emailConfig.port < 1 || emailConfig.port > 65535) {
                Message.error('端口必须在1-65535范围内');
                return;
              }
              if (!emailConfig.senderEmail.trim()) {
                Message.error('发件邮箱未填写');
                return;
              }
              if (!emailConfig.smtpAccount.trim()) {
                Message.error('SMTP账号未填写');
                return;
              }
              if (!emailConfig.password.trim()) {
                Message.error('密码未填写');
                return;
              }
              
              // 邮箱格式验证
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(emailConfig.senderEmail)) {
                Message.error('发件邮箱格式不正确');
                return;
              }
              
              // 密码强度验证
              if (emailConfig.password.length < 8 || !/[a-zA-Z]/.test(emailConfig.password) || !/\d/.test(emailConfig.password)) {
                Message.error('密码至少8位，需包含字母和数字');
                return;
              }
              
              // 企微配置验证
              if (!wechatConfig.configName.trim()) {
                Message.error('企微配置名称未填写');
                return;
              }
              if (!wechatConfig.agentId.trim()) {
                Message.error('应用ID未填写');
                return;
              }
              if (!wechatConfig.apiSecret.trim()) {
                Message.error('API密钥未填写');
                return;
              }
              
              // 保存配置
              Message.success('通知配置已保存');
              setNotificationConfigModalVisible(false);
            }}
          >
            确定
          </Button>
        ]}
        style={{ width: '800px', top: '20px' }}
      >
        <div style={{ 
          maxHeight: 'calc(100vh - 120px)',
          height: 'auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px'
        }}>
        <Tabs 
          activeTab={notificationConfigActiveTab} 
          onChange={setNotificationConfigActiveTab}
          type="line"
        >
          <TabPane key="email" title="邮箱">
            <div style={{ padding: '16px 0' }}>
              <Form layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="配置名称" required>
                    <Input
                      value={emailConfig.configName}
                      onChange={(value) => setEmailConfig({...emailConfig, configName: value})}
                      placeholder="请输入配置名称（1-50个字符）"
                      maxLength={50}
                    />
                  </Form.Item>
                  
                  <Form.Item label="发件人名称" required>
                    <Input
                      value={emailConfig.senderName}
                      onChange={(value) => setEmailConfig({...emailConfig, senderName: value})}
                      placeholder="请输入发件人名称（1-50个字符）"
                      maxLength={50}
                    />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="发件人邮箱" required>
                    <Input
                      value={emailConfig.senderEmail}
                      onChange={(value) => setEmailConfig({...emailConfig, senderEmail: value})}
                      placeholder="请输入发件人邮箱"
                    />
                  </Form.Item>
                  
                  <Form.Item label="回复邮箱">
                    <Input
                      value={emailConfig.replyEmail}
                      onChange={(value) => setEmailConfig({...emailConfig, replyEmail: value})}
                      placeholder="不可设置回复邮箱"
                      disabled // 根据需求置空且不可填写
                    />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="SMTP服务器地址" required>
                    <Input
                      value={emailConfig.smtpServer}
                      onChange={(value) => setEmailConfig({...emailConfig, smtpServer: value})}
                      placeholder="请输入SMTP服务器地址"
                    />
                  </Form.Item>
                  
                  <Form.Item label="端口" required>
                    <Input
                      type="number"
                      value={String(emailConfig.port)}
                      onChange={(value) => setEmailConfig({...emailConfig, port: parseInt(value) || 587})}
                      placeholder="请输入端口号"
                    />
                  </Form.Item>
                  
                  <Form.Item label="加密方式" required>
                    <Select
                      value={emailConfig.securityProtocol}
                      onChange={(value) => setEmailConfig({...emailConfig, securityProtocol: value})}
                    >
                      <Select.Option value="SSL">SSL</Select.Option>
                      <Select.Option value="TLS">TLS</Select.Option>
                      <Select.Option value="None">无加密</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="SMTP账号" required>
                    <Input
                      value={emailConfig.smtpAccount}
                      onChange={(value) => setEmailConfig({...emailConfig, smtpAccount: value})}
                      placeholder="请输入SMTP账号"
                    />
                  </Form.Item>
                  
                  <Form.Item label="密码" required>
                    <Input.Password
                      value={emailConfig.password}
                      onChange={(value) => setEmailConfig({...emailConfig, password: value})}
                      placeholder="请输入密码"
                      visibilityToggle
                    />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="配置描述">
                    <Input.TextArea
                      value={emailConfig.configDescription}
                      onChange={(value) => setEmailConfig({...emailConfig, configDescription: value})}
                      placeholder="请输入配置描述（不超过250个字符）"
                      maxLength={250}
                      rows={2}
                    />
                  </Form.Item>
                  
                  <Form.Item label="是否为默认" required>
                    <Select
                      value={emailConfig.isDefault ? '是' : '否'}
                      onChange={(value) => setEmailConfig({...emailConfig, isDefault: value === '是'})}
                    >
                      <Select.Option value="是">是</Select.Option>
                      <Select.Option value="否">否</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </TabPane>
          
          <TabPane key="wechat" title="企微">
            <div style={{ padding: '16px 0' }}>
              <Form layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="配置名称" required>
                    <Input
                      value={wechatConfig.configName}
                      onChange={(value) => setWechatConfig({...wechatConfig, configName: value})}
                      placeholder="请输入配置名称"
                    />
                  </Form.Item>
                  
                  <Form.Item label="企业ID" required>
                    <Input
                      value={wechatConfig.corpId}
                      onChange={(value) => setWechatConfig({...wechatConfig, corpId: value})}
                      placeholder="请输入企业ID"
                    />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="应用ID" required>
                    <Input
                      value={wechatConfig.agentId}
                      onChange={(value) => setWechatConfig({...wechatConfig, agentId: value})}
                      placeholder="请输入应用ID"
                    />
                  </Form.Item>
                  
                  <Form.Item label="API密钥" required>
                    <Input.Password
                      value={wechatConfig.apiSecret}
                      onChange={(value) => setWechatConfig({...wechatConfig, apiSecret: value})}
                      placeholder="请输入API密钥"
                      visibilityToggle
                    />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item label="状态" required>
                    <Select
                      value={wechatConfig.status}
                      onChange={(value) => setWechatConfig({...wechatConfig, status: value})}
                    >
                      <Select.Option value="启用">启用</Select.Option>
                      <Select.Option value="停用">停用</Select.Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="是否默认">
                    <Select
                      value={wechatConfig.isDefault ? '是' : '否'}
                      onChange={(value) => setWechatConfig({...wechatConfig, isDefault: value === '是'})}
                    >
                      <Select.Option value="是">是</Select.Option>
                      <Select.Option value="否">否</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                
                <Form.Item label="备注">
                  <Input.TextArea
                    value={wechatConfig.remark}
                    onChange={(value) => setWechatConfig({...wechatConfig, remark: value})}
                    placeholder="请输入备注信息"
                    rows={3}
                  />
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
        </div>
      </Modal>
    );
  };

  // 主页面渲染 - 直接显示全局通知订阅管理的内容
  const renderMainContent = () => {
    // 过滤后的角色列表
    const filteredRoles = mockRoles.filter(role => 
      role.name.toLowerCase().includes(roleSearchText.toLowerCase())
    );
    
    // 过滤后的操作列表
    const filteredOperationsList = operations.filter(op => 
      op.status === '启用' && op.name.toLowerCase().includes(operationSearchText.toLowerCase())
    );
    
    // 过滤后的订阅角色列表
    const filteredSubscribers = mockRoles.filter(role => 
      role.name.toLowerCase().includes(subscriberSearchText.toLowerCase())
    );

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '16px', height: '600px' }}>
          {/* 通知角色 - 1份宽度 */}
          <div style={{ 
            flex: '1', 
            border: '1px solid #e5e6eb', 
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f7f8fa', 
              borderBottom: '1px solid #e5e6eb',
              fontWeight: 500
            }}>
              通知角色
            </div>
            <div style={{ padding: '8px', borderBottom: '1px solid #e5e6eb' }}>
              <Input
                placeholder="搜索角色"
                value={roleSearchInput}
                onChange={setRoleSearchInput}
                onPressEnter={() => setRoleSearchText(roleSearchInput)}
                suffix={
                  <Space size="mini">
                    {roleSearchInput && (
                      <Button
                        type="text"
                        size="mini"
                        icon={<IconDelete />}
                        onClick={() => {
                          setRoleSearchInput('');
                          setRoleSearchText('');
                        }}
                        style={{ padding: '2px' }}
                      />
                    )}
                    <Button
                      type="text"
                      size="mini"
                      icon={<IconSearch />}
                      onClick={() => setRoleSearchText(roleSearchInput)}
                      style={{ padding: '2px' }}
                    />
                  </Space>
                }
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ 
              padding: '8px 16px', 
              backgroundColor: '#fafafa', 
              borderBottom: '1px solid #e5e6eb',
              display: 'grid',
              gridTemplateColumns: '1fr 60px 60px',
              gap: '8px',
              alignItems: 'center',
              fontSize: '12px',
              color: '#666'
            }}>
              <span>角色</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredRoles.map(role => (
                <div
                  key={role.id}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: localSelectedRole === role.id ? '#f0f5ff' : 'transparent',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => {
                    setLocalSelectedRole(role.id);
                    setLocalSelectedOperation(null);
                  }}
                >
                  <Text>{role.name}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* 操作名称 - 3份宽度 */}
          <div style={{ 
            flex: '3', 
            border: '1px solid #e5e6eb', 
            borderRadius: '8px',
            overflow: 'hidden',
            opacity: localSelectedRole ? 1 : 0.5,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f7f8fa', 
              borderBottom: '1px solid #e5e6eb',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>操作名称</span>
              <Space size="small">
                <Button size="mini" onClick={() => {
                  if (!localSelectedRole) return;
                  filteredOperationsList.forEach(op => {
                    permissionSettings.forEach(setting => {
                      if (setting.roleId === localSelectedRole && setting.operationId === op.id && setting.receiverRoleId) {
                        // 更新所有渠道
                        handlePermissionToggle(setting, 'emailEnabled', true);
                        handlePermissionToggle(setting, 'wechatEnabled', true);
                        handlePermissionToggle(setting, 'smsEnabled', true);
                      }
                    });
                  });
                }}>全选</Button>
                <Button size="mini" onClick={() => {
                  if (!localSelectedRole) return;
                  filteredOperationsList.forEach(op => {
                    permissionSettings.forEach(setting => {
                      if (setting.roleId === localSelectedRole && setting.operationId === op.id && setting.receiverRoleId) {
                         // 更新所有渠道
                        handlePermissionToggle(setting, 'emailEnabled', false);
                        handlePermissionToggle(setting, 'wechatEnabled', false);
                        handlePermissionToggle(setting, 'smsEnabled', false);
                      }
                    });
                  });
                }}>反选</Button>
              </Space>
            </div>
            <div style={{ padding: '8px', borderBottom: '1px solid #e5e6eb' }}>
              <Input
                placeholder="搜索操作"
                value={operationSearchInput}
                onChange={setOperationSearchInput}
                onPressEnter={() => setOperationSearchText(operationSearchInput)}
                suffix={
                  <Space size="mini">
                    {operationSearchInput && (
                      <Button
                        type="text"
                        size="mini"
                        icon={<IconDelete />}
                        onClick={() => {
                          setOperationSearchInput('');
                          setOperationSearchText('');
                        }}
                        style={{ padding: '2px' }}
                      />
                    )}
                    <Button
                      type="text"
                      size="mini"
                      icon={<IconSearch />}
                      onClick={() => setOperationSearchText(operationSearchInput)}
                      style={{ padding: '2px' }}
                    />
                  </Space>
                }
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ 
              padding: '8px 16px', 
              backgroundColor: '#fafafa', 
              borderBottom: '1px solid #e5e6eb',
              display: 'grid',
              gridTemplateColumns: '1fr 60px 60px 60px',
              gap: '8px',
              alignItems: 'center',
              fontSize: '12px',
              color: '#666'
            }}>
              <span>操作</span>
              <span style={{ textAlign: 'center' }}>邮件</span>
              <span style={{ textAlign: 'center' }}>企微</span>
              <span style={{ textAlign: 'center' }}>短信</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {localSelectedRole ? (
                filteredOperationsList.map(operation => {
                  // 获取设置
                  const setting = permissionSettings.find(
                    s => s.roleId === localSelectedRole && 
                         s.operationId === operation.id && 
                         !s.receiverRoleId
                  );
                  
                  // 检查是否有模板
                  const hasTemplate = hasTemplates(operation.id);
                  
                  return (
                    <div
                      key={operation.id}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: localSelectedOperation === operation.id ? '#f0f5ff' : 'transparent',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s',
                        display: 'grid',
                        gridTemplateColumns: '1fr 60px 60px 60px',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => setLocalSelectedOperation(operation.id)}
                    >
                      <Text>{operation.name}</Text>
                      {/* 邮件开关 */}
                      <div style={{ textAlign: 'center' }}>
                        {!hasTemplate ? (
                          <Tooltip content="该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板">
                            <span style={{ display: 'inline-block', cursor: 'not-allowed' }} onClick={(e) => e.stopPropagation()}>
                              <Switch
                                size="small"
                                checked={false}
                                disabled={true}
                                style={{ pointerEvents: 'none' }}
                              />
                            </span>
                          </Tooltip>
                        ) : (
                          <Switch
                            size="small"
                            checked={setting?.emailEnabled || false}
                            onChange={(checked) => setting && handlePermissionToggle(setting, 'emailEnabled', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                      {/* 企微开关 */}
                      <div style={{ textAlign: 'center' }}>
                        {!hasTemplate ? (
                          <Tooltip content="该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板">
                            <span style={{ display: 'inline-block', cursor: 'not-allowed' }} onClick={(e) => e.stopPropagation()}>
                              <Switch
                                size="small"
                                checked={false}
                                disabled={true}
                                style={{ pointerEvents: 'none' }}
                              />
                            </span>
                          </Tooltip>
                        ) : (
                          <Switch
                            size="small"
                            checked={setting?.wechatEnabled || false}
                            onChange={(checked) => setting && handlePermissionToggle(setting, 'wechatEnabled', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                      {/* 短信开关 */}
                      <div style={{ textAlign: 'center' }}>
                        {!hasTemplate ? (
                          <Tooltip content="该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板">
                            <span style={{ display: 'inline-block', cursor: 'not-allowed' }} onClick={(e) => e.stopPropagation()}>
                              <Switch
                                size="small"
                                checked={false}
                                disabled={true}
                                style={{ pointerEvents: 'none' }}
                              />
                            </span>
                          </Tooltip>
                        ) : (
                          <Switch
                            size="small"
                            checked={setting?.smsEnabled || false}
                            onChange={(checked) => setting && handlePermissionToggle(setting, 'smsEnabled', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ 
                  padding: '40px 16px', 
                  textAlign: 'center', 
                  color: '#86909c',
                  fontSize: '14px'
                }}>
                  请先选择通知角色
                </div>
              )}
            </div>
          </div>

          {/* 订阅角色 - 3份宽度 */}
          <div style={{ 
            flex: '3', 
            border: '1px solid #e5e6eb', 
            borderRadius: '8px',
            overflow: 'hidden',
            opacity: localSelectedRole && localSelectedOperation ? 1 : 0.5,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f7f8fa', 
              borderBottom: '1px solid #e5e6eb',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>订阅角色</span>
              <Space size="small">
                <Button size="mini" onClick={() => {
                  if (!localSelectedRole || !localSelectedOperation) return;
                  filteredSubscribers.forEach(role => {
                    const setting = permissionSettings.find(
                      s => s.roleId === localSelectedRole && 
                           s.operationId === localSelectedOperation && 
                           s.receiverRoleId === role.id
                    );
                    if (setting) {
                      handlePermissionToggle(setting, 'emailEnabled', true);
                      handlePermissionToggle(setting, 'wechatEnabled', true);
                      handlePermissionToggle(setting, 'smsEnabled', true);
                    }
                  });
                }}>全选</Button>
                <Button size="mini" onClick={() => {
                  if (!localSelectedRole || !localSelectedOperation) return;
                  filteredSubscribers.forEach(role => {
                    const setting = permissionSettings.find(
                      s => s.roleId === localSelectedRole && 
                           s.operationId === localSelectedOperation && 
                           s.receiverRoleId === role.id
                    );
                    if (setting) {
                      handlePermissionToggle(setting, 'emailEnabled', false);
                      handlePermissionToggle(setting, 'wechatEnabled', false);
                      handlePermissionToggle(setting, 'smsEnabled', false);
                    }
                  });
                }}>反选</Button>
              </Space>
            </div>
            <div style={{ padding: '8px', borderBottom: '1px solid #e5e6eb' }}>
              <Input
                placeholder="搜索角色"
                value={subscriberSearchInput}
                onChange={setSubscriberSearchInput}
                onPressEnter={() => setSubscriberSearchText(subscriberSearchInput)}
                suffix={
                  <Space size="mini">
                    {subscriberSearchInput && (
                      <Button
                        type="text"
                        size="mini"
                        icon={<IconDelete />}
                        onClick={() => {
                          setSubscriberSearchInput('');
                          setSubscriberSearchText('');
                        }}
                        style={{ padding: '2px' }}
                      />
                    )}
                    <Button
                      type="text"
                      size="mini"
                      icon={<IconSearch />}
                      onClick={() => setSubscriberSearchText(subscriberSearchInput)}
                      style={{ padding: '2px' }}
                    />
                  </Space>
                }
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ 
              padding: '8px 16px', 
              backgroundColor: '#fafafa', 
              borderBottom: '1px solid #e5e6eb',
              display: 'grid',
              gridTemplateColumns: '1fr 60px 60px 60px',
              gap: '8px',
              alignItems: 'center',
              fontSize: '12px',
              color: '#666'
            }}>
              <span>角色</span>
              <span style={{ textAlign: 'center' }}>邮件</span>
              <span style={{ textAlign: 'center' }}>企微</span>
              <span style={{ textAlign: 'center' }}>短信</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {localSelectedRole && localSelectedOperation ? (
                filteredSubscribers.map(receiverRole => {
                  const setting = permissionSettings.find(
                    s => s.roleId === localSelectedRole && 
                         s.operationId === localSelectedOperation && 
                         s.receiverRoleId === receiverRole.id
                  );
                  
                  return (
                    <div key={receiverRole.id} style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'grid',
                      gridTemplateColumns: '1fr 60px 60px 60px',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <Text>{receiverRole.name}</Text>
                      <div style={{ textAlign: 'center' }}>
                        <Switch
                          size="small"
                          checked={setting?.emailEnabled || false}
                          onChange={(checked) => setting && handlePermissionToggle(setting, 'emailEnabled', checked)}
                        />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Switch
                          size="small"
                          checked={setting?.wechatEnabled || false}
                          onChange={(checked) => setting && handlePermissionToggle(setting, 'wechatEnabled', checked)}
                        />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Switch
                          size="small"
                          checked={setting?.smsEnabled || false}
                          onChange={(checked) => setting && handlePermissionToggle(setting, 'smsEnabled', checked)}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ 
                  padding: '40px 16px', 
                  textAlign: 'center', 
                  color: '#86909c',
                  fontSize: '14px'
                }}>
                  {!localSelectedRole ? '请先选择通知角色' : '请选择操作名称'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        {/* 左侧复制粘贴按钮 */}
        <Space>
          <Tooltip content="复制当前所有设置">
            <Button 
              icon={<IconCopy />} 
              onClick={handleCopySettings}
              type="outline"
              size="small"
            >
              复制设置
            </Button>
          </Tooltip>
          <Tooltip content="将复制的设置粘贴到选中角色">
            <Button 
              icon={<IconPaste />} 
              onClick={() => {
                Message.warning('请在下方选择要粘贴到的角色');
              }}
              type="outline"
              size="small"
            >
              粘贴设置
            </Button>
          </Tooltip>
        </Space>
        {/* 右侧管理按钮 */}
        <Space>
          <Button 
            type="primary" 
            icon={<IconSettings />}
            onClick={() => setNotificationConfigModalVisible(true)}
          >
            通知配置管理
          </Button>
          {isAdmin && (
            <Button 
              type="primary" 
              icon={<IconSettings />}
              onClick={() => setOperationModalVisible(true)}
            >
              操作管理
            </Button>
          )}
        </Space>
      </div>

      {renderMainContent()}

      {renderOperationModal()}
      {renderOperationEditModal()}
      {renderDeleteConfirmModal()}
      {renderNotificationConfigModal()}
    </div>
  );
};

export default NotificationSubscriptionSettings;