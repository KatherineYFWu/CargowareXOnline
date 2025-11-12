import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Drawer,
  Form,
  InputNumber,
  Message,
  Modal,
  Checkbox,
  Tooltip,
  Typography,
  Grid,
  Radio,
  Switch,
  Tabs
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconDownload,
  IconSettings,
  IconEye,
  IconDelete,
  IconDragDotVertical,
  IconUp,
  IconDown,
  IconLeft,
  IconRight,
  IconList,
  IconSync
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import SchemeSelect from '../saas/SchemeSelect';
import SchemeManagementModal from '../saas/SchemeManagementModal';
import AIAssistant from '../layout/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileContract, 
  faAnchor, 
  faFileAlt, 
  faTruck, 
  faWarehouse, 
  faShippingFast,
  faFileInvoiceDollar,
  faFileText,
  faCogs,
  faBox,
  faFileImport,
  faWeight,
  faReceipt,
  faExchangeAlt,
  faClock,
  faCheckCircle,
  faShoppingCart,
  faCubes,
  faUndo,
  faPlay,
  faStop,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

// 导入交通工具图片
import vesselImg from '../../../assets/Vessel.png';
import planeImg from '../../../assets/plane.png';
import truckImg from '../../../assets/truck.png';
import trainImg from '../../../assets/train.png';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const { Title } = Typography;
const { TabPane } = Tabs;

// 筛选模式枚举
enum FilterMode {
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
interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'input' | 'select' | 'dateRange' | 'numberRange';
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  visible?: boolean;
}

// 筛选条件值接口
interface FilterCondition {
  field: string;
  operator: string;
  value: any;
  mode: FilterMode;
  visible: boolean;
}

// 筛选方案接口
interface FilterScheme {
  id: string;
  name: string;
  conditions: FilterCondition[];
  isDefault?: boolean;
  createTime?: string;
}

// 订单管理筛选字段配置
const getOrderFilterFields = (): FilterFieldConfig[] => [
  {
    key: 'orderNumber',
    label: '订单编号',
    type: 'input',
    placeholder: '请输入订单编号',
    visible: true
  },
  {
    key: 'transportType',
    label: '运输类型',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '整箱', value: 'fcl' },
      { label: '拼箱', value: 'lcl' }
    ],
    visible: true
  },
  {
    key: 'originPort',
    label: '起运港',
    type: 'input',
    placeholder: '请输入起运港',
    visible: true
  },
  {
    key: 'destinationPort',
    label: '目的港',
    type: 'input',
    placeholder: '请输入目的港',
    visible: true
  },
  {
    key: 'shippingCompany',
    label: '船公司',
    type: 'input',
    placeholder: '请输入船公司',
    visible: true
  },
  {
    key: 'vesselVoyage',
    label: '船名航次',
    type: 'input',
    placeholder: '请输入船名航次',
    visible: true
  },
  {
    key: 'creator',
    label: '创建人',
    type: 'input',
    placeholder: '请输入创建人',
    visible: true
  },
  {
    key: 'createDateRange',
    label: '创建日期',
    type: 'dateRange',
    visible: true
  },
  {
    key: 'remarks',
    label: '备注',
    type: 'input',
    placeholder: '请输入备注',
    visible: false
  }
];
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface OrderItem {
  key: string;
  orderNo: string;
  type: string;
  originPort: string;
  destinationPort: string;
  shippingCompany: string;
  vesselVoyage: string;
  creator: string;
  createTime: string;
}

// Mock企业名称数据
const mockCompanies = [
  { label: '深圳市华润物流有限公司', value: 'huarun_logistics' },
  { label: '上海中远海运集装箱运输有限公司', value: 'cosco_shipping' },
  { label: '广州港集团有限公司', value: 'guangzhou_port' },
  { label: '青岛海尔物流有限公司', value: 'haier_logistics' },
  { label: '宁波舟山港集团有限公司', value: 'ningbo_port' },
  { label: '厦门象屿集团有限公司', value: 'xiangyu_group' },
  { label: '天津港集团有限公司', value: 'tianjin_port' },
  { label: '大连港集团有限公司', value: 'dalian_port' }
];

