import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Table,
  Select,
  DatePicker,
  Message,
  Typography,
  Tag,
  Dropdown,
  Tabs,
  Modal,
  Grid,
  Drawer,
  Input,
  Switch
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconSettings,
  IconUp,
  IconDown,
  IconDragDotVertical,
  IconSearch,
  IconRefresh,
  IconList,
  IconDownload
} from '@arco-design/web-react/icon';
import SaasPageWrapper from './SaasPageWrapper';

const { Option } = Select;
const { Title } = Typography;
const { Row, Col } = Grid;

// 生成8位随机费用ID
const generateTenderId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 筛选模式枚举
export enum FilterMode {
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual', 
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  BATCH = 'batch'
}

// 筛选字段配置接口
export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'dateRange' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  width?: number;
}

// 筛选条件接口
export interface FilterCondition {
  key: string;
  mode: FilterMode;
  value: any;
  visible: boolean;
}

// 筛选方案接口
export interface FilterScheme {
  id: string;
  name: string;
  conditions: FilterCondition[];
  isDefault?: boolean;
}

export interface SchemeData {
  id: string;
  name: string;
  isDefault: boolean;
  createTime: string;
  conditions: FilterCondition[];
}

// 获取筛选字段配置
const getFilterFields = (): FilterFieldConfig[] => {
  return [
    { key: 'code', label: '项目编号', type: 'text', placeholder: '请输入项目编号' },
    { key: 'projectName', label: '项目名称', type: 'text', placeholder: '请输入项目名称' },
    { key: 'company', label: '招标单位', type: 'select', placeholder: '请选择招标单位', options: [
      { label: '上海港务集团', value: '上海港务集团' },
      { label: '阿联酋航运', value: '阿联酋航运' },
      { label: 'MAERSK', value: 'MAERSK' },
      { label: 'EVERGREEN', value: 'EVERGREEN' },
      { label: 'CMA CGM', value: 'CMA CGM' }
    ]},
    { key: 'category', label: '项目类别', type: 'select', placeholder: '请选择项目类别', options: [
      { label: '基础设施建设', value: '基础设施建设' },
      { label: '软件开发', value: '软件开发' },
      { label: '港口建设', value: '港口建设' },
      { label: '物流设施', value: '物流设施' },
      { label: '技术改造', value: '技术改造' }
    ]},
    { key: 'status', label: '项目状态', type: 'select', placeholder: '请选择状态', options: [
      { label: '进行中', value: 'active' },
      { label: '已暂停', value: 'inactive' },
      { label: '已结束', value: 'expired' }
    ]},
    { key: 'type', label: '招投标类型', type: 'select', placeholder: '请选择类型', options: [
      { label: '公开招标', value: 'public' },
      { label: '邀请招标', value: 'invite' },
      { label: '竞争性谈判', value: 'competitive' }
    ]},
    { key: 'updateTime', label: '更新时间', type: 'dateRange', placeholder: '请选择时间范围' }
  ];
};

// 招投标类型枚举
type TenderType = 'public' | 'invite' | 'competitive';
type TenderStatus = 'draft' | 'ongoing' | 'completed_full' | 'completed_partial' | 'failed';

// 招投标数据接口
interface TenderData {
  id: string;
  code: string; // 招标编号 - 8位数字字母随机组合
  projectName: string; // 招标标题
  company: string; // 招标单位
  category: string; // 开标方式
  status: TenderStatus; // 招标状态
  updateTime: string; // 更新时间
  type: TenderType; // 招标类型
  usageStatus?: 'active' | 'inactive' | 'expired'; // 使用状态，可选属性
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
  creator?: string; // 创建人
  createTime?: string; // 创建时间
  updater?: string; // 更新人
}

