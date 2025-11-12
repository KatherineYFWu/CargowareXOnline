import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Modal,
  Message,
  Space,
  Typography,
  Dropdown,
  Menu,
  Tooltip,
  Grid,
  Drawer,
  Switch,
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconMore,
  IconUp,
  IconDown,
  IconSettings,
  IconDragDotVertical,
  IconEye,
  IconEdit,
  IconDelete,
  IconCopy,
  IconDownload
} from '@arco-design/web-react/icon';


const { Option } = Select;
// const { Title } = Typography;
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

// 船代信息接口


// 时间信息接口


// 港口信息接口


// 航线数据接口
interface DeclarationData {
  id: string;
  declarationNo: string; // 申报单号
  hbl: string; // HBL
  mbl: string; // MBL
  declarationStatus: 'submitted' | 'sent_success' | 'sent_failed' | 'deleted' | 'expired'; // 申报状态
  customsReceiptStatus: 'allow_loading' | 'require_supplement' | 'risk_loading' | 'prohibit_loading' | 'not_declared'; // 海关回执状态
  shippingCompany: string; // 船公司
  declarantMpci: string; // 申报人MPCI
  portOfLoading: string; // 起运港
  portOfDischarge: string; // 卸货港
  portOfDestination: string; // 目的港
  shipper: string; // 发货人
  consignee: string; // 收货人
  creator: string; // 创建人
  createTime: string; // 创建时间
  sender: string; // 发送人
  sendTime: string; // 发送时间
  updater: string; // 更新人
  updateTime: string; // 更新时间
  status: 'enabled' | 'disabled'; // 状态
}

// 联盟选项
// 申报状态选项
const declarationStatusOptions = [
  { value: 'submitted', label: '已提交' },
  { value: 'sent_success', label: '发送成功' },
  { value: 'sent_failed', label: '发送失败' },
  { value: 'deleted', label: '已删除' },
  { value: 'expired', label: '已过期' }
];

// 海关回执状态选项
const customsReceiptStatusOptions = [
  { value: 'allow_loading', label: '允许装船' },
  { value: 'require_supplement', label: '要求补充信息' },
  { value: 'risk_loading', label: '风险装船' },
  { value: 'prohibit_loading', label: '禁止装船' },
  { value: 'not_declared', label: '下层未申报' }
];

// 船公司选项
const shippingCompanyOptions = [
  { value: 'MAERSK', label: 'MAERSK | 马士基' },
  { value: 'MSC', label: 'MSC | 地中海航运' },
  { value: 'COSCO', label: 'COSCO | 中远海运' },
  { value: 'EVERGREEN', label: 'EVERGREEN | 长荣海运' },
  { value: 'OOCL', label: 'OOCL | 东方海外' },
  { value: 'CMA', label: 'CMA | 达飞轮船' },
  { value: 'ONE', label: 'ONE | 海洋网联船务' },
  { value: 'HAPAG', label: 'HAPAG | 赫伯罗特' }
];



// 筛选字段配置
const getFilterFields = (): FilterFieldConfig[] => {
  return [
    { key: 'declarationNo', label: '申报单号', type: 'text', placeholder: '请输入申报单号' },
    { key: 'hbl', label: 'HBL', type: 'text', placeholder: '请输入HBL' },
    { key: 'mbl', label: 'MBL', type: 'text', placeholder: '请输入MBL' },
    { key: 'declarationStatus', label: '申报状态', type: 'select', placeholder: '请选择申报状态', options: declarationStatusOptions },
    { key: 'customsReceiptStatus', label: '海关回执状态', type: 'select', placeholder: '请选择海关回执状态', options: customsReceiptStatusOptions },
    { key: 'shippingCompany', label: '船公司', type: 'select', placeholder: '请选择船公司', options: shippingCompanyOptions },
    { key: 'declarantMpci', label: '申报人MPCI', type: 'text', placeholder: '请输入申报人MPCI' },
    { key: 'portOfLoading', label: '起运港', type: 'select', placeholder: '请选择起运港', options: portOptions },
    { key: 'portOfDischarge', label: '卸货港', type: 'select', placeholder: '请选择卸货港', options: portOptions },
    { key: 'portOfDestination', label: '目的港', type: 'select', placeholder: '请选择目的港', options: portOptions },
    { key: 'shipper', label: '发货人', type: 'text', placeholder: '请输入发货人' },
    { key: 'consignee', label: '收货人', type: 'text', placeholder: '请输入收货人' },
    { key: 'creator', label: '创建人', type: 'text', placeholder: '请输入创建人' },
    { key: 'createTime', label: '创建时间', type: 'dateRange', placeholder: '请选择创建时间' }
  ];
};

