import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Typography, 
  Button, 
  Space, 
  Select, 
  Table, 
  Modal, 
  Grid, 
  Switch, 
  Dropdown, 
  Menu, 
  Tooltip, 
  Tabs,
  Input,
  DatePicker,
  Drawer,
  Message
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconRefresh, 
  IconList, 
  IconDragDotVertical, 
  IconDownload, 
  IconDown, 
  IconPlus,
  IconUp,
  IconSettings
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import SchemeSelect from './SchemeSelect';
import SchemeManagementModal, { SchemeData } from './SchemeManagementModal';
import './InquiryManagement.css';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Title = Typography.Title;
const TabPane = Tabs.TabPane;
const Row = Grid.Row;
const Col = Grid.Col;

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

// 筛选模式选项
const FilterModeOptions = [
  { label: '等于', value: FilterMode.EQUAL },
  { label: '不等于', value: FilterMode.NOT_EQUAL },
  { label: '包含', value: FilterMode.CONTAINS },
  { label: '不包含', value: FilterMode.NOT_CONTAINS },
  { label: '为空', value: FilterMode.IS_EMPTY },
  { label: '不为空', value: FilterMode.IS_NOT_EMPTY },
  { label: '批量', value: FilterMode.BATCH }
];

// 筛选字段配置接口
export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'dateRange' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  width?: number;
}

// 筛选条件值接口
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

// 根据Tab获取筛选字段配置
const getFilterFieldsByTab = (activeTab: string): FilterFieldConfig[] => {
  const commonFields: FilterFieldConfig[] = [
    { key: 'inquiryNo', label: '询价编号', type: 'text', placeholder: '请输入询价编号' },
    { key: 'source', label: '询价来源', type: 'select', placeholder: '请选择询价来源', options: [
      { label: '网站询价', value: 'website' },
      { label: '电话询价', value: 'phone' },
      { label: '邮件询价', value: 'email' },
      { label: '客户端询价', value: 'client' }
    ]},
    { key: 'inquirer', label: '询价人', type: 'text', placeholder: '请输入询价人' },
    { key: 'inquiryStatus', label: '询价状态', type: 'select', placeholder: '请选择询价状态', options: [
      { label: '草稿', value: 'draft' },
      { label: '已提交', value: 'submitted' },
      { label: '已撤回', value: 'withdrawn' }
    ]},
    { key: 'firstQuoteStatus', label: '头程报价状态', type: 'select', placeholder: '请选择头程报价状态', options: [
      { label: '待报价', value: 'pending' },
      { label: '已报价', value: 'quoted' },
      { label: '拒绝报价', value: 'rejected' }
    ]},
    { key: 'mainQuoteStatus', label: '干线报价状态', type: 'select', placeholder: '请选择干线报价状态', options: [
      { label: '待报价', value: 'pending' },
      { label: '已报价', value: 'quoted' },
      { label: '拒绝报价', value: 'rejected' }
    ]},
    { key: 'lastQuoteStatus', label: '尾程报价状态', type: 'select', placeholder: '请选择尾程报价状态', options: [
      { label: '待报价', value: 'pending' },
      { label: '已报价', value: 'quoted' },
      { label: '拒绝报价', value: 'rejected' }
    ]},
    { key: 'cargoReadyTime', label: '货好时间', type: 'dateRange', placeholder: '请选择货好时间' },
    { key: 'cargoNature', label: '货盘性质', type: 'select', placeholder: '请选择货盘性质', options: [
      { label: '普通货物', value: 'normal' },
      { label: '危险品', value: 'dangerous' },
      { label: '冷藏货', value: 'refrigerated' },
      { label: '超重货', value: 'overweight' }
    ]},
    { key: 'shipCompany', label: '船公司', type: 'select', placeholder: '请选择船公司', options: [
      { label: 'SITC', value: 'sitc' },
      { label: 'COSCO', value: 'cosco' },
      { label: 'MSK', value: 'msk' },
      { label: 'ONE', value: 'one' }
    ]},
    { key: 'transitType', label: '直达/中转', type: 'select', placeholder: '请选择直达/中转', options: [
      { label: '直达', value: 'direct' },
      { label: '中转', value: 'transit' }
    ]},
    { key: 'route', label: '航线', type: 'text', placeholder: '请输入航线' },
    { key: 'departurePort', label: '起运港', type: 'text', placeholder: '请输入起运港' },
    { key: 'dischargePort', label: '卸货港', type: 'text', placeholder: '请输入卸货港' },
    { key: 'remark', label: '备注', type: 'text', placeholder: '请输入备注' },
    { key: 'createdAt', label: '创建时间', type: 'dateRange', placeholder: '请选择创建时间' },
    { key: 'clientType', label: '委托单位', type: 'text', placeholder: '请输入委托单位' },
    { key: 'clientName', label: '委托单位名称', type: 'text', placeholder: '请输入委托单位名称' },
    { key: 'entryPerson', label: '创建人', type: 'text', placeholder: '请输入创建人' },
    { key: 'createDate', label: '创建日期', type: 'dateRange', placeholder: '请选择创建日期范围' },
    { key: 'rateModifier', label: '修改人', type: 'text', placeholder: '请输入修改人' },
    { key: 'modifyDate', label: '修改日期', type: 'dateRange', placeholder: '请选择修改日期范围' }
  ];

  // 根据不同Tab返回不同字段
  switch (activeTab) {
    case 'fcl':
      return [
        ...commonFields,
        { key: 'containerInfo', label: '箱型信息', type: 'text', placeholder: '请输入箱型信息' }
      ];
    case 'lcl':
    case 'air':
      return [
        ...commonFields,
        { key: 'weight', label: '重量', type: 'number', placeholder: '请输入重量' },
        { key: 'volume', label: '体积', type: 'number', placeholder: '请输入体积' }
      ];
    default:
      return commonFields;
  }
};