// 模拟数据
const mockData: TenderData[] = [
  // 公开招标项目
  {
    id: 'BFDCYDX4',
    code: 'BFDCYDX4',
    projectName: '青岛港智能化物流系统建设',
    company: '青岛港集团',
    category: '线上开标',
    status: 'ongoing',
    updateTime: '2025-04-20 10:30',
    type: 'public',
    startTime: '2025-04-15 09:00:00',
    endTime: '2025-05-15 18:00:00',
    creator: '张三',
    createTime: '2025-04-10 10:30:00',
    updater: '李四'
  },
  {
    id: 'TENDER00000048',
    code: generateTenderId(),
    projectName: '上海港口物流园区建设项目',
    company: '上海港务集团',
    category: '线下开标',
    status: 'draft',
    updateTime: '2025-04-16 14:05',
    type: 'public',
    startTime: '2025-05-01 09:00:00',
    endTime: '2025-06-01 18:00:00',
    creator: '王五',
    createTime: '2025-04-12 14:05:00',
    updater: '赵六'
  },
  {
    id: 'TENDER00000047',
    code: generateTenderId(),
    projectName: '智慧物流管理系统开发',
    company: '阿联酋航运',
    category: '线上开标',
    status: 'ongoing',
    updateTime: '2025-03-06 14:40',
    type: 'public',
    startTime: '2025-03-01 09:00:00',
    endTime: '2025-04-01 18:00:00',
    creator: '孙七',
    createTime: '2025-02-25 14:40:00',
    updater: '周八'
  },
  {
    id: 'TENDER00000046',
    code: generateTenderId(),
    projectName: '宁波港集装箱码头改造',
    company: 'MAERSK',
    category: '线下开标',
    status: 'completed_full',
    updateTime: '2025-03-01 10:20',
    type: 'public',
    startTime: '2025-01-01 09:00:00',
    endTime: '2025-02-01 18:00:00',
    creator: '吴九',
    createTime: '2024-12-25 10:20:00',
    updater: '郑十'
  },
  {
    id: 'TENDER00000060',
    code: generateTenderId(),
    projectName: '深圳国际物流中心项目',
    company: 'EVERGREEN',
    category: '物流设施',
    status: 'ongoing',
    updateTime: '2025-04-18 09:30',
    type: 'public'
  },
  {
    id: 'TENDER00000061',
    code: generateTenderId(),
    projectName: '天津港智能化升级改造',
    company: 'CMA CGM',
    category: '技术改造',
    status: 'ongoing',
    updateTime: '2025-04-17 16:45',
    type: 'public'
  },
  // 邀请招标项目
  {
    id: 'TENDER00000049',
    code: generateTenderId(),
    projectName: '宁波港智能化仓储系统',
    company: '马士基',
    category: '智能化改造',
    status: 'ongoing',
    updateTime: '2025-04-15 10:30',
    type: 'invite'
  },
  {
    id: 'TENDER00000050',
    code: generateTenderId(),
    projectName: '深圳港区环保设施建设',
    company: 'COSCO',
    category: '环保工程',
    status: 'failed',
    updateTime: '2025-04-14 16:20',
    type: 'invite'
  },
  {
    id: 'TENDER00000045',
    code: generateTenderId(),
    projectName: '上海自贸区物流配送中心',
    company: 'CMA CGM',
    category: '物流设施',
    status: 'completed_partial',
    updateTime: '2025-02-28 15:30',
    type: 'invite'
  },
  {
    id: 'TENDER00000062',
    code: generateTenderId(),
    projectName: '广州港多式联运枢纽建设',
    company: 'ONE',
    category: '交通枢纽',
    status: 'ongoing',
    updateTime: '2025-04-16 11:20',
    type: 'invite'
  },
  {
    id: 'TENDER00000063',
    code: generateTenderId(),
    projectName: '厦门港口信息化平台升级',
    company: 'YANG MING',
    category: '信息化建设',
    status: 'ongoing',
    updateTime: '2025-04-15 14:10',
    type: 'invite'
  },
  // 竞争性谈判项目
  {
    id: 'TENDER00000051',
    code: generateTenderId(),
    projectName: '上海国际航运中心建设',
    company: '国航货运',
    category: '航运设施',
    status: 'ongoing',
    updateTime: '2025-04-13 14:15',
    type: 'competitive'
  },
  {
    id: 'TENDER00000052',
    code: generateTenderId(),
    projectName: '北京大兴机场货运枢纽',
    company: '东航货运',
    category: '航空物流',
    status: 'ongoing',
    updateTime: '2025-04-12 09:45',
    type: 'competitive'
  },
  {
    id: 'TENDER00000044',
    code: generateTenderId(),
    projectName: '广州白云机场扩建工程',
    company: '南航货运',
    category: '机场建设',
    status: 'failed',
    updateTime: '2025-04-10 11:20',
    type: 'competitive'
  },
  {
    id: 'TENDER00000064',
    code: generateTenderId(),
    projectName: '成都天府机场物流园区',
    company: '川航货运',
    category: '物流园区',
    status: 'ongoing',
    updateTime: '2025-04-14 13:30',
    type: 'competitive'
  },
  {
    id: 'TENDER00000065',
    code: generateTenderId(),
    projectName: '深圳宝安机场智能化改造',
    company: '顺丰航空',
    category: '智能化改造',
    status: 'ongoing',
    updateTime: '2025-04-13 10:15',
    type: 'competitive'
  },
  {
    id: 'TENDER00000066',
    code: generateTenderId(),
    projectName: '杭州萧山机场货运中心',
    company: '长龙航空',
    category: '货运设施',
    status: 'ongoing',
    updateTime: '2025-04-12 15:45',
    type: 'competitive'
  }
];

const TenderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTenderType, setActiveTenderType] = useState<TenderType>('public');
  const [allData] = useState<TenderData[]>(mockData);
  const [filteredData, setFilteredData] = useState<TenderData[]>(mockData.filter(item => item.type === 'public'));
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  
  // 确认弹窗相关状态
  const [toggleStatusModalVisible, setToggleStatusModalVisible] = useState(false);
  const [batchToggleModalVisible, setBatchToggleModalVisible] = useState(false);
  const [pendingToggleRule, setPendingToggleRule] = useState<{ id: string; currentStatus: 'active' | 'inactive' | 'expired' } | null>(null);
  const [pendingBatchToggleStatus, setPendingBatchToggleStatus] = useState<'active' | 'inactive' | null>(null);

  // 自定义表格抽屉状态
  const [customTableDrawerVisible, setCustomTableDrawerVisible] = useState(false);
  
  // 字段可见性状态 - 包含招投标管理的所有字段
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({
    code: true,
    projectName: true,
    company: true,
    category: true,
    status: true,
    updateTime: true,
    type: false,
  });

  // 列顺序状态
  const [columnOrder, setColumnOrder] = useState([
    'code', 'projectName', 'company', 'category', 'status', 'updateTime', 'type'
  ]);

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // 筛选条件状态
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');

  // 筛选功能状态
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  
  // 方案管理相关状态
  const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);

  // 筛选字段拖拽状态
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);

  // 初始化筛选功能
  const initializeDefaultConditions = (): FilterCondition[] => {
    const fields = getFilterFields();
    return fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: ['code', 'projectName', 'company'].includes(field.key) // 默认显示前3个字段
    }));
  };

  const initializeDefaultScheme = (): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(),
      isDefault: true
    };
  };

  // 方案管理相关函数已移除

  useEffect(() => {
    const defaultConditions = initializeDefaultConditions();
    const defaultScheme = initializeDefaultScheme();
    setFilterConditions(defaultConditions);
    setFilterSchemes([defaultScheme]);
    setFilterFieldOrder(getFilterFields().map(field => field.key));
  }, []);

  // 初始化方案数据
  useEffect(() => {
    const defaultScheme: SchemeData = {
      id: 'default',
      name: '系统默认方案',
      isDefault: true,
      createTime: new Date().toISOString(),
      conditions: []
    };
    
    const customScheme1: SchemeData = {
      id: 'custom1',
      name: '常用招投标筛选',
      isDefault: false,
      createTime: new Date(Date.now() - 86400000).toISOString(),
      conditions: []
    };
    
    const customScheme2: SchemeData = {
      id: 'custom2',
      name: '港务集团项目',
      isDefault: false,
      createTime: new Date(Date.now() - 172800000).toISOString(),
      conditions: []
    };
    
    setAllSchemes([defaultScheme, customScheme1, customScheme2]);
  }, []);

  // 筛选功能函数
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  const getFirstRowConditions = (): FilterCondition[] => {
    return getVisibleConditions().slice(0, 3);
  };

  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, mode, value } : condition
    ));
  };

  const resetFilterConditions = () => {
    const fields = getFilterFields();
    const resetConditions = fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: ['code', 'projectName', 'company'].includes(field.key)
    }));
    setFilterConditions(resetConditions);
  };

  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions([...scheme.conditions]);
      setCurrentSchemeId(schemeId);
    }
  };

  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  const openSchemeModal = () => {
    setSchemeName('');
    setSchemeModalVisible(true);
  };

  const closeSchemeModal = () => {
    setSchemeModalVisible(false);
  };

  const saveFilterScheme = () => {
    if (!schemeName.trim()) {
      Message.warning('请输入方案名称');
      return;
    }
    
    const newScheme: FilterScheme = {
      id: Date.now().toString(),
      name: schemeName,
      conditions: [...filterConditions],
      isDefault: false
    };

    const newSchemeData: SchemeData = {
      id: newScheme.id,
      name: newScheme.name,
      isDefault: false,
      createTime: new Date().toISOString(),
      conditions: newScheme.conditions
    };
    
    // 同时更新两个状态
    setFilterSchemes(prev => [...prev, newScheme]);
    setAllSchemes(prev => [...prev, newSchemeData]);
    setCurrentSchemeId(newScheme.id);
    closeSchemeModal();
    Message.success('保存成功');
  };

  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, visible } : condition
    ));
  };

  // 拖拽功能函数
  const handleDragStart = (e: React.DragEvent, columnKey: string) => {
    setDraggedItem(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverItem(columnKey);
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetColumnKey) {
      return;
    }

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetColumnKey);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    setColumnOrder(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleFilterFieldDragStart = (e: React.DragEvent, fieldKey: string) => {
    setDraggedFilterField(fieldKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFilterFieldDragOver = (e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    setDragOverFilterField(fieldKey);
  };

  const handleFilterFieldDrop = (e: React.DragEvent, targetFieldKey: string) => {
    e.preventDefault();
    
    if (!draggedFilterField || draggedFilterField === targetFieldKey) {
      return;
    }

    const newOrder = [...filterFieldOrder];
    const draggedIndex = newOrder.indexOf(draggedFilterField);
    const targetIndex = newOrder.indexOf(targetFieldKey);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedFilterField);
    
    setFilterFieldOrder(newOrder);
  };

  const handleFilterFieldDragEnd = () => {
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  // 自定义表格功能函数
  const openCustomTableDrawer = () => {
    setCustomTableDrawerVisible(true);
  };

  const closeCustomTableDrawer = () => {
    setCustomTableDrawerVisible(false);
  };

  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: visible
    }));
  };

  const resetColumnVisibility = () => {
    setColumnVisibility({
      code: true,
      usageLocation: true,
      company: true,
      projectName: true,
      usageStatus: true,
      updateTime: true,
      type: false,
    });
  };

  const applyColumnSettings = () => {
    closeCustomTableDrawer();
    Message.success('设置已应用');
  };

  const getColumnLabel = (columnKey: string): string => {
    const columnMap: { [key: string]: string } = {
      code: '项目编号',
      projectName: '项目名称',
      company: '招标单位',
      category: '项目类别',
      status: '项目状态',
      updateTime: '更新时间',
      type: '招投标类型'
    };
    return columnMap[columnKey] || columnKey;
  };

  // Tab切换处理
  const handleTenderTypeChange = (type: string) => {
    const tenderType = type as TenderType;
    setActiveTenderType(tenderType);
    const typeData = allData.filter(item => item.type === tenderType);
    setFilteredData(typeData);
    setSelectedRowKeys([]); // 重置选中项
  };

  // 查看详情






  // 确认切换状态
  const handleConfirmToggleStatus = () => {
    if (!pendingToggleRule) return;
    
    const newStatus = pendingToggleRule.currentStatus === 'active' ? 'inactive' : 'active';
    setFilteredData(prev => prev.map(item => 
      item.id === pendingToggleRule.id ? { ...item, usageStatus: newStatus } : item
    ));
    
    setToggleStatusModalVisible(false);
    setPendingToggleRule(null);
    Message.success(newStatus === 'active' ? '启用成功' : '禁用成功');
  };

  // 批量切换状态
  const handleBatchToggleStatus = (targetStatus: 'active' | 'inactive') => {
    setPendingBatchToggleStatus(targetStatus);
    setBatchToggleModalVisible(true);
  };

  // 确认批量切换状态
  const handleConfirmBatchToggleStatus = () => {
    if (!pendingBatchToggleStatus) return;
    
    setFilteredData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, usageStatus: pendingBatchToggleStatus } : item
    ));
    
    setBatchToggleModalVisible(false);
    setPendingBatchToggleStatus(null);
    setSelectedRowKeys([]);
    Message.success(`批量${pendingBatchToggleStatus === 'active' ? '启用' : '禁用'}成功`);
  };

  // 新增附加费
  const handleAdd = () => {
    navigate(`/controltower/saas/tender/add?type=${activeTenderType}`);
  };

  // 表格列定义
  const getColumns = () => {
    const baseColumns = [
      {
        title: '招标编号',
        dataIndex: 'code',
        key: 'code',
        width: 120,
        sorter: true,
      },
      {
        title: '招标标题',
        dataIndex: 'projectName',
        key: 'projectName',
        width: 200,
        sorter: true,
      },
      {
        title: '招标单位',
        dataIndex: 'company',
        key: 'company',
        width: 150,
        sorter: true,
      },
      {
        title: '招标类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        sorter: true,
        render: (type: string) => {
          const typeMap = {
            'public': '公开招标',
            'invite': '邀请招标',
            'competitive': '竞争性谈判'
          };
          return <Tag color="blue">{typeMap[type as keyof typeof typeMap] || type}</Tag>;
        }
      },
      {
        title: '开标方式',
        dataIndex: 'category',
        key: 'category',
        width: 120,
        sorter: true,
      },
      {
        title: '招标状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        sorter: true,
        render: (status: string) => {
          const statusMap = {
            'active': { text: '进行中', color: 'green' },
            'inactive': { text: '已暂停', color: 'orange' },
            'expired': { text: '已结束', color: 'red' },
            'draft': { text: '草稿', color: 'gray' },
            'ongoing': { text: '进行中', color: 'blue' },
            'completed_full': { text: '已完成', color: 'green' },
            'completed_partial': { text: '部分完成', color: 'orange' }
          };
          const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, color: 'gray' };
          return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
        }
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 150,
        sorter: true,
        render: (text: string) => text || '-'
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 150,
        sorter: true,
        render: (text: string) => text || '-'
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
        width: 100,
        sorter: true,
        render: (text: string) => text || '-'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
        sorter: true,
        render: (text: string) => text || '-'
      },
      {
        title: '更新人',
        dataIndex: 'updater',
        key: 'updater',
        width: 100,
        sorter: true,
        render: (text: string) => text || '-'
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 150,
        sorter: true,
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        fixed: 'right' as const,
        render: (_: unknown, record: TenderData) => {
          /**
           * 判断操作是否可用
           * @param status 当前状态
           * @param action 操作类型
           * @returns 是否可用
           */
          const isActionEnabled = (status: string, action: string): boolean => {
            switch (action) {
              case 'view':
                return true; // 查看始终可用
              case 'edit':
                return status === 'draft' || status === 'active'; // 草稿和进行中状态可编辑
              case 'publish':
                return status === 'draft'; // 只有草稿状态可发布
              case 'withdraw':
                return status === 'ongoing' || status === 'active'; // 进行中状态可撤回
              case 'delete':
                return status === 'draft'; // 只有草稿状态可删除
              case 'invite':
                return true; // 邀请链接始终可用
              case 'bidding':
                return status === 'completed_full' || status === 'completed_partial'; // 只有已完成状态可开标
              default:
                return false;
            }
          };

          /**
           * 处理查看操作
           */
          const handleViewAction = () => {
            console.log('查看投标:', record.id);
            navigate(`/controltower/bidding/bid-detail/${record.id}`);
          };

          /**
           * 处理编辑操作
           */
          const handleEditAction = () => {
            if (!isActionEnabled(record.status, 'edit')) {
              Message.warning('当前状态不允许编辑');
              return;
            }
            console.log('编辑投标:', record.id);
            navigate(`/controltower/saas/tender/edit/${record.id}`);
          };

          /**
           * 处理发布操作
           */
          const handlePublishAction = () => {
            if (!isActionEnabled(record.status, 'publish')) {
              Message.warning('当前状态不允许发布');
              return;
            }
            Modal.confirm({
              title: '确认发布',
              content: '确定要发布这个投标吗？发布后将开始接受投标。',
              onOk: () => {
                console.log('发布投标:', record.id);
                Message.success('投标发布成功');
                // 这里应该调用API更新状态
              }
            });
          };

          /**
           * 处理撤回操作
           */
          const handleWithdrawAction = () => {
            if (!isActionEnabled(record.status, 'withdraw')) {
              Message.warning('当前状态不允许撤回');
              return;
            }
            Modal.confirm({
              title: '确认撤回',
              content: '确定要撤回这个投标吗？撤回后状态将变为草稿。',
              onOk: () => {
                console.log('撤回投标:', record.id);
                Message.success('投标撤回成功');
                // 这里应该调用API更新状态为draft
              }
            });
          };

          /**
           * 处理删除操作
           */
          const handleDeleteAction = () => {
            if (!isActionEnabled(record.status, 'delete')) {
              Message.warning('当前状态不允许删除');
              return;
            }
            Modal.confirm({
              title: '确认删除',
              content: '删除后不可恢复，是否确认删除？',
              onOk: () => {
                console.log('删除投标:', record.id);
                Message.success('投标删除成功');
                // 这里应该调用API删除数据
              }
            });
          };

          // 更多菜单项
          const moreMenuItems = [
            {
              key: 'withdraw',
              title: '撤回',
              disabled: !isActionEnabled(record.status, 'withdraw'),
              onClick: handleWithdrawAction
            },
            {
              key: 'delete',
              title: '删除',
              disabled: !isActionEnabled(record.status, 'delete'),
              onClick: handleDeleteAction
            }
          ];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* 第一行：查看、编辑 */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="text"
                  size="small"
                  onClick={handleViewAction}
                  style={{ flex: 1, minWidth: '50px' }}
                >
                  查看
                </Button>
                <Button
                  type="text"
                  size="small"
                  disabled={!isActionEnabled(record.status, 'edit')}
                  onClick={handleEditAction}
                  style={{ flex: 1, minWidth: '50px' }}
                >
                  编辑
                </Button>
              </div>
              {/* 第二行：发布、更多 */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="text"
                  size="small"
                  disabled={!isActionEnabled(record.status, 'publish')}
                  onClick={handlePublishAction}
                  style={{ flex: 1, minWidth: '50px' }}
                >
                  发布
                </Button>
                <Dropdown
                  droplist={
                    <div style={{ padding: '4px 0', backgroundColor: '#fff', minWidth: '120px' }}>
                      {moreMenuItems.map(item => (
                        <div
                          key={item.key}
                          style={{
                            padding: '8px 12px',
                            cursor: item.disabled ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            color: item.disabled ? '#ccc' : '#1890ff',
                            opacity: item.disabled ? 0.5 : 1
                          }}
                          onClick={item.disabled ? undefined : item.onClick}
                          onMouseEnter={(e) => {
                            if (!item.disabled) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  }
                  position="bottom"
                >
                  <Button
                    type="text"
                    size="small"
                    style={{ flex: 1, minWidth: '50px' }}
                  >
                    更多
                  </Button>
                </Dropdown>
              </div>
            </div>
          );
        },
      },
    ];

    return baseColumns;
  };

  // 渲染筛选条件
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getFilterFields().find(field => field.key === condition.key);
    if (!fieldConfig) return null;

    const handleModeChange = (mode: FilterMode) => {
      updateFilterCondition(condition.key, mode, condition.value);
    };

    const handleValueChange = (value: any) => {
      updateFilterCondition(condition.key, condition.mode, value);
    };

    // 根据筛选模式决定是否禁用输入框
    const isInputDisabled = condition.mode === FilterMode.IS_EMPTY || condition.mode === FilterMode.IS_NOT_EMPTY;

    return (
      <Col span={6} key={condition.key} className="mb-4">
        <div className="filter-condition-wrapper">
          {/* 字段标签和筛选模式 */}
          <div className="filter-label-row mb-2 flex items-center justify-between">
            <span className="text-gray-700 text-sm font-medium">{fieldConfig.label}</span>
            <Select
              value={condition.mode}
              onChange={handleModeChange}
              style={{ width: '80px' }}
              size="small"
              className="filter-mode-select"
            >
              <Option value={FilterMode.EQUAL}>等于</Option>
              <Option value={FilterMode.NOT_EQUAL}>不等于</Option>
              <Option value={FilterMode.CONTAINS}>包含</Option>
              <Option value={FilterMode.NOT_CONTAINS}>不包含</Option>
              <Option value={FilterMode.IS_EMPTY}>为空</Option>
              <Option value={FilterMode.IS_NOT_EMPTY}>不为空</Option>
            </Select>
          </div>
          
          {/* 筛选输入框 */}
          <div className="filter-input-wrapper">
            {fieldConfig.type === 'select' && (
              <Select
                value={condition.value}
                onChange={handleValueChange}
                placeholder="请选择"
                allowClear
                style={{ width: '100%' }}
                disabled={isInputDisabled}
                size="small"
              >
                {fieldConfig.options?.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
            
            {fieldConfig.type === 'text' && (
              <Input
                value={condition.value}
                onChange={handleValueChange}
                placeholder={fieldConfig.placeholder}
                disabled={isInputDisabled}
                size="small"
              />
            )}
            
            {fieldConfig.type === 'dateRange' && (
              <DatePicker.RangePicker
                value={condition.value}
                onChange={handleValueChange}
                style={{ width: '100%' }}
                disabled={isInputDisabled}
                size="small"
              />
            )}
          </div>
        </div>
      </Col>
    );
  };

  // 渲染新版筛选区域
  const renderNewFilterArea = () => {
    const conditionsToShow = filterExpanded ? getVisibleConditions() : getFirstRowConditions();
    
    return (
      <Card className="mb-4 filter-area-card">
        {/* 筛选区头部 - 标题和所有操作按钮在同一行 */}
        <div className="filter-header flex justify-between items-center mb-6">
          <Title heading={6} className="!mb-0 !text-gray-800">
            筛选条件
          </Title>
          <div className="flex items-center gap-3">
            {/* 选择方案下拉 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">方案:</span>
              <Select
                value={currentSchemeId}
                onChange={applyFilterScheme}
                placeholder="选择方案"
                style={{ width: '180px' }}
                size="small"
              >
                {allSchemes.map(scheme => (
                  <Option key={scheme.id} value={scheme.id}>
                    {scheme.name}
                  </Option>
                ))}
              </Select>
            </div>
            
            {/* 所有操作按钮 */}
            <Space size="medium">
              <Button 
                type="primary" 
                icon={<IconSearch />}
                className="search-btn"
                size="small"
              >
                查询
              </Button>
              <Button 
                icon={<IconRefresh />} 
                onClick={resetFilterConditions}
                className="reset-btn"
                size="small"
              >
                重置
              </Button>
              <Button 
                type="outline"
                icon={<IconSettings />} 
                onClick={openFilterFieldModal}
                className="settings-btn"
                size="small"
              >
                增减条件
              </Button>
              <Button 
                type="outline"
                onClick={openSchemeModal}
                className="save-scheme-btn"
                size="small"
              >
                另存为方案
              </Button>
              <Button 
                type="text" 
                icon={filterExpanded ? <IconUp /> : <IconDown />}
                onClick={toggleFilterExpanded}
                className="expand-btn text-blue-500 hover:text-blue-700"
                size="small"
              >
                {filterExpanded ? '收起' : '展开'}
              </Button>
            </Space>
          </div>
        </div>
        
        {/* 筛选条件网格 - 直接放置，无额外包装 */}
        <Row gutter={[20, 20]}>
          {conditionsToShow.map((condition) => renderFilterCondition(condition))}
        </Row>

        {/* 添加自定义样式 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .filter-area-card {
              background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
              border: 1px solid #e2e8f0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            }
            
            .filter-label-row {
              min-height: 24px;
            }
            
            .filter-mode-select .arco-select-view {
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
            }
            
            .filter-input-wrapper .arco-input,
            .filter-input-wrapper .arco-select-view,
            .filter-input-wrapper .arco-picker {
              border: 1px solid #d1d5db;
              transition: border-color 0.2s ease;
            }
            
            .filter-input-wrapper .arco-input:focus,
            .filter-input-wrapper .arco-select-view:focus,
            .filter-input-wrapper .arco-picker:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .search-btn {
              background: linear-gradient(45deg, #3b82f6, #1d4ed8);
              border: none;
              font-weight: 500;
            }
            
            .reset-btn {
              border: 1px solid #e2e8f0;
              background: white;
              transition: all 0.2s ease;
            }
            
            .reset-btn:hover {
              border-color: #3b82f6;
              color: #3b82f6;
            }
            
            .expand-btn {
              font-weight: 500;
            }
          `
        }} />
      </Card>
    );
  };

  return (
    <SaasPageWrapper>
      <Card>
        <Tabs activeTab={activeTenderType} onChange={handleTenderTypeChange} className="mb-4">
          <Tabs.TabPane key="fcl" title="整箱附加费" />
          <Tabs.TabPane key="lcl" title="拼箱附加费" />
          <Tabs.TabPane key="air" title="空运附加费" />
        </Tabs>
        
        {/* 使用新的筛选区域 */}
        {renderNewFilterArea()}
        
        <Card>
          <div className="flex justify-between mb-4">
            <Space>
              <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新增海运招标</Button>
              <Button icon={<IconDownload />}>导出列表</Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button 
                    type="outline" 
                    status="success"
                    onClick={() => handleBatchToggleStatus('active')}
                  >
                    批量发布 ({selectedRowKeys.length})
                  </Button>
                  <Button 
                    type="outline" 
                    status="warning"
                    onClick={() => handleBatchToggleStatus('inactive')}
                  >
                    批量删除 ({selectedRowKeys.length})
                  </Button>
                </>
              )}
            </Space>
            <div 
              className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={openCustomTableDrawer}
            >
              <IconList className="mr-1" />
              <span>自定义表格</span>
            </div>
          </div>
          <Table
            columns={getColumns()}
            data={filteredData}
            loading={false}
            rowKey="id"
            scroll={{ x: 1000 }}
            border={false}
            className="mt-4 inquiry-table-nowrap"
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
            }}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys: (string | number)[]) => {
                setSelectedRowKeys(selectedRowKeys as string[]);
              },
            }}
          />
          <div className="mt-2 text-gray-500 text-sm">共 {filteredData.length} 条</div>
        </Card>
      </Card>

      {/* 单个状态切换确认弹窗 */}
      <Modal
        title="确认操作"
        visible={toggleStatusModalVisible}
        onOk={handleConfirmToggleStatus}
        onCancel={() => {
          setToggleStatusModalVisible(false);
          setPendingToggleRule(null);
        }}
        okText="确认"
        cancelText="取消"
      >
        <div>
          {pendingToggleRule && (
            <div>
              确定要{pendingToggleRule.currentStatus === 'active' ? '禁用' : '启用'}该附加费吗？
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>费用ID：</span>
                  <span style={{ fontFamily: 'monospace', color: '#165DFF' }}>
                    {(() => {
                      const rule = filteredData.find(r => r.id === pendingToggleRule.id);
                      return rule ? rule.code : '-';
                    })()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>适用航线：</span>
                  <span>
                    {(() => {
                      const rule = filteredData.find(r => r.id === pendingToggleRule.id);
                      return rule ? rule.projectName : '-';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 批量状态切换确认弹窗 */}
      <Modal
        title="确认批量操作"
        visible={batchToggleModalVisible}
        onOk={handleConfirmBatchToggleStatus}
        onCancel={() => {
          setBatchToggleModalVisible(false);
          setPendingBatchToggleStatus(null);
        }}
        okText="确认"
        cancelText="取消"
      >
        <div>
          确定要批量{pendingBatchToggleStatus === 'active' ? '启用' : '禁用'} {selectedRowKeys.length} 个附加费吗？
        </div>
      </Modal>

      {/* 自定义表格抽屉 */}
      <Drawer
        width={480}
        title={
          <div className="flex items-center">
            <IconSettings className="mr-2" />
            <span>自定义表格设置</span>
          </div>
        }
        visible={customTableDrawerVisible}
        onCancel={closeCustomTableDrawer}
        footer={
          <div className="flex justify-between">
            <Button onClick={resetColumnVisibility}>重置默认</Button>
            <Space>
              <Button onClick={closeCustomTableDrawer}>取消</Button>
              <Button type="primary" onClick={applyColumnSettings}>确认</Button>
            </Space>
          </div>
        }
      >
        <div className="h-full flex flex-col">
          {/* 快捷操作 */}
          <div className="flex justify-between items-center mb-4 p-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              已选择 {Object.values(columnVisibility).filter(Boolean).length}/{Object.keys(columnVisibility).length} 个字段
            </div>
            <Space>
              <Button size="small" onClick={() => {
                const newVisibility = {...columnVisibility};
                Object.keys(newVisibility).forEach(key => {
                  (newVisibility as any)[key] = true;
                });
                setColumnVisibility(newVisibility);
              }}>全选</Button>
              <Button size="small" onClick={() => {
                const newVisibility = {...columnVisibility};
                Object.keys(newVisibility).forEach(key => {
                  (newVisibility as any)[key] = false;
                });
                setColumnVisibility(newVisibility);
              }}>清空</Button>
            </Space>
          </div>
          
          {/* 可拖拽的字段列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            {columnOrder.map((columnKey, index) => (
              <div
                key={columnKey}
                className={`
                  flex items-center justify-between p-3 mb-2 bg-white border cursor-move
                  hover:shadow-sm transition-all duration-200
                  ${draggedItem === columnKey ? 'opacity-50' : ''}
                  ${dragOverItem === columnKey ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
                `}
                draggable
                onDragStart={(e) => handleDragStart(e, columnKey)}
                onDragOver={(e) => handleDragOver(e, columnKey)}
                onDrop={(e) => handleDrop(e, columnKey)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center flex-1">
                  <IconDragDotVertical className="text-gray-400 mr-3 cursor-grab" />
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 mr-3 min-w-[30px] text-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{getColumnLabel(columnKey)}</span>
                  </div>
                </div>
                <Switch 
                  size="small"
                  checked={columnVisibility[columnKey] || false} 
                  onChange={(checked) => handleColumnVisibilityChange(columnKey, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      {/* 增减条件抽屉 - 与自定义表格一致的样式 */}
      <Drawer
        width={480}
        title={
          <div className="flex items-center">
            <IconSettings className="mr-2" />
            <span>筛选字段设置</span>
          </div>
        }
        visible={filterFieldModalVisible}
        onCancel={closeFilterFieldModal}
        footer={
          <div className="flex justify-between">
            <Button onClick={() => {
              const fields = getFilterFields();
              setFilterFieldOrder(fields.map(field => field.key));
              fields.forEach(field => {
                updateFilterConditionVisibility(field.key, true);
              });
            }}>重置默认</Button>
            <Space>
              <Button onClick={closeFilterFieldModal}>取消</Button>
              <Button type="primary" onClick={closeFilterFieldModal}>确认</Button>
            </Space>
          </div>
        }
      >
        <div className="h-full flex flex-col">
          {/* 快捷操作 */}
          <div className="flex justify-between items-center mb-4 p-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              已选择 {filterConditions.filter(c => c.visible).length}/{getFilterFields().length} 个字段
            </div>
            <Space>
              <Button size="small" onClick={() => {
                getFilterFields().forEach(field => {
                  updateFilterConditionVisibility(field.key, true);
                });
              }}>全选</Button>
              <Button size="small" onClick={() => {
                getFilterFields().forEach(field => {
                  updateFilterConditionVisibility(field.key, false);
                });
              }}>清空</Button>
            </Space>
          </div>
          
          {/* 可拖拽的筛选字段列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            {filterFieldOrder.map((fieldKey, index) => {
              const condition = filterConditions.find(c => c.key === fieldKey);
              const field = getFilterFields().find(f => f.key === fieldKey);
              if (!condition || !field) return null;

              return (
                <div
                  key={fieldKey}
                  className={`
                    flex items-center justify-between p-3 mb-2 bg-white border cursor-move
                    hover:shadow-sm transition-all duration-200
                    ${draggedFilterField === fieldKey ? 'opacity-50' : ''}
                    ${dragOverFilterField === fieldKey ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
                  `}
                  draggable
                  onDragStart={(e) => handleFilterFieldDragStart(e, fieldKey)}
                  onDragOver={(e) => handleFilterFieldDragOver(e, fieldKey)}
                  onDrop={(e) => handleFilterFieldDrop(e, fieldKey)}
                  onDragEnd={handleFilterFieldDragEnd}
                >
                  <div className="flex items-center flex-1">
                    <IconDragDotVertical className="text-gray-400 mr-3 cursor-grab" />
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 mr-3 min-w-[30px] text-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{field.label}</span>
                    </div>
                  </div>
                  <Switch 
                    size="small"
                    checked={condition.visible} 
                    onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>

      {/* 保存方案弹窗 */}
      <Modal
        title="保存筛选方案"
        visible={schemeModalVisible}
        onOk={saveFilterScheme}
        onCancel={closeSchemeModal}
        okText="保存"
        cancelText="取消"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            方案名称
          </label>
          <Input
            value={schemeName}
            onChange={setSchemeName}
            placeholder="请输入方案名称"
            maxLength={50}
          />
        </div>
      </Modal>

      {/* 方案管理功能暂时移除 */}
    </SaasPageWrapper>
  );
};

export default TenderManagement;