// 港口选项
const portOptions = [
  { value: 'CNSHA', label: '上海港 Shanghai Port (CNSHA)' },
  { value: 'CNNGB', label: '宁波港 Ningbo Port (CNNGB)' },
  { value: 'CNSZN', label: '深圳港 Shenzhen Port (CNSZN)' },
  { value: 'CNQIN', label: '青岛港 Qingdao Port (CNQIN)' },
  { value: 'CNTXG', label: '天津港 Tianjin Port (CNTXG)' },
  { value: 'CNDLC', label: '大连港 Dalian Port (CNDLC)' },
  { value: 'CNXMN', label: '厦门港 Xiamen Port (CNXMN)' },
  { value: 'CNHKG', label: '香港港 Hong Kong Port (CNHKG)' },
  { value: 'SGSIN', label: '新加坡港 Singapore Port (SGSIN)' },
  { value: 'JPYOK', label: '横滨港 Yokohama Port (JPYOK)' },
  { value: 'JPTYO', label: '东京港 Tokyo Port (JPTYO)' },
  { value: 'JPKOB', label: '神户港 Kobe Port (JPKOB)' },
  { value: 'KRPUS', label: '釜山港 Busan Port (KRPUS)' },
  { value: 'USLAX', label: '洛杉矶港 Los Angeles Port (USLAX)' },
  { value: 'USLGB', label: '长滩港 Long Beach Port (USLGB)' },
  { value: 'USOAK', label: '奥克兰港 Oakland Port (USOAK)' },
  { value: 'USNYC', label: '纽约港 New York Port (USNYC)' },
  { value: 'USSAV', label: '萨凡纳港 Savannah Port (USSAV)' },
  { value: 'USCHA', label: '查尔斯顿港 Charleston Port (USCHA)' },
  { value: 'USNOR', label: '诺福克港 Norfolk Port (USNOR)' },
  { value: 'DEHAM', label: '汉堡港 Hamburg Port (DEHAM)' },
  { value: 'NLRTM', label: '鹿特丹港 Rotterdam Port (NLRTM)' },
  { value: 'BEANR', label: '安特卫普港 Antwerp Port (BEANR)' },
  { value: 'FRLEH', label: '勒阿弗尔港 Le Havre Port (FRLEH)' },
  { value: 'ITGOA', label: '热那亚港 Genoa Port (ITGOA)' },
  { value: 'ESVLC', label: '瓦伦西亚港 Valencia Port (ESVLC)' },
  { value: 'GBFEL', label: '费利克斯托港 Felixstowe Port (GBFEL)' },
  { value: 'GBLGP', label: '伦敦门户港 London Gateway Port (GBLGP)' }
];

// 周几选项


// 船公司选项（共舱方）


/**
 * 已发送页面组件
 * @description 展示已发送的MPCI申报单列表，支持查看、编辑和删除操作
 * @author 系统开发者
 * @date 2024-01-15
 */
