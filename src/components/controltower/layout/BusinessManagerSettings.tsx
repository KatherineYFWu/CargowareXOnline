import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select, 
  DatePicker, 
  Card, 
  Tag,
  Message,
  Tooltip,
  Input,
  Grid,
  Checkbox
} from '@arco-design/web-react';
import ConfirmDialog from '../../common/ConfirmDialog';
import BusinessManagerFormModal from './BusinessManagerFormModal';
import { 
  IconSearch, 
  IconRefresh, 
  IconDown,
  IconUp,
  IconPlus,
  IconEdit,
  IconDelete
} from '@arco-design/web-react/icon';
import ControlTowerSaasLayout from "../saas/ControlTowerSaasLayout";
import SchemeManagementModal, { SchemeData } from '../saas/SchemeManagementModal';
import '../saas/InquiryManagement.css';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
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
export const FilterModeOptions = [
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
  type: 'text' | 'select' | 'dateRange' | 'number' | 'multiSelect';
  options?: { label: string; value: string }[];
  placeholder?: string;
  width?: number;
}

// 筛选条件值接口
export interface FilterCondition {
  key: string;
  mode: FilterMode;
  value: string | string[] | [string, string] | any;
  visible: boolean;
}

// 筛选方案接口
export interface FilterScheme {
  id: string;
  name: string;
  conditions: FilterCondition[];
  isDefault?: boolean;
}

