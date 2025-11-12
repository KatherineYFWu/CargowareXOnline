import React, { useState } from 'react';
import { 
  Card, 
  Space, 
  Button, 
  Modal, 
  Tabs, 
  Table, 
  Checkbox, 
  Switch, 
  Typography,
  Message,
  Tooltip,
  Input,
  Form,
  Select,
  Pagination
} from '@arco-design/web-react';
import { IconSettings, IconCopy, IconPaste, IconPlus, IconEdit, IconSearch } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 数据类型定义
interface Operation {
  id: string;
  name: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface NotificationSetting {
  operationId: string;
  roleId: string;
  enabled: boolean;
  editable: boolean;
}

interface SubscriptionSetting {
  operationId: string;
  enabled: boolean;
  editable: boolean;
}

interface PermissionSetting {
  roleId: string;
  operationId: string;
  receiverRoleId?: string;
  enabled: boolean;
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

// 模拟数据
const mockOperations: Operation[] = [
  { id: '1', name: '提交询价' },
  { id: '2', name: '更改询价' },
  { id: '3', name: '撤回询价' },
  { id: '4', name: '提交报价' },
  { id: '5', name: '更改报价' },
  { id: '6', name: '撤回报价' },
];

const mockRoles: Role[] = [
  { id: '1', name: '销售' },
  { id: '2', name: '商务' },
  { id: '3', name: '营销' },
  { id: '4', name: '运营' },
  { id: '5', name: '客服' },
];

// 通知设置模拟数据
const mockNotificationSettings: NotificationSetting[] = [
  { operationId: '1', roleId: '1', enabled: true, editable: true },
  { operationId: '1', roleId: '2', enabled: false, editable: true },
  { operationId: '1', roleId: '3', enabled: true, editable: false },
  { operationId: '2', roleId: '1', enabled: true, editable: true },
  { operationId: '2', roleId: '2', enabled: false, editable: true },
  { operationId: '3', roleId: '1', enabled: true, editable: true },
  { operationId: '4', roleId: '1', enabled: true, editable: true },
  { operationId: '5', roleId: '1', enabled: false, editable: true },
  { operationId: '6', roleId: '1', enabled: true, editable: true },
];

// 订阅设置模拟数据
const mockSubscriptionSettings: SubscriptionSetting[] = [
  { operationId: '1', enabled: true, editable: true },
  { operationId: '2', enabled: false, editable: true },
  { operationId: '3', enabled: true, editable: false },
  { operationId: '4', enabled: true, editable: true },
  { operationId: '5', enabled: false, editable: true },
  { operationId: '6', enabled: true, editable: true },
];

// 权限设置模拟数据
const mockPermissionSettings: PermissionSetting[] = [
  // 通知设置权限
  { roleId: '1', operationId: '1', receiverRoleId: '1', enabled: true, configurable: true },
  { roleId: '1', operationId: '1', receiverRoleId: '2', enabled: false, configurable: true },
  { roleId: '1', operationId: '2', receiverRoleId: '1', enabled: true, configurable: false },
  // 订阅设置权限
  { roleId: '1', operationId: '1', enabled: true, configurable: true },
  { roleId: '1', operationId: '2', enabled: false, configurable: true },
];

// 操作管理模拟数据
const mockOperationManagement: OperationManagement[] = [
  {
    id: 'OP001',
    name: '提交询价',
    source: '订单管理_创建',
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
    source: '订单管理_修改',
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
    source: '订单管理_删除',
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
    source: '报价管理_创建',
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
    source: '报价管理_修改',
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
    source: '报价管理_删除',
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
    source: '订单管理_确认',
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
    source: '订单管理_取消',
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
  {
    id: 'OP009',
    name: '发货通知',
    source: '物流管理_发货',
    status: '启用',
    creator: 'logistics',
    lastUpdated: '2024-01-07 10:40:00',
    remark: '物流人员发货并通知客户',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "物流单号": "string",
      "发货地址": "string",
      "收货地址": "string"
    }
  },
  {
    id: 'OP010',
    name: '签收确认',
    source: '物流管理_签收',
    status: '启用',
    creator: 'customer',
    lastUpdated: '2024-01-06 17:00:00',
    remark: '客户确认收货签收',
    variables: {
      "操作人姓名": "string",
      "操作人邮箱": "string",
      "操作时间": "datetime",
      "物流单号": "string",
      "签收时间": "datetime"
    }
  }
];

const NotificationSubscriptionSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notification');
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [copiedSettings, setCopiedSettings] = useState<PermissionSetting[]>([]);
  