const OrderManagement: React.FC = () => {
  // Tab状态管理
  const [activeTab, setActiveTab] = useState<string>('sea');
  
  const [createForm] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [orderType, setOrderType] = useState<string>('');
  const [aiVisible, setAiVisible] = useState(false);
  const navigate = useNavigate();

  /**
   * Tab 切换处理函数
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  /**
   * 根据运输方式获取对应的交通工具图片
   */
  const getTransportImage = (transportType: string): string => {
    switch (transportType) {
      case 'air':
        return planeImg;
      case 'land':
        return truckImg;
      case 'rail':
        return trainImg;
      case 'sea':
      default:
        return vesselImg;
    }
  };

  /**
   * 根据运输方式获取对应的交通工具描述
   */
  const getTransportAlt = (transportType: string): string => {
    switch (transportType) {
      case 'air':
        return '飞机';
      case 'land':
        return '卡车';
      case 'rail':
        return '火车';
      case 'sea':
      default:
        return '集装箱船';
    }
  };

  /**
   * 自定义表格相关函数
   */
  const closeCustomTableModal = () => {
    setCustomTableModalVisible(false);
  };

  const handleColumnVisibilityChange = (columnKey: string, checked: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: checked
    }));
  };

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

  const getColumnLabel = (columnKey: string): string => {
    const columnMap: Record<string, string> = {
      'orderNo': '订单编号',
      'type': '运输类型',
      'originPort': '起运港',
      'destinationPort': '目的港',
      'shippingCompany': '船公司',
      'vesselVoyage': '船名航次',
      'creator': '创建人',
      'createTime': '创建时间',
      'actions': '操作'
    };
    return columnMap[columnKey] || columnKey;
  };

  /**
   * 同步订单相关函数
   */
  const openSyncModal = () => {
    setSyncModalVisible(true);
  };

  const closeSyncModal = () => {
    setSyncModalVisible(false);
    setSyncPlatform('CargoWare');
    setSyncModes(['newOrders', 'updateOrders']);
    setSyncSuccess(false);
    setSyncResult(null);
  };

  const handleSyncConfirm = async () => {
    if (!syncPlatform) {
      Message.error('请选择第三方平台');
      return;
    }
    
    if (syncModes.length === 0) {
      Message.error('请选择至少一种同步模式');
      return;
    }

    setSyncLoading(true);
    
    try {
      // 模拟同步过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 生成模拟同步结果
      const mockResult = {
        newOrderCount: Math.floor(Math.random() * 20) + 5, // 5-24票新增订单
        updateOrderCount: Math.floor(Math.random() * 15) + 3, // 3-17票更新订单
      };
      
      setSyncResult(mockResult);
      setSyncSuccess(true);
    } catch (error) {
      Message.error('同步失败，请重试');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSyncModeChange = (checkedValues: string[]) => {
    setSyncModes(checkedValues);
  };

  // 初始化筛选系统
  useEffect(() => {
    initializeDefaultConditions();
    initializeDefaultScheme();
    const fields = getOrderFilterFields();
    setFilterFieldOrder(fields.map(f => f.key));
    
    // 初始化自定义表格状态
    const defaultColumns = ['orderNo', 'type', 'originPort', 'destinationPort', 'shippingCompany', 'vesselVoyage', 'creator', 'createTime', 'actions'];
    setColumnOrder(defaultColumns);
    const defaultVisibility: Record<string, boolean> = {};
    defaultColumns.forEach(col => {
      defaultVisibility[col] = true;
    });
    setColumnVisibility(defaultVisibility);
  }, []);

  /**
   * 初始化默认筛选条件
   */
  const initializeDefaultConditions = () => {
    const fields = getOrderFilterFields();
    const defaultConditions: FilterCondition[] = fields
      .filter(field => field.visible)
      .map(field => ({
        field: field.key,
        operator: getDefaultOperator(field.type),
        value: getDefaultValue(field.type),
        mode: FilterMode.EQUAL,
        visible: true
      }));
    setFilterConditions(defaultConditions);
  };

  /**
   * 初始化默认方案
   */
  const initializeDefaultScheme = () => {
    const defaultScheme: FilterScheme = {
      id: 'default',
      name: '默认方案',
      conditions: [],
      isDefault: true,
      createTime: new Date().toISOString()
    };
    setFilterSchemes([defaultScheme]);
    setAllSchemes([defaultScheme]);
  };

  /**
   * 获取字段类型的默认操作符
   */
  const getDefaultOperator = (type: string): string => {
    switch (type) {
      case 'input':
        return 'contains';
      case 'select':
        return 'equals';
      case 'dateRange':
        return 'between';
      case 'numberRange':
        return 'between';
      default:
        return 'equals';
    }
  };

  /**
   * 获取字段类型的默认值
   */
  const getDefaultValue = (type: string): any => {
    switch (type) {
      case 'input':
        return '';
      case 'select':
        return '';
      case 'dateRange':
        return [null, null];
      case 'numberRange':
        return [null, null];
      default:
        return '';
    }
  };

  /**
   * 获取可见的筛选条件
   */
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  /**
   * 获取第一行显示的筛选条件
   */
  const getFirstRowConditions = (): FilterCondition[] => {
    const visibleConditions = getVisibleConditions();
    return filterExpanded ? visibleConditions : visibleConditions.slice(0, 4);
  };

  /**
   * 切换筛选区展开/收起
   */
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  /**
   * 更新筛选条件
   */
  const updateFilterCondition = (index: number, field: keyof FilterCondition, value: any) => {
    const newConditions = [...filterConditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFilterConditions(newConditions);
  };

  /**
   * 重置筛选条件
   */
  const resetFilterConditions = () => {
    initializeDefaultConditions();
    Message.success('筛选条件已重置');
  };

  /**
   * 应用筛选方案
   */
  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions(scheme.conditions);
      setCurrentSchemeId(schemeId);
      Message.success(`已应用方案：${scheme.name}`);
    }
  };

  /**
   * 打开筛选字段设置弹窗
   */
  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  /**
   * 关闭筛选字段设置弹窗
   */
  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  /**
   * 打开保存方案弹窗
   */
  const openSchemeModal = () => {
    setSchemeModalVisible(true);
  };

  /**
   * 关闭保存方案弹窗
   */
  const closeSchemeModal = () => {
    setSchemeModalVisible(false);
    setNewSchemeName('');
  };

  /**
   * 保存筛选方案
   */
  const saveFilterScheme = (schemeName?: string) => {
    const nameToUse = schemeName || newSchemeName;
    if (!nameToUse.trim()) {
      Message.error('请输入方案名称');
      return;
    }

    const newScheme: FilterScheme = {
      id: Date.now().toString(),
      name: nameToUse.trim(),
      conditions: [...filterConditions],
      isDefault: false,
      createTime: new Date().toISOString()
    };

    setFilterSchemes([...filterSchemes, newScheme]);
    setAllSchemes([...allSchemes, newScheme]);
    closeSchemeModal();
    Message.success('方案保存成功');
  };

  /**
   * 方案管理相关函数
   */
  const openSchemeManagementModal = () => {
    setSchemeManagementModalVisible(true);
  };

  const closeSchemeManagementModal = () => {
    setSchemeManagementModalVisible(false);
  };

  const handleDeleteScheme = (id: string) => {
    const newSchemes = allSchemes.filter(s => s.id !== id);
    setAllSchemes(newSchemes);
    setFilterSchemes(newSchemes);
    if (currentSchemeId === id) {
      setCurrentSchemeId('default');
    }
  };

  const handleSetDefaultScheme = (id: string) => {
    const newSchemes = allSchemes.map(s => ({
      ...s,
      isDefault: s.id === id
    }));
    setAllSchemes(newSchemes);
    setFilterSchemes(newSchemes);
  };

  const handleRenameScheme = (id: string, newName: string) => {
    const newSchemes = allSchemes.map(s =>
      s.id === id ? { ...s, name: newName } : s
    );
    setAllSchemes(newSchemes);
    setFilterSchemes(newSchemes);
  };

  /**
   * 渲染单个筛选条件
   */
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getOrderFilterFields().find(f => f.key === condition.field);
    if (!fieldConfig) return null;

    const handleModeChange = (mode: FilterMode) => {
      const index = filterConditions.findIndex(c => c.field === condition.field);
      updateFilterCondition(index, 'mode', mode);
    };

    const handleValueChange = (value: any) => {
      const index = filterConditions.findIndex(c => c.field === condition.field);
      updateFilterCondition(index, 'value', value);
    };

    // 根据筛选模式决定是否禁用输入框
    const isInputDisabled = condition.mode === FilterMode.IS_EMPTY || condition.mode === FilterMode.IS_NOT_EMPTY;

    return (
      <Col span={6} key={condition.field} className="mb-4">
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
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          
          {/* 输入控件 - 占满整个宽度 */}
          <div className="filter-input-wrapper">
            {fieldConfig.type === 'input' && (
              <Input
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value || ''}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
                size="small"
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
                size="small"
              >
                {fieldConfig.options?.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            )}
            {fieldConfig.type === 'dateRange' && (
              <RangePicker
                value={condition.value}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                style={{ width: '100%' }}
                size="small"
                placeholder={isInputDisabled ? ['（自动判断）', ''] : ['开始日期', '结束日期']}
              />
            )}
            {fieldConfig.type === 'numberRange' && (
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <InputNumber
                  placeholder={isInputDisabled ? '（自动判断）' : '最小值'}
                  value={condition.value?.[0]}
                  onChange={(value) => handleValueChange([value, condition.value?.[1]])}
                  disabled={isInputDisabled}
                  style={{ flex: 1 }}
                  size="small"
                />
                <InputNumber
                  placeholder={isInputDisabled ? '（自动判断）' : '最大值'}
                  value={condition.value?.[1]}
                  onChange={(value) => handleValueChange([condition.value?.[0], value])}
                  disabled={isInputDisabled}
                  style={{ flex: 1 }}
                  size="small"
                />
              </div>
            )}
          </div>
        </div>
      </Col>
    );
   };

  /**
   * 渲染新的筛选区域
   */
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

  // 新筛选系统状态
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');
  const [schemeManagementModalVisible, setSchemeManagementModalVisible] = useState(false);
  const [allSchemes, setAllSchemes] = useState<FilterScheme[]>([]);
  
  // 自定义表格状态
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  
  // 同步订单相关状态
  const [syncModalVisible, setSyncModalVisible] = useState<boolean>(false);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [syncPlatform, setSyncPlatform] = useState<string>('CargoWare');
  const [syncModes, setSyncModes] = useState<string[]>(['newOrders', 'updateOrders']);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{
    newOrderCount: number;
    updateOrderCount: number;
  } | null>(null);
  
  // 拖拽相关状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [draggedFilterField, setDraggedFilterField] = useState<number | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<number | null>(null);
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);

  // 表格展开相关状态
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>(['0']); // 默认第一行展开
  const [allExpanded, setAllExpanded] = useState<boolean>(false); // 全局展开状态

  /**
   * 处理全局展开/收起
   */
  const handleToggleAllExpanded = () => {
    if (allExpanded) {
      // 收起所有行
      setExpandedRowKeys([]);
      setAllExpanded(false);
    } else {
      // 展开所有
      const allKeys = data.map(item => item.key);
      setExpandedRowKeys(allKeys);
      setAllExpanded(true);
    }
  };

  /**
   * 处理单行展开状态变化
   */
  const handleExpandedRowsChange = (expandedKeys: (string | number)[]) => {
    // 允许第一行被收起
    setExpandedRowKeys(expandedKeys);
    
    // 更新全局展开状态
    const allKeys = data.map(item => item.key);
    const isAllExpanded = allKeys.every(key => expandedKeys.includes(key));
    setAllExpanded(isAllExpanded);
  };



  const handleCreateOrder = async () => {
    try {
      const values = await createForm.validate();
      console.log('创建订单:', { ...values, orderType });
      
      // 根据订单类型进行不同的处理
      if (orderType === 'needQuote') {
        // 需要报价：跳转到新增整箱询价页面
        navigate('/controltower/saas/create-inquiry/fcl');
      } else if (orderType === 'hasQuote') {
        // 已有报价：验证报价号并跳转到创建订舱申请界面
        if (!values.quoteNo) {
          Message.error('请输入报价号');
          return;
        }
        navigate('/controltower/booking-submission-operation', {
          state: { quoteNo: values.quoteNo }
        });
      } else if (orderType === 'booking') {
        // 代订舱：验证委托单位并处理
        if (!values.delegateCompany) {
          Message.error('请选择委托单位');
          return;
        }
        console.log('代订舱委托单位:', values.delegateCompany);
        // 跳转到代订舱页面，传递委托单位信息
        navigate('/controltower/booking-submission-operation-norate', {
          state: { delegateCompany: values.delegateCompany }
        });
      }
      
      setCreateModalVisible(false);
      createForm.resetFields();
      setOrderType('');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleOrderTypeChange = (value: string) => {
    setOrderType(value);
    if (value !== 'hasQuote') {
      createForm.setFieldValue('quoteNo', undefined);
    }
  };

  // 物流跟踪节点组件
  const TrackingNodes = ({ orderNo: _orderNo }: { orderNo: string }) => {
    // 切换状态：true为运踪节点，false为业务节点
    const [isTrackingMode, setIsTrackingMode] = useState(false);
    
    // 业务节点数据
    const businessNodes = [
      { 
        id: 'production', 
        name: '生产', 
        icon: faCogs, 
        status: 'completed',
        tasks: [
          { name: '生产安排', type: 'operation', status: 'completed', time: '2024-03-10 09:00:00' }
        ]
      },
      { 
        id: 'freight_rate', 
        name: '运价', 
        icon: faDollarSign, 
        status: 'partial',
        tasks: [
          { name: '提交询价', type: 'customer', status: 'completed', time: '2024-03-10 14:00:00' },
          { name: '提交报价', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'booking', 
        name: '订舱', 
        icon: faAnchor, 
        status: 'completed',
        tasks: [
          { name: '订舱申请', type: 'customer', status: 'completed', time: '2024-03-11 10:00:00' },
          { name: '订舱确认', type: 'operation', status: 'completed', time: '2024-03-11 15:00:00' }
        ]
      },
      { 
        id: 'trucking', 
        name: '拖车', 
        icon: faTruck, 
        status: 'completed',
        tasks: [
          { name: '拖车安排', type: 'operation', status: 'completed', time: '2024-03-12 14:00:00' }
        ]
      },
      { 
        id: 'warehouse', 
        name: '仓库', 
        icon: faWarehouse, 
        status: 'partial',
        tasks: [
          { name: '入库安排', type: 'operation', status: 'completed', time: '2024-03-13 16:00:00' },
          { name: '仓储费用', type: 'customer', status: 'skipped', time: '2024-03-13 17:00:00' }
        ]
      },
      { 
        id: 'customs', 
        name: '报关', 
        icon: faFileContract, 
        status: 'completed',
        tasks: [
          { name: '报关资料', type: 'customer', status: 'completed', time: '2024-03-14 09:00:00' },
          { name: '报关申报', type: 'operation', status: 'completed', time: '2024-03-14 11:00:00' }
        ]
      },
      { 
        id: 'manifest', 
        name: '舱单', 
        icon: faFileAlt, 
        status: 'completed',
        tasks: [
          { name: '舱单制作', type: 'operation', status: 'completed', time: '2024-03-15 09:00:00' }
        ]
      },
      { 
        id: 'vgm', 
        name: 'VGM', 
        icon: faWeight, 
        status: 'completed',
        tasks: [
          { name: 'VGM提交', type: 'customer', status: 'completed', time: '2024-03-15 14:00:00' }
        ]
      },
      { 
        id: 'supplement', 
        name: '补料', 
        icon: faFileImport, 
        status: 'partial',
        tasks: [
          { name: '补料提交', type: 'customer', status: 'completed', time: '2024-03-16 10:00:00' },
          { name: '补料审核', type: 'operation', status: 'pending' },
          { name: '补料费用', type: 'customer', status: 'skipped', time: '2024-03-16 11:00:00' }
        ]
      },
      { 
        id: 'bill', 
        name: '账单', 
        icon: faReceipt, 
        status: 'pending',
        tasks: [
          { name: '账单生成', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'invoice', 
        name: '发票', 
        icon: faFileInvoiceDollar, 
        status: 'pending',
        tasks: [
          { name: '发票开具', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'bill_of_lading', 
        name: '提单', 
        icon: faFileText, 
        status: 'pending',
        tasks: [
          { name: '提单签发', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'switch_bill', 
        name: '换单', 
        icon: faExchangeAlt, 
        status: 'pending',
        tasks: [
          { name: '换单处理', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'container_pickup', 
        name: '提柜', 
        icon: faBox, 
        status: 'pending',
        tasks: [
          { name: '提柜安排', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'delivery', 
        name: '送货', 
        icon: faShippingFast, 
        status: 'pending',
        tasks: [
          { name: '配送安排', type: 'operation', status: 'pending' }
        ]
      }
    ];
    
    // 运踪节点数据
    const trackingNodes = [
      { 
        id: 'empty_pickup', 
        name: '提空箱', 
        icon: faBox, 
        status: 'completed',
        tasks: [
          { name: '空箱提取', type: 'operation', status: 'completed', time: '2024-03-15 09:00:00' }
        ]
      },
      { 
        id: 'expected_port_open', 
        name: '预计开港', 
        icon: faClock, 
        status: 'completed',
        tasks: [
          { name: '开港通知', type: 'operation', status: 'completed', time: '2024-03-15 14:00:00' }
        ]
      },
      { 
        id: 'port_cutoff', 
        name: '港区截单', 
        icon: faFileAlt, 
        status: 'completed',
        tasks: [
          { name: '截单确认', type: 'operation', status: 'completed', time: '2024-03-16 10:00:00' }
        ]
      },
      { 
        id: 'heavy_entry', 
        name: '重箱进场', 
        icon: faTruck, 
        status: 'partial',
        tasks: [
          { name: '进场申请', type: 'customer', status: 'completed', time: '2024-03-16 15:00:00' },
          { name: '进场确认', type: 'operation', status: 'pending' },
          { name: '加急费用', type: 'customer', status: 'skipped', time: '2024-03-16 16:00:00' }
        ]
      },
      { 
        id: 'customs_release', 
        name: '海关放行', 
        icon: faCheckCircle, 
        status: 'completed',
        tasks: [
          { name: '海关审核', type: 'operation', status: 'completed', time: '2024-03-17 11:00:00' }
        ]
      },
      { 
        id: 'terminal_release', 
        name: '码头放行', 
        icon: faWarehouse, 
        status: 'completed',
        tasks: [
          { name: '码头确认', type: 'operation', status: 'completed', time: '2024-03-17 16:00:00' }
        ]
      },
      { 
        id: 'actual_berth', 
        name: '实际靠泊', 
        icon: faAnchor, 
        status: 'completed',
        tasks: [
          { name: '靠泊确认', type: 'operation', status: 'completed', time: '2024-03-18 08:00:00' }
        ]
      },
      { 
        id: 'loading_plan', 
        name: '配载', 
        icon: faCubes, 
        status: 'completed',
        tasks: [
          { name: '配载计划', type: 'operation', status: 'completed', time: '2024-03-18 14:00:00' }
        ]
      },
      { 
        id: 'actual_departure', 
        name: '实际开船', 
        icon: faPlay, 
        status: 'pending',
        tasks: [
          { name: '开船确认', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'unloading', 
        name: '卸船', 
        icon: faStop, 
        status: 'pending',
        tasks: [
          { name: '卸船作业', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'heavy_pickup', 
        name: '提重', 
        icon: faShoppingCart, 
        status: 'pending',
        tasks: [
          { name: '重箱提取', type: 'operation', status: 'pending' }
        ]
      },
      { 
        id: 'return_empty', 
        name: '还箱', 
        icon: faUndo, 
        status: 'pending',
        tasks: [
          { name: '空箱归还', type: 'operation', status: 'pending' }
        ]
      }
    ];

    // 根据当前模式选择节点数据
    const nodes = isTrackingMode ? trackingNodes : businessNodes;

    // 计算最后一个已完成节点的索引
    const completedNodesCount = nodes.filter((n: any) => n.status === 'completed').length;
    // let lastCompletedIndex = -1;
    // for (let i = nodes.length - 1; i >= 0; i--) {
    //   if (nodes[i].completed) {
    //     lastCompletedIndex = i;
    //     break;
    //   }
    // }

    return (
      <div className="tracking-nodes mt-4 relative bg-gray-50 p-4 rounded-lg">
        {/* 精致小巧的切换按钮 - 真正贴顶左上角 */}
        <div className="absolute -top-4 -left-4 z-30">
          <div className="flex items-center bg-white/95 backdrop-blur-sm shadow-lg px-0.5 py-0.5">
            <button
              onClick={() => setIsTrackingMode(false)}
              className={`
                px-2 py-1 text-xs font-medium transition-all duration-300 ease-out
                ${!isTrackingMode 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              业务
            </button>
            <button
              onClick={() => setIsTrackingMode(true)}
              className={`
                px-2 py-1 text-xs font-medium transition-all duration-300 ease-out
                ${isTrackingMode 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              运踪
            </button>
          </div>
        </div>
        {/* 添加CSS动画样式 */}
        <style>{`
          @keyframes movingShip {
            ${(() => {
              if (completedNodesCount === 0) return `
                0%, 100% { left: ${100 / (nodes.length * 2)}%; opacity: 0; }
              `;
              
              let keyframes = '';
              // const totalDuration = 100;
              const moveTime = 70; // 70% 时间用于移动
              const pauseTime = 30; // 30% 时间用于停顿
              const timePerNode = moveTime / completedNodesCount;
              const pausePerNode = pauseTime / completedNodesCount;
              
              // 起始位置
              keyframes += `0% {
                left: ${100 / (nodes.length * 2)}%;
                transform: scale(1);
                opacity: 1;
              }\n`;
              
              let currentTime = 0;
              
              // 为每个已完成节点创建关键帧
              for (let i = 0; i < completedNodesCount; i++) {
                const nodePosition = (i + 0.5) * (100 / nodes.length);
                
                // 移动到节点
                currentTime += timePerNode;
                keyframes += `${currentTime}% {
                  left: ${nodePosition}%;
                  transform: scale(1);
                  opacity: 1;
                }\n`;
                
                // 在节点处停顿并放大
                currentTime += pausePerNode / 2;
                keyframes += `${currentTime}% {
                  left: ${nodePosition}%;
                  transform: scale(1.3);
                  opacity: 1;
                }\n`;
                
                // 停顿结束，恢复正常大小
                currentTime += pausePerNode / 2;
                keyframes += `${currentTime}% {
                  left: ${nodePosition}%;
                  transform: scale(1);
                  opacity: 1;
                }\n`;
              }
              
              // 到达终点后稍作停留
              keyframes += `90% {
                left: ${(completedNodesCount - 0.5) * (100 / nodes.length)}%;
                transform: scale(1);
                opacity: 1;
              }\n`;
              
              // 开始返回起点的过程
              keyframes += `95% {
                left: ${(completedNodesCount - 0.5) * (100 / nodes.length)}%;
                transform: scale(1);
                opacity: 1;
              }\n`;
              
              // 直接回到起点重新开始，保持可见
              keyframes += `100% {
                left: ${100 / (nodes.length * 2)}%;
                transform: scale(1);
                opacity: 1;
              }\n`;
              
              return keyframes;
            })()}
          }
          
          /* 小屏幕下的移动动画 - 使用像素值确保可见性 */
          @media (max-width: 1200px) {
            @keyframes movingShipMobile {
              ${(() => {
                if (completedNodesCount === 0) return `
                  0%, 100% { left: ${1200 / (nodes.length * 2)}px; opacity: 0; }
                `;
                
                let keyframes = '';
                const moveTime = 70;
                const pauseTime = 30;
                const timePerNode = moveTime / completedNodesCount;
                const pausePerNode = pauseTime / completedNodesCount;
                
                // 起始位置 - 使用像素值
                keyframes += `0% {
                  left: ${1200 / (nodes.length * 2)}px;
                  transform: scale(1);
                  opacity: 1;
                }\n`;
                
                let currentTime = 0;
                
                // 为每个已完成节点创建关键帧
                for (let i = 0; i < completedNodesCount; i++) {
                  const nodePosition = (i + 0.5) * (1200 / nodes.length);
                  
                  // 移动到节点
                  currentTime += timePerNode;
                  keyframes += `${currentTime}% {
                    left: ${nodePosition}px;
                    transform: scale(1);
                    opacity: 1;
                  }\n`;
                  
                  // 在节点处停顿并放大
                  currentTime += pausePerNode / 2;
                  keyframes += `${currentTime}% {
                    left: ${nodePosition}px;
                    transform: scale(1.3);
                    opacity: 1;
                  }\n`;
                  
                  // 停顿结束，恢复正常大小
                  currentTime += pausePerNode / 2;
                  keyframes += `${currentTime}% {
                    left: ${nodePosition}px;
                    transform: scale(1);
                    opacity: 1;
                  }\n`;
                }
                
                // 到达终点后稍作停留
                keyframes += `90% {
                  left: ${(completedNodesCount - 0.5) * (1200 / nodes.length)}px;
                  transform: scale(1);
                  opacity: 1;
                }\n`;
                
                // 开始返回起点的过程
                keyframes += `95% {
                  left: ${(completedNodesCount - 0.5) * (1200 / nodes.length)}px;
                  transform: scale(1);
                  opacity: 1;
                }\n`;
                
                // 直接回到起点重新开始，保持可见
                keyframes += `100% {
                  left: ${1200 / (nodes.length * 2)}px;
                  transform: scale(1);
                  opacity: 1;
                }\n`;
                
                return keyframes;
              })()}
            }
            
            .glowing-ship {
               animation: movingShipMobile 30s ease-in-out infinite;
             }
           }
           
            @keyframes sparkleStars {
            ${(() => {
              if (completedNodesCount === 0) return `
                0%, 100% { opacity: 0; transform: scale(0); }
              `;
              
              let keyframes = '';
              // const totalDuration = 100;
              const moveTime = 75; // 增加移动时间比例
              const pauseTime = 25; // 减少停顿时间比例
              const timePerNode = moveTime / completedNodesCount;
              const pausePerNode = pauseTime / completedNodesCount;
              
              // 默认隐藏
              keyframes += `0% { opacity: 0; transform: scale(0) rotate(0deg); }\n`;
              
              let currentTime = 0;
              
              // 为每个节点的停顿时间创建星星闪烁
              for (let i = 0; i < completedNodesCount; i++) {
                // 移动阶段 - 隐藏星星
                currentTime += timePerNode;
                keyframes += `${currentTime}% { opacity: 0; transform: scale(0) rotate(0deg); }\n`;
                
                // 停顿开始 - 显示星星
                currentTime += pausePerNode / 3;
                keyframes += `${currentTime}% { opacity: 1; transform: scale(1.3) rotate(120deg); }\n`;
                
                // 停顿中间 - 星星旋转
                currentTime += pausePerNode / 3;
                keyframes += `${currentTime}% { opacity: 1; transform: scale(1.1) rotate(240deg); }\n`;
                
                // 停顿结束 - 隐藏星星
                currentTime += pausePerNode / 3;
                keyframes += `${currentTime}% { opacity: 0; transform: scale(0) rotate(360deg); }\n`;
              }
              
              // 最后阶段隐藏，为下一轮循环做准备
              keyframes += `95%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }\n`;
              
              return keyframes;
            })()}
          }
          
          .glowing-ship {
            animation: movingShip 30s ease-in-out infinite;
            font-size: 20px;
            position: relative;
          }
          
          /* 小屏幕适配 */
          @media (max-width: 1200px) {
            .glowing-ship {
              /* 在小屏幕下确保交通工具可见 */
              min-width: 40px;
              min-height: 32px;
            }
            
            .tracking-flow {
              /* 确保在小屏幕下有足够的空间显示交通工具 */
              padding: 0 20px;
            }
          }
          
          .sparkle-stars {
            position: absolute;
            top: -15px;
            left: -15px;
            width: 50px;
            height: 50px;
            pointer-events: none;
            z-index: 25;
          }
          
          .star {
            position: absolute;
            font-size: 14px;
            animation: sparkleStars 30s ease-in-out infinite;
          }
          
          .star:nth-child(1) {
            top: 2px;
            left: 18px;
            animation-delay: 0s;
            animation-duration: 30s;
          }
          
          .star:nth-child(2) {
            top: 12px;
            right: 5px;
            animation-delay: 0.4s;
            animation-duration: 30s;
          }
          
          .star:nth-child(3) {
            bottom: 2px;
            left: 12px;
            animation-delay: 0.8s;
            animation-duration: 30s;
          }
          
          /* 随机显示效果 - 通过不同的动画时长创造随机感 */
          .sparkle-stars .star:nth-child(1) {
            animation-name: sparkleStars;
          }
          
          .sparkle-stars .star:nth-child(2) {
            animation-name: sparkleStars;
          }
          
          .sparkle-stars .star:nth-child(3) {
            animation-name: sparkleStars;
          }
          
          .glowing-ship:hover {
            transform: scale(1.2);
          }

          /* 船只图片样式 */
          .vessel-image {
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            transition: all 0.3s ease;
          }
          
          .glowing-ship:hover .vessel-image {
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.4));
            transform: translateY(-1px);
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .pulse-glow {
            animation: pulse 1.5s ease-in-out infinite alternate;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 15px #3b82f6;
            }
            100% {
              box-shadow: 0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6;
            }
          }
        `}</style>
        
        {/* 响应式容器：大屏幕时均分宽度，小屏幕时横向滚动 */}
        <div className="tracking-container overflow-x-auto">
          <div className="tracking-flow flex items-start relative" style={{ minWidth: '1200px' }}>
            {/* 完整的背景连接线 */}
            <div className="absolute top-[54px] left-0 right-0 h-[2px] bg-gray-300 z-0" 
                 style={{ 
                   marginLeft: `${100 / (nodes.length * 2)}%`, 
                   marginRight: `${100 / (nodes.length * 2)}%` 
                 }}>
            </div>
            
            {/* 已完成部分的蓝色线条 */}
            <div className="absolute top-[54px] left-0 h-[2px] bg-blue-500 z-0" 
                 style={{ 
                   marginLeft: `${100 / (nodes.length * 2)}%`,
                   width: `${(completedNodesCount - 1) * (100 / nodes.length)}%`
                 }}>
            </div>

            {/* 炫酷的移动交通工具 */}
            {completedNodesCount > 0 && (
              <div 
                className="absolute glowing-ship w-[40px] h-[32px] z-20 flex items-center justify-center"
                style={{ 
                  top: '38px', // 调整位置使其在连接线上
                  marginLeft: '-20px' // 居中对齐
                }}
              >
                <img 
                  src={getTransportImage(activeTab)} 
                  alt={getTransportAlt(activeTab)} 
                  className="vessel-image w-full h-full object-contain"
                />
                {/* 彩色星星闪烁效果 - 随机1-3个 */}
                <div className="sparkle-stars">
                  <div className="star">⭐</div>
                  <div className="star">✨</div>
                  <div className="star">💫</div>
                </div>
              </div>
            )}

            {/* 渲染所有节点 */}
            {nodes.map((node) => (
              <div key={node.id} className="tracking-node flex flex-col items-center relative flex-1">
                <div className="node-content text-center mb-2">
                  <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                    <FontAwesomeIcon 
                      icon={node.icon} 
                      className={`mr-2 ${
                        node.status === 'completed' ? 'text-blue-500' : 
                        node.status === 'partial' ? 'text-yellow-500' : 'text-gray-400'
                      }`} 
                    />
                    {node.name}
                  </div>
                </div>
                {/* 移除了原来的小圆形节点 */}
                <div className="node-spacer h-[12px] mb-2 relative z-10"></div>
                <div className={`node-line h-[30px] w-[2px] ${
                  node.status === 'completed' ? 'bg-blue-500' : 
                  node.status === 'partial' ? 'bg-yellow-500' : 'bg-gray-300'
                }`}></div>
                <div className="node-status text-center">
                  <Tooltip
                    content={
                      <div>
                        {node.tasks.map((task: any, index: number) => (
                          <div key={index} style={{ marginBottom: '4px', color: 'white' }}>
                            <span>
                              {task.type === 'customer' ? '客户任务' : '运营任务'}：{task.name} - 
                            </span>
                            <span style={{
                              color: task.status === 'completed' ? '#52c41a' : 
                                     task.status === 'skipped' ? '#faad14' : '#ff4d4f',
                              fontWeight: 'bold'
                            }}>
                              {task.status === 'completed' ? '已完成' : 
                               task.status === 'skipped' ? '已跳过' : '未完成'}
                            </span>
                            {(task.status === 'completed' || task.status === 'skipped') && task.time && (
                              <div style={{ fontSize: '12px', color: '#d9d9d9', marginTop: '2px' }}>
                                {task.time}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    }
                    position="top"
                  >
                    <div style={{ cursor: 'pointer' }}>
                      <Tag 
                        color={
                          node.status === 'completed' ? 'blue' : 
                          node.status === 'partial' ? 'orange' : 'gray'
                        } 
                        className="mb-2 mx-auto block w-24"
                      >
                        {node.status === 'completed' ? '已完成' : 
                         node.status === 'partial' ? '部分完成' : '未完成'}
                      </Tag>
                    </div>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  // 表格列定义
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 150,
      sorter: true,
      render: (value: string) => <a href="#" className="text-blue-600">{value}</a>,
    },
    {
      title: '运输类型',
      dataIndex: 'type',
      width: 120,
      sorter: true,
    },
    {
      title: '起运港',
      dataIndex: 'originPort',
      width: 150,
      sorter: true,
    },
    {
      title: '目的港',
      dataIndex: 'destinationPort',
      width: 150,
      sorter: true,
    },
    {
      title: '船公司',
      dataIndex: 'shippingCompany',
      width: 150,
      sorter: true,
    },
    {
      title: '船名航次',
      dataIndex: 'vesselVoyage',
      width: 150,
      sorter: true,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 120,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      sorter: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: OrderItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEye />}
            onClick={() => {
              navigate(`/controltower/order-detail/${record.orderNo}`);
            }}
          >
            查看
          </Button>
          <Button 
            type="text" 
            size="small" 
            status="danger" 
            icon={<IconDelete />}
            onClick={() => {
              Message.info(`删除订单：${record.orderNo}`);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    }
  ];

  // 模拟数据
  const data: OrderItem[] = Array(10).fill(null).map((_, index) => ({
    key: `${index}`,
    orderNo: `ORD${String(index + 1).padStart(6, '0')}`,
    type: ['整箱', '拼箱'][Math.floor(Math.random() * 2)],
    originPort: ['深圳港', '上海港', '广州港', '青岛港'][Math.floor(Math.random() * 4)],
    destinationPort: ['汉堡港', '鹿特丹港', '洛杉矶港', '迪拜港'][Math.floor(Math.random() * 4)],
    shippingCompany: ['马士基', '中远海运', '达飞轮船', '长荣海运'][Math.floor(Math.random() * 4)],
    vesselVoyage: [`MSC OSCAR/2024${String(index + 1).padStart(2, '0')}`, `EVER GIVEN/2024${String(index + 1).padStart(2, '0')}`, `COSCO SHIPPING/2024${String(index + 1).padStart(2, '0')}`, `MAERSK ESSEX/2024${String(index + 1).padStart(2, '0')}`][Math.floor(Math.random() * 4)],
    creator: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
    createTime: '2024-03-15 14:30:00',
  }));

  const pagination = {
    showTotal: true,
    total: 100,
    pageSize: 10,
    current: 1,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [10, 20, 50, 100],
  };

  return (
    <>
      <Card>
        <Tabs activeTab={activeTab} onChange={handleTabChange} className="mb-4">
          <TabPane key="sea" title="海运订单" />
          <TabPane key="air" title="空运订单" />
          <TabPane key="land" title="陆运订单" />
          <TabPane key="rail" title="铁路订单" />
        </Tabs>
        
        {/* 新的筛选区 */}
        {renderNewFilterArea()}

        {/* 数据表格区域 */}
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button type="primary" icon={<IconPlus />} onClick={() => setCreateModalVisible(true)}>
              新增订单
            </Button>
            <Button icon={<IconDownload />}>导出数据</Button>
            <Button icon={<IconSync />} onClick={openSyncModal}>同步订单</Button>
          </Space>
          <Space>
            <Button 
              type="text"
              icon={<IconList />}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
              onClick={() => {
                setCustomTableModalVisible(true);
              }}
            >
              自定义表格
            </Button>
          </Space>
        </div>
        
        <Table
          rowKey="key"
          columns={columns}
          data={data}
          pagination={pagination}
          scroll={{ x: 1500 }}
          border={false}
          className="mt-4"
          expandedRowRender={(record) => (
            <div className="w-full p-4 bg-gray-50">
              <TrackingNodes orderNo={record.orderNo} />
            </div>
          )}
          expandProps={{
            expandRowByClick: false,
            columnTitle: (
              <Button
                type="text"
                size="small"
                icon={allExpanded ? <IconLeft /> : <IconRight />}
                onClick={handleToggleAllExpanded}
                className="p-0 h-auto text-gray-600 hover:text-blue-600"
              >
                {allExpanded ? '收起' : '展开'}
              </Button>
            ),
            width: 80
          }}

          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={handleExpandedRowsChange}
        />
      </Card>

      {/* 新增订单弹窗 */}
      <Modal
        title="新增订单"
        visible={createModalVisible}
        onOk={handleCreateOrder}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
          setOrderType('');
        }}
        autoFocus={false}
        focusLock={true}
        maskClosable={false}
      >
        <Form
          form={createForm}
          layout="vertical"
        >
          <FormItem
            label="订单类型"
            field="orderType"
            rules={[{ required: true, message: '请选择订单类型' }]}
          >
            <RadioGroup onChange={handleOrderTypeChange}>
              <Radio value="needQuote">需要报价</Radio>
              <Radio value="hasQuote">已有报价</Radio>
              <Radio value="booking">代订舱</Radio>
            </RadioGroup>
          </FormItem>

          {orderType === 'hasQuote' && (
            <FormItem
              label="报价单号"
              field="quoteNo"
              rules={[{ required: true, message: '请输入报价单号' }]}
            >
              <Input placeholder="请输入报价单号" allowClear />
            </FormItem>
          )}

          {orderType === 'booking' && (
            <FormItem
              label="委托单位"
              field="delegateCompany"
              rules={[{ required: true, message: '请选择委托单位' }]}
            >
              <Select placeholder="请选择委托单位" allowClear>
                {mockCompanies.map(company => (
                  <Select.Option key={company.value} value={company.value}>
                    {company.label}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          )}
        </Form>
      </Modal>

      {/* AI助手弹窗 */}
      <AIAssistant 
        visible={aiVisible} 
        onClose={() => setAiVisible(false)} 
      />

      {/* 同步订单弹窗 */}
      <Modal
        title="同步订单"
        visible={syncModalVisible}
        onOk={syncSuccess ? closeSyncModal : handleSyncConfirm}
        onCancel={closeSyncModal}
        confirmLoading={syncLoading}
        okText={syncSuccess ? "关闭" : "确认同步"}
        autoFocus={false}
        focusLock={true}
        maskClosable={false}
      >
        {!syncSuccess ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择第三方平台 <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="请选择第三方平台"
                value={syncPlatform}
                onChange={setSyncPlatform}
                style={{ width: '100%' }}
              >
                <Select.Option value="CargoWare">CargoWare</Select.Option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择同步模式 <span className="text-red-500">*</span>
              </label>
              <Checkbox.Group
                value={syncModes}
                onChange={handleSyncModeChange}
                direction="vertical"
              >
                <Checkbox value="newOrders">同步新增订单</Checkbox>
                <Checkbox value="updateOrders">更新已有订单</Checkbox>
              </Checkbox.Group>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-medium text-green-600 mb-4">
                🎉 同步成功！
              </div>
              
              <div className="space-y-3 text-left bg-gray-50 p-4 rounded">
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-600">新增订单：</span>
                   <span className="font-medium text-blue-600">{syncResult?.newOrderCount || 0} 票</span>
                 </div>
                 
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-600">更新订单：</span>
                   <span className="font-medium text-orange-600">{syncResult?.updateOrderCount || 0} 票</span>
                 </div>
               </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 筛选字段管理抽屉 */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <IconSettings />
            <span>增减条件</span>
          </div>
        }
        visible={filterFieldModalVisible}
        onCancel={closeFilterFieldModal}
        width={480}
        footer={
          <div className="flex justify-between">
            <Button onClick={() => {
              initializeDefaultConditions();
              setFilterFieldOrder(getOrderFilterFields().map(f => f.key));
            }}>
              重置默认
            </Button>
            <div>
              <Button onClick={closeFilterFieldModal} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" onClick={closeFilterFieldModal}>
                确认
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* 快捷操作区域 */}
          <div className="bg-gray-50 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {filterConditions.filter(c => c.visible).length} / {filterConditions.length} 个字段
              </span>
              <div className="space-x-2">
                <Button 
                  size="small" 
                  onClick={() => {
                    const newConditions = [...filterConditions];
                    
                    // 添加所有未显示的字段
                    getOrderFilterFields().forEach(field => {
                      if (!newConditions.some(c => c.field === field.key)) {
                        newConditions.push({
                          field: field.key,
                          operator: getDefaultOperator(field.type),
                          value: getDefaultValue(field.type),
                          mode: FilterMode.EQUAL,
                          visible: true
                        });
                      }
                    });
                    
                    setFilterConditions(newConditions.map(condition => ({ ...condition, visible: true })));
                  }}
                >
                  全选
                </Button>
                <Button 
                  size="small" 
                  onClick={() => {
                    setFilterConditions(prev => prev.map(condition => ({ ...condition, visible: false })));
                  }}
                >
                  清空
                </Button>
              </div>
            </div>
          </div>

          {/* 筛选字段列表 */}
          <div className="space-y-2">
            {filterFieldOrder.map((fieldKey, index) => {
              const field = getOrderFilterFields().find(f => f.key === fieldKey);
              const condition = filterConditions.find(c => c.field === fieldKey);
              
              if (!field) return null;
              
              return (
                <div
                  key={fieldKey}
                  className={`flex items-center gap-3 p-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                    draggedFilterField === index ? 'opacity-50' : ''
                  } ${
                    dragOverFilterField === index ? 'border-blue-400 border-2' : ''
                  }`}
                  draggable
                  onDragStart={() => setDraggedFilterField(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverFilterField(index);
                  }}
                  onDrop={() => {
                    if (draggedFilterField !== null && dragOverFilterField !== null) {
                      const newOrder = [...filterFieldOrder];
                      const draggedItem = newOrder[draggedFilterField];
                      newOrder.splice(draggedFilterField, 1);
                      newOrder.splice(dragOverFilterField, 0, draggedItem);
                      setFilterFieldOrder(newOrder);
                    }
                    setDraggedFilterField(null);
                    setDragOverFilterField(null);
                  }}
                  onDragEnd={() => {
                    setDraggedFilterField(null);
                    setDragOverFilterField(null);
                  }}
                >
                  <IconDragDotVertical className="text-gray-400 cursor-move" />
                  <div className="flex items-center justify-center w-6 h-5 bg-gray-100 text-xs text-gray-600 font-medium rounded" style={{ minWidth: '24px' }}>
                    {index + 1}
                  </div>
                  <span className="flex-1 text-sm">{field.label}</span>
                  <Switch
                    size="small"
                    checked={condition?.visible || false}
                    onChange={(checked) => {
                      if (checked) {
                        // 如果字段不存在，添加新的筛选条件
                        if (!condition) {
                          setFilterConditions(prev => [...prev, {
                            field: fieldKey,
                            operator: getDefaultOperator(field.type),
                            value: getDefaultValue(field.type),
                            mode: FilterMode.EQUAL,
                            visible: true
                          }]);
                        } else {
                          // 如果字段存在，更新可见性
                          setFilterConditions(prev => 
                            prev.map(c => 
                              c.field === fieldKey ? { ...c, visible: true } : c
                            )
                          );
                        }
                      } else {
                        // 隐藏字段
                        setFilterConditions(prev => 
                          prev.map(c => 
                            c.field === fieldKey ? { ...c, visible: false } : c
                          )
                        );
                      }
                    }}
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
        onCancel={closeSchemeModal}
        onOk={() => saveFilterScheme(newSchemeName)}
        okText="保存"
        cancelText="取消"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              方案名称
            </label>
            <Input
              placeholder="请输入方案名称"
              value={newSchemeName}
              onChange={setNewSchemeName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              当前筛选条件
            </label>
            <div className="bg-gray-50 p-3 rounded">
              {filterConditions.filter(c => c.visible).map(condition => {
                const field = getOrderFilterFields().find(f => f.key === condition.field);
                return (
                  <div key={condition.field} className="text-sm text-gray-600">
                    {field?.label}: {FilterModeOptions.find(m => m.value === condition.mode)?.label} {condition.value || '(空)'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* 自定义表格抽屉 */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <IconList />
            <span>自定义表格</span>
          </div>
        }
        visible={customTableModalVisible}
        onCancel={closeCustomTableModal}
        width={480}
        footer={
          <div className="flex justify-between">
            <Button onClick={() => {
              const defaultColumns = ['orderNo', 'status', 'type', 'customerName', 'origin', 'destination', 'amount', 'createTime', 'estimatedDeliveryTime', 'actions'];
              setColumnOrder(defaultColumns);
              const defaultVisibility: Record<string, boolean> = {};
              defaultColumns.forEach(col => {
                defaultVisibility[col] = true;
              });
              setColumnVisibility(defaultVisibility);
            }}>
              重置默认
            </Button>
            <div>
              <Button onClick={closeCustomTableModal} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" onClick={closeCustomTableModal}>
                确认
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* 快捷操作区域 */}
          <div className="bg-gray-50 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {Object.values(columnVisibility).filter(Boolean).length} / {Object.keys(columnVisibility).length} 个字段
              </span>
              <div className="space-x-2">
                <Button 
                  size="small" 
                  onClick={() => {
                    const newVisibility: Record<string, boolean> = {};
                    Object.keys(columnVisibility).forEach(key => {
                      newVisibility[key] = true;
                    });
                    setColumnVisibility(newVisibility);
                  }}
                >
                  全选
                </Button>
                <Button 
                  size="small" 
                  onClick={() => {
                    const newVisibility: Record<string, boolean> = {};
                    Object.keys(columnVisibility).forEach(key => {
                      newVisibility[key] = false;
                    });
                    setColumnVisibility(newVisibility);
                  }}
                >
                  清空
                </Button>
              </div>
            </div>
          </div>

          {/* 字段列表 */}
          <div className="space-y-2">
            {columnOrder.map((columnKey, index) => (
              <div
                key={columnKey}
                className={`flex items-center gap-3 p-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                  draggedItem === columnKey ? 'opacity-50' : ''
                } ${
                  dragOverItem === columnKey ? 'border-blue-400 border-2' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, columnKey)}
                onDragOver={(e) => handleDragOver(e, columnKey)}
                onDrop={(e) => handleDrop(e, columnKey)}
                onDragEnd={handleDragEnd}
              >
                <IconDragDotVertical className="text-gray-400 cursor-move" />
                <div className="flex items-center justify-center w-6 h-5 bg-gray-100 text-xs text-gray-600 font-medium rounded" style={{ minWidth: '24px' }}>
                  {index + 1}
                </div>
                <span className="flex-1 text-sm">{getColumnLabel(columnKey)}</span>
                <Switch
                  size="small"
                  checked={columnVisibility[columnKey]}
                  onChange={(checked) => handleColumnVisibilityChange(columnKey, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      {/* 方案管理弹窗 */}
      <SchemeManagementModal
        visible={schemeManagementModalVisible}
        onCancel={closeSchemeManagementModal}
        schemes={allSchemes.map(scheme => ({
          ...scheme,
          isDefault: scheme.isDefault || false,
          createTime: scheme.createTime || new Date().toISOString()
        }))}
        onDeleteScheme={handleDeleteScheme}
        onSetDefault={handleSetDefaultScheme}
        onRenameScheme={handleRenameScheme}
      />
    </>
  );
};

export default OrderManagement;