// 业务负责人数据接口
interface BusinessManagerItem {
  key: string;
  employee: string; // 员工选择（姓名+手机号+邮箱拼接）
  businessType: string[]; // 业务属性（海运/空运/铁路/陆运）- 支持多个
  position: string[]; // 岗位（销售、航线、客服、操作、单证、商务、财务）- 支持多个
  rateType: string[]; // 运价类型（整箱、拼箱、空运、铁路、陆运、港前、尾程）- 支持多个
  originPort: string[]; // 起运港 - 支持多个
  destinationPort: string[]; // 目的港 - 支持多个
  dischargePort: string[]; // 卸货港 - 支持多个
  route: string[]; // 航线 - 支持多个
  carrier: string[]; // 承运人 - 支持多个
  customer: string[]; // 客户 - 支持多个
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

/**
 * 根据不同业务类型获取筛选字段配置
 * @param businessType 业务类型
 * @returns 筛选字段配置数组
 */
const getFilterFieldsByBusinessType = (): FilterFieldConfig[] => {
  const commonFields: FilterFieldConfig[] = [
    {
      key: 'employeeName',
      label: '员工姓名',
      type: 'multiSelect',
      options: [
        { label: '张三 (13800138001, zhang@example.com)', value: '张三' },
        { label: '李四 (13800138002, li@example.com)', value: '李四' },
        { label: '王五 (13800138003, wang@example.com)', value: '王五' },
        { label: '赵六 (13800138004, zhao@example.com)', value: '赵六' },
        { label: '钱七 (13800138005, qian@example.com)', value: '钱七' }
      ],
      placeholder: '请选择员工姓名',
      width: 200
    },
    {
      key: 'businessType',
      label: '业务属性',
      type: 'multiSelect',
      options: [
        { label: '海运', value: '海运' },
        { label: '空运', value: '空运' },
        { label: '铁路', value: '铁路' },
        { label: '陆运', value: '陆运' }
      ],
      placeholder: '请选择业务属性',
      width: 150
    },
    {
      key: 'position',
      label: '岗位',
      type: 'multiSelect',
      options: [
        { label: '销售', value: '销售' },
        { label: '航线', value: '航线' },
        { label: '客服', value: '客服' },
        { label: '操作', value: '操作' },
        { label: '单证', value: '单证' },
        { label: '商务', value: '商务' },
        { label: '财务', value: '财务' }
      ],
      placeholder: '请选择岗位',
      width: 150
    },
    {
      key: 'rateType',
      label: '运价类型',
      type: 'multiSelect',
      options: [
        { label: '整箱', value: '整箱' },
        { label: '拼箱', value: '拼箱' },
        { label: '空运', value: '空运' },
        { label: '铁路', value: '铁路' },
        { label: '陆运', value: '陆运' },
        { label: '港前', value: '港前' },
        { label: '尾程', value: '尾程' }
      ],
      placeholder: '请选择运价类型',
      width: 150
    },
    {
      key: 'originPort',
      label: '起运港',
      type: 'multiSelect',
      options: [
        { label: 'CNSHA|上海港', value: 'CNSHA|上海港' },
        { label: 'CNNGB|宁波港', value: 'CNNGB|宁波港' },
        { label: 'CNSZX|深圳港', value: 'CNSZX|深圳港' },
        { label: 'CNQIN|青岛港', value: 'CNQIN|青岛港' },
        { label: 'CNTAO|天津港', value: 'CNTAO|天津港' }
      ],
      placeholder: '请选择起运港',
      width: 200
    },
    {
      key: 'destinationPort',
      label: '目的港',
      type: 'multiSelect',
      options: [
        { label: 'USLAX|洛杉矶港', value: 'USLAX|洛杉矶港' },
        { label: 'USOAK|奥克兰港', value: 'USOAK|奥克兰港' },
        { label: 'DEHAM|汉堡港', value: 'DEHAM|汉堡港' },
        { label: 'NLRTM|鹿特丹港', value: 'NLRTM|鹿特丹港' },
        { label: 'SGSIN|新加坡港', value: 'SGSIN|新加坡港' }
      ],
      placeholder: '请选择目的港',
      width: 200
    },
    {
      key: 'dischargePort',
      label: '卸货港',
      type: 'multiSelect',
      options: [
        { label: 'USLAX|洛杉矶港', value: 'USLAX|洛杉矶港' },
        { label: 'USOAK|奥克兰港', value: 'USOAK|奥克兰港' },
        { label: 'DEHAM|汉堡港', value: 'DEHAM|汉堡港' },
        { label: 'NLRTM|鹿特丹港', value: 'NLRTM|鹿特丹港' },
        { label: 'SGSIN|新加坡港', value: 'SGSIN|新加坡港' }
      ],
      placeholder: '请选择卸货港',
      width: 200
    },
    {
      key: 'route',
      label: '航线',
      type: 'multiSelect',
      options: [
        { label: '亚欧航线', value: '亚欧航线' },
        { label: '跨太平洋航线', value: '跨太平洋航线' },
        { label: '亚美航线', value: '亚美航线' },
        { label: '欧美航线', value: '欧美航线' },
        { label: '中欧班列', value: '中欧班列' },
        { label: '中亚班列', value: '中亚班列' },
        { label: '东南亚航线', value: '东南亚航线' },
        { label: '中东航线', value: '中东航线' }
      ],
      placeholder: '请选择航线',
      width: 200
    },
    {
      key: 'carrier',
      label: '承运人',
      type: 'multiSelect',
      options: [
        { label: 'COSCO SHIPPING', value: 'COSCO SHIPPING' },
        { label: 'EVERGREEN', value: 'EVERGREEN' },
        { label: 'MAERSK', value: 'MAERSK' },
        { label: 'MSC', value: 'MSC' },
        { label: 'CMA CGM', value: 'CMA CGM' },
        { label: 'HAPAG-LLOYD', value: 'HAPAG-LLOYD' },
        { label: 'ONE', value: 'ONE' },
        { label: 'YANG MING', value: 'YANG MING' }
      ],
      placeholder: '请选择承运人',
      width: 200
    },
    {
      key: 'customer',
      label: '客户',
      type: 'multiSelect',
      options: [
        { label: '华为技术有限公司', value: '华为技术有限公司' },
        { label: '腾讯科技有限公司', value: '腾讯科技有限公司' },
        { label: '阿里巴巴集团', value: '阿里巴巴集团' },
        { label: '百度公司', value: '百度公司' },
        { label: '京东集团', value: '京东集团' },
        { label: '小米科技', value: '小米科技' },
        { label: '比亚迪股份', value: '比亚迪股份' },
        { label: '宁德时代', value: '宁德时代' }
      ],
      placeholder: '请选择客户',
      width: 200
    }
  ];

  return commonFields;
};

/**
 * 业务负责人设置页面组件
 * @returns JSX.Element
 */
const BusinessManagerSettings: React.FC = () => {
  
  // 基础状态
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BusinessManagerItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
    pageSizeOptions: ['10', '20', '50', '100']
  });
  
  // 筛选相关状态
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');
  
  // 选择状态管理
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  
  // 弹窗状态
  const [schemeManagementModalVisible, setSchemeManagementModalVisible] = useState(false);
  const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);
  
  // 当前业务类型
  const [currentBusinessType] = useState<string>('all');
  
  // 确认弹窗状态
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState({
    title: '确认',
    content: '',
    onOk: () => {}
  });
  
  // 表单弹窗状态
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [formModalTitle, setFormModalTitle] = useState('');
  const [editingData, setEditingData] = useState<BusinessManagerItem | undefined>(undefined);

  /**
   * 初始化筛选条件
   */
  useEffect(() => {
    const fields = getFilterFieldsByBusinessType();
    const initialConditions: FilterCondition[] = fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: true // 设置所有字段都可见
    }));
    setFilterConditions(initialConditions);
  }, [currentBusinessType]);

  /**
   * 初始化数据
   */
  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  /**
   * 加载数据
   */
  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockData = generateMockData();
      setData(mockData);
      setPagination(prev => ({ ...prev, total: 100 })); // 模拟总数
    } catch (error) {
      Message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 生成模拟数据
   * @returns 模拟的业务负责人数据
   */
  const generateMockData = (): BusinessManagerItem[] => {
    const businessTypes = ['海运', '空运', '铁路', '陆运'];
    const positions = ['销售', '航线', '客服', '操作', '单证', '商务', '财务'];
    const rateTypes = ['整箱', '拼箱', '空运', '铁路', '陆运', '港前', '尾程'];
    const carriers = [
      'COSCO SHIPPING', 'EVERGREEN', 'MAERSK', 'MSC', 'CMA CGM',
      '中国南方航空', '中国东方航空', '中国国际航空', '海南航空',
      '中铁集装箱', '中铁快运', '顺丰速运', '德邦物流'
    ];
    const ports = [
      'CNSHA|上海港', 'CNNGB|宁波港', 'CNSZX|深圳港', 'CNQIN|青岛港',
      'USLAX|洛杉矶港', 'USOAK|奥克兰港', 'DEHAM|汉堡港', 'NLRTM|鹿特丹港'
    ];
    const customers = [
      '华为技术有限公司', '腾讯科技有限公司', '阿里巴巴集团', '百度公司',
      '京东集团', '小米科技', '比亚迪股份', '宁德时代'
    ];
    const routes = [
      '亚欧航线', '跨太平洋航线', '亚美航线', '欧美航线',
      '中欧班列', '中亚班列', '东南亚航线', '中东航线'
    ];


    /**
     * 从数组中随机选择1-3个元素
     * @param arr 源数组
     * @returns 随机选择的元素数组
     */
    const getRandomItems = (arr: string[]): string[] => {
      const count = Math.floor(Math.random() * 3) + 1; // 1-3个
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    return Array(20).fill(null).map((_, index) => {
      const name = `员工${index + 1}`;
      const phone = `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
      const email = `employee${index + 1}@company.com`;
      
      return {
        key: `manager-${index + 1}`,
        employee: `${name} ${phone} ${email}`, // 姓名+手机号+邮箱拼接
        businessType: getRandomItems(businessTypes),
        position: getRandomItems(positions),
        rateType: getRandomItems(rateTypes),
        originPort: getRandomItems(ports),
        destinationPort: getRandomItems(ports),
        dischargePort: getRandomItems(ports),
        route: getRandomItems(routes),
        carrier: getRandomItems(carriers),
        customer: getRandomItems(customers),
        createTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        updateTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      };
    });
  };

  /**
   * 处理全选
   * @param checked 是否选中
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = data.map(item => item.key);
      setSelectedRowKeys(allKeys);
      setSelectAll(true);
      setIndeterminate(false);
    } else {
      setSelectedRowKeys([]);
      setSelectAll(false);
      setIndeterminate(false);
    }
  };

  /**
   * 处理行选择
   * @param selectedKeys 选中的行键
   */
  const handleRowSelection = (selectedKeys: string[]) => {
    setSelectedRowKeys(selectedKeys);
    setSelectAll(selectedKeys.length === data.length);
    setIndeterminate(selectedKeys.length > 0 && selectedKeys.length < data.length);
  };

  /**
   * 获取可见的筛选条件
   * @returns 可见的筛选条件数组
   */
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  /**
   * 获取第一行筛选条件
   * @returns 第一行筛选条件数组
   */
  const getFirstRowConditions = (): FilterCondition[] => {
    const visible = getVisibleConditions();
    return visible.slice(0, 4);
  };

  /**
   * 切换筛选区展开/收起
   */
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  /**
   * 更新筛选条件
   * @param key 字段键
   * @param mode 筛选模式
   * @param value 筛选值
   */
  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, mode, value } : condition
    ));
  };

  /**
   * 重置筛选条件
   */
  const resetFilterConditions = () => {
    setFilterConditions(prev => prev.map(condition => ({
      ...condition,
      mode: FilterMode.EQUAL,
      value: ''
    })));
  };





  /**
   * 关闭方案管理弹窗
   */
  const closeSchemeManagementModal = () => {
    setSchemeManagementModalVisible(false);
  };

  /**
   * 删除筛选方案
   * @param id 方案ID
   */
  const handleDeleteScheme = (id: string) => {
    setAllSchemes(prev => prev.filter(scheme => scheme.id !== id));
    // 如果删除的是当前选中的方案，切换到默认方案
    if (currentSchemeId === id) {
      setCurrentSchemeId('default');
    }
    Message.success('删除方案成功');
  };

  /**
   * 设置默认方案
   * @param id 方案ID
   */
  const handleSetDefault = (id: string) => {
    setAllSchemes(prev => prev.map(scheme => ({
      ...scheme,
      isDefault: scheme.id === id
    })));
    setCurrentSchemeId(id);
    Message.success('设置默认方案成功');
  };

  /**
   * 重命名方案
   * @param id 方案ID
   * @param newName 新名称
   */
  const handleRenameScheme = (id: string, newName: string) => {
    setAllSchemes(prev => prev.map(scheme => 
      scheme.id === id ? { ...scheme, name: newName } : scheme
    ));
    Message.success('重命名方案成功');
  };



  /**
   * 渲染筛选条件
   * @param condition 筛选条件
   * @returns JSX.Element
   */
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getFilterFieldsByBusinessType().find(field => field.key === condition.key);
    if (!fieldConfig) return null;

    const handleValueChange = (value: any) => {
      updateFilterCondition(condition.key, FilterMode.EQUAL, value);
    };

    return (
      <Col span={6} key={condition.key}>
        <div>
          <span className="text-sm text-gray-600 mb-1 block">{fieldConfig.label}</span>
          {fieldConfig.type === 'text' && (
            <Input
              placeholder={fieldConfig.placeholder}
              value={condition.value || ''}
              onChange={handleValueChange}
              allowClear
              size="small"
            />
          )}
          {fieldConfig.type === 'select' && (
            <Select
              placeholder={fieldConfig.placeholder}
              value={condition.value}
              onChange={handleValueChange}
              allowClear
              size="small"
              style={{ width: '100%' }}
            >
              {fieldConfig.options?.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          )}
          {fieldConfig.type === 'multiSelect' && (
            <Select
              placeholder={fieldConfig.placeholder}
              value={condition.value}
              onChange={handleValueChange}
              allowClear
              size="small"
              style={{ width: '100%' }}
              mode="multiple"
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
              size="small"
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          )}
          {fieldConfig.type === 'number' && (
            <Input
              placeholder={fieldConfig.placeholder}
              value={condition.value || ''}
              onChange={handleValueChange}
              allowClear
              size="small"
            />
          )}
        </div>
      </Col>
    );
  };

  /**
   * 渲染筛选区域
   * @returns JSX.Element
   */
  const renderFilterArea = () => {
    const conditionsToShow = filterExpanded ? getVisibleConditions() : getFirstRowConditions();
    
    return (
      <div className="mb-4 p-4 bg-gray-50 rounded relative">
        {/* 筛选条件区域 */}
        <Row gutter={[16, 16]}>
          {conditionsToShow.map(condition => renderFilterCondition(condition))}
        </Row>
        
        {/* 操作按钮区域 - 绝对定位到右下角 */}
        <div className="absolute bottom-4 right-4">
          <Space>
            <Button 
              type="primary" 
              icon={<IconSearch />}
              onClick={loadData}
            >
              查询
            </Button>
            <Button 
              icon={<IconRefresh />} 
              onClick={resetFilterConditions}
            >
              重置
            </Button>
            <Button 
              type="text" 
              icon={filterExpanded ? <IconUp /> : <IconDown />}
              onClick={toggleFilterExpanded}
            >
              {filterExpanded ? '收起' : '展开'}
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  /**
   * 表格列定义
   */
  const columns = [
    {
      title: (
        <Checkbox
          checked={selectAll}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
        />
      ),
      dataIndex: 'checkbox',
      width: 50,
      render: (_: any, record: BusinessManagerItem) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(checked) => {
            if (checked) {
              handleRowSelection([...selectedRowKeys, record.key]);
            } else {
              handleRowSelection(selectedRowKeys.filter(key => key !== record.key));
            }
          }}
        />
      ),
    },
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
      ),
    },
    {
      title: '员工',
      dataIndex: 'employee',
      width: 200,
      render: (value: string) => (
        <div>
          <div className="font-medium">{value}</div>
        </div>
      ),
      sorter: true,
      resizable: true,
    },
    {
      title: '业务属性',
      dataIndex: 'businessType',
      width: 150,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          return (
            <Tag color={values[0] === '海运' ? 'blue' : values[0] === '空运' ? 'green' : values[0] === '铁路' ? 'orange' : 'purple'}>
              {values[0]}
            </Tag>
          );
        }
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color={values[0] === '海运' ? 'blue' : values[0] === '空运' ? 'green' : values[0] === '铁路' ? 'orange' : 'purple'}>
                {values[0]}
              </Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '岗位',
      dataIndex: 'position',
      width: 150,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          return <Tag color="blue">{values[0]}</Tag>;
        }
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="blue">{values[0]}</Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '运价类型',
      dataIndex: 'rateType',
      width: 150,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          return <Tag color="green">{values[0]}</Tag>;
        }
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="green">{values[0]}</Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '起运港',
      dataIndex: 'originPort',
      width: 200,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          const [code] = values[0].split('|');
          return (
            <Tooltip content={values[0]} mini>
              <Tag color="orange">
                <div className="text-xs">{code}</div>
              </Tag>
            </Tooltip>
          );
        }
        const [firstCode] = values[0].split('|');
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="orange">
                <div className="text-xs">{firstCode}</div>
              </Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '目的港',
      dataIndex: 'destinationPort',
      width: 200,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          const [code] = values[0].split('|');
          return (
            <Tooltip content={values[0]} mini>
              <Tag color="purple">
                <div className="text-xs">{code}</div>
              </Tag>
            </Tooltip>
          );
        }
        const [firstCode] = values[0].split('|');
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="purple">
                <div className="text-xs">{firstCode}</div>
              </Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '卸货港',
      dataIndex: 'dischargePort',
      width: 200,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          const [code] = values[0].split('|');
          return (
            <Tooltip content={values[0]} mini>
              <Tag color="cyan">
                <div className="text-xs">{code}</div>
              </Tag>
            </Tooltip>
          );
        }
        const [firstCode] = values[0].split('|');
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="cyan">
                <div className="text-xs">{firstCode}</div>
              </Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '航线',
      dataIndex: 'route',
      width: 180,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          return <Tag color="magenta">{values[0]}</Tag>;
        }
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="magenta">{values[0]}</Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '承运人',
      dataIndex: 'carrier',
      width: 220,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          return <Tag color="blue">{values[0]}</Tag>;
        }
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="blue">{values[0]}</Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      width: 220,
      render: (values: string[]) => {
        if (!values || values.length === 0) return '-';
        if (values.length === 1) {
          return <Tag color="green">{values[0]}</Tag>;
        }
        return (
          <Tooltip content={values.join('、')} mini>
            <div className="flex items-center gap-1">
              <Tag color="green">{values[0]}</Tag>
              <span className="text-xs text-gray-500">+{values.length - 1}</span>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: BusinessManagerItem) => (
        <Space>
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
            icon={<IconDelete />}
            status="danger"
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * 处理编辑
   * @param record 记录
   */
  const handleEdit = (record: BusinessManagerItem) => {
    setFormModalTitle('编辑负责人');
    setEditingData(record);
    setFormModalVisible(true);
  };

  /**
   * 处理删除
   * @param record 记录
   */
  const handleDelete = (_: BusinessManagerItem) => {
    setConfirmDialogConfig({
      title: '确认删除',
      content: '删除后无法恢复，确认删除？（已存在的业务不受影响）',
      onOk: () => {
        Message.success('删除成功');
        loadData();
        setConfirmDialogVisible(false);
      }
    });
    setConfirmDialogVisible(true);
  };

  /**
   * 处理新增
   */
  const handleAdd = () => {
    setFormModalTitle('新增负责人');
    setEditingData(undefined);
    setFormModalVisible(true);
  };
  
  /**
   * 处理表单提交
   */
  const handleFormSubmit = (data: BusinessManagerItem) => {
    if (editingData) {
      // 编辑模式
      setData(prevData => 
        prevData.map(item => 
          item.key === editingData.key ? { ...data, key: editingData.key } : item
        )
      );
    } else {
      // 新增模式
      setData(prevData => [...prevData, data]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    }
    setFormModalVisible(false);
  };
  
  /**
   * 处理表单取消
   */
  const handleFormCancel = () => {
    setFormModalVisible(false);
    setEditingData(undefined);
  };

  /**
   * 处理批量删除
   */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要删除的记录');
      return;
    }
    
    setConfirmDialogConfig({
      title: '确认删除',
      content: '删除后无法恢复，确认删除？（已存在的业务不受影响）',
      onOk: () => {
        Message.success('删除成功');
        setSelectedRowKeys([]);
        setSelectAll(false);
        setIndeterminate(false);
        loadData();
        setConfirmDialogVisible(false);
      }
    });
    setConfirmDialogVisible(true);
  };



  return (
    <ControlTowerSaasLayout>
      <div className="business-manager-settings">
        {/* 筛选区域 */}
        {renderFilterArea()}

        {/* 操作按钮区域和数据表格 */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Button 
                type="primary" 
                icon={<IconPlus />}
                onClick={handleAdd}
              >
                新增负责人
              </Button>
              {selectedRowKeys.length > 0 && (
                <Button 
                  type="primary" 
                  status="danger"
                  icon={<IconDelete />}
                  onClick={handleBatchDelete}
                >
                  批量删除 ({selectedRowKeys.length})
                </Button>
              )}
            </Space>
          </div>
          
          <Table
            columns={columns}
            data={data}
            loading={loading}
            pagination={{
              ...pagination,
              onChange: (current, pageSize) => {
                setPagination(prev => ({ ...prev, current, pageSize }));
              },
            }}
            scroll={{ x: 2000 }}
            border
            stripe
            size="small"
          />
        </Card>

        {/* 方案管理弹窗 */}
        <SchemeManagementModal
          visible={schemeManagementModalVisible}
          onCancel={closeSchemeManagementModal}
          schemes={allSchemes}
          onDeleteScheme={handleDeleteScheme}
          onSetDefault={handleSetDefault}
          onRenameScheme={handleRenameScheme}
        />
        
        {/* 确认弹窗 */}
        <ConfirmDialog
          visible={confirmDialogVisible}
          title={confirmDialogConfig.title}
          content={confirmDialogConfig.content}
          onOk={confirmDialogConfig.onOk}
          onCancel={() => setConfirmDialogVisible(false)}
        />
        
        {/* 表单弹窗 */}
        <BusinessManagerFormModal
          visible={formModalVisible}
          title={formModalTitle}
          initialData={editingData}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    </ControlTowerSaasLayout>
  );
};

export default BusinessManagerSettings;