  // 操作管理状态
  const [operationModalVisible, setOperationModalVisible] = useState(false);
  const [operationEditModalVisible, setOperationEditModalVisible] = useState(false);
  const [operations, setOperations] = useState<OperationManagement[]>(mockOperationManagement);
  const [filteredOperations, setFilteredOperations] = useState<OperationManagement[]>(mockOperationManagement);
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    source: '',
    status: '',
    creator: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingOperation, setEditingOperation] = useState<OperationManagement | null>(null);
  const [isAdmin] = useState(true); // 模拟管理员权限
  
  // 操作编辑表单错误状态
  const [operationFormErrors, setOperationFormErrors] = useState<Record<string, string>>({});
  
  // 通知设置状态
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(mockNotificationSettings);
  
  // 订阅设置状态
  const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSetting[]>(mockSubscriptionSettings);
  
  // 权限设置状态
  const [permissionSettings, setPermissionSettings] = useState<PermissionSetting[]>(mockPermissionSettings);
  
  // 当前选中的操作和角色
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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

  // 获取操作名称
  const getOperationName = (operationId: string) => {
    return mockOperations.find(op => op.id === operationId)?.name || operationId;
  };

  // 获取角色名称
  const getRoleName = (roleId: string) => {
    return mockRoles.find(role => role.id === roleId)?.name || roleId;
  };

  // 处理通知设置切换
  const handleNotificationToggle = (operationId: string, roleId: string, enabled: boolean) => {
    const setting = notificationSettings.find(
      s => s.operationId === operationId && s.roleId === roleId
    );
    
    if (setting && setting.editable) {
      setNotificationSettings(prev => 
        prev.map(s => 
          s.operationId === operationId && s.roleId === roleId 
            ? { ...s, enabled }
            : s
        )
      );
      Message.success('通知设置已更新');
    }
  };

  // 处理订阅设置切换
  const handleSubscriptionToggle = (operationId: string, enabled: boolean) => {
    const setting = subscriptionSettings.find(s => s.operationId === operationId);
    
    if (setting && setting.editable) {
      setSubscriptionSettings(prev => 
        prev.map(s => 
          s.operationId === operationId 
            ? { ...s, enabled }
            : s
        )
      );
      Message.success('订阅设置已更新');
    }
  };

