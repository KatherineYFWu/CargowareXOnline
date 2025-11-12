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
  Drawer
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconSettings,
  IconDownload
} from '@arco-design/web-react/icon';

const { Title } = Typography;

/**
 * 生成8位随机运力需求ID
 * @returns {string} 随机生成的运力需求ID
 */
const generateCapacityDemandId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};



// 枚举类型定义
enum TransportType {
  OCEAN = 'ocean',
  TRUCKING = 'trucking'
}

enum UrgencyLevel {
  URGENT = 'urgent',
  NORMAL = 'normal',
  LOW = 'low'
}

enum DemandStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  MATCHED = 'matched',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 数据接口定义
interface CapacityDemandData {
  id: string;
  demandCode: string;
  title: string;
  customer: string;
  transportType: TransportType;
  urgencyLevel: UrgencyLevel;
  status: DemandStatus;
  origin: string;
  destination: string;
  cargoType: string;
  quantity: number;
  unit: string;
  expectedDate: string;
  creator: string;
  createTime: string;
  updateTime: string;
  description?: string;
  requirements?: string;
  matchedCount?: number;
}

/**
 * 模拟运力需求数据
 */
const mockData: CapacityDemandData[] = [
  {
    id: 'DEMAND00000001',
    demandCode: generateCapacityDemandId(),
    title: '2025年度东南亚海运运力需求',
    customer: '奥马冰箱',
    transportType: TransportType.OCEAN,
    urgencyLevel: UrgencyLevel.NORMAL,
    status: DemandStatus.MATCHED,
    origin: '深圳',
    destination: '新加坡',
    cargoType: '家电产品',
    quantity: 5000,
    unit: 'TEU',
    expectedDate: '2025-12-31',
    creator: '张三',
    createTime: '2024-12-15 10:30',
    updateTime: '2024-12-20 14:05',
    description: '年度东南亚航线集装箱运输需求',
    matchedCount: 3
  },
  {
    id: 'DEMAND00000002',
    demandCode: generateCapacityDemandId(),
    title: '2025年Q1欧洲拖车运力需求',
    customer: '奥马冰箱',
    transportType: TransportType.TRUCKING,
    urgencyLevel: UrgencyLevel.URGENT,
    status: DemandStatus.PROCESSING,
    origin: '汉堡',
    destination: '慕尼黑',
    cargoType: '冰箱配件',
    quantity: 200,
    unit: '车次',
    expectedDate: '2025-03-31',
    creator: '王五',
    createTime: '2024-12-20 09:15',
    updateTime: '2024-12-22 16:30',
    description: '第一季度欧洲内陆拖车运输需求',
    matchedCount: 1
  },
  {
    id: 'DEMAND00000003',
    demandCode: generateCapacityDemandId(),
    title: '紧急北美海运运力需求',
    customer: '奥马冰箱',
    transportType: TransportType.OCEAN,
    urgencyLevel: UrgencyLevel.URGENT,
    status: DemandStatus.COMPLETED,
    origin: '上海',
    destination: '洛杉矶',
    cargoType: '电器设备',
    quantity: 100,
    unit: 'TEU',
    expectedDate: '2025-02-15',
    creator: '孙七',
    createTime: '2025-01-10 14:20',
    updateTime: '2025-01-12 11:45',
    description: '临时北美航线运力补充需求',
    matchedCount: 2
  },
  {
    id: 'DEMAND00000004',
    demandCode: generateCapacityDemandId(),
    title: '2025年度中东拖车运力需求',
    customer: '海尔集团',
    transportType: TransportType.TRUCKING,
    urgencyLevel: UrgencyLevel.LOW,
    status: DemandStatus.PENDING,
    origin: '迪拜',
    destination: '利雅得',
    cargoType: '家电产品',
    quantity: 800,
    unit: '车次',
    expectedDate: '2025-12-31',
    creator: '吴九',
    createTime: '2024-12-25 16:45',
    updateTime: '2024-12-26 09:30',
    description: '年度中东地区拖车运输需求',
    matchedCount: 0
  },
  {
    id: 'DEMAND00000005',
    demandCode: generateCapacityDemandId(),
    title: '2025年Q2澳洲海运运力需求',
    customer: '美的集团',
    transportType: TransportType.OCEAN,
    urgencyLevel: UrgencyLevel.NORMAL,
    status: DemandStatus.MATCHED,
    origin: '广州',
    destination: '悉尼',
    cargoType: '空调设备',
    quantity: 300,
    unit: 'TEU',
    expectedDate: '2025-06-30',
    creator: '陈一',
    createTime: '2025-01-05 08:30',
    updateTime: '2025-01-08 15:20',
    description: '第二季度澳洲航线运力需求',
    matchedCount: 4
  }
];