const Sent: React.FC = () => {

  const [declarationData, setDeclarationData] = useState<DeclarationData[]>([]);
  const [filteredData, setFilteredData] = useState<DeclarationData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentDeclaration, setCurrentDeclaration] = useState<DeclarationData | null>(null);
  // const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  // const [batchAction, setBatchAction] = useState<'enable' | 'disable'>('enable');
  const [singleConfirmModalVisible, setSingleConfirmModalVisible] = useState(false);
  const [currentToggleRecord, setCurrentToggleRecord] = useState<DeclarationData | null>(null);

  // 筛选功能状态
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  
  // 字段可见性状态
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({
    declarationNo: true,
    hbl: true,
    mbl: true,
    validationStatus: true,
    shippingCompany: true,
    declarantMpci: true,
    portOfLoading: true,
    portOfDischarge: true,
    portOfDestination: true,
    shipper: true,
    consignee: true,
    creator: true,
    createTime: true
  });

  // 列顺序状态
  const [columnOrder, setColumnOrder] = useState([
    'declarationNo', 'hbl', 'mbl', 'validationStatus', 'shippingCompany', 'declarantMpci', 
    'portOfLoading', 'portOfDischarge', 'portOfDestination', 'shipper', 'consignee', 'creator', 'createTime'
  ]);

  // 筛选条件状态
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');

  // 筛选功能状态
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // 筛选字段拖拽状态
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);

  // 初始化默认筛选条件
  const initializeDefaultConditions = (): FilterCondition[] => {
    const fields = getFilterFields();
    return fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: undefined,
      visible: ['declarationNo', 'hbl', 'validationStatus', 'status'].includes(field.key)
    }));
  };

  // 初始化默认筛选方案
  const initializeDefaultScheme = (): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(),
      isDefault: true
    };
  };



  // 切换筛选区域展开状态
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  // 更新筛选条件
  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => 
      prev.map(condition => 
        condition.key === key ? { ...condition, mode, value } : condition
      )
    );
  };

  // 重置筛选条件
  const resetFilterConditions = () => {
    const defaultConditions = initializeDefaultConditions();
    setFilterConditions(defaultConditions);
    // 应用默认筛选方案
    const defaultScheme = filterSchemes.find(scheme => scheme.isDefault);
    if (defaultScheme) {
      setCurrentSchemeId('default');
    }
  };

  // 应用筛选方案
  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions(scheme.conditions);
      setCurrentSchemeId(schemeId);
    }
  };

  // 打开筛选字段配置
  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  // 关闭筛选字段配置
  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  // 打开筛选方案配置
  const openSchemeModal = () => {
    setSchemeModalVisible(true);
    setNewSchemeName('');
  };

  // 关闭筛选方案配置
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
      conditions: [...filterConditions],
      isDefault: false
    };
    
    setFilterSchemes(prev => [...prev, newScheme]);
    Message.success('筛选方案保存成功');
    closeSchemeModal();
  };

  // 更新筛选条件可见性
  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => 
      prev.map(condition => 
        condition.key === key ? { ...condition, visible } : condition
      )
    );
  };

  // 打开自定义表格弹窗
  const openCustomTableModal = () => {
    setCustomTableModalVisible(true);
  };

  // 关闭自定义表格弹窗
  const closeCustomTableModal = () => {
    setCustomTableModalVisible(false);
  };

  // 处理表格列可见性变更
  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility({
      ...columnVisibility,
      [column]: visible
    });
  };

  // 重置表格列可见性
  const resetColumnVisibility = () => {
    setColumnVisibility({
      declarationNo: true,
      hbl: true,
      mbl: true,
      validationStatus: true,
      shippingCompany: true,
      status: true
    });
  };

  // 应用表格列设置
  const applyColumnSettings = () => {
    Message.success('表格设置已应用');
    closeCustomTableModal();
  };

  // 拖拽排序处理函数
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
    
    if (draggedItem && draggedItem !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetColumnKey);
      
      // 移动元素
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

  // 筛选字段拖拽排序处理函数
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
    
    if (draggedFilterField && draggedFilterField !== targetFieldKey) {
      const newOrder = [...filterFieldOrder];
      const draggedIndex = newOrder.indexOf(draggedFilterField);
      const targetIndex = newOrder.indexOf(targetFieldKey);
      
      // 移动元素
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

  // 获取列的中文名称
  const getColumnLabel = (columnKey: string): string => {
    const columnLabels: Record<string, string> = {
      declarationNo: '申报单号',
      hbl: 'HBL',
      mbl: 'MBL',
      validationStatus: '校验状态',
      shippingCompany: '船公司',
      declarantMpci: '申报人MPCI',
      status: '状态'
    };
    return columnLabels[columnKey] || columnKey;
  };

  // 获取可见的筛选条件（用于渲染）
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  // 获取第一行筛选条件（用于收起状态）
  const getFirstRowConditions = (): FilterCondition[] => {
    const visibleConditions = getVisibleConditions();
    return visibleConditions.slice(0, 4); // 假设第一行显示4个条件
  };

  // 渲染单个筛选条件
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
              style={{ width: '90px' }}
              size="mini"
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
          <Typography.Title heading={6} className="!mb-0 !text-gray-800">
            筛选条件
          </Typography.Title>
          <div className="flex items-center gap-3">
            {/* 选择方案下拉 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">方案:</span>
              <Select
                value={currentSchemeId}
                onChange={applyFilterScheme}
                style={{ width: '140px' }}
                placeholder="选择方案"
                size="small"
              >
                {filterSchemes.map(scheme => (
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
            .filter-input-wrapper .arco-select-view {
              border: 1px solid #d1d5db;
              transition: border-color 0.2s ease;
            }
            
            .filter-input-wrapper .arco-input:focus,
            .filter-input-wrapper .arco-select-view:focus {
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

  // 模拟数据 - 已发送的申报单（所有记录都是已发送状态）
  const mockData: DeclarationData[] = [
    {
      id: '1',
      declarationNo: 'DECL001',
      hbl: 'SHSE1234567',
      mbl: 'COSU123456789',
      declarationStatus: 'submitted',
      customsReceiptStatus: 'allow_loading',
      shippingCompany: 'MAERSK',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNSHA',
      portOfDischarge: 'NLRTM',
      portOfDestination: 'DEHAM',
      shipper: 'Shanghai Global Logistics Co., Ltd.',
      consignee: 'Amsterdam Trading Company B.V.',
      creator: '张三',
      createTime: '2024-01-15 10:30:00',
      sender: '张三',
      sendTime: '2024-01-15 11:00:00',
      updater: '李四',
      updateTime: '2024-01-16 09:30:00',
      status: 'enabled'
    },
    {
      id: '2',
      declarationNo: 'DECL002',
      hbl: 'SHSE2345678',
      mbl: 'EGLV1234567890',
      declarationStatus: 'sent_failed',
      customsReceiptStatus: 'require_supplement',
      shippingCompany: 'COSCO',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNNGB',
      portOfDischarge: 'USLAX',
      portOfDestination: 'USOAK',
      shipper: 'Ningbo International Freight Co., Ltd.',
      consignee: 'Los Angeles Logistics Center Inc.',
      creator: '李四',
      createTime: '2024-01-20 09:15:00',
      sender: '李四',
      sendTime: '2024-01-20 10:00:00',
      updater: '王五',
      updateTime: '2024-01-21 14:20:00',
      status: 'enabled'
    },
    {
      id: '3',
      declarationNo: 'DECL003',
      hbl: 'SHSE3456789',
      mbl: 'COSU234567890',
      declarationStatus: 'sent_success',
      customsReceiptStatus: 'allow_loading',
      shippingCompany: 'EVERGREEN',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNSZN',
      portOfDischarge: 'USLGB',
      portOfDestination: 'USNYC',
      shipper: 'Shenzhen Foreign Trade Group Ltd.',
      consignee: 'New York Import Corporation',
      creator: '王五',
      createTime: '2024-02-01 14:22:00',
      sender: '王五',
      sendTime: '2024-02-01 15:10:00',
      updater: '赵六',
      updateTime: '2024-02-02 10:15:00',
      status: 'disabled'
    },
    {
      id: '4',
      declarationNo: 'DECL004',
      hbl: 'SHSE4567890',
      mbl: 'EGLV2345678901',
      declarationStatus: 'deleted',
      customsReceiptStatus: 'prohibit_loading',
      shippingCompany: 'MSC',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNQIN',
      portOfDischarge: 'DEHAM',
      portOfDestination: 'BEANR',
      shipper: 'Qingdao Maritime Group Co., Ltd.',
      consignee: 'Hamburg Logistics GmbH',
      creator: '赵六',
      createTime: '2024-02-05 11:45:00',
      sender: '赵六',
      sendTime: '2024-02-05 12:30:00',
      updater: '孙七',
      updateTime: '2024-02-06 08:45:00',
      status: 'enabled'
    },
    {
      id: '5',
      declarationNo: 'DECL005',
      hbl: 'SHSE5678901',
      mbl: 'COSU345678901',
      declarationStatus: 'expired',
      customsReceiptStatus: 'not_declared',
      shippingCompany: 'OOCL',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNTXG',
      portOfDischarge: 'JPYOK',
      portOfDestination: 'JPTYO',
      shipper: 'Tianjin Port Group Co., Ltd.',
      consignee: 'Tokyo Trading Corporation',
      creator: '孙七',
      createTime: '2024-02-08 16:20:00',
      sender: '孙七',
      sendTime: '2024-02-08 17:00:00',
      updater: '周八',
      updateTime: '2024-02-09 11:30:00',
      status: 'enabled'
    },
    {
      id: '6',
      declarationNo: 'DECL006',
      hbl: 'SHSE6789012',
      mbl: 'EGLV3456789012',
      declarationStatus: 'sent_success',
      customsReceiptStatus: 'risk_loading',
      shippingCompany: 'CMA',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNDLC',
      portOfDischarge: 'FRLEH',
      portOfDestination: 'ITGOA',
      shipper: 'Dalian Ocean Shipping Co., Ltd.',
      consignee: 'Genoa Import Export S.r.l.',
      creator: '周八',
      createTime: '2024-02-10 08:30:00',
      sender: '周八',
      sendTime: '2024-02-10 09:15:00',
      updater: '吴九',
      updateTime: '2024-02-11 16:20:00',
      status: 'enabled'
    },
    {
      id: '7',
      declarationNo: 'DECL007',
      hbl: 'SHSE7890123',
      mbl: 'COSU456789012',
      declarationStatus: 'sent_failed',
      customsReceiptStatus: 'require_supplement',
      shippingCompany: 'ONE',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNXMN',
      portOfDischarge: 'KRPUS',
      portOfDestination: 'JPKOB',
      shipper: 'Xiamen International Freight Co., Ltd.',
      consignee: 'Kobe Trading Corporation',
      creator: '吴九',
      createTime: '2024-02-12 13:15:00',
      sender: '吴九',
      sendTime: '2024-02-12 14:00:00',
      updater: '郑十',
      updateTime: '2024-02-13 10:30:00',
      status: 'enabled'
    },
    {
      id: '8',
      declarationNo: 'DECL008',
      hbl: 'SHSE8901234',
      mbl: 'EGLV4567890123',
      declarationStatus: 'submitted',
      customsReceiptStatus: 'allow_loading',
      shippingCompany: 'HAPAG',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNHKG',
      portOfDischarge: 'SGSIN',
      portOfDestination: 'NLRTM',
      shipper: 'Hong Kong Global Logistics Ltd.',
      consignee: 'Rotterdam Port Authority N.V.',
      creator: '郑十',
      createTime: '2024-02-15 09:45:00',
      sender: '郑十',
      sendTime: '2024-02-15 10:30:00',
      updater: '王十一',
      updateTime: '2024-02-16 14:15:00',
      status: 'enabled'
    },
    {
      id: '9',
      declarationNo: 'DECL009',
      hbl: 'SHSE9012345',
      mbl: 'COSU567890123',
      declarationStatus: 'sent_failed',
      customsReceiptStatus: 'require_supplement',
      shippingCompany: 'MAERSK',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNSHA',
      portOfDischarge: 'USSAV',
      portOfDestination: 'USCHA',
      shipper: 'Shanghai Oriental Shipping Co., Ltd.',
      consignee: 'Charleston Terminal Corporation',
      creator: '王十一',
      createTime: '2024-02-18 15:30:00',
      sender: '王十一',
      sendTime: '2024-02-18 16:15:00',
      updater: '李十二',
      updateTime: '2024-02-19 09:45:00',
      status: 'enabled'
    },
    {
      id: '10',
      declarationNo: 'DECL010',
      hbl: 'SHSE0123456',
      mbl: 'EGLV5678901234',
      declarationStatus: 'sent_success',
      customsReceiptStatus: 'allow_loading',
      shippingCompany: 'COSCO',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNNGB',
      portOfDischarge: 'USNOR',
      portOfDestination: 'USNYC',
      shipper: 'Ningbo Zhoushan Port Group Co., Ltd.',
      consignee: 'New York Port Authority Inc.',
      creator: '李十二',
      createTime: '2024-02-20 12:00:00',
      sender: '李十二',
      sendTime: '2024-02-20 12:45:00',
      updater: '张十三',
      updateTime: '2024-02-21 11:20:00',
      status: 'enabled'
    },
    {
      id: '11',
      declarationNo: 'DECL011',
      hbl: 'SHSE1234560',
      mbl: 'COSU678901234',
      declarationStatus: 'submitted',
      customsReceiptStatus: 'allow_loading',
      shippingCompany: 'EVERGREEN',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNSZN',
      portOfDischarge: 'ESVLC',
      portOfDestination: 'GBFEL',
      shipper: 'Shenzhen Yantian Port Co., Ltd.',
      consignee: 'Felixstowe Logistics Ltd.',
      creator: '张十三',
      createTime: '2024-02-22 10:15:00',
      sender: '张十三',
      sendTime: '2024-02-22 11:00:00',
      updater: '赵十四',
      updateTime: '2024-02-23 15:30:00',
      status: 'enabled'
    },
    {
      id: '12',
      declarationNo: 'DECL012',
      hbl: 'SHSE2345601',
      mbl: 'EGLV6789012345',
      declarationStatus: 'deleted',
      customsReceiptStatus: 'prohibit_loading',
      shippingCompany: 'MSC',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNQIN',
      portOfDischarge: 'GBLGP',
      portOfDestination: 'DEHAM',
      shipper: 'Qingdao Qianwan Port Co., Ltd.',
      consignee: 'Hamburg Sudamerika Line GmbH',
      creator: '赵十四',
      createTime: '2024-02-25 14:45:00',
      sender: '赵十四',
      sendTime: '2024-02-25 15:30:00',
      updater: '孙十五',
      updateTime: '2024-02-26 09:15:00',
      status: 'enabled'
    },
    {
      id: '13',
      declarationNo: 'DECL013',
      hbl: 'SHSE3456012',
      mbl: 'COSU789012345',
      declarationStatus: 'expired',
      customsReceiptStatus: 'not_declared',
      shippingCompany: 'OOCL',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNTXG',
      portOfDischarge: 'USLAX',
      portOfDestination: 'USOAK',
      shipper: 'Tianjin Xingang Port Co., Ltd.',
      consignee: 'Oakland Port Authority Inc.',
      creator: '孙十五',
      createTime: '2024-02-28 11:30:00',
      sender: '孙十五',
      sendTime: '2024-02-28 12:15:00',
      updater: '周十六',
      updateTime: '2024-03-01 08:45:00',
      status: 'enabled'
    },
    {
      id: '14',
      declarationNo: 'DECL014',
      hbl: 'SHSE4567123',
      mbl: 'EGLV7890123456',
      declarationStatus: 'sent_failed',
      customsReceiptStatus: 'require_supplement',
      shippingCompany: 'CMA',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNDLC',
      portOfDischarge: 'NLRTM',
      portOfDestination: 'BEANR',
      shipper: 'Dalian Port Group Co., Ltd.',
      consignee: 'Antwerp Terminal Corporation N.V.',
      creator: '周十六',
      createTime: '2024-03-01 16:00:00',
      sender: '周十六',
      sendTime: '2024-03-01 16:45:00',
      updater: '吴十七',
      updateTime: '2024-03-02 13:20:00',
      status: 'enabled'
    },
    {
      id: '15',
      declarationNo: 'DECL015',
      hbl: 'SHSE5678234',
      mbl: 'COSU890123456',
      declarationStatus: 'sent_success',
      customsReceiptStatus: 'risk_loading',
      shippingCompany: 'ONE',
      declarantMpci: 'LETOL00',
      portOfLoading: 'CNXMN',
      portOfDischarge: 'JPYOK',
      portOfDestination: 'KRPUS',
      shipper: 'Xiamen Port Holdings Co., Ltd.',
      consignee: 'Busan New Port Corporation',
      creator: '吴十七',
      createTime: '2024-03-03 09:20:00',
      sender: '吴十七',
      sendTime: '2024-03-03 10:05:00',
      updater: '郑十八',
      updateTime: '2024-03-04 14:30:00',
      status: 'enabled'
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '申报单号',
      dataIndex: 'declarationNo',
      width: 140,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: 'HBL',
      dataIndex: 'hbl',
      width: 140,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: 'MBL',
      dataIndex: 'mbl',
      width: 140,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '申报状态',
      dataIndex: 'declarationStatus',
      width: 120,
      sorter: true,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          'submitted': 'blue',
          'sent_success': 'green',
          'sent_failed': 'red',
          'deleted': 'gray',
          'expired': 'orange'
        };
        const statusOption = declarationStatusOptions.find(opt => opt.value === status);
        return <Tag color={colorMap[status] || 'gray'}>{statusOption?.label || status}</Tag>;
      }
    },
    {
      title: '海关回执状态',
      dataIndex: 'customsReceiptStatus',
      width: 140,
      sorter: true,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          'allow_loading': 'green',
          'require_supplement': 'orange',
          'risk_loading': 'gold',
          'prohibit_loading': 'red',
          'not_declared': 'gray'
        };
        const statusOption = customsReceiptStatusOptions.find(opt => opt.value === status);
        return <Tag color={colorMap[status] || 'gray'}>{statusOption?.label || status}</Tag>;
      }
    },
    {
      title: '船公司',
      dataIndex: 'shippingCompany',
      width: 160,
      sorter: true,
      render: (company: string) => {
        const companyLabel = shippingCompanyOptions.find(opt => opt.value === company)?.label || company;
        return <Tooltip content={companyLabel} mini><span className="arco-ellipsis">{companyLabel}</span></Tooltip>;
      }
    },
    {
      title: '申报人MPCI',
      dataIndex: 'declarantMpci',
      width: 140,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '起运港',
      dataIndex: 'portOfLoading',
      width: 160,
      sorter: true,
      render: (port: string) => {
        const portOption = portOptions.find(opt => opt.value === port);
        if (portOption) {
          const [fullName, code] = portOption.label.split(' (');
          const portCode = code?.replace(')', '') || port;
          // 提取英文全称：去掉中文部分，保留英文部分
          const englishName = fullName.split(' ').slice(1).join(' ');
          return (
            <div style={{ lineHeight: '1.2' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{englishName}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>{portCode}</div>
            </div>
          );
        }
        return <span>{port}</span>;
      }
    },
    {
      title: '卸货港',
      dataIndex: 'portOfDischarge',
      width: 160,
      sorter: true,
      render: (port: string) => {
        const portOption = portOptions.find(opt => opt.value === port);
        if (portOption) {
          const [fullName, code] = portOption.label.split(' (');
          const portCode = code?.replace(')', '') || port;
          // 提取英文全称：去掉中文部分，保留英文部分
          const englishName = fullName.split(' ').slice(1).join(' ');
          return (
            <div style={{ lineHeight: '1.2' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{englishName}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>{portCode}</div>
            </div>
          );
        }
        return <span>{port}</span>;
      }
    },
    {
      title: '目的港',
      dataIndex: 'portOfDestination',
      width: 160,
      sorter: true,
      render: (port: string) => {
        const portOption = portOptions.find(opt => opt.value === port);
        if (portOption) {
          const [fullName, code] = portOption.label.split(' (');
          const portCode = code?.replace(')', '') || port;
          // 提取英文全称：去掉中文部分，保留英文部分
          const englishName = fullName.split(' ').slice(1).join(' ');
          return (
            <div style={{ lineHeight: '1.2' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{englishName}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>{portCode}</div>
            </div>
          );
        }
        return <span>{port}</span>;
      }
    },
    {
      title: '发货人',
      dataIndex: 'shipper',
      width: 160,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '收货人',
      dataIndex: 'consignee',
      width: 160,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 120,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 140,
      sorter: true,
      render: (value: string) => {
        const date = new Date(value);
        const dateStr = date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const timeStr = date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        return (
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{dateStr}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>{timeStr}</div>
          </div>
        );
      },
    },
    {
      title: '发送人',
      dataIndex: 'sender',
      width: 120,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      width: 140,
      sorter: true,
      render: (value: string) => {
        const date = new Date(value);
        const dateStr = date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const timeStr = date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        return (
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{dateStr}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>{timeStr}</div>
          </div>
        );
      },
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      width: 120,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 140,
      sorter: true,
      render: (value: string) => {
        const date = new Date(value);
        const dateStr = date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const timeStr = date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        return (
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{dateStr}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>{timeStr}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: DeclarationData) => {
        // 按钮状态控制逻辑
        const isSubmittedOrFailed = record.declarationStatus === 'submitted' || record.declarationStatus === 'sent_failed';
        const isExpiredOrDeleted = record.declarationStatus === 'expired' || record.declarationStatus === 'deleted';
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* 第一行：详情、复制 */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <Button
                type="text"
                size="small"
                icon={<IconEye />}
                onClick={() => handleDetail(record)}
                style={{ flex: 1 }}
              >
                详情
              </Button>
              <Button
                type="text"
                size="small"
                icon={<IconCopy />}
                onClick={() => handleCopy(record)}
                style={{ flex: 1 }}
              >
                复制
              </Button>
            </div>
            {/* 第二行：改单、更多 */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <Button
                type="text"
                size="small"
                icon={<IconEdit />}
                onClick={() => handleEdit(record)}
                disabled={isSubmittedOrFailed || isExpiredOrDeleted}
                style={{ 
                  flex: 1,
                  opacity: (isSubmittedOrFailed || isExpiredOrDeleted) ? 0.5 : 1
                }}
              >
                改单
              </Button>
              <Dropdown
                droplist={
                  <Menu style={{ color: '#1890ff' }}>
                    <Menu.Item
                      key="delete"
                      onClick={() => handleDelete(record)}
                      disabled={isSubmittedOrFailed || isExpiredOrDeleted}
                      style={{ 
                        color: (isSubmittedOrFailed || isExpiredOrDeleted) ? '#ccc' : '#1890ff',
                        opacity: (isSubmittedOrFailed || isExpiredOrDeleted) ? 0.5 : 1
                      }}
                    >
                      <IconDelete style={{ marginRight: '8px' }} />
                      删单
                    </Menu.Item>
                    <Menu.Item
                      key="export"
                      onClick={() => handleExport(record)}
                      disabled={isSubmittedOrFailed}
                      style={{ 
                        color: isSubmittedOrFailed ? '#ccc' : '#1890ff',
                        opacity: isSubmittedOrFailed ? 0.5 : 1
                      }}
                    >
                      <IconDownload style={{ marginRight: '8px' }} />
                      导出
                    </Menu.Item>
                  </Menu>
                }
                position="bottom"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<IconMore />}
                  style={{ flex: 1 }}
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

  // 事件处理函数
  const handleDetail = (record: DeclarationData) => {
    setCurrentDeclaration(record);
    setDetailModalVisible(true);
  };

  /**
   * 处理复制申报单操作
   * @param record 申报单数据
   */
  const handleCopy = (record: DeclarationData) => {
    Message.info(`复制申报单: ${record.declarationNo}`);
    // TODO: 实现复制逻辑
  };

  /**
   * 处理改单操作
   * @param record 申报单数据
   */
  const handleEdit = (record: DeclarationData) => {
    Message.info(`改单操作: ${record.declarationNo}`);
    // TODO: 实现改单逻辑
  };

  /**
   * 处理删单操作
   * @param record 申报单数据
   */
  const handleDelete = (record: DeclarationData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除申报单 ${record.declarationNo} 吗？此操作不可撤销。`,
      onOk: () => {
        const newData = declarationData.filter(item => item.id !== record.id);
        setDeclarationData(newData);
        setFilteredData(newData);
        Message.success('删除成功');
      }
    });
  };

  /**
   * 处理导出操作
   * @param record 申报单数据
   */
  const handleExport = (record: DeclarationData) => {
    Message.info(`导出申报单: ${record.declarationNo}`);
    // TODO: 实现导出逻辑
  };

  /**
   * 获取批量操作按钮 - 已发送页面暂不需要批量操作
   */
  /**
   * 获取批量操作按钮
   * @returns 批量操作按钮组件或null
   */
  const getBatchActionButtons = () => {
    if (selectedRowKeys.length === 0) {
      return null;
    }

    return (
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-600 font-medium mr-4">
              已选择 {selectedRowKeys.length} 项
            </span>
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              取消选择
            </Button>
          </div>
          <Space>
            <Button
              type="primary"
              status="danger"
              icon={<IconDelete />}
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              批量删单
            </Button>
            <Button
              type="primary"
              icon={<IconDownload />}
              onClick={handleBatchExport}
              disabled={selectedRowKeys.length === 0}
            >
              批量导出
            </Button>
          </Space>
        </div>
      </div>
    );
  };



  const handleConfirmSingleToggle = () => {
    if (currentToggleRecord) {
      const newStatus = currentToggleRecord.status === 'enabled' ? 'disabled' : 'enabled';
      const newData = declarationData.map((item: DeclarationData) =>
        item.id === currentToggleRecord.id ? { ...item, status: newStatus as 'enabled' | 'disabled' } : item
      );
      setDeclarationData(newData);
      setFilteredData(newData);
      setSingleConfirmModalVisible(false);
      setCurrentToggleRecord(null);
      Message.success(`已${newStatus === 'enabled' ? '启用' : '禁用'}申报单`);
    }
  };

  /**
   * 处理批量删除操作
   */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请先选择要删除的申报单');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个申报单吗？此操作不可撤销。`,
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { status: 'danger' },
      onOk: () => {
        const newData = declarationData.filter((item: DeclarationData) => 
          !selectedRowKeys.includes(item.id)
        );
        setDeclarationData(newData);
        setFilteredData(newData);
        setSelectedRowKeys([]);
        Message.success(`已成功删除 ${selectedRowKeys.length} 个申报单`);
      }
    });
  };

  /**
   * 处理批量导出操作
   */
  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请先选择要导出的申报单');
      return;
    }

    const selectedData = declarationData.filter((item: DeclarationData) => 
      selectedRowKeys.includes(item.id)
    );

    // 创建CSV内容
    const headers = [
      '申报单号', 'HBL', 'MBL', '申报状态', '海关回执状态', 
      '船公司', '申报人MPCI', '起运港', '卸货港', '目的港', 
      '发货人', '收货人', '创建人', '创建时间', '发送人', '发送时间'
    ];
    
    const csvContent = [
      headers.join(','),
      ...selectedData.map(item => [
        item.declarationNo,
        item.hbl,
        item.mbl,
        declarationStatusOptions.find(opt => opt.value === item.declarationStatus)?.label || item.declarationStatus,
        customsReceiptStatusOptions.find(opt => opt.value === item.customsReceiptStatus)?.label || item.customsReceiptStatus,
        item.shippingCompany,
        item.declarantMpci,
        item.portOfLoading,
        item.portOfDischarge,
        item.portOfDestination,
        item.shipper,
        item.consignee,
        item.creator,
        item.createTime,
        item.sender,
        item.sendTime
      ].join(','))
    ].join('\n');

    // 创建并下载文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `已发送申报单_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    Message.success(`已成功导出 ${selectedRowKeys.length} 个申报单`);
  };

  // 初始化数据
  useEffect(() => {
    setDeclarationData(mockData);
    setFilteredData(mockData);
    
    // 初始化筛选条件
    const defaultScheme = initializeDefaultScheme();
    setFilterSchemes([defaultScheme]);
    setFilterConditions(defaultScheme.conditions);
    
    // 初始化筛选字段顺序
    const fields = getFilterFields();
    setFilterFieldOrder(fields.map(field => field.key));
  }, []);

  return (
    <div>
      <Card>
        {/* 使用新的筛选区域 */}
        {renderNewFilterArea()}
        
        <div style={{ marginBottom: 16 }}>
          <div className="flex justify-end">
            <div 
              className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={openCustomTableModal}
            >
              <IconSettings className="mr-1" />
              <span>自定义表格</span>
            </div>
          </div>
        </div>

        {/* 批量操作按钮 */}
        {getBatchActionButtons()}

        {/* 表格 */}
        <Table
          rowKey="id"
          data={filteredData}
          columns={columns}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys as string[]);
            },
            onSelectAll: (selected) => {
              if (selected) {
                setSelectedRowKeys(filteredData.map(item => item.id));
              } else {
                setSelectedRowKeys([]);
              }
            },
            checkboxProps: (record) => ({
              disabled: record.status === 'disabled', // 禁用状态的行不可选择
            }),
          }}
          pagination={{
            total: filteredData.length,
            pageSize: 20,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
            pageSizeChangeResetCurrent: true,
          }}
          scroll={{ x: 1200 }}
          border={false}
          className="mt-4"
        />
        <div className="mt-2 text-gray-500 text-sm">共 {filteredData.length} 条</div>

        {/* 详情抽屉 */}
        <Drawer
          width={800}
          title="航线详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={
            <div className="flex justify-end">
              <Button onClick={() => setDetailModalVisible(false)}>
                关闭
              </Button>
            </div>
          }
        >
          {currentDeclaration && (
            <div style={{ padding: '16px 0' }}>
              {/* 基础信息 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, borderLeft: '4px solid #1890ff', paddingLeft: 12, fontSize: 16, fontWeight: 'bold' }}>基础信息</h3>
                <Row gutter={24}>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>申报单号：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.declarationNo}</span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>HBL：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.hbl}</span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>MBL：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.mbl}</span>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>申报状态：</strong>
                      <Tag color={currentDeclaration.declarationStatus === 'sent_success' ? 'green' : 'red'}>
                        {declarationStatusOptions.find(opt => opt.value === currentDeclaration.declarationStatus)?.label}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>船公司：</strong>
                      <span style={{ marginLeft: 8 }}>
                        {shippingCompanyOptions.find(opt => opt.value === currentDeclaration.shippingCompany)?.label || currentDeclaration.shippingCompany}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>申报人MPCI：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.declarantMpci}</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* 港口信息 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, borderLeft: '4px solid #52c41a', paddingLeft: 12, fontSize: 16, fontWeight: 'bold' }}>港口信息</h3>
                <Row gutter={24}>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>起运港：</strong>
                      <span style={{ marginLeft: 8 }}>
                        {portOptions.find(opt => opt.value === currentDeclaration.portOfLoading)?.label || currentDeclaration.portOfLoading}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>卸货港：</strong>
                      <span style={{ marginLeft: 8 }}>
                        {portOptions.find(opt => opt.value === currentDeclaration.portOfDischarge)?.label || currentDeclaration.portOfDischarge}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>目的港：</strong>
                      <span style={{ marginLeft: 8 }}>
                        {portOptions.find(opt => opt.value === currentDeclaration.portOfDestination)?.label || currentDeclaration.portOfDestination}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* 货主信息 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, borderLeft: '4px solid #ff7875', paddingLeft: 12, fontSize: 16, fontWeight: 'bold' }}>货主信息</h3>
                <Row gutter={24}>
                  <Col span={12}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>发货人：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.shipper}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>收货人：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.consignee}</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* 操作信息 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, borderLeft: '4px solid #faad14', paddingLeft: 12, fontSize: 16, fontWeight: 'bold' }}>操作信息</h3>
                <Row gutter={24}>
                  <Col span={12}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>创建人：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.creator}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>创建时间：</strong>
                      <span style={{ marginLeft: 8 }}>{currentDeclaration.createTime}</span>
                    </div>
                  </Col>
                </Row>

                {/* 操作信息 */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold', color: '#722ed1' }}>操作信息</div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <strong>创建人：</strong>
                        <span style={{ marginLeft: 8 }}>{currentDeclaration.creator}</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <strong>创建时间：</strong>
                        <span style={{ marginLeft: 8 }}>{currentDeclaration.createTime}</span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          )}
        </Drawer>

        {/* 状态切换确认弹窗 */}
        <Modal
          title="确认操作"
          visible={singleConfirmModalVisible}
          onOk={handleConfirmSingleToggle}
          onCancel={() => setSingleConfirmModalVisible(false)}
          okText="确定"
          cancelText="取消"
        >
          {currentToggleRecord && (
            <p>
              确定要{currentToggleRecord.status === 'enabled' ? '禁用' : '启用'}申报单 
              <strong> {currentToggleRecord.declarationNo} </strong>吗？
            </p>
          )}
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
            
            {/* 可拖拽的字段列表 */}
            <div className="flex-1 overflow-y-auto px-4">
              {filterFieldOrder.map((fieldKey, index) => {
                const field = getFilterFields().find(f => f.key === fieldKey);
                const condition = filterConditions.find(c => c.key === fieldKey);
                const isSelected = condition?.visible || false;
                
                if (!field) return null;
                
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
                      checked={isSelected} 
                      onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer>

        {/* 另存为方案弹窗 */}
        <Modal
          title="另存为筛选方案"
          visible={schemeModalVisible}
          onCancel={closeSchemeModal}
          footer={[
            <Button key="cancel" onClick={closeSchemeModal}>取消</Button>,
            <Button key="save" type="primary" onClick={saveFilterScheme} disabled={!newSchemeName.trim()}>保存</Button>,
          ]}
          style={{ width: 400 }}
        >
          <div className="p-4">
            <div className="mb-4 text-gray-600">请输入方案名称：</div>
            <Input
              value={newSchemeName}
              onChange={setNewSchemeName}
              placeholder="请输入方案名称"
              maxLength={50}
              showWordLimit
            />
            <div className="mt-4 text-xs text-gray-500">
              保存后可在"选择方案"下拉中找到此方案
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default Sent;