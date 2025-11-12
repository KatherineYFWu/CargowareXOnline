import React, { useState } from 'react';
import { Card, Grid, Tag, Table, DatePicker } from '@arco-design/web-react';
import { 
  IconSend, 
  IconClockCircle, 
  IconEdit,
  IconDelete,
  IconExclamationCircle,
  IconCheckCircle,
  IconInfoCircle,
  IconCloseCircle,
  IconQuestionCircle
} from '@arco-design/web-react/icon';


const { Row, Col } = Grid;

const Dashboard: React.FC = () => {
  // 状态管理
  const [selectedCard, setSelectedCard] = useState<{type: 'status' | 'customs' | null, value: string}>({type: null, value: 'all'});
  const [dateRange, setDateRange] = useState<string>('month');


  // 申报状态数据
  const declarationStats = [
    {
      title: '草稿',
      value: 23,
      icon: IconEdit,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700'
    },
    {
      title: '已提交',
      value: 45,
      icon: IconSend,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700'
    },
    {
      title: '发送成功',
      value: 89,
      icon: IconCheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-700'
    },
    {
      title: '已删除',
      value: 12,
      icon: IconDelete,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700'
    },
    {
      title: '已过期',
      value: 8,
      icon: IconClockCircle,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700'
    }
  ];

  // 海关回执状态数据
  const customsStats = [
    {
      title: '允许装船',
      value: 67,
      icon: IconCheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-700'
    },
    {
      title: '要求补充信息',
      value: 15,
      icon: IconInfoCircle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700'
    },
    {
      title: '风险装船',
      value: 8,
      icon: IconExclamationCircle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700'
    },
    {
      title: '禁止装船',
      value: 3,
      icon: IconCloseCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      textColor: 'text-red-700'
    },
    {
      title: '下层未申报',
      value: 5,
      icon: IconQuestionCircle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700'
    }
  ];

  // 申报记录数据
  const declarationRecords = [
    {
      id: 1,
      declarationNo: 'MPCI-2024-001',
      hbl: 'HBL001234567',
      mbl: 'MBL987654321',
      shippingCompany: 'COSCO-中远海运',
      portOfLoading: 'SHANGHAI-CNSHA',
      portOfDischarge: 'LOS ANGELES-USLAX',
      destinationPort: 'LOS ANGELES-USLAX',
      creator: '张三',
      createTime: '2024-01-15 14:30',
      lastUpdateTime: '2024-01-15 14:35',
      status: '草稿',
      customsStatus: '允许装船'
    },
    {
      id: 2,
      declarationNo: 'MPCI-2024-002',
      hbl: 'HBL001234568',
      mbl: 'MBL987654322',
      shippingCompany: 'EMC-长荣海运',
      portOfLoading: 'SHENZHEN-CNSZX',
      portOfDischarge: 'NEW YORK-USNYC',
      destinationPort: 'NEW YORK-USNYC',
      creator: '李四',
      createTime: '2024-01-15 13:45',
      lastUpdateTime: '2024-01-15 14:20',
      status: '已提交',
      customsStatus: '要求补充信息'
    },
    {
      id: 3,
      declarationNo: 'MPCI-2024-003',
      hbl: 'HBL001234569',
      mbl: 'MBL987654323',
      shippingCompany: 'MSK-马士基',
      portOfLoading: 'NINGBO-CNNGB',
      portOfDischarge: 'HAMBURG-DEHAM',
      destinationPort: 'HAMBURG-DEHAM',
      creator: '王五',
      createTime: '2024-01-15 12:20',
      lastUpdateTime: '2024-01-15 13:10',
      status: '发送成功',
      customsStatus: '允许装船'
    },
    {
      id: 4,
      declarationNo: 'MPCI-2024-004',
      hbl: 'HBL001234570',
      mbl: 'MBL987654324',
      shippingCompany: 'MSC-地中海航运',
      portOfLoading: 'QINGDAO-CNTAO',
      portOfDischarge: 'ROTTERDAM-NLRTM',
      destinationPort: 'ROTTERDAM-NLRTM',
      creator: '赵六',
      createTime: '2024-01-15 11:15',
      lastUpdateTime: '2024-01-15 11:20',
      status: '已删除',
      customsStatus: '禁止装船'
    },
    {
      id: 5,
      declarationNo: 'MPCI-2024-005',
      hbl: 'HBL001234571',
      mbl: 'MBL987654325',
      shippingCompany: 'CMA-达飞轮船',
      portOfLoading: 'XIAMEN-CNXMN',
      portOfDischarge: 'LONG BEACH-USLGB',
      destinationPort: 'LONG BEACH-USLGB',
      creator: '孙七',
      createTime: '2024-01-14 16:20',
      lastUpdateTime: '2024-01-14 16:25',
      status: '已过期',
      customsStatus: '风险装船'
    }
  ];



  // 工具函数
  const getStatusColor = (status: string) => {
    switch (status) {
      case '草稿':
        return 'gray';
      case '已提交':
        return 'blue';
      case '发送成功':
        return 'green';
      case '已删除':
        return 'gray';
      case '已过期':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // 过滤申报记录
  const filteredDeclarationRecords = declarationRecords.filter(record => {
    if (selectedCard.type === 'status' && selectedCard.value !== 'all') {
      return record.status === selectedCard.value;
    }
    if (selectedCard.type === 'customs' && selectedCard.value !== 'all') {
      return record.customsStatus === selectedCard.value;
    }
    return true; // 显示所有记录
  });

  // 处理申报状态卡片点击
  const handleStatusCardClick = (status: string) => {
    if (selectedCard.type === 'status' && selectedCard.value === status) {
      setSelectedCard({type: null, value: 'all'});
    } else {
      setSelectedCard({type: 'status', value: status});
    }
  };

  // 处理海关回执状态卡片点击
  const handleCustomsStatusCardClick = (status: string) => {
    if (selectedCard.type === 'customs' && selectedCard.value === status) {
      setSelectedCard({type: null, value: 'all'});
    } else {
      setSelectedCard({type: 'customs', value: status});
    }
  };

  // 处理日期范围切换
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };



  // 表格列定义
  const columns = [
    {
      title: '申报单号',
      dataIndex: 'declarationNo',
      key: 'declarationNo',
      align: 'left' as const,
      render: (declarationNo: string) => (
        <span 
          className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
          onClick={() => console.log('点击申报单号:', declarationNo)}
        >
          {declarationNo}
        </span>
      )
    },
    {
      title: 'HBL',
      dataIndex: 'hbl',
      key: 'hbl',
      align: 'left' as const
    },
    {
      title: 'MBL',
      dataIndex: 'mbl',
      key: 'mbl',
      align: 'left' as const
    },
    {
      title: '船公司',
      dataIndex: 'shippingCompany',
      key: 'shippingCompany',
      align: 'left' as const,
      render: (company: string) => {
        if (!company) return '-';
        // 假设船公司数据格式为 "COSCO-中远海运" 或者需要从船公司代码映射
        const parts = company.split('-');
        if (parts.length === 2) {
          return (
            <div className="text-left">
              <div className="text-sm">{parts[0]}</div>
              <div className="text-xs text-gray-500">{parts[1]}</div>
            </div>
          );
        }
        // 如果没有分隔符，显示原始值
        return company;
      }
    },
    {
      title: '起运港',
      dataIndex: 'portOfLoading',
      key: 'portOfLoading',
      align: 'left' as const,
      render: (port: string) => {
        if (!port) return '-';
        // 假设港口数据格式为 "SHANGHAI-CNSHA" 或者需要从港口代码映射
        const parts = port.split('-');
        if (parts.length === 2) {
          return (
            <div className="text-left">
              <div className="text-sm">{parts[0]}</div>
              <div className="text-xs text-gray-500">{parts[1]}</div>
            </div>
          );
        }
        // 如果没有分隔符，显示原始值
        return port;
      }
    },
    {
      title: '卸货港',
      dataIndex: 'portOfDischarge',
      key: 'portOfDischarge',
      align: 'left' as const,
      render: (port: string) => {
        if (!port) return '-';
        const parts = port.split('-');
        if (parts.length === 2) {
          return (
            <div className="text-left">
              <div className="text-sm">{parts[0]}</div>
              <div className="text-xs text-gray-500">{parts[1]}</div>
            </div>
          );
        }
        return port;
      }
    },
    {
      title: '目的港',
      dataIndex: 'destinationPort',
      key: 'destinationPort',
      align: 'left' as const,
      render: (port: string) => {
        if (!port) return '-';
        const parts = port.split('-');
        if (parts.length === 2) {
          return (
            <div className="text-left">
              <div className="text-sm">{parts[0]}</div>
              <div className="text-xs text-gray-500">{parts[1]}</div>
            </div>
          );
        }
        return port;
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      align: 'left' as const
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'left' as const,
      render: (time: string) => {
        if (!time) return '-';
        const date = new Date(time);
        const dateStr = date.toLocaleDateString('zh-CN');
        const timeStr = date.toLocaleTimeString('zh-CN', { hour12: false });
        return (
          <div className="text-left">
            <div className="text-sm">{dateStr}</div>
            <div className="text-xs text-gray-500">{timeStr}</div>
          </div>
        );
      }
    },
    {
      title: '状态更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      align: 'left' as const,
      render: (time: string) => {
        if (!time) return '-';
        const date = new Date(time);
        const dateStr = date.toLocaleDateString('zh-CN');
        const timeStr = date.toLocaleTimeString('zh-CN', { hour12: false });
        return (
          <div className="text-left">
            <div className="text-sm">{dateStr}</div>
            <div className="text-xs text-gray-500">{timeStr}</div>
          </div>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'left' as const,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题区域 - 白色背景容器 */}
      <div className="bg-white shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* 左侧标题信息 */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">仪表盘</h1>
            <p className="text-gray-600">欢迎使用MPCI申报系统，又是元气满满的一天👏🏻</p>
          </div>
          
          {/* 右侧公告栏 */}
          <div className="flex-1 ml-8">
            <div className="bg-blue-50 border border-blue-200 p-4 overflow-hidden relative">
              <div className="flex items-center mb-2">
                <IconInfoCircle className="text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-700">系统公告</span>
              </div>
              <div className="relative h-6 overflow-hidden">
                <div className="absolute whitespace-nowrap animate-marquee">
                  <span className="text-sm text-blue-600 mr-8">📢 MPCI 抑郁7月31日正式实行。</span>
                  <span className="text-sm text-blue-600 mr-8">🚨 所欲UAE国家都要申报！</span>
                  <span className="text-sm text-blue-600 mr-8">📢 MPCI 抑郁7月31日正式实行。</span>
                  <span className="text-sm text-blue-600 mr-8">🚨 所欲UAE国家都要申报！</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数量统计卡片区域 - 白色背景容器 */}
      <div className="bg-white shadow-sm p-6 mb-6">
        {/* 申报状态统计 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">申报状态</h2>
            {/* 日期选择区域 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">时间范围:</span>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-3 py-1 text-xs transition-all duration-200 ${
                      dateRange === 'day' 
                        ? 'bg-white text-blue-600 shadow-sm font-medium' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => handleDateRangeChange('day')}
                  >
                    当天
                  </button>
                  <button
                    className={`px-3 py-1 text-xs transition-all duration-200 ${
                      dateRange === 'week' 
                        ? 'bg-white text-blue-600 shadow-sm font-medium' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => handleDateRangeChange('week')}
                  >
                    本周
                  </button>
                  <button
                    className={`px-3 py-1 text-xs transition-all duration-200 ${
                      dateRange === 'month' 
                        ? 'bg-white text-blue-600 shadow-sm font-medium' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => handleDateRangeChange('month')}
                  >
                    本月
                  </button>
                </div>
              </div>
              <DatePicker.RangePicker 
                size="small"
                placeholder={['开始日期', '结束日期']}
                onChange={(dates) => {
                  if (dates) {
                    setDateRange('custom');
                  }
                }}
                style={{ width: 240 }}
              />
            </div>
          </div>
          <Row gutter={[16, 16]} className="mb-6">
            {declarationStats.map((stat, index) => (
              <Col span={4} xs={24} sm={12} md={4} lg={4} key={index}>
                <Card 
                  className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    selectedCard.type === 'status' && selectedCard.value === stat.title ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleStatusCardClick(stat.title)}
                  style={{
                    backgroundColor: stat.bgColor.replace('bg-', '').replace('-100', '') === 'gray' ? '#f3f4f6' : 
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'blue' ? '#dbeafe' :
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'green' ? '#dcfce7' :
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'yellow' ? '#fefce8' :
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'red' ? '#fee2e2' : '#f3f4f6',
                    borderColor: stat.borderColor.replace('border-', '').replace('-300', '') === 'gray' ? '#d1d5db' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'blue' ? '#93c5fd' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'green' ? '#86efac' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'yellow' ? '#fde047' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'red' ? '#fca5a5' : '#d1d5db',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold mb-1 text-gray-800">
                        {stat.value}
                      </div>
                      <div 
                        style={{
                          color: stat.textColor.replace('text-', '').replace('-700', '') === 'gray' ? '#374151' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'blue' ? '#1d4ed8' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'green' ? '#15803d' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'yellow' ? '#a16207' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'red' ? '#b91c1c' : '#374151'
                        }}
                        className="text-sm font-medium"
                      >
                        {stat.title}
                      </div>
                    </div>
                    <div className="text-2xl">
                      <stat.icon 
                        style={{
                          color: stat.iconColor.replace('text-', '').replace('-600', '') === 'gray' ? '#4b5563' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'blue' ? '#2563eb' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'green' ? '#16a34a' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'yellow' ? '#ca8a04' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'red' ? '#dc2626' : '#4b5563'
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 海关回执状态统计 */}
        <div className="mb-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">海关回执状态</h2>
          <Row gutter={[16, 16]} className="mb-0">
            {customsStats.map((stat, index) => (
              <Col span={4} xs={24} sm={12} md={4} lg={4} key={index}>
                <Card 
                  className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    selectedCard.type === 'customs' && selectedCard.value === stat.title ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleCustomsStatusCardClick(stat.title)}
                  style={{
                    backgroundColor: stat.bgColor.replace('bg-', '').replace('-100', '') === 'gray' ? '#f3f4f6' : 
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'blue' ? '#dbeafe' :
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'green' ? '#dcfce7' :
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'yellow' ? '#fefce8' :
                                     stat.bgColor.replace('bg-', '').replace('-100', '') === 'red' ? '#fee2e2' : '#f3f4f6',
                    borderColor: stat.borderColor.replace('border-', '').replace('-300', '') === 'gray' ? '#d1d5db' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'blue' ? '#93c5fd' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'green' ? '#86efac' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'yellow' ? '#fde047' :
                                 stat.borderColor.replace('border-', '').replace('-300', '') === 'red' ? '#fca5a5' : '#d1d5db',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold mb-1 text-gray-800">
                        {stat.value}
                      </div>
                      <div 
                        style={{
                          color: stat.textColor.replace('text-', '').replace('-700', '') === 'gray' ? '#374151' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'blue' ? '#1d4ed8' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'green' ? '#15803d' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'yellow' ? '#a16207' :
                                 stat.textColor.replace('text-', '').replace('-700', '') === 'red' ? '#b91c1c' : '#374151'
                        }}
                        className="text-sm font-medium"
                      >
                        {stat.title}
                      </div>
                    </div>
                    <div className="text-2xl">
                      <stat.icon 
                        style={{
                          color: stat.iconColor.replace('text-', '').replace('-600', '') === 'gray' ? '#4b5563' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'blue' ? '#2563eb' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'green' ? '#16a34a' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'yellow' ? '#ca8a04' :
                                 stat.iconColor.replace('text-', '').replace('-600', '') === 'red' ? '#dc2626' : '#4b5563'
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 申报记录列表 */}
      <div className="mb-6">
        <Card 
          title={`申报记录列表${selectedCard.type === 'status' && selectedCard.value !== 'all' ? ` - ${selectedCard.value}` : ''}${selectedCard.type === 'customs' && selectedCard.value !== 'all' ? ` - ${selectedCard.value}` : ''}`} 
        >
          <Table
              columns={columns}
              data={filteredDeclarationRecords}
              pagination={{
                pageSize: 10
              }}
              size="small"
              scroll={{ y: 400 }}
            />
        </Card>
      </div>


    </div>
  );
};

export default Dashboard;