/**
 * 运力需求管理页面组件
 * @description 用于管理运力需求的填报、审核和查询，支持海运和拖车两种运输类型
 * @author 开发者
 * @date 2025-01-26
 */
const CapacityDemandManagement: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CapacityDemandData[]>(mockData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [filterVisible, setFilterVisible] = useState(false);

  /**
   * 处理新增运力需求
   */
  const handleAdd = () => {
    navigate('/controltower/capacity-demand/add');
  };

  /**
   * 处理编辑运力需求
   * @param record 运力需求记录
   */
  const handleEdit = (record: CapacityDemandData) => {
    navigate(`/controltower/capacity-demand/edit/${record.id}`);
  };

  /**
   * 处理查看运力需求详情
   * @param record 运力需求记录
   */
  const handleView = (record: CapacityDemandData) => {
    navigate(`/controltower/capacity-demand/detail/${record.id}`);
  };

  /**
   * 处理删除运力需求
   * @param record 运力需求记录
   */
  const handleDelete = (record: CapacityDemandData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除运力需求"${record.title}"吗？`,
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
   * 处理审核通过
   * @param record 运力需求记录
   */
  const handleApprove = (record: CapacityDemandData) => {
    const updatedData = data.map(item => 
      item.id === record.id 
        ? { ...item, status: 'approved' as DemandStatus, updateTime: new Date().toLocaleString() }
        : item
    );
    setData(updatedData);
    Message.success('审核通过');
  };

  /**
   * 处理审核驳回
   * @param record 运力需求记录
   */
  const handleReject = (record: CapacityDemandData) => {
    const updatedData = data.map(item => 
      item.id === record.id 
        ? { ...item, status: 'rejected' as DemandStatus, updateTime: new Date().toLocaleString() }
        : item
    );
    setData(updatedData);
    Message.success('审核驳回');
  };

  /**
   * 获取状态标签
   * @param status 状态值
   * @returns JSX元素
   */
  const getStatusTag = (status: DemandStatus) => {
    const statusMap = {
      pending: { color: 'orange', text: '待处理' },
      processing: { color: 'blue', text: '处理中' },
      matched: { color: 'green', text: '已匹配' },
      completed: { color: 'arcoblue', text: '已完成' },
      cancelled: { color: 'red', text: '已取消' }
    };
    
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
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
   * 获取紧急程度标签
   * @param level 紧急程度
   * @returns JSX元素
   */
  const getUrgencyLevelTag = (level: UrgencyLevel) => {
    const levelMap = {
      [UrgencyLevel.URGENT]: { color: 'red', text: '紧急' },
      [UrgencyLevel.NORMAL]: { color: 'orange', text: '一般' },
      [UrgencyLevel.LOW]: { color: 'gray', text: '不急' }
    };
    
    const config = levelMap[level];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /**
   * 根据当前Tab过滤数据
   * @returns 过滤后的数据
   */
  const getFilteredData = () => {
    const transportTypeMap = {
      'sea': TransportType.OCEAN,
      'truck': TransportType.TRUCKING
    };
    return data.filter(item => item.transportType === transportTypeMap[activeTab as keyof typeof transportTypeMap]);
  };

  // 表格列配置
  const columns = [
    {
      title: '需求编号',
      dataIndex: 'demandCode',
      key: 'demandCode',
      width: 120,
      fixed: 'left' as const
    },
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
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
      title: '紧急程度',
      dataIndex: 'urgencyLevel',
      key: 'urgencyLevel',
      width: 100,
      render: (level: UrgencyLevel) => getUrgencyLevelTag(level)
    },
    {
      title: '运力需求',
      key: 'quantity',
      width: 120,
      render: (record: CapacityDemandData) => `${record.quantity} ${record.unit}`
    },
    {
      title: '起始地',
      dataIndex: 'origin',
      key: 'origin',
      width: 100
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
      width: 100
    },
    {
      title: '预期时间',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: DemandStatus) => getStatusTag(status)
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (record: CapacityDemandData) => (
        <Space>
          <Button type="text" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="text" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="text" size="small" onClick={() => handleApprove(record)}>
                通过
              </Button>
              <Button type="text" size="small" onClick={() => handleReject(record)}>
                驳回
              </Button>
            </>
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
      <Card>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <Title heading={4} style={{ margin: 0 }}>运力需求管理</Title>
            <Space>
              <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
                新增需求
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
            <Tabs.TabPane key="sea" title="海运需求" />
            <Tabs.TabPane key="truck" title="拖车需求" />
          </Tabs>

          {/* 数据表格 */}
          <Table
            columns={columns}
            data={getFilteredData()}
            loading={false}
            rowKey="id"
            scroll={{ x: 1400 }}
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

export default CapacityDemandManagement;