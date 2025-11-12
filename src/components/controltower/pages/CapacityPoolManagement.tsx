import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Table,
  Message,
  Typography,
  Tag,
  Tabs,
  Modal,
  Drawer,
  Progress,
  Statistic
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconSettings,
  IconDownload
} from '@arco-design/web-react/icon';

const { Title } = Typography;

/**
 * 生成8位随机运力池ID
 * @returns {string} 随机生成的运力池ID
 */
const generateCapacityPoolId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

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

// 运输类型枚举
enum TransportType {
  OCEAN = 'ocean',
  TRUCKING = 'trucking'
}

// 运力池状态枚举
enum PoolStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  SUSPENDED = 'suspended'
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



// 运力池数据接口
interface CapacityPoolData {
  id: string;
  poolCode: string; // 运力池编号
  poolName: string; // 运力池名称
  supplier: string; // 供应商
  transportType: TransportType; // 运输类型
  totalCapacity: number; // 总运力
  usedCapacity: number; // 已使用运力
  availableCapacity: number; // 可用运力
  unit: string; // 单位
  utilizationRate: number; // 使用率
  status: PoolStatus; // 状态
  contractStartTime: string; // 合同开始时间
  contractEndTime: string; // 合同结束时间
  creator: string; // 创建人
  createTime: string; // 创建时间
  updater: string; // 更新人
  updateTime: string; // 更新时间
  description?: string; // 描述
}

/**
 * 模拟运力池数据
 */
const mockData: CapacityPoolData[] = [
  {
    id: 'POOL00000001',
    poolCode: generateCapacityPoolId(),
    poolName: '东南亚海运运力池',
    supplier: '中远海运',
    transportType: TransportType.OCEAN,
    totalCapacity: 5000,
    usedCapacity: 3200,
    availableCapacity: 1800,
    unit: 'TEU',
    utilizationRate: 64,
    status: PoolStatus.AVAILABLE,
    contractStartTime: '2025-01-01',
    contractEndTime: '2025-12-31',
    creator: '张三',
    createTime: '2024-12-15 10:30',
    updater: '李四',
    updateTime: '2024-12-20 14:05',
    description: '东南亚航线集装箱运力池'
  },
  {
    id: 'POOL00000002',
    poolCode: generateCapacityPoolId(),
    poolName: '欧洲拖车运力池',
    supplier: '马士基',
    transportType: TransportType.TRUCKING,
    totalCapacity: 800,
    usedCapacity: 720,
    availableCapacity: 80,
    unit: '车次',
    utilizationRate: 90,
    status: PoolStatus.RESERVED,
    contractStartTime: '2025-01-01',
    contractEndTime: '2025-06-30',
    creator: '王五',
    createTime: '2024-12-20 09:15',
    updater: '赵六',
    updateTime: '2024-12-22 16:30',
    description: '欧洲内陆拖车运力池'
  },
  {
    id: 'POOL00000003',
    poolCode: generateCapacityPoolId(),
    poolName: '北美海运运力池',
    supplier: '地中海航运',
    transportType: TransportType.OCEAN,
    totalCapacity: 3000,
    usedCapacity: 3100,
    availableCapacity: -100,
    unit: 'TEU',
    utilizationRate: 103,
    status: PoolStatus.IN_USE,
    contractStartTime: '2025-01-01',
    contractEndTime: '2025-12-31',
    creator: '孙七',
    createTime: '2025-01-10 14:20',
    updater: '周八',
    updateTime: '2025-01-12 11:45',
    description: '北美航线运力池'
  },
  {
    id: 'POOL00000004',
    poolCode: generateCapacityPoolId(),
    poolName: '中东拖车运力池',
    supplier: '达飞轮船',
    transportType: TransportType.TRUCKING,
    totalCapacity: 1200,
    usedCapacity: 0,
    availableCapacity: 1200,
    unit: '车次',
    utilizationRate: 0,
    status: PoolStatus.SUSPENDED,
    contractStartTime: '2025-01-01',
    contractEndTime: '2025-12-31',
    creator: '吴九',
    createTime: '2024-12-25 16:45',
    updater: '郑十',
    updateTime: '2024-12-26 09:30',
    description: '中东地区拖车运力池（暂停使用）'
  },
  {
    id: 'POOL00000005',
    poolCode: generateCapacityPoolId(),
    poolName: '澳洲海运运力池',
    supplier: '赫伯罗特',
    transportType: TransportType.OCEAN,
    totalCapacity: 2000,
    usedCapacity: 1200,
    availableCapacity: 800,
    unit: 'TEU',
    utilizationRate: 60,
    status: PoolStatus.MAINTENANCE,
    contractStartTime: '2025-01-01',
    contractEndTime: '2025-12-31',
    creator: '陈一',
    createTime: '2025-01-05 08:30',
    updater: '林二',
    updateTime: '2025-01-08 15:20',
    description: '澳洲航线运力池'
  }
];

