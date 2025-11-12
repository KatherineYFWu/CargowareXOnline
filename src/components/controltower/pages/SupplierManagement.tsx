import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Modal,
  Form,
  Message,
  Descriptions,
  Dropdown,
  Menu
} from '@arco-design/web-react';
import ConfirmDialog from '../../common/ConfirmDialog';
import { 
  IconSearch, 
  IconPhone,
  IconUser
} from '@arco-design/web-react/icon';

const { Text } = Typography;
const { Option } = Select;

// 统计卡片样式 - 与用户管理完全一致
const cardStyles = `
  .stats-card {
    position: relative;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent !important;
    overflow: hidden;
  }

  .stats-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(22, 93, 255, 0.1), rgba(22, 93, 255, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .stats-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 25px rgba(22, 93, 255, 0.15);
    border-color: rgba(22, 93, 255, 0.3) !important;
  }

  .stats-card:hover::before {
    opacity: 1;
  }

  .stats-card:active {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 4px 15px rgba(22, 93, 255, 0.2);
  }

  .stats-card.selected {
    border-color: #165DFF !important;
    background: linear-gradient(135deg, rgba(22, 93, 255, 0.08), rgba(22, 93, 255, 0.03));
    box-shadow: 0 6px 20px rgba(22, 93, 255, 0.12);
    transform: translateY(-2px);
  }

  .stats-card.selected::before {
    opacity: 0.7;
  }

  .stats-card .card-content {
    position: relative;
    z-index: 2;
  }

  .stats-card .stats-number {
    position: relative;
    z-index: 2;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .stats-card:hover .stats-number {
    transform: scale(1.05);
  }

  .stats-card .stats-label {
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .stats-card:hover .stats-label {
    transform: translateY(-1px);
  }
`;

// 添加样式到文档
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = cardStyles;
  if (!document.head.querySelector('style[data-company-stats-cards]')) {
    styleElement.setAttribute('data-company-stats-cards', 'true');
    document.head.appendChild(styleElement);
  }
}

interface SupplierData {
  id: string;
  supplierCode: string; // 供应商编码，8位随机字母数字组合
  name: string;
  englishName: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  industry: string;
  scale: string;
  businessLicense: string;
  status: 'active' | 'fail' | 'warning' | 'blacklist';
  createTime: string;
  assessmentScore: number; // 评估得分（当前周期）
  lastAssessmentScore?: number; // 评估得分（上一周期）
  supplierRating: 'T0' | 'T1' | 'T2' | 'T3' | 'T4'; // 供应商评级
  evaluationStatus: 'evaluated' | 'pending' | 'overdue'; // 评估状态：已评估、待评估、逾期未评估
}

const SupplierManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [evaluationStatusFilter, setEvaluationStatusFilter] = useState('all'); // 评估状态筛选
  // 删除了行业筛选相关状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<SupplierData | null>(null);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [auditForm] = Form.useForm();
  
  // 自定义确认对话框状态
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState<{
    title: string;
    content: string;
    onConfirm: () => void;
  } | null>(null);

  /**
   * 处理评估按钮点击事件
   * 显示确认对话框，询问是否直接进入评分页面
   */
  const handleEvaluationClick = (supplier: SupplierData) => {
    console.log('评估按钮被点击，供应商ID:', supplier.id);
    
    // 使用自定义确认对话框替代 Modal.confirm
    setConfirmDialogData({
      title: '评估确认',
      content: '该供应商已进入当前周期评估阶段，是否直接进入评分页面？',
      onConfirm: () => {
        console.log('用户选择直接评分，跳转到评分页面');
        // 跳转到评分页面
        navigate(`/controltower/supplier-management/evaluation/${supplier.id}`);
        setConfirmDialogVisible(false);
      }
    });
    setConfirmDialogVisible(true);
  };
  
  /**
    * 处理确认对话框取消事件
    */
   const handleConfirmDialogCancel = () => {
     console.log('用户选择进入管理页，保持在当前页面');
     setConfirmDialogVisible(false);
     setConfirmDialogData(null);
   };

  // 模拟供应商数据
  const [supplierData, setSupplierData] = useState<SupplierData[]>([
    {
      id: '1',
      supplierCode: 'HLL8K9M2', // 8位随机字母数字组合
      name: '货拉拉物流科技有限公司',
      englishName: 'Huolala Logistics Technology Co., Ltd.',
      contactPerson: '张经理',
      contactPhone: '13800138001',
      email: 'contact@huolala.com',
      industry: '物流运输',
      scale: '大型企业',
      businessLicense: '91110000123456789X',
      status: 'active',
      createTime: '2023-03-15 09:30:00',
      assessmentScore: 92,
      lastAssessmentScore: 88,
      supplierRating: 'T0',
      evaluationStatus: 'evaluated'
    },
    {
      id: '2',
      supplierCode: 'SF7X4N6Y', // 8位随机字母数字组合
      name: '顺丰速运集团',
      englishName: 'SF Express Group',
      contactPerson: '李总监',
      contactPhone: '13800138002',
      email: 'business@sf-express.com',
      industry: '快递服务',
      scale: '大型企业',
      businessLicense: '91440300987654321A',
      status: 'active',
      createTime: '2023-01-20 11:15:20',
      assessmentScore: 88,
      lastAssessmentScore: 85,
      supplierRating: 'T1',
      evaluationStatus: 'evaluated'
    },
    {
      id: '3',
      supplierCode: 'DB5K2L8W', // 8位随机字母数字组合
      name: '德邦物流股份有限公司',
      englishName: 'Deppon Logistics Co., Ltd.',
      contactPerson: '王主管',
      contactPhone: '13800138003',
      email: 'service@deppon.com',
      industry: '物流运输',
      scale: '中型企业',
      businessLicense: '91310000456789123B',
      status: 'fail',
      createTime: '2024-01-10 14:22:18',
      assessmentScore: 65,
      lastAssessmentScore: 70,
      supplierRating: 'T3',
      evaluationStatus: 'pending'
    },
          {
        id: '4',
        supplierCode: 'ZT9X4N7Q', // 8位随机字母数字组合
        name: '中通快递股份有限公司',
        englishName: 'ZTO Express Co., Ltd.',
        contactPerson: '赵副总',
        contactPhone: '13800138004',
        email: 'cooperation@zto.com',
        industry: '快递服务',
        scale: '大型企业',
        businessLicense: '91330000654321987C',
        status: 'warning',
        createTime: '2023-11-05 16:45:30',
        assessmentScore: 72,
        lastAssessmentScore: 75,
        supplierRating: 'T2',
        evaluationStatus: 'overdue'
      },
      {
        id: '5',
        supplierCode: 'ST3M8P9Q', // 8位随机字母数字组合
        name: '申通快递有限公司',
        englishName: 'STO Express Co., Ltd.',
        contactPerson: '陈经理',
        contactPhone: '13800138005',
        email: 'info@sto.cn',
        industry: '快递服务',
        scale: '中型企业',
        businessLicense: '91310000321987654D',
        status: 'blacklist',
        createTime: '2023-06-18 13:20:45',
        assessmentScore: 45,
        lastAssessmentScore: 52,
        supplierRating: 'T4',
        evaluationStatus: 'evaluated'
      },
      {
        id: '6',
        supplierCode: 'YD6M3R8K', // 8位随机字母数字组合
        name: '韵达速递有限公司',
        englishName: 'Yunda Express Co., Ltd.',
        contactPerson: '刘总',
        contactPhone: '13800138006',
        email: 'service@yunda.com',
        industry: '快递服务',
        scale: '中型企业',
        businessLicense: '91310000789456123E',
        status: 'warning',
        createTime: '2023-08-12 10:30:25',
        assessmentScore: 68,
        lastAssessmentScore: 72,
        supplierRating: 'T3',
        evaluationStatus: 'pending'
      }
  ]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Message.success('搜索完成');
    }, 800);
  };

  const handleViewDetail = (supplier: SupplierData) => {
    setCurrentSupplier(supplier);
    setDetailModalVisible(true);
  };



  const handleCardClick = (cardType: string) => {
    setSelectedCard(selectedCard === cardType ? '' : cardType);
    
    switch (cardType) {
      case 'total':
        setStatusFilter('all');
        Message.info('已显示所有供应商');
        break;
      case 'active':
        setStatusFilter('active');
        Message.info('已筛选正常供应商');
        break;
      case 'fail':
        setStatusFilter('fail');
        Message.info('已筛选考核不通过供应商');
        break;
      case 'warning':
        setStatusFilter('warning');
        Message.info('已筛选考核预警供应商');
        break;
      case 'blacklist':
        setStatusFilter('blacklist');
        Message.info('已筛选黑名单供应商');
        break;
      default:
        setStatusFilter('all');
        break;
    }
  };



  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">正常</Tag>;
      case 'fail':
        return <Tag color="red">评估不通过</Tag>;
      case 'warning':
        return <Tag color="orange">评估预警</Tag>;
      case 'blacklist':
        return <Tag color="gray">黑名单</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };



  const filteredData = supplierData.filter(supplier => {
    const matchesKeyword = !searchKeyword || 
      supplier.name.includes(searchKeyword) || 
      supplier.contactPerson.includes(searchKeyword) ||
      supplier.industry.includes(searchKeyword);
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    const matchesEvaluationStatus = evaluationStatusFilter === 'all' || supplier.evaluationStatus === evaluationStatusFilter;
    
    return matchesKeyword && matchesStatus && matchesEvaluationStatus;
  });

  return (
    <div style={{ padding: '0' }}>


      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Space size="medium">
            <Input
              style={{ width: 280 }}
              placeholder="搜索企业名称、联系人或行业"
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
              prefix={<IconSearch />}
              allowClear
            />
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">正常</Option>
              <Option value="fail">评估不通过</Option>
              <Option value="warning">评估预警</Option>
              <Option value="blacklist">黑名单</Option>
             </Select>
            <Select
              placeholder="评估状态"
              value={evaluationStatusFilter}
              onChange={setEvaluationStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部评估</Option>
              <Option value="evaluated">已评估</Option>
              <Option value="pending">待评估</Option>
              <Option value="overdue">逾期未评估</Option>
            </Select>

            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              搜索
            </Button>
          </Space>
          

        </div>
      </Card>

      {/* 企业统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <Card 
          className={`stats-card ${selectedCard === 'total' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('total')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#165DFF', marginBottom: '8px' }}>
              {supplierData.length}
            </div>
            <Text type="secondary" className="stats-label">总供应商数</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'active' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('active')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#00B42A', marginBottom: '8px' }}>
              {supplierData.filter(c => c.status === 'active').length}
            </div>
            <Text type="secondary" className="stats-label">正常</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'fail' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('fail')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#F53F3F', marginBottom: '8px' }}>
              {supplierData.filter(c => c.status === 'fail').length}
            </div>
            <Text type="secondary" className="stats-label">考核不通过</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'warning' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('warning')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#FF7D00', marginBottom: '8px' }}>
              {supplierData.filter(c => c.status === 'warning').length}
            </div>
            <Text type="secondary" className="stats-label">考核预警</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'blacklist' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('blacklist')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#722ED1', marginBottom: '8px' }}>
              {supplierData.filter(c => c.status === 'blacklist').length}
            </div>
            <Text type="secondary" className="stats-label">黑名单</Text>
          </div>
        </Card>
      </div>

      {/* 供应商列表表格 */}
      <Card title={`供应商列表 (${filteredData.length})`}>
        <Table
          loading={loading}
          data={filteredData}
          columns={[
            {
              title: '供应商编码',
              dataIndex: 'supplierCode',
              key: 'supplierCode',
              width: 120,
              sorter: true,
              render: (supplierCode) => (
                supplierCode ? (
                  <Text 
                    copyable={{ text: supplierCode }} 
                    style={{ 
                      fontSize: '13px', 
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#165DFF'
                    }}
                  >
                    {supplierCode}
                  </Text>
                ) : (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    待审核
                  </Text>
                )
              )
            },
            {
              title: '供应商信息',
              dataIndex: 'name',
              key: 'name',
              width: 240,
              sorter: true,
              render: (_, record) => (
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
                    {record.name}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    {record.englishName}
                  </Text>
                </div>
              )
            },
            {
              title: '营业执照',
              dataIndex: 'businessLicense',
              key: 'businessLicense',
              width: 140,
              sorter: true,
              render: (businessLicense) => (
                <Text copyable={{ text: businessLicense }} style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                  {businessLicense}
                </Text>
              )
            },
            {
              title: '联系信息',
              dataIndex: 'contactPerson',
              key: 'contactPerson',
              width: 160,
              sorter: true,
              render: (_, record) => (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <IconUser style={{ fontSize: '12px', color: '#86909C' }} />
                    <Text style={{ fontSize: '14px' }}>{record.contactPerson}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconPhone style={{ fontSize: '12px', color: '#86909C' }} />
                    <Text copyable={{ text: record.contactPhone }} style={{ fontSize: '12px' }}>
                      {record.contactPhone}
                    </Text>
                  </div>
                </div>
              )
            },
            {
              title: '上一周期得分',
              dataIndex: 'lastAssessmentScore',
              key: 'lastAssessmentScore',
              width: 110,
              sorter: true,
              render: (score) => {
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: score >= 80 ? '#00B42A' : score >= 60 ? '#FF7D00' : '#F53F3F'
                      }}
                    >
                      {score}
                    </div>
                    <Text type="secondary" style={{ fontSize: '11px' }}>分</Text>
                  </div>
                );
              }
            },
            {
              title: '当前周期得分',
              dataIndex: 'assessmentScore',
              key: 'assessmentScore',
              width: 110,
              sorter: true,
              render: (score, record) => {
                // 如果评估状态为待评估或逾期未评估，显示短横杠
                if (record.evaluationStatus === 'pending' || record.evaluationStatus === 'overdue') {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <div 
                        style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: '#86909C'
                        }}
                      >
                        —
                      </div>
                      <Text type="secondary" style={{ fontSize: '11px' }}>分</Text>
                    </div>
                  );
                }
                // 已评估状态显示具体分数
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: score >= 80 ? '#00B42A' : score >= 60 ? '#FF7D00' : '#F53F3F'
                      }}
                    >
                      {score}
                    </div>
                    <Text type="secondary" style={{ fontSize: '11px' }}>分</Text>
                  </div>
                );
              }
            },
            {
              title: '供应商评级',
              dataIndex: 'supplierRating',
              key: 'supplierRating',
              width: 90,
              sorter: true,
              render: (rating) => {
                const getRatingColor = (rating: string) => {
                  switch (rating) {
                    case 'T0': return '#00B42A'; // 绿色
                    case 'T1': return '#0FC6C2'; // 青色
                    case 'T2': return '#FF7D00'; // 橙色
                    case 'T3': return '#F53F3F'; // 红色
                    case 'T4': return '#86909C'; // 灰色
                    default: return '#86909C';
                  }
                };
                return (
                  <Tag 
                    color={getRatingColor(rating)}
                    style={{ 
                      fontWeight: 'bold',
                      border: 'none'
                    }}
                  >
                    {rating}
                  </Tag>
                );
              }
            },
            {
              title: '评估状态',
              dataIndex: 'evaluationStatus',
              key: 'evaluationStatus',
              width: 110,
              sorter: true,
              render: (status: 'evaluated' | 'pending' | 'overdue') => {
                 const statusConfig = {
                   'evaluated': { color: 'green', text: '已评估' },
                   'pending': { color: 'orange', text: '待评估' },
                   'overdue': { color: 'red', text: '逾期未评估' }
                 };
                 const config = statusConfig[status] || { color: 'gray', text: '未知' };
                return (
                  <Tag color={config.color}>
                    {config.text}
                  </Tag>
                );
              }
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 80,
              sorter: true,
              render: (status) => getStatusTag(status)
            },

            {
              title: '操作',
              key: 'actions',
              width: 160,
              render: (_, record) => {
                const moreMenuItems = [
                  {
                    key: 'blacklist',
                    title: '加入黑名单',
                    style: { color: '#F53F3F' },
                    onClick: () => {
                      Modal.confirm({
                        title: '确定要将该供应商加入黑名单吗？',
                        content: '加入黑名单后，该供应商将无法参与业务合作',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                          Message.success('已成功加入黑名单');
                          // 这里可以添加实际的API调用
                        }
                      });
                    }
                  },
                  {
                    key: 'lock',
                    title: '锁定',
                    style: { color: '#FF7D00' },
                    onClick: () => {
                      Modal.confirm({
                        title: '确定要锁定该供应商吗？',
                        content: '锁定后，该供应商将暂时无法参与业务合作',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                          Message.success('已成功锁定供应商');
                          // 这里可以添加实际的API调用
                        }
                      });
                    }
                  }
                ];

                return (
                  <Space>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleViewDetail(record)}
                    >
                      详情
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleEvaluationClick(record)}
                    >
                      评估
                    </Button>
                    <Dropdown
                      droplist={
                        <Menu>
                          {moreMenuItems.map((item) => (
                            <Menu.Item 
                              key={item.key} 
                              onClick={item.onClick}
                              style={item.style}
                            >
                              {item.title}
                            </Menu.Item>
                          ))}
                        </Menu>
                      }
                      position="bottom"
                    >
                      <Button type="text" size="small">
                        更多
                      </Button>
                    </Dropdown>
                  </Space>
                );
              }
            }
          ]}
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            showJumper: true,
            sizeCanChange: true,
            sizeOptions: [10, 20, 50]
          }}
          rowKey="id"
          stripe
          border
        />
      </Card>

      {/* 供应商详情模态框 */}
      <Modal
        title="供应商详情"
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setCurrentSupplier(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="edit" 
            type="primary"
            onClick={() => {
              setDetailModalVisible(false);
              if (currentSupplier) {
                navigate(`/controltower/supplier-management/edit/${currentSupplier.id}`);
              }
            }}
          >
            编辑
          </Button>
        ]}
        style={{ width: 800 }}
      >
        {currentSupplier && (
          <Descriptions 
            column={2} 
            labelStyle={{ fontWeight: 'bold' }}
            data={[
              ...(currentSupplier.supplierCode ? [{
                label: '供应商编码',
                value: (
                  <Text 
                    copyable={{ text: currentSupplier.supplierCode }} 
                    style={{ 
                      fontSize: '14px', 
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#165DFF'
                    }}
                  >
                    {currentSupplier.supplierCode}
                  </Text>
                )
              }] : []),
              {
                label: '供应商名称',
                value: currentSupplier.name
              },
              {
                label: '营业执照号',
                value: currentSupplier.businessLicense
              },
              {
                label: '联系人',
                value: currentSupplier.contactPerson
              },
              {
                label: '联系电话',
                value: (
                  <Text copyable={{ text: currentSupplier.contactPhone }}>
                    {currentSupplier.contactPhone}
                  </Text>
                )
              },
              {
                label: '供应商邮箱',
                value: (
                  <Text copyable={{ text: currentSupplier.email }}>
                    {currentSupplier.email}
                  </Text>
                )
              },
              {
                label: '创建时间',
                value: currentSupplier.createTime
              },
              {
                label: '评估得分（当前周期）',
                value: (
                  <Text style={{ color: '#165DFF', fontWeight: 'bold' }}>
                    {currentSupplier.evaluationStatus === 'pending' || currentSupplier.evaluationStatus === 'overdue' 
                      ? '— 分' 
                      : `${currentSupplier.assessmentScore} 分`}
                  </Text>
                )
              },
              {
                label: '评估得分（上一周期）',
                value: (
                  <Text style={{ color: '#165DFF', fontWeight: 'bold' }}>
                    {currentSupplier.lastAssessmentScore ? `${currentSupplier.lastAssessmentScore} 分` : '— 分'}
                  </Text>
                )
              },
              {
                label: '供应商评级',
                value: (() => {
                  const getRatingColor = (rating: string) => {
                    switch (rating) {
                      case 'T0': return '#00B42A'; // 绿色
                      case 'T1': return '#0FC6C2'; // 青色
                      case 'T2': return '#FF7D00'; // 橙色
                      case 'T3': return '#F53F3F'; // 红色
                      case 'T4': return '#86909C'; // 灰色
                      default: return '#86909C';
                    }
                  };
                  return (
                    <Tag 
                      color={getRatingColor(currentSupplier.supplierRating)}
                      style={{ 
                        fontWeight: 'bold',
                        border: 'none'
                      }}
                    >
                      {currentSupplier.supplierRating}
                    </Tag>
                  );
                })()
              },
              {
                label: '评估状态',
                value: (
                  <Tag color={currentSupplier.evaluationStatus === 'evaluated' ? 'green' : currentSupplier.evaluationStatus === 'pending' ? 'orange' : 'red'}>
                    {currentSupplier.evaluationStatus === 'evaluated' ? '已评估' : currentSupplier.evaluationStatus === 'pending' ? '待评估' : '逾期未评估'}
                  </Tag>
                )
              }
            ]}
                     />
         )}
       </Modal>

      {/* 审核认证模态框 */}
      <Modal
        title="供应商审核认证"
        visible={auditModalVisible}
        onCancel={() => {
          setAuditModalVisible(false);
          setCurrentSupplier(null);
          auditForm.resetFields();
        }}
        onOk={() => {
          auditForm.validate().then((values) => {
            if (currentSupplier) {
              const newStatus = values.auditResult === 'approve' ? 'active' : 'fail';
              setSupplierData(prev => prev.map(supplier => 
                supplier.id === currentSupplier.id 
                  ? { ...supplier, status: newStatus }
                  : supplier
              ));
              Message.success(
                values.auditResult === 'approve' 
                  ? '供应商审核通过，已激活' 
                  : '供应商审核未通过，已停用'
              );
            }
            setAuditModalVisible(false);
            setCurrentSupplier(null);
            auditForm.resetFields();
          }).catch((error) => {
            console.error('审核表单验证失败:', error);
          });
        }}
        okText="确定"
        cancelText="取消"
        style={{ width: 600 }}
      >
        {currentSupplier && (
          <div>
            <div style={{ 
              background: '#f7f8fa', 
              padding: '16px', 
              borderRadius: '6px', 
              marginBottom: '16px' 
            }}>
                             <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>待审核供应商信息</Text>
              <div style={{ marginTop: '8px' }}>
                <Text>供应商名称：{currentSupplier.name}</Text>
                <br />
                <Text>营业执照：{currentSupplier.businessLicense}</Text>
                <br />
                <Text>联系人：{currentSupplier.contactPerson}</Text>
                <br />
                <Text>联系电话：{currentSupplier.contactPhone}</Text>
              </div>
            </div>
            
            <Form
              form={auditForm}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="审核结果"
                field="auditResult"
                rules={[
                  { required: true, message: '请选择审核结果' }
                ]}
              >
                <Select placeholder="请选择审核结果">
                  <Option value="approve">
                    <span style={{ color: '#00B42A' }}>✓ 审核通过</span>
                  </Option>
                  <Option value="reject">
                    <span style={{ color: '#F53F3F' }}>✗ 审核不通过</span>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="审核意见"
                field="auditReason"
                rules={[
                  { required: true, message: '请输入审核意见' }
                ]}
              >
                <Input.TextArea 
                  placeholder="请详细说明审核的原因和意见"
                  rows={4}
                  maxLength={500}
                  showWordLimit
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
      
      {/* 自定义确认对话框 */}
       {confirmDialogVisible && confirmDialogData && (
         <ConfirmDialog
           visible={confirmDialogVisible}
           title={confirmDialogData.title}
           content={confirmDialogData.content}
           onOk={confirmDialogData.onConfirm}
           onCancel={handleConfirmDialogCancel}
           okText="是，直接评分"
           cancelText="否，进入管理页"
         />
       )}
    </div>
  );
};

export default SupplierManagement;