// 定义询价项接口
interface InquiryItem {
  inquiryNo: string;
  source: string;
  inquirer: string;
  inquiryStatus: string;
  firstQuoteStatus: string;
  mainQuoteStatus: string;
  lastQuoteStatus: string;
  cargoReadyTime: string;
  cargoNature: string;
  shipCompany: string;
  transitType: string;
  route: string;
  departurePort: string;
  dischargePort: string;
  remark: string;
  createdAt: string;
  clientType: string;
  clientName: string;
  // 新增字段
  entryPerson: string; // 创建人
  createDate: string; // 创建时间
  rateModifier: string; // 修改人
  modifyDate: string; // 修改时间
  // FCL特有
  containerInfo?: string;
  // LCL/Air特有
  weight?: string;
  volume?: string;
}

// 定义列类型接口
interface ColumnItem {
  title: string;
  dataIndex?: string;
  width?: number;
  sorter?: boolean;
  resizable?: boolean;
  fixed?: 'left' | 'right';
  className?: string;
  render?: (value: any, record: InquiryItem) => React.ReactNode;
}

const InquiryManagement: React.FC = () => {
  // 基础状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const onSelectChange = (keys: (string | number)[]) => setSelectedRowKeys(keys);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  
  // 当前选中的Tab
  const [activeTab, setActiveTab] = useState<string>('fcl');

  // 自定义表格状态
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  
  // 字段可见性状态 - 包含询价管理的所有字段
  const [columnVisibility, setColumnVisibility] = useState({
    inquiryNo: true,
    source: true,
    inquirer: true,
    inquiryStatus: true,
    firstQuoteStatus: true,
    mainQuoteStatus: true,
    lastQuoteStatus: true,
    cargoReadyTime: true,
    cargoNature: true,
    shipCompany: true,
    transitType: true,
    route: true,
    departurePort: true,
    dischargePort: true,
    remark: true,
    createdAt: true,
    clientType: true,
    clientName: true,
    containerInfo: true,
    weight: true,
    volume: true,
    entryPerson: false,
    createDate: false,
    rateModifier: false,
    modifyDate: false
  });

  // 筛选条件状态
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // 筛选功能状态
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');
  
  // 方案管理相关状态
  const [schemeManagementModalVisible, setSchemeManagementModalVisible] = useState(false);
  const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);

  // 筛选字段拖拽状态
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);

  // 未读状态管理
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('inquiry_read_ids_demo_v1') || '[]');
    } catch {
      return [];
    }
  });

  // 获取通知列表
  const getNotifications = (record: InquiryItem): string[] => {
    const notifications: string[] = [];
    
    // 只有当所有相关报价状态都为“已报价”时，才视为可能未读
    // 这里简化逻辑：只要状态是已报价且不在已读列表中，就显示红点
    // 根据需求：头程、干线、尾程同时变为"已报价"
    const allQuoted = record.firstQuoteStatus === '已报价' && 
                      record.mainQuoteStatus === '已报价' && 
                      record.lastQuoteStatus === '已报价';
    
    if (allQuoted && !readIds.includes(record.inquiryNo)) {
      notifications.push('已完成全部报价');
    }
    
    return notifications;
  };

  // 检查是否未读
  const isUnread = (record: InquiryItem) => {
    return getNotifications(record).length > 0;
  };

  // 标记为已读
  const markAsRead = (inquiryNo: string) => {
    if (!readIds.includes(inquiryNo)) {
      const newReadIds = [...readIds, inquiryNo];
      setReadIds(newReadIds);
      localStorage.setItem('inquiry_read_ids_demo_v1', JSON.stringify(newReadIds));
      window.dispatchEvent(new CustomEvent('INQUIRY_UNREAD_UPDATE'));
    }
  };

  // useEffect 初始化字段顺序
  useEffect(() => {
    const fields = Object.keys(columnVisibility);
    setColumnOrder(fields);
    
    const filterFields = getFilterFieldsByTab(activeTab).map(f => f.key);
    setFilterFieldOrder(filterFields);
    
    // 初始化筛选条件
    const defaultConditions = initializeDefaultConditions(activeTab);
    setFilterConditions(defaultConditions);
    
    const defaultScheme = initializeDefaultScheme(activeTab);
    setFilterSchemes([defaultScheme]);
    setCurrentSchemeId('default');
  }, [activeTab]);

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
      name: '常用询价筛选',
      isDefault: false,
      createTime: new Date(Date.now() - 86400000).toISOString(),
      conditions: []
    };
    
    const customScheme2: SchemeData = {
      id: 'custom2',
      name: '美线询价',
      isDefault: false,
      createTime: new Date(Date.now() - 172800000).toISOString(),
      conditions: []
    };
    
    setAllSchemes([defaultScheme, customScheme1, customScheme2]);
  }, []);

  // 导航到询价页面
  const navigateToInquiryForm = () => {
    // 根据当前选中的Tab类型跳转到对应页面
    switch(activeTab) {
      case 'fcl':
        navigate('/controltower/saas/create-inquiry/fcl');
        break;
      case 'lcl':
        navigate('/controltower/saas/create-inquiry/lcl');
        break;
      case 'air':
        navigate('/controltower/saas/create-inquiry/air');
        break;
      default:
        navigate('/controltower/saas/create-inquiry/fcl');
    }
  };

  // 处理Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // 重置分页和选中项
    setCurrent(1);
    setSelectedRowKeys([]);
  };

  // 方案管理相关函数
  const openSchemeManagementModal = () => {
    setSchemeManagementModalVisible(true);
  };

  const closeSchemeManagementModal = () => {
    setSchemeManagementModalVisible(false);
  };

  const handleDeleteScheme = (id: string) => {
    setAllSchemes(prev => prev.filter(scheme => scheme.id !== id));
    // 如果删除的是当前选中的方案，切换到默认方案
    if (currentSchemeId === id) {
      setCurrentSchemeId('default');
    }
  };

  const handleSetDefaultScheme = (id: string) => {
    setAllSchemes(prev => prev.map(scheme => ({
      ...scheme,
      isDefault: scheme.id === id
    })));
  };

  const handleRenameScheme = (id: string, newName: string) => {
    setAllSchemes(prev => prev.map(scheme => 
      scheme.id === id ? { ...scheme, name: newName } : scheme
    ));
  };

  // 初始化默认筛选条件
  const initializeDefaultConditions = (activeTab: string): FilterCondition[] => {
    const fields = getFilterFieldsByTab(activeTab);
    return fields.slice(0, 4).map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: true
    }));
  };

  // 初始化默认筛选方案
  const initializeDefaultScheme = (activeTab: string): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(activeTab),
      isDefault: true
    };
  };

  // 获取可见的筛选条件
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  // 获取第一行显示的筛选条件（最多4个）
  const getFirstRowConditions = (): FilterCondition[] => {
    return getVisibleConditions().slice(0, 4);
  };

  // 切换筛选区展开/收起
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  // 更新筛选条件
  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, mode, value } : condition
    ));
  };

  // 重置筛选条件
  const resetFilterConditions = () => {
    const defaultConditions = initializeDefaultConditions(activeTab);
    setFilterConditions(defaultConditions);
    
    const defaultScheme = initializeDefaultScheme(activeTab);
    setFilterSchemes([defaultScheme]);
    setCurrentSchemeId('default');
    
    Message.success('筛选条件已重置');
  };

  // 应用筛选方案
  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions(scheme.conditions);
      setCurrentSchemeId(schemeId);
    }
  };

  // 打开筛选字段Modal
  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  // 关闭筛选字段Modal
  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  // 打开保存方案Modal
  const openSchemeModal = () => {
    setNewSchemeName('');
    setSchemeModalVisible(true);
  };

  // 关闭保存方案Modal
  const closeSchemeModal = () => {
    setSchemeModalVisible(false);
    setNewSchemeName('');
  };

  // 保存筛选方案
  const saveFilterScheme = () => {
    if (!newSchemeName.trim()) {
      Message.error('请输入方案名称');
      return;
    }
    
    const newScheme: FilterScheme = {
      id: Date.now().toString(),
      name: newSchemeName,
      conditions: [...filterConditions]
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
    Message.success('方案保存成功');
  };

  // 更新筛选条件可见性
  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, visible } : condition
    ));
  };

  // 拖拽功能
  const handleDragStart = (_e: React.DragEvent, columnKey: string) => {
    setDraggedItem(columnKey);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverItem(columnKey);
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetColumnKey);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
      
      setColumnOrder(newOrder);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // 筛选字段拖拽功能
  const handleFilterFieldDragStart = (_e: React.DragEvent, fieldKey: string) => {
    setDraggedFilterField(fieldKey);
  };

  const handleFilterFieldDragOver = (e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    setDragOverFilterField(fieldKey);
  };

  const handleFilterFieldDrop = (e: React.DragEvent, targetFieldKey: string) => {
    e.preventDefault();
    if (draggedFilterField && draggedFilterField !== targetFieldKey) {
      const newOrder = [...filterFieldOrder];
      const draggedIndex = newOrder.indexOf(draggedFilterField);
      const targetIndex = newOrder.indexOf(targetFieldKey);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedFilterField);
      
      setFilterFieldOrder(newOrder);
    }
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  const handleFilterFieldDragEnd = () => {
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  // 获取列标签
  const getColumnLabel = (columnKey: string): string => {
    const fieldLabels: {[key: string]: string} = {
      inquiryNo: '询价编号',
      source: '询价来源',
      inquirer: '询价人',
      inquiryStatus: '询价状态',
      firstQuoteStatus: '头程报价状态',
      mainQuoteStatus: '干线报价状态',
      lastQuoteStatus: '尾程报价状态',
      cargoReadyTime: '货好时间',
      cargoNature: '货盘性质',
      shipCompany: '船公司',
      transitType: '直达/中转',
      route: '航线',
      departurePort: '起运港',
      dischargePort: '卸货港',
      remark: '备注',
      createdAt: '创建时间',
      clientType: '委托单位',
      clientName: '委托单位名称',
      containerInfo: '箱型信息',
      weight: '重量',
      volume: '体积',
      entryPerson: '创建人',
      createDate: '创建日期',
      rateModifier: '修改人',
      modifyDate: '修改日期'
    };
    return fieldLabels[columnKey] || columnKey;
  };

  // 自定义表格功能
  const openCustomTableModal = () => {
    setCustomTableModalVisible(true);
  };

  const closeCustomTableModal = () => {
    setCustomTableModalVisible(false);
  };

  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: visible
    }));
  };

  const resetColumnVisibility = () => {
    const resetVisibility = Object.keys(columnVisibility).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as any);
    setColumnVisibility(resetVisibility);
  };

  const applyColumnSettings = () => {
    closeCustomTableModal();
    Message.success('表格设置已保存');
  };

  // 渲染筛选条件
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getFilterFieldsByTab(activeTab).find(field => field.key === condition.key);
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
              style={{ width: '90px' }}
              size="mini"
              className="filter-mode-select"
            >
              {FilterModeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          
          {/* 输入控件 - 占满整个宽度 */}
          <div className="filter-input-wrapper">
            {fieldConfig.type === 'text' && (
              <Input
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value || ''}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
              />
            )}
            {fieldConfig.type === 'select' && (
              <Select
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
              >
                {fieldConfig.options?.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
            {fieldConfig.type === 'dateRange' && (
              <RangePicker
                value={condition.value}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                style={{ width: '100%' }}
                placeholder={isInputDisabled ? ['（自动判断）', ''] : ['开始日期', '结束日期']}
              />
            )}
            {fieldConfig.type === 'number' && (
              <Input
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value || ''}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
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
              <SchemeSelect
                value={currentSchemeId}
                onChange={applyFilterScheme}
                schemes={allSchemes}
                onSchemeManagement={openSchemeManagementModal}
                placeholder="选择方案"
                style={{ width: '180px' }}
                size="small"
              />
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

  // 表格数据（示例）
  // 根据Tab获取当前要显示的列
  const getColumns = () => {
    // 基础列（所有类型共有）
    const baseColumns: ColumnItem[] = [
      { 
        title: '询价编号', 
        dataIndex: 'inquiryNo', 
        width: 140, 
        sorter: true, 
        resizable: true, 
        render: (val: string, record: InquiryItem) => {
          const notifications = getNotifications(record);
          const hasNotifications = notifications.length > 0;

          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {hasNotifications && (
                <Tooltip 
                  position="bl"
                  color="#fff"
                  mouseLeaveDelay={0}
                  popupHoverStay={false}
                  content={
                    <div style={{ textAlign: 'left', minWidth: '160px', padding: '8px 4px' }}>
                      <div style={{ 
                        color: '#FF7D00', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        marginBottom: '8px', 
                        paddingBottom: '8px',
                        borderBottom: '1px solid #F2F3F5',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ marginRight: '6px' }}>🔔</span>
                        消息提醒
                      </div>
                      <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc', color: '#1D2129' }}>
                        {notifications.map((note, index) => (
                          <li key={index} style={{ marginBottom: index === notifications.length - 1 ? 0 : 8, fontSize: '13px', lineHeight: '1.5' }}>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                >
                  <div 
                    className="premium-red-dot animate" 
                    style={{ 
                      marginRight: 8,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '10px',
                      lineHeight: 1,
                      cursor: 'pointer'
                    }}
                  >
                    {notifications.length}
                  </div>
                </Tooltip>
              )}
              <Tooltip content={val} mini>
                <span className="no-ellipsis">{val}</span>
              </Tooltip>
            </div>
          );
        } 
      },
      { title: '询价来源', dataIndex: 'source', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '询价人', dataIndex: 'inquirer', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { 
        title: '询价状态', 
        dataIndex: 'inquiryStatus', 
        width: 100,
        sorter: true, 
        resizable: true, 
        render: (val: string) => {
          let color = '';
          switch(val) {
            case '草稿':
              color = '#86909C'; // 灰色
              break;
            case '已提交':
              color = '#00B42A'; // 绿色
              break;
            case '已撤回':
              color = '#F53F3F'; // 红色
              break;
            default:
              color = '#86909C'; // 默认灰色
          }
          return (
            <Tooltip content={val} mini>
              <div className="flex items-center">
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                <span className="no-ellipsis">{val}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { 
        title: '头程报价状态', 
        dataIndex: 'firstQuoteStatus', 
        sorter: true, 
        resizable: true, 
        width: 150,
        render: (val: string) => {
          let color = '';
          switch(val) {
            case '待报价':
              color = '#F7BA1E'; // 黄色
              break;
            case '已报价':
              color = '#00B42A'; // 绿色
              break;
            case '拒绝报价':
              color = '#F53F3F'; // 红色
              break;
            default:
              color = '#86909C'; // 默认灰色
          }
          return (
            <Tooltip content={val} mini>
              <div className="flex items-center">
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                <span className="no-ellipsis">{val}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { 
        title: '干线报价状态', 
        dataIndex: 'mainQuoteStatus', 
        sorter: true, 
        resizable: true, 
        width: 150,
        render: (val: string) => {
          let color = '';
          switch(val) {
            case '待报价':
              color = '#F7BA1E'; // 黄色
              break;
            case '已报价':
              color = '#00B42A'; // 绿色
              break;
            case '拒绝报价':
              color = '#F53F3F'; // 红色
              break;
            default:
              color = '#86909C'; // 默认灰色
          }
          return (
            <Tooltip content={val} mini>
              <div className="flex items-center">
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                <span className="no-ellipsis">{val}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { 
        title: '尾程报价状态', 
        dataIndex: 'lastQuoteStatus', 
        sorter: true, 
        resizable: true, 
        width: 150,
        render: (val: string) => {
          let color = '';
          switch(val) {
            case '待报价':
              color = '#F7BA1E'; // 黄色
              break;
            case '已报价':
              color = '#00B42A'; // 绿色
              break;
            case '拒绝报价':
              color = '#F53F3F'; // 红色
              break;
            default:
              color = '#86909C'; // 默认灰色
          }
          return (
            <Tooltip content={val} mini>
              <div className="flex items-center">
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                <span className="no-ellipsis">{val}</span>
              </div>
            </Tooltip>
          );
        }
      },
    ];

    // 根据Tab添加特定的列
    let specificColumns: ColumnItem[] = [];
    if (activeTab === 'fcl') {
      specificColumns = [
        { title: '箱型箱量', dataIndex: 'containerInfo', width: 160, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      ];
    } else if (activeTab === 'lcl' || activeTab === 'air') {
      specificColumns = [
        { title: '重量(KGS)', dataIndex: 'weight', width: 120, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
        { title: '体积(CBM)', dataIndex: 'volume', width: 120, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      ];
    }

    // 公共后续列
    const commonColumns: ColumnItem[] = [
      { title: '货好时间', dataIndex: 'cargoReadyTime', width: 120, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '货盘性质', dataIndex: 'cargoNature', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '船公司', dataIndex: 'shipCompany', width: 160, sorter: true, resizable: true, render: (val: string) => {
          if (val === '不指定') {
            return <Tooltip content="不指定" mini><span className="no-ellipsis text-gray-400">不指定</span></Tooltip>;
          }
          return <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip>;
        }
      },
      { title: '直达/中转', dataIndex: 'transitType', width: 100, sorter: true, resizable: true, render: (val: string) => {
          if (!val) {
            return <Tooltip content="不限" mini><span className="no-ellipsis text-gray-400">不限</span></Tooltip>;
          }
          return <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip>;
        } 
      },
      { title: '航线', dataIndex: 'route', width: 150, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '起运港', dataIndex: 'departurePort', width: 160, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '卸货港', dataIndex: 'dischargePort', width: 160, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '备注', dataIndex: 'remark', width: 200, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '创建时间', dataIndex: 'createdAt', width: 140, sorter: true, resizable: true, render: (val: string) => {
          const [date, time] = val.split(' ');
          return (
            <Tooltip content={val} mini>
              <div className="flex flex-col text-xs leading-tight">
                <span className="no-ellipsis">{date}</span>
                <span className="no-ellipsis text-gray-500">{time}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { title: '委托单位', dataIndex: 'clientType', width: 120, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '委托单位名称', dataIndex: 'clientName', width: 160, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '创建人', dataIndex: 'entryPerson', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '创建日期', dataIndex: 'createDate', width: 140, sorter: true, resizable: true, render: (val: string) => {
          const [date, time] = val.split(' ');
          return (
            <Tooltip content={val} mini>
              <div className="flex flex-col text-xs leading-tight">
                <span className="no-ellipsis">{date}</span>
                <span className="no-ellipsis text-gray-500">{time}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { title: '修改人', dataIndex: 'rateModifier', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '修改日期', dataIndex: 'modifyDate', width: 140, sorter: true, resizable: true, render: (val: string) => {
          const [date, time] = val.split(' ');
          return (
            <Tooltip content={val} mini>
              <div className="flex flex-col text-xs leading-tight">
                <span className="no-ellipsis">{date}</span>
                <span className="no-ellipsis text-gray-500">{time}</span>
              </div>
            </Tooltip>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'operations',
        fixed: 'right' as const,
        width: 210,
        className: 'action-column',
        render: (_: unknown, record: InquiryItem) => {
          // 检查是否可以撤销：头程、干线、尾程状态都是待报价
          const canWithdraw = record.firstQuoteStatus === '待报价' && 
                            record.mainQuoteStatus === '待报价' && 
                            record.lastQuoteStatus === '待报价';
          
          // 检查是否可以删除：询价状态是草稿
          const canDelete = record.inquiryStatus === '草稿';
          
          return (
            <Space size={0}>
              <Button 
                type="text" 
                size="small" 
                onClick={() => {
                  markAsRead(record.inquiryNo);
                  navigate(`/controltower/saas/inquiry-detail/${activeTab}/${record.inquiryNo}`);
                }}
              >
                详情
              </Button>
              <Button 
                type="text" 
                size="small"
                onClick={() => {
                  markAsRead(record.inquiryNo);
                  navigate(`/controltower/saas/edit-inquiry/${activeTab}/${record.inquiryNo}`);
                }}
              >
                编辑
              </Button>
              <Dropdown
                droplist={
                  <Menu>
                    {canWithdraw && (
                      <Menu.Item key="withdraw">
                        撤销
                      </Menu.Item>
                    )}
                    {canDelete && (
                      <Menu.Item 
                        key="delete"
                        style={{ color: 'red' }}
                      >
                        删除
                      </Menu.Item>
                    )}
                  </Menu>
                }
                position="bottom"
                trigger="click"
              >
                <Button type="text" size="small">
                  更多
                </Button>
              </Dropdown>
            </Space>
          );
        },
      },
    ];

    return [...baseColumns, ...specificColumns, ...commonColumns];
  };
  
  const columns = getColumns();

  // 整箱数据
  const fclData: InquiryItem[] = [
    {
      inquiryNo: 'R20249998', source: '内部', inquirer: '演示用户', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '已报价', containerInfo: '2*20GP', cargoReadyTime: '1周内', cargoNature: '询价', shipCompany: 'MSK | 马士基', transitType: '直达', route: '跨太平洋东行', departurePort: 'CNNGB | Ningbo', dischargePort: 'USLGB | Long Beach', remark: '演示数据-未读', createdAt: '2024-05-16 09:00:00', clientType: '正式客户', clientName: '演示客户A', entryPerson: '演示用户', createDate: '2024-05-16 09:00:00', rateModifier: '系统', modifyDate: '2024-05-16 10:00:00',
    },
    {
      inquiryNo: 'R20249999', source: '内部', inquirer: '演示用户', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '已报价', containerInfo: '1*40HC', cargoReadyTime: '3天内', cargoNature: '实单', shipCompany: 'CMA | 达飞轮船', transitType: '直达', route: '远东西行', departurePort: 'CNSHA | Shanghai', dischargePort: 'NLRTM | Rotterdam', remark: '演示数据-未读', createdAt: '2024-05-16 09:30:00', clientType: '正式客户', clientName: '演示客户B', entryPerson: '演示用户', createDate: '2024-05-16 09:30:00', rateModifier: '系统', modifyDate: '2024-05-16 10:30:00',
    },
    {
      inquiryNo: 'R20249995', source: '内部', inquirer: '演示用户', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '已报价', containerInfo: '1*20GP', cargoReadyTime: '1周内', cargoNature: '询价', shipCompany: 'MSC | 地中海航运', transitType: '中转', route: '地中海航线', departurePort: 'CNSHA | Shanghai', dischargePort: 'ITGOA | Genoa', remark: '演示数据-未读', createdAt: '2024-05-16 10:00:00', clientType: '正式客户', clientName: '演示客户C', entryPerson: '演示用户', createDate: '2024-05-16 10:00:00', rateModifier: '系统', modifyDate: '2024-05-16 11:00:00',
    },
    {
      inquiryNo: 'R20249996', source: '内部', inquirer: '演示用户', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '已报价', containerInfo: '2*40HC', cargoReadyTime: '2周内', cargoNature: '实单', shipCompany: 'HPL | 赫伯罗特', transitType: '直达', route: '欧洲航线', departurePort: 'CNYTN | Yantian', dischargePort: 'DEHAM | Hamburg', remark: '演示数据-未读', createdAt: '2024-05-16 10:30:00', clientType: '正式客户', clientName: '演示客户D', entryPerson: '演示用户', createDate: '2024-05-16 10:30:00', rateModifier: '系统', modifyDate: '2024-05-16 11:30:00',
    },
    {
      inquiryNo: 'R20249997', source: '内部', inquirer: '演示用户', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '已报价', containerInfo: '1*40GP', cargoReadyTime: '3天内', cargoNature: '询价', shipCompany: 'EMC | 长荣海运', transitType: '直达', route: '美西航线', departurePort: 'CNXMN | Xiamen', dischargePort: 'USLAX | Los Angeles', remark: '演示数据-未读', createdAt: '2024-05-16 11:00:00', clientType: '正式客户', clientName: '演示客户E', entryPerson: '演示用户', createDate: '2024-05-16 11:00:00', rateModifier: '系统', modifyDate: '2024-05-16 12:00:00',
    },
    {
      inquiryNo: 'R20240001', source: '内部', inquirer: '张三', inquiryStatus: '草稿', firstQuoteStatus: '待报价', mainQuoteStatus: '待报价', lastQuoteStatus: '待报价', containerInfo: '1*20GP+2*40HC', cargoReadyTime: '1周内', cargoNature: '询价', shipCompany: '不指定', transitType: '直达', route: '跨太平洋东行', departurePort: 'CNSHA | Shanghai', dischargePort: 'USLAX | Los Angeles', remark: '电子产品 优先考虑直达航线', createdAt: '2024-05-10 08:30:15', clientType: '正式客户', clientName: '上海测试', entryPerson: '张三', createDate: '2024-05-10 08:30:15', rateModifier: '李四', modifyDate: '2024-05-10 10:30:15',
    },
    {
      inquiryNo: 'R20240002', source: '内部', inquirer: '李四', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '待报价', containerInfo: '3*40HC', cargoReadyTime: '2周内', cargoNature: '实单', shipCompany: 'COSCO | 中远海运', transitType: '', route: '跨太平洋东行', departurePort: 'CNTAO | Qingdao', dischargePort: 'USNYC | New York', remark: '需要温控设备', createdAt: '2024-05-10 09:45:22', clientType: '正式客户', clientName: '深圳测试', entryPerson: '李四', createDate: '2024-05-10 09:45:22', rateModifier: '王五', modifyDate: '2024-05-10 11:45:22',
    },
    {
      inquiryNo: 'R20240003', source: '内部', inquirer: '王五', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '已报价', containerInfo: '2*20GP', cargoReadyTime: '2024-06-15', cargoNature: '询价', shipCompany: '不指定', transitType: '直达', route: '远东西行', departurePort: 'CNNGB | Ningbo', dischargePort: 'DEHAM | Hamburg', remark: '', createdAt: '2024-05-10 10:15:30', clientType: '正式客户', clientName: '青岛测试', entryPerson: '王五', createDate: '2024-05-10 10:15:30', rateModifier: '赵六', modifyDate: '2024-05-10 12:15:30',
    },
    {
      inquiryNo: 'R20240004', source: '内部', inquirer: '赵六', inquiryStatus: '草稿', firstQuoteStatus: '拒绝报价', mainQuoteStatus: '待报价', lastQuoteStatus: '待报价', containerInfo: '1*40HC+1*40HQ', cargoReadyTime: '1个月内', cargoNature: '实单', shipCompany: 'CMA | 达飞轮船', transitType: '', route: '远东西行', departurePort: 'CNXMN | Xiamen', dischargePort: 'GBFXT | Felixstowe', remark: '客户要求准班期', createdAt: '2024-05-10 10:20:45', clientType: '正式客户', clientName: '宁波测试', entryPerson: '赵六', createDate: '2024-05-10 10:20:45', rateModifier: '钱七', modifyDate: '2024-05-10 14:20:45',
    },
    {
      inquiryNo: 'R20240005', source: '内部', inquirer: '钱七', inquiryStatus: '草稿', firstQuoteStatus: '待报价', mainQuoteStatus: '待报价', lastQuoteStatus: '拒绝报价', containerInfo: '5*40GP', cargoReadyTime: '暂不确定', cargoNature: '询价', shipCompany: '不指定', transitType: '', route: '亚洲区域', departurePort: 'CNDLC | Dalian', dischargePort: 'SGSIN | Singapore', remark: '危险品6.1类', createdAt: '2024-05-10 10:25:10', clientType: '正式客户', clientName: '大连测试', entryPerson: '钱七', createDate: '2024-05-10 10:25:10', rateModifier: '孙八', modifyDate: '2024-05-10 15:25:10',
    },
  ];

  // 拼箱数据
  const lclData: InquiryItem[] = [
    {
      inquiryNo: 'L20240001', source: '内部', inquirer: '张三', inquiryStatus: '草稿', firstQuoteStatus: '待报价', mainQuoteStatus: '待报价', lastQuoteStatus: '待报价', weight: '1200', volume: '3.5', cargoReadyTime: '1周内', cargoNature: '询价', shipCompany: '不指定', transitType: '直达', route: '跨太平洋东行', departurePort: 'CNSHA | Shanghai', dischargePort: 'USLAX | Los Angeles', remark: '服装类产品', createdAt: '2024-05-12 08:30:15', clientType: '正式客户', clientName: '杭州测试', entryPerson: '张三', createDate: '2024-05-12 08:30:15', rateModifier: '李四', modifyDate: '2024-05-12 10:30:15',
    },
    {
      inquiryNo: 'L20240002', source: '内部', inquirer: '李四', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '待报价', weight: '850', volume: '2.1', cargoReadyTime: '2周内', cargoNature: '实单', shipCompany: 'COSCO | 中远海运', transitType: '', route: '跨太平洋东行', departurePort: 'CNTAO | Qingdao', dischargePort: 'USNYC | New York', remark: '鞋类产品', createdAt: '2024-05-12 09:45:22', clientType: '正式客户', clientName: '温州测试', entryPerson: '李四', createDate: '2024-05-12 09:45:22', rateModifier: '王五', modifyDate: '2024-05-12 11:45:22',
    },
    {
      inquiryNo: 'L20240003', source: '内部', inquirer: '王五', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '已报价', weight: '1500', volume: '4.8', cargoReadyTime: '2024-06-15', cargoNature: '询价', shipCompany: '不指定', transitType: '直达', route: '远东西行', departurePort: 'CNNGB | Ningbo', dischargePort: 'DEHAM | Hamburg', remark: '五金配件', createdAt: '2024-05-12 10:15:30', clientType: '正式客户', clientName: '宁波测试', entryPerson: '王五', createDate: '2024-05-12 10:15:30', rateModifier: '赵六', modifyDate: '2024-05-12 12:15:30',
    },
  ];

  // 空运数据
  const airData: InquiryItem[] = [
    {
      inquiryNo: 'A20240001', source: '内部', inquirer: '张三', inquiryStatus: '草稿', firstQuoteStatus: '待报价', mainQuoteStatus: '待报价', lastQuoteStatus: '待报价', weight: '350', volume: '1.2', cargoReadyTime: '1周内', cargoNature: '询价', shipCompany: '不指定', transitType: '直达', route: '跨太平洋东行', departurePort: 'CNPVG | Shanghai Pudong', dischargePort: 'USLAX | Los Angeles', remark: '电子产品 紧急发货', createdAt: '2024-05-15 08:30:15', clientType: '正式客户', clientName: '上海电子', entryPerson: '张三', createDate: '2024-05-15 08:30:15', rateModifier: '李四', modifyDate: '2024-05-15 10:30:15',
    },
    {
      inquiryNo: 'A20240002', source: '内部', inquirer: '李四', inquiryStatus: '已提交', firstQuoteStatus: '已报价', mainQuoteStatus: '已报价', lastQuoteStatus: '待报价', weight: '120', volume: '0.5', cargoReadyTime: '3天内', cargoNature: '实单', shipCompany: 'CX | 国泰航空', transitType: '', route: '跨太平洋东行', departurePort: 'CNHKG | Hong Kong', dischargePort: 'USNYC | New York', remark: '医疗产品', createdAt: '2024-05-15 09:45:22', clientType: '正式客户', clientName: '深圳医疗', entryPerson: '李四', createDate: '2024-05-15 09:45:22', rateModifier: '王五', modifyDate: '2024-05-15 11:45:22',
    },
  ];

  // 根据当前Tab获取对应数据
  const getCurrentData = () => {
    let currentData: InquiryItem[] = [];
    switch(activeTab) {
      case 'fcl':
        currentData = fclData;
        break;
      case 'lcl':
        currentData = lclData;
        break;
      case 'air':
        currentData = airData;
        break;
      default:
        currentData = fclData;
    }
    
    // 排序：未读置顶
    return [...currentData].sort((a, b) => {
      const aUnread = isUnread(a);
      const bUnread = isUnread(b);
      if (aUnread && !bUnread) return -1;
      if (!aUnread && bUnread) return 1;
      return 0;
    });
  };
  
  const data = getCurrentData();

  // 监听数据变化，更新全局未读数量
  useEffect(() => {
    // 计算所有类型的未读总数（不仅是当前Tab）
    // 这里为了演示，假设只计算当前Tab的未读数，或者应该合并所有数据
    // 简单起见，我们计算所有数据的未读数
    const allData = [...fclData, ...lclData, ...airData];
    const unreadCount = allData.filter(item => isUnread(item)).length;
    
    localStorage.setItem('inquiry_unread_count', String(unreadCount));
    window.dispatchEvent(new CustomEvent('INQUIRY_UNREAD_UPDATE'));
  }, [readIds, activeTab]); // 当已读列表或Tab变化时更新

  const pagination = {
    showTotal: true,
    total: data.length,
    pageSize,
    current,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [10, 20, 50, 100],
    onChange: (page: number) => setCurrent(page),
    onPageSizeChange: (size: number) => setPageSize(size),
  };

  return (
    <ControlTowerSaasLayout menuSelectedKey="9" breadcrumb={
      <Breadcrumb>
        <Breadcrumb.Item>询价报价</Breadcrumb.Item>
        <Breadcrumb.Item>询价管理</Breadcrumb.Item>
      </Breadcrumb>
    }>
      <Card>
        <Tabs activeTab={activeTab} onChange={handleTabChange} className="mb-4">
          <TabPane key="fcl" title="整箱询价" />
          <TabPane key="lcl" title="拼箱询价" />
          <TabPane key="air" title="空运询价" />
          <TabPane key="precarriage" title="港前询价" />
          <TabPane key="oncarriage" title="尾程询价" />
        </Tabs>
        {renderNewFilterArea()}
        <Card>
          <div className="flex justify-between mb-4">
            <Space>
              {/* 新增询价按钮 - 直接使用当前Tab类型 */}
              <Button 
                type="primary" 
                icon={<IconPlus />} 
                onClick={navigateToInquiryForm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {activeTab === 'fcl' ? '新增整箱询价' : 
                 activeTab === 'lcl' ? '新增拼箱询价' : '新增空运询价'}
              </Button>
              
              {/* 导出列表按钮 */}
              <Button icon={<IconDownload />}>导出列表</Button>
            </Space>
            <div 
              className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={openCustomTableModal}
            >
              <IconList className="mr-1" />
              <span>自定义表格</span>
            </div>
          </div>
          <Table
            rowKey="inquiryNo"
            loading={false}
            columns={columns}
            data={data}
            rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
            pagination={pagination}
            scroll={{ x: 2880 }}
            border={false}
            className="mt-4 inquiry-table-nowrap"
          />
          <div className="mt-2 text-gray-500 text-sm">共 {data.length} 条记录，每页 {pageSize} 条，共 {Math.ceil(data.length / pageSize)} 页</div>
        </Card>
        
        {/* 自定义表格抽屉 */}
        <Drawer
          width={480}
          title={
            <div className="flex items-center">
              <IconSettings className="mr-2" />
              <span>自定义表格设置</span>
            </div>
          }
          visible={customTableModalVisible}
          onCancel={closeCustomTableModal}
          footer={
            <div className="flex justify-between">
              <Button onClick={resetColumnVisibility}>重置默认</Button>
              <Space>
                <Button onClick={closeCustomTableModal}>取消</Button>
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
                    checked={(columnVisibility as any)[columnKey] || false} 
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
                const allFields = getFilterFieldsByTab(activeTab);
                const newConditions = allFields.map(field => ({
                  key: field.key,
                  mode: FilterMode.EQUAL,
                  value: '',
                  visible: true
                }));
                setFilterConditions(newConditions);
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
                已选择 {getVisibleConditions().length}/{getFilterFieldsByTab(activeTab).length} 个字段
              </div>
              <Space>
                <Button size="small" onClick={() => {
                  const allFields = getFilterFieldsByTab(activeTab);
                  setFilterConditions(prev => prev.map(condition => ({
                    ...condition,
                    visible: allFields.some(field => field.key === condition.key)
                  })));
                }}>全选</Button>
                <Button size="small" onClick={() => {
                  setFilterConditions(prev => prev.map(condition => ({
                    ...condition,
                    visible: false
                  })));
                }}>清空</Button>
              </Space>
            </div>
            
            {/* 可拖拽的筛选字段列表 */}
            <div className="flex-1 overflow-y-auto px-4">
              {filterFieldOrder.map((fieldKey, index) => {
                const condition = filterConditions.find(c => c.key === fieldKey);
                const fieldConfig = getFilterFieldsByTab(activeTab).find(f => f.key === fieldKey);
                if (!fieldConfig) return null;
                
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
                        <span className="text-sm font-medium">{fieldConfig.label}</span>
                      </div>
                    </div>
                    <Switch 
                      size="small"
                      checked={condition?.visible || false} 
                      onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer>

        {/* 保存筛选方案弹窗 */}
        <Modal
          title="保存筛选方案"
          visible={schemeModalVisible}
          onCancel={closeSchemeModal}
          footer={[
            <Button key="cancel" onClick={closeSchemeModal}>取消</Button>,
            <Button key="save" type="primary" onClick={saveFilterScheme}>保存</Button>,
          ]}
          style={{ width: 400 }}
        >
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">方案名称</label>
              <Input
                placeholder="请输入方案名称"
                value={newSchemeName}
                onChange={setNewSchemeName}
                maxLength={50}
              />
            </div>
            <div className="text-sm text-gray-500">
              将保存当前的筛选条件配置为新方案
            </div>
          </div>
        </Modal>

        {/* 方案管理弹窗 */}
        <SchemeManagementModal
          visible={schemeManagementModalVisible}
          onCancel={closeSchemeManagementModal}
          schemes={allSchemes}
          onDeleteScheme={handleDeleteScheme}
          onSetDefault={handleSetDefaultScheme}
          onRenameScheme={handleRenameScheme}
        />
      </Card>
    </ControlTowerSaasLayout>
  );
};

export default InquiryManagement;