  // 处理权限设置切换
  const handlePermissionToggle = (setting: PermissionSetting, field: 'enabled' | 'configurable', value: boolean) => {
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

  // 全选/反选功能
  const handleSelectAll = (settings: any[], field: string, value: boolean, filter?: (s: any) => boolean) => {
    const filtered = filter ? settings.filter(filter) : settings;
    const updatedSettings = settings.map(s => {
      if (filtered.includes(s)) {
        return { ...s, [field]: value };
      }
      return s;
    });
    
    if (field === 'enabled' || field === 'configurable') {
      setPermissionSettings(updatedSettings);
    }
  };

  // 全选/反选操作名称
  const handleSelectAllOperations = (selectAll: boolean) => {
    if (!selectedRole) return;
    
    const roleOperations = mockOperations.filter(operation => 
      permissionSettings.some(s => s.roleId === selectedRole && s.operationId === operation.id && !s.receiverRoleId)
    );
    
    if (roleOperations.length > 0) {
      if (selectAll) {
        setSelectedOperation(roleOperations[0].id);
      } else {
        setSelectedOperation(null);
      }
    }
  };

  // 全选/反选接收角色
  const handleSelectAllReceiverRoles = (selectAll: boolean) => {
    if (!selectedRole || !selectedOperation) return;
    
    const receiverRoles = mockRoles.filter(role => 
      permissionSettings.some(s => s.roleId === selectedRole && s.operationId === selectedOperation && s.receiverRoleId === role.id)
    );
    
    if (receiverRoles.length > 0) {
      if (selectAll) {
        setSelectedReceiverRole(receiverRoles[0].id);
      } else {
        setSelectedReceiverRole(null);
      }
    }
  };

  // 全选/反选订阅操作名称
  const handleSelectAllSubscriptionOperations = (selectAll: boolean) => {
    if (!selectedRole) return;
    
    const subscriptionOperations = mockOperations.filter(operation => 
      permissionSettings.some(s => s.roleId === selectedRole && s.operationId === operation.id && !s.receiverRoleId)
    );
    
    if (subscriptionOperations.length > 0) {
      if (selectAll) {
        // 这里可以设置选中的操作，但订阅设置不需要选中状态
      } else {
        // 这里可以清除选中的操作
      }
    }
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
          return { ...setting, enabled: copiedSetting.enabled, configurable: copiedSetting.configurable };
        }
      }
      return setting;
    });

    setPermissionSettings(newSettings);
    Message.success('设置已粘贴');
  };

  // 操作管理相关函数
  // 筛选操作列表
  const handleFilterOperations = () => {
    const filtered = operations.filter(operation => {
      return (
        (!filters.id || operation.id.toLowerCase().includes(filters.id.toLowerCase())) &&
        (!filters.name || operation.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.source || operation.source.toLowerCase().includes(filters.source.toLowerCase())) &&
        (!filters.status || operation.status === filters.status) &&
        (!filters.creator || operation.creator.toLowerCase().includes(filters.creator.toLowerCase()))
      );
    });
    setFilteredOperations(filtered);
    setCurrentPage(1);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      id: '',
      name: '',
      source: '',
      status: '',
      creator: ''
    });
    setFilteredOperations(operations);
    setCurrentPage(1);
  };

  // 切换操作状态
  const handleToggleOperationStatus = (operation: OperationManagement) => {
    const newStatus = operation.status === '启用' ? '停用' : '启用';
    
    // 如果启用，自动停用同名的其他操作
    if (newStatus === '启用') {
      const updatedOperations = operations.map(op => {
        if (op.name === operation.name && op.id !== operation.id) {
          return { ...op, status: '停用' };
        }
        if (op.id === operation.id) {
          return { ...op, status: newStatus };
        }
        return op;
      });
      setOperations(updatedOperations);
      setFilteredOperations(updatedOperations);
    } else {
      const updatedOperations = operations.map(op => 
        op.id === operation.id ? { ...op, status: newStatus } : op
      );
      setOperations(updatedOperations);
      setFilteredOperations(updatedOperations);
    }
    
    Message.success(`操作"${operation.name}"${newStatus}`);
  };

  // 新建操作
  const handleCreateOperation = (values: any) => {
    const newOperation: OperationManagement = {
      id: `OP${String(operations.length + 1).padStart(3, '0')}`,
      name: values.name,
      source: values.source,
      status: values.status,
      creator: 'admin',
      lastUpdated: new Date().toLocaleString('zh-CN'),
      remark: values.remark,
      variables: values.variables || {}
    };
    
    // 自动停用同名的其他操作
    const updatedOperations = operations.map(op => {
      if (op.name === newOperation.name && newOperation.status === '启用') {
        return { ...op, status: '停用' };
      }
      return op;
    });
    
    const finalOperations = [...updatedOperations, newOperation];
    setOperations(finalOperations);
    setFilteredOperations(finalOperations);
    setOperationEditModalVisible(false);
    Message.success('操作创建成功');
  };

  // 编辑操作
  const handleEditOperation = (values: any) => {
    if (!editingOperation) return;
    
    const updatedOperations = operations.map(op => {
      if (op.id === editingOperation.id) {
        // 如果状态从停用改为启用，自动停用同名的其他操作
        if (editingOperation.status === '停用' && values.status === '启用') {
          return {
            ...op,
            name: values.name,
            source: values.source,
            status: values.status,
            remark: values.remark,
            variables: values.variables || {},
            lastUpdated: new Date().toLocaleString('zh-CN')
          };
        } else {
          return {
            ...op,
            name: values.name,
            source: values.source,
            status: values.status,
            remark: values.remark,
            variables: values.variables || {},
            lastUpdated: new Date().toLocaleString('zh-CN')
          };
        }
      }
      // 如果当前操作启用且编辑的操作也启用，需要停用同名的其他操作
      else if (op.name === values.name && values.status === '启用' && editingOperation.status === '启用') {
        return { ...op, status: '停用' };
      }
      return op;
    });
    
    setOperations(updatedOperations);
    setFilteredOperations(updatedOperations);
    setOperationEditModalVisible(false);
    setEditingOperation(null);
    Message.success('操作编辑成功');
  };

  // 表单校验
  const validateForm = (values: any, isEdit: boolean = false): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // 1. 字段类型校验
    if (values.name && typeof values.name !== 'string') {
      errors.name = '操作名称应该为字符串类型';
    }
    
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
    if (typeof values.name === 'string' && (!values.name || values.name.trim() === '')) {
      errors.name = '操作名称未填写';
    }
    
    if (typeof values.source === 'string' && (!values.source || values.source.trim() === '')) {
      errors.source = '操作来源未填写';
    }
    
    if (typeof values.status === 'string' && (!values.status || values.status.trim() === '')) {
      errors.status = '操作状态未选择';
    }
    
    if (typeof values.variables === 'object' && (!values.variables || Object.keys(values.variables).length === 0)) {
      errors.variables = '关联变量未填写';
    }
    
    // 3. 字段长度校验（只有在字段类型正确且不为空时才检查）
    if (typeof values.name === 'string' && values.name && values.name.length > 50) {
      errors.name = '操作名称过长';
    }
    
    if (typeof values.source === 'string' && values.source && values.source.length > 500) {
      errors.source = '操作来源过长';
    }
    
    if (typeof values.remark === 'string' && values.remark && values.remark.length > 5000) {
      errors.remark = '备注过长';
    }
    
    // 4. 操作名称格式校验
    if (typeof values.name === 'string' && values.name && !/^[\u4e00-\u9fa5a-zA-Z_]+$/.test(values.name)) {
      errors.name = '操作名称应该为中英文和下划线';
    }
    
    // 5. 操作名称重复校验
    if (typeof values.name === 'string' && values.name && values.name.trim() !== '') {
      const existingOperation = operations.find(op => 
        op.name === values.name.trim() && 
        (isEdit ? op.id !== values.id : true)
      );
      if (existingOperation) {
        errors.name = '该操作名称已存在';
      }
    }
    
    return errors;
  };

  // 渲染通知设置 - 新设计
  const renderNotificationSettings = () => {
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

    return (
      <div style={{ display: 'flex', gap: '16px', height: '400px' }}>
        {/* 第一列：操作名称和通知设置合并 */}
        <div style={{ 
          flex: 1, 
          border: '1px solid #e5e6eb', 
          borderRadius: '8px',
          overflow: 'hidden'
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
            <Space>
              <Button 
                size="mini" 
                onClick={() => {
                  mockOperations.forEach(operation => {
                    mockRoles.forEach(role => {
                      const setting = notificationSettings.find(s => s.operationId === operation.id && s.roleId === role.id);
                      if (setting && setting.editable) {
                        handleNotificationToggle(operation.id, role.id, true);
                      }
                    });
                  });
                }}
              >
                全选
              </Button>
              <Button 
                size="mini" 
                onClick={() => {
                  mockOperations.forEach(operation => {
                    mockRoles.forEach(role => {
                      const setting = notificationSettings.find(s => s.operationId === operation.id && s.roleId === role.id);
                      if (setting && setting.editable) {
                        handleNotificationToggle(operation.id, role.id, false);
                      }
                    });
                  });
                }}
              >
                反选
              </Button>
            </Space>
          </div>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {mockOperations.map(operation => {
              const setting = notificationSettings.find(s => s.operationId === operation.id);
              return (
                <div
                  key={operation.id}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedOperation === operation.id ? '#f0f5ff' : 'transparent',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => setSelectedOperation(selectedOperation === operation.id ? null : operation.id)}
                >
                  <Text>{operation.name}</Text>
                  <Switch
                    checked={setting?.enabled || false}
                    disabled={!setting?.editable}
                    onChange={(checked) => handleNotificationToggle(operation.id, '', checked)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 第二列：接收角色 */}
        <div style={{ 
          flex: 1, 
          border: '1px solid #e5e6eb', 
          borderRadius: '8px',
          overflow: 'hidden',
          opacity: selectedOperation ? 1 : 0.5
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
            <span>接收角色</span>
            <Space>
              <Button 
                size="mini" 
                onClick={() => {
                  if (selectedOperation) {
                    mockRoles.forEach(role => {
                      const setting = notificationSettings.find(s => s.operationId === selectedOperation && s.roleId === role.id);
                      if (setting && setting.editable) {
                        handleNotificationToggle(selectedOperation, role.id, true);
                      }
                    });
                  }
                }}
              >
                全选
              </Button>
              <Button 
                size="mini" 
                onClick={() => {
                  if (selectedOperation) {
                    mockRoles.forEach(role => {
                      const setting = notificationSettings.find(s => s.operationId === selectedOperation && s.roleId === role.id);
                      if (setting && setting.editable) {
                        handleNotificationToggle(selectedOperation, role.id, false);
                      }
                    });
                  }
                }}
              >
                反选
              </Button>
            </Space>
          </div>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {selectedOperation ? (
              (() => {
                // 检查选中的操作是否已关闭通知
                const operationSetting = notificationSettings.find(s => s.operationId === selectedOperation);
                const isOperationEnabled = operationSetting?.enabled !== false;
                
                if (!isOperationEnabled) {
                  // 如果操作已关闭通知，显示提示信息
                  return (
                    <div style={{ 
                      padding: '40px 16px', 
                      textAlign: 'center', 
                      color: '#86909c',
                      fontSize: '14px'
                    }}>
                      该操作已关闭通知
                    </div>
                  );
                }
                
                // 如果操作已启用通知，显示角色列表
                return mockRoles.map(role => {
                  const setting = notificationSettings.find(s => s.operationId === selectedOperation && s.roleId === role.id);
                  return (
                    <div
                      key={role.id}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Text>{role.name}</Text>
                      <Switch
                        checked={setting?.enabled || false}
                        disabled={!setting?.editable}
                        onChange={(checked) => handleNotificationToggle(selectedOperation, role.id, checked)}
                      />
                    </div>
                  );
                });
              })()
            ) : (
              <div style={{ 
                padding: '40px 16px', 
                textAlign: 'center', 
                color: '#86909c',
                fontSize: '14px'
              }}>
                请先选择操作名称
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染订阅设置 - 新设计
  const renderSubscriptionSettings = () => {
    return (
      <div style={{ 
        border: '1px solid #e5e6eb', 
        borderRadius: '8px', 
        overflow: 'hidden',
        width: '40%'
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
          <Space>
            <Button 
              size="mini" 
              onClick={() => {
                mockOperations.forEach(operation => {
                  const subscription = subscriptionSettings.find(s => s.operationId === operation.id);
                  if (subscription && subscription.editable) {
                    handleSubscriptionToggle(operation.id, true);
                  }
                });
              }}
            >
              全选
            </Button>
            <Button 
              size="mini" 
              onClick={() => {
                mockOperations.forEach(operation => {
                  const subscription = subscriptionSettings.find(s => s.operationId === operation.id);
                  if (subscription && subscription.editable) {
                    handleSubscriptionToggle(operation.id, false);
                  }
                });
              }}
            >
              反选
            </Button>
          </Space>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {mockOperations.map(operation => {
                const subscription = subscriptionSettings.find(s => s.operationId === operation.id);
                return (
                  <tr key={operation.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <Text>{operation.name}</Text>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Switch
                        checked={subscription?.enabled || false}
                        disabled={!subscription?.editable}
                        onChange={(checked) => handleSubscriptionToggle(operation.id, checked)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染权限范围设置弹窗 - 新的左右排布设计
  const renderPermissionModal = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
    const [selectedReceiverRole, setSelectedReceiverRole] = useState<string | null>(null);

    return (
      <Modal
        title="设置范围权限"
        visible={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPermissionModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={() => setPermissionModalVisible(false)}>
            确定
          </Button>
        ]}
        style={{ width: '90%', maxWidth: '1400px' }}
        bodyStyle={{ padding: '0' }}
      >
        <div style={{ position: 'relative', display: 'flex', height: '600px' }}>
          {/* 复制粘贴按钮 - 窗口内部右上角 */}
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
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
                  onClick={() => selectedRole && handlePasteSettings(selectedRole)}
                  type="outline"
                  size="small"
                  disabled={!selectedRole}
                >
                  粘贴设置
                </Button>
              </Tooltip>
            </Space>
          </div>
          {/* 左侧：通知设置 */}
          <div style={{ 
            flex: '0 0 60%', 
            borderRight: '1px solid #e5e6eb',
            padding: '20px',
            overflowY: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <Text strong style={{ fontSize: '16px' }}>通知范围权限设置</Text>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', height: '500px' }}>
              {/* 角色菜单 */}
              <div style={{ 
                flex: '0 0 150px', 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f7f8fa', 
                  borderBottom: '1px solid #e5e6eb',
                  fontWeight: 500
                }}>
                  角色
                </div>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>通知产生者</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}></span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}></span>
                </div>
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {mockRoles.map(role => (
                    <div
                      key={role.id}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: selectedRole === role.id ? '#f0f5ff' : 'transparent',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => {
                        setSelectedRole(role.id);
                        setSelectedOperation(null);
                        setSelectedReceiverRole(null);
                      }}
                    >
                      <Text>{role.name}</Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作名称菜单 */}
              <div style={{ 
                flex: '0 0 280px', 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden',
                opacity: selectedRole ? 1 : 0.5
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
                    <Button size="mini" onClick={() => handleSelectAllOperations(true)}>全选</Button>
                    <Button size="mini" onClick={() => handleSelectAllOperations(false)}>反选</Button>
                  </Space>
                </div>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>操作触发通知</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>启用/停用</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>可设置</span>
                </div>
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {selectedRole ? (
                    mockOperations.map(operation => {
                      const setting = permissionSettings.find(
                        s => s.roleId === selectedRole && 
                             s.operationId === operation.id && 
                             !s.receiverRoleId
                      );
                      
                      if (!setting) return null;
                      
                      return (
                        <div
                          key={operation.id}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            backgroundColor: selectedOperation === operation.id ? '#f0f5ff' : 'transparent',
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'background-color 0.2s',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto auto',
                            gap: '16px',
                            alignItems: 'center'
                          }}
                          onClick={() => {
                            setSelectedOperation(operation.id);
                            setSelectedReceiverRole(null);
                          }}
                        >
                          <Text>{operation.name}</Text>
                          <Switch
                            size="small"
                            checked={setting.enabled}
                            onChange={(checked) => handlePermissionToggle(setting, 'enabled', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Switch
                            size="small"
                            checked={setting.configurable}
                            onChange={(checked) => handlePermissionToggle(setting, 'configurable', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
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
                      请先选择角色
                    </div>
                  )}
                </div>
              </div>

              {/* 接收角色面板 */}
              <div style={{ 
                flex: 1, 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden',
                opacity: selectedRole && selectedOperation ? 1 : 0.5
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
                  <span>接收角色</span>
                  <Space size="small">
                    <Button size="mini" onClick={() => handleSelectAllReceiverRoles(true)}>全选</Button>
                    <Button size="mini" onClick={() => handleSelectAllReceiverRoles(false)}>反选</Button>
                  </Space>
                </div>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>通知接收者</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>启用/停用</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>可设置</span>
                </div>
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {selectedRole && selectedOperation ? (
                    mockRoles.map(receiverRole => {
                      const setting = permissionSettings.find(
                        s => s.roleId === selectedRole && 
                             s.operationId === selectedOperation && 
                             s.receiverRoleId === receiverRole.id
                      );
                      
                      if (!setting) return null;
                      
                      return (
                        <div key={receiverRole.id} style={{ 
                          padding: '12px 16px',
                          cursor: 'pointer',
                          backgroundColor: selectedReceiverRole === receiverRole.id ? '#f0f5ff' : 'transparent',
                          borderBottom: '1px solid #f0f0f0',
                          transition: 'background-color 0.2s',
                          display: 'grid',
                          gridTemplateColumns: '1fr auto auto',
                          gap: '16px',
                          alignItems: 'center'
                        }}
                        onClick={() => setSelectedReceiverRole(receiverRole.id)}
                        >
                          <Text>{receiverRole.name}</Text>
                          <Switch
                            size="small"
                            checked={setting.enabled}
                            onChange={(checked) => handlePermissionToggle(setting, 'enabled', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Switch
                            size="small"
                            checked={setting.configurable}
                            onChange={(checked) => handlePermissionToggle(setting, 'configurable', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
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
                      {!selectedRole ? '请先选择角色' : '请选择操作名称'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：订阅范围权限设置 */}
          <div style={{ 
            flex: '0 0 40%', 
            padding: '20px',
            overflowY: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <Text strong style={{ fontSize: '16px' }}>订阅范围权限设置</Text>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', height: '500px' }}>
              {/* 角色菜单 */}
              <div style={{ 
                flex: '0 0 150px', 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f7f8fa', 
                  borderBottom: '1px solid #e5e6eb',
                  fontWeight: 500
                }}>
                  角色
                </div>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>通知产生者</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}></span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}></span>
                </div>
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {mockRoles.map(role => (
                    <div
                      key={role.id}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: selectedRole === role.id ? '#f0f5ff' : 'transparent',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <Text>{role.name}</Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作名称面板 */}
              <div style={{ 
                flex: 1, 
                border: '1px solid #e5e6eb', 
                borderRadius: '8px',
                overflow: 'hidden'
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
                    <Button size="mini" onClick={() => handleSelectAllSubscriptionOperations(true)}>全选</Button>
                    <Button size="mini" onClick={() => handleSelectAllSubscriptionOperations(false)}>反选</Button>
                  </Space>
                </div>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#fafafa', 
                  borderBottom: '1px solid #e5e6eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>操作触发通知</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>启用/停用</span>
                  <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>可设置</span>
                </div>
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {selectedRole ? (
                    mockOperations.map(operation => {
                      const setting = permissionSettings.find(
                        s => s.roleId === selectedRole && 
                             s.operationId === operation.id && 
                             !s.receiverRoleId
                      );
                      
                      if (!setting) return null;
                      
                      return (
                        <div key={operation.id} style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          display: 'grid',
                          gridTemplateColumns: '1fr auto auto',
                          gap: '16px',
                          alignItems: 'center'
                        }}>
                          <Text>{operation.name}</Text>
                          <Switch
                            size="small"
                            checked={setting.enabled}
                            onChange={(checked) => handlePermissionToggle(setting, 'enabled', checked)}
                          />
                          <Switch
                            size="small"
                            checked={setting.configurable}
                            onChange={(checked) => handlePermissionToggle(setting, 'configurable', checked)}
                          />
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
                      请先选择角色
                    </div>
                  )}
                </div>
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
        width={1600}
        style={{ maxWidth: '98vw', minWidth: '1200px' }}
      >
        {/* 筛选栏 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr) auto', 
          gap: '12px', 
          marginBottom: '20px',
          alignItems: 'end'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>操作ID</div>
            <Input
              placeholder="请输入操作ID"
              value={filters.id || ''}
              onChange={(value) => {
                setFilters({ ...filters, id: value });
                handleFilterOperations({ ...filters, id: value });
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>操作名称</div>
            <Input
              placeholder="请输入操作名称"
              value={filters.name || ''}
              onChange={(value) => {
                setFilters({ ...filters, name: value });
                handleFilterOperations({ ...filters, name: value });
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>操作来源</div>
            <Input
              placeholder="请输入操作来源"
              value={filters.source || ''}
              onChange={(value) => {
                setFilters({ ...filters, source: value });
                handleFilterOperations({ ...filters, source: value });
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>操作状态</div>
            <Select
              placeholder="请选择操作状态"
              value={filters.status || ''}
              onChange={(value) => {
                setFilters({ ...filters, status: value });
                handleFilterOperations({ ...filters, status: value });
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
              value={filters.creator || ''}
              onChange={(value) => {
                setFilters({ ...filters, creator: value });
                handleFilterOperations({ ...filters, creator: value });
              }}
            />
          </div>
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
                setEditingOperation(null);
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
              gridTemplateColumns: '80px 1fr 1fr 80px 100px 120px 1fr 120px',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#f7f8fa',
              borderBottom: '1px solid #e5e6eb',
              fontWeight: 500,
              fontSize: '14px'
            }}>
              <div>操作ID</div>
              <div>操作名称</div>
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
                        gridTemplateColumns: '80px 1fr 1fr 80px 100px 120px 1fr 120px',
                        gap: '12px',
                        padding: '12px 16px',
                        borderBottom: '1px solid #f0f0f0',
                        alignItems: 'center',
                        fontSize: '14px'
                      }}
                    >
                      <div style={{ color: '#666' }}>{operation.id}</div>
                      <div>{operation.name}</div>
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
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <Button 
                          type="text" 
                          size="mini" 
                          icon={<IconEdit />}
                          onClick={() => {
                            setEditingOperation(operation);
                            setOperationEditModalVisible(true);
                          }}
                        >
                          编辑
                        </Button>
                        <div style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 8px',
                          height: '24px',
                          borderRadius: '2px',
                          backgroundColor: operation.status === '启用' ? '#fff7e8' : '#f6ffed',
                          border: `1px solid ${operation.status === '启用' ? '#ffd588' : '#b7eb8f'}`,
                          color: operation.status === '启用' ? '#ff7d00' : '#00b42a',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleToggleOperationStatus(operation)}
                        >
                          {operation.status === '启用' ? '停用' : '启用'}
                        </div>
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
    const isEdit = !!editingOperation;
    
    return (
      <Modal
        title={isEdit ? '编辑操作' : '新建操作'}
        visible={operationEditModalVisible}
        onCancel={() => setOperationEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setOperationEditModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => {
              // 获取表单数据
              const formData = {
                id: editingOperation?.id || '',  // 添加id字段用于编辑时的重复校验
                name: editingOperation?.name || '',
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
        width={'600px'}
        style={{ top: '20px' }}
        bodyStyle={{ 
          maxHeight: 'calc(100vh - 200px)', 
          overflowY: 'auto',
          padding: '16px',
          top: 0,
        }}
      >
        <Form layout="vertical">
          <Form.Item 
            label="操作名称" 
            required
            validateStatus={operationFormErrors.name ? 'error' : ''}
            help={operationFormErrors.name}
          >
            <Input
              placeholder="请输入操作名称"
              value={editingOperation?.name || ''}
              onChange={(value) => {
                setEditingOperation({
                  ...editingOperation!,
                  name: value
                });
                // 清除该字段的错误状态
                if (operationFormErrors.name) {
                  setOperationFormErrors(prev => ({
                    ...prev,
                    name: ''
                  }));
                }
              }}
              maxLength={50}
            />
          </Form.Item>
          
          <Form.Item 
            label="操作来源" 
            required
            validateStatus={operationFormErrors.source ? 'error' : ''}
            help={operationFormErrors.source}
          >
            <Input
              placeholder="请输入操作来源，如：订单管理_创建"
              value={editingOperation?.source || ''}
              onChange={(value) => {
                setEditingOperation({
                  ...editingOperation!,
                  source: value
                });
                // 清除该字段的错误状态
                if (operationFormErrors.source) {
                  setOperationFormErrors(prev => ({
                    ...prev,
                    source: ''
                  }));
                }
              }}
              maxLength={500}
            />
          </Form.Item>
          
          <Form.Item 
            label="操作状态" 
            required
            validateStatus={operationFormErrors.status ? 'error' : ''}
            help={operationFormErrors.status}
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
            >
              <Select.Option value="启用">启用</Select.Option>
              <Select.Option value="停用">停用</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            label="关联变量" 
            required
            validateStatus={operationFormErrors.variables ? 'error' : ''}
            help={operationFormErrors.variables}
          >
            <Input.TextArea
              placeholder="请输入关联变量（JSON格式）"
              value={editingOperation?.variables ? JSON.stringify(editingOperation.variables, null, 2) : ''}
              onChange={(value) => {
                try {
                  const parsed = JSON.parse(value);
                  setEditingOperation({
                    ...editingOperation!,
                    variables: parsed
                  });
                } catch (e) {
                  // 如果不是有效的JSON，保持原值
                }
                // 清除该字段的错误状态
                if (operationFormErrors.variables) {
                  setOperationFormErrors(prev => ({
                    ...prev,
                    variables: ''
                  }));
                }
              }}
              rows={3}
            />
          </Form.Item>
          
          <Form.Item 
            label="备注"
            validateStatus={operationFormErrors.remark ? 'error' : ''}
            help={operationFormErrors.remark}
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
            />
          </Form.Item>
          
          
          {/* 新建操作时不显示操作ID、更新者、最近更新时间字段 */}
        </Form>
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
              if (!emailConfig.username.trim()) {
                Message.error('用户名未填写');
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
        width={800}
        style={{ top: '20px' }}
        bodyStyle={{ 
          maxHeight: 'calc(100vh - 120px)', // 根据实际情况调整这个值
          height: 'auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
        }}
      >
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
                      value={emailConfig.port}
                      onChange={(value) => setEmailConfig({...emailConfig, port: parseInt(value) || 587})}
                      placeholder="请输入端口号"
                      min={1}
                      max={65535}
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
      </Modal>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>
        <Button 
          type="primary" 
          icon={<IconSettings />}
          onClick={() => setNotificationConfigModalVisible(true)}
          style={{ marginRight: '12px' }}
        >
          通知配置管理
        </Button>
        {isAdmin && (
          <Button 
            type="primary" 
            icon={<IconSettings />}
            onClick={() => setOperationModalVisible(true)}
            style={{ marginRight: '12px' }}
          >
            操作管理
          </Button>
        )}
        <Button 
          type="primary" 
          icon={<IconSettings />}
          onClick={() => setPermissionModalVisible(true)}
        >
          设置范围权限
        </Button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px',
        marginBottom: '24px'
      }}>
        <Card title="通知设置" style={{ minHeight: '400px' }}>
          {renderNotificationSettings()}
        </Card>
        
        <Card title="订阅设置" style={{ minHeight: '400px' }}>
          {renderSubscriptionSettings()}
        </Card>
      </div>

      {renderPermissionModal()}
      {renderOperationModal()}
      {renderOperationEditModal()}
      {renderNotificationConfigModal()}
    </div>
  );
};

export default NotificationSubscriptionSettings;