/**
 * 运力池管理页面组件
 * @description 用于管理已中标的运力池，显示总运力和已使用运力情况，支持海运和拖车两种运输类型
 * @author 开发者
 * @date 2025-01-26
 */
const CapacityPoolManagement: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CapacityPoolData[]>(mockData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('sea'); // 默认显示海运
  const [filterVisible, setFilterVisible] = useState(false);

  /**
   * 处理新增运力池
   */
  const handleAdd = () => {
    navigate('/controltower/capacity-pool/add');
  };

  /**
   * 处理编辑运力池
   * @param record 运力池记录
   */
  const handleEdit = (record: CapacityPoolData) => {
    navigate(`/controltower/capacity-pool/edit/${record.id}`);
  };

  /**
   * 处理查看运力池详情
   * @param record 运力池记录
   */
  const handleView = (record: CapacityPoolData) => {
    navigate(`/controltower/capacity-pool/detail/${record.id}`);
  };

  /**
   * 处理删除运力池
   * @param record 运力池记录
   */
  const handleDelete = (record: CapacityPoolData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除运力池"${record.poolName}"吗？`,
      onOk: () => {
        setData(data.filter(item => item.id !== record.id));
        Message.success('删除成功');
      }
    });
  };

  /**
   * 处理批量删除
   */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要删除的记录');
      return;
    }
    
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`,
      onOk: () => {
        setData(data.filter(item => !selectedRowKeys.includes(item.id)));
        setSelectedRowKeys([]);
        Message.success('批量删除成功');
      }
    });
  };

  /**
   * 处理暂停运力池
   * @param record 运力池记录
   */
  const handleSuspend = (record: CapacityPoolData) => {
    const updatedData = data.map(item => 
      item.id === record.id 
        ? { ...item, status: PoolStatus.SUSPENDED, updateTime: new Date().toLocaleString() }
        : item
    );
    setData(updatedData);
    Message.success('运力池已暂停');
  };

  /**
   * 处理恢复运力池
   * @param record 运力池记录
   */
  const handleResume = (record: CapacityPoolData) => {
    const updatedData = data.map(item => 
      item.id === record.id 
        ? { ...item, status: PoolStatus.AVAILABLE, updateTime: new Date().toLocaleString() }
        : item
    );
    setData(updatedData);
    Message.success('运力池已恢复');
  };

  /**
   * 获取运输类型标签
   * @param type 运输类型
   * @returns JSX元素
   */
  const getTransportTypeTag = (type: TransportType) => {
    const typeMap = {
      [TransportType.OCEAN]: { color: 'blue', text: '海运' },
      [TransportType.TRUCKING]: { color: 'green', text: '拖车' }
    };
    
    const config = typeMap[type];
    return <Tag color={config.color}>{config.text}</Tag>;
  };



  /**
   * 获取状态标签
   * @param status 状态
   * @returns JSX元素
   */
  const getStatusTag = (status: PoolStatus) => {
    const statusMap = {
      [PoolStatus.AVAILABLE]: { color: 'green', text: '可用' },
      [PoolStatus.RESERVED]: { color: 'orange', text: '已预订' },
      [PoolStatus.IN_USE]: { color: 'blue', text: '使用中' },
      [PoolStatus.MAINTENANCE]: { color: 'purple', text: '维护中' },
      [PoolStatus.SUSPENDED]: { color: 'gray', text: '暂停' }
    };
    
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /**
   * 获取使用率进度条颜色
   * @param rate 使用率
   * @returns 颜色值
   */
  const getProgressColor = (rate: number) => {
    if (rate >= 100) return '#f53f3f'; // 红色
    if (rate >= 80) return '#ff7d00'; // 橙色
    return '#00b42a'; // 绿色
  };

  /**
   * 根据当前Tab过滤数据
   * @returns 过滤后的数据
   */
  const getFilteredData = () => {
    return data.filter(item => item.transportType === activeTab);
  };

  /**
   * 计算统计数据
   * @returns 统计数据对象
   */
  const getStatistics = () => {
    const filteredData = getFilteredData();
    const totalPools = filteredData.length;
    const totalCapacity = filteredData.reduce((sum, item) => sum + item.totalCapacity, 0);
    const usedCapacity = filteredData.reduce((sum, item) => sum + item.usedCapacity, 0);
    const availableCapacity = filteredData.reduce((sum, item) => sum + item.availableCapacity, 0);
    const avgUtilizationRate = totalPools > 0 ? Math.round(filteredData.reduce((sum, item) => sum + item.utilizationRate, 0) / totalPools) : 0;
    
    return {
      totalPools,
      totalCapacity,
      usedCapacity,
      availableCapacity,
      avgUtilizationRate
    };
  };

  const statistics = getStatistics();

  // 表格列配置
  const columns = [
    {
      title: '运力池编号',
      dataIndex: 'poolCode',
      key: 'poolCode',
      width: 120,
      fixed: 'left' as const
    },
    {
      title: '运力池名称',
      dataIndex: 'poolName',
      key: 'poolName',
      width: 180,
      ellipsis: true
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 120
    },
    {
      title: '运输类型',
      dataIndex: 'transportType',
      key: 'transportType',
      width: 100,
      render: (type: TransportType) => getTransportTypeTag(type)
    },
    {
      title: '总运力',
      key: 'totalCapacity',
      width: 120,
      render: (record: CapacityPoolData) => `${record.totalCapacity} ${record.unit}`
    },
    {
      title: '已使用',
      key: 'usedCapacity',
      width: 120,
      render: (record: CapacityPoolData) => `${record.usedCapacity} ${record.unit}`
    },
    {
      title: '可用运力',
      key: 'availableCapacity',
      width: 120,
      render: (record: CapacityPoolData) => (
        <span style={{ color: record.availableCapacity < 0 ? '#f53f3f' : '#00b42a' }}>
          {record.availableCapacity} {record.unit}
        </span>
      )
    },
    {
      title: '使用率',
      key: 'utilizationRate',
      width: 150,
      render: (record: CapacityPoolData) => (
        <div>
          <Progress 
            percent={Math.min(record.utilizationRate, 100)} 
            color={getProgressColor(record.utilizationRate)}
            size="small"
          />
          <div style={{ fontSize: '12px', marginTop: '2px' }}>
            {record.utilizationRate}%
          </div>
        </div>
      )
    },
    {
      title: '合同期限',
      key: 'contractPeriod',
      width: 180,
      render: (record: CapacityPoolData) => (
        <div>
          <div>{record.contractStartTime}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>至 {record.contractEndTime}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: PoolStatus) => getStatusTag(status)
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (record: CapacityPoolData) => (
        <Space>
          <Button type="text" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="text" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === PoolStatus.SUSPENDED ? (
            <Button type="text" size="small" onClick={() => handleResume(record)}>
              恢复
            </Button>
          ) : (
            <Button type="text" size="small" onClick={() => handleSuspend(record)}>
              暂停
            </Button>
          )}
          <Button type="text" size="small" status="danger" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <Statistic title="运力池总数" value={statistics.totalPools} suffix="个" />
        </Card>
        <Card>
          <Statistic 
            title="总运力" 
            value={statistics.totalCapacity} 
            suffix={activeTab === 'sea' ? 'TEU' : '车次'} 
          />
        </Card>
        <Card>
          <Statistic 
            title="已使用运力" 
            value={statistics.usedCapacity} 
            suffix={activeTab === 'sea' ? 'TEU' : '车次'} 
          />
        </Card>
        <Card>
          <div style={{ color: statistics.availableCapacity < 0 ? '#f53f3f' : '#00b42a' }}>
            <Statistic 
              title="可用运力" 
              value={statistics.availableCapacity} 
              suffix={activeTab === 'sea' ? 'TEU' : '车次'}
            />
          </div>
        </Card>
        <Card>
          <div style={{ color: getProgressColor(statistics.avgUtilizationRate) }}>
            <Statistic 
              title="平均使用率" 
              value={statistics.avgUtilizationRate} 
              suffix="%" 
            />
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <Title heading={4} style={{ margin: 0 }}>运力池管理</Title>
            <Space>
              <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
                新增运力池
              </Button>
              <Button icon={<IconDownload />}>
                导出
              </Button>
              <Button icon={<IconSettings />} onClick={() => setFilterVisible(true)}>
                筛选设置
              </Button>
            </Space>
          </div>

          {/* 批量操作栏 */}
          {selectedRowKeys.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded">
              <Space>
                <span>已选择 {selectedRowKeys.length} 项</span>
                <Button size="small" onClick={handleBatchDelete}>
                  批量删除
                </Button>
                <Button size="small" onClick={() => setSelectedRowKeys([])}>
                  取消选择
                </Button>
              </Space>
            </div>
          )}

          {/* Tab切换 */}
          <Tabs 
            activeTab={activeTab} 
            onChange={setActiveTab}
            type="rounded"
            className="mb-4"
          >
            <Tabs.TabPane key="sea" title="海运运力池" />
            <Tabs.TabPane key="truck" title="拖车运力池" />
          </Tabs>

          {/* 数据表格 */}
          <Table
            columns={columns}
            data={getFilteredData()}
            loading={false}
            rowKey="id"
            scroll={{ x: 1600 }}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys: (string | number)[]) => {
                setSelectedRowKeys(selectedRowKeys as string[]);
              }
            }}
            pagination={{
              total: getFilteredData().length,
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true
            }}
          />
        </div>
      </Card>

      {/* 筛选设置抽屉 */}
      <Drawer
        title="筛选设置"
        visible={filterVisible}
        onCancel={() => setFilterVisible(false)}
        width={400}
      >
        <div>筛选功能开发中...</div>
      </Drawer>
    </div>
  );
};

export default CapacityPoolManagement;