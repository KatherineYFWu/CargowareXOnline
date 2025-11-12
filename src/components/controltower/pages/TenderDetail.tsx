import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Descriptions,
  Tag,
  Table,
  Space,
  Divider,
  Empty,
  Modal,
  Message
} from '@arco-design/web-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconLeft,
  IconEdit,
  IconDownload,
  IconEye,
  IconUser,
  IconUndo,
  IconSend
} from '@arco-design/web-react/icon';
import SaasPageWrapper from './SaasPageWrapper';

const { Text } = Typography;

/**
 * 生成投标编号 - TESE + 7位随机数字
 */
const generateBidId = (): string => {
  const prefix = 'TESE';
  let randomNumbers = '';
  for (let i = 0; i < 7; i++) {
    randomNumbers += Math.floor(Math.random() * 10).toString();
  }
  return prefix + randomNumbers;
};

/**
 * 招标类型枚举
 */
type TenderType = 'annual' | 'semiannual' | 'shortterm' | 'single';

/**
 * 开标方式枚举
 */
type BiddingMethod = 'internal' | 'public';

/**
 * 招标方式枚举
 */
type TenderMethod = 'directed' | 'open';



/**
 * 基本信息表单数据
 */
interface BasicInfo {
  tenderCode: string;
  title: string;
  tenderCompany: string;
  tenderType: TenderType;
  biddingMethod: BiddingMethod;
  startTime: string;
  endTime: string;
  remark: string;
  attachments: any[];
}



/**
 * 公共配置接口
 */
interface CommonConfig {
  maxBidCount: number;
  minBidCount: number;
  winningBidCount: number;
  contractStartDate: string;
  contractEndDate: string;
  remark: string;
}

/**
 * 查看历史记录项接口
 */
interface ViewHistoryRecord {
  id: string;
  viewerName: string; // 查看人姓名
  viewerCompany: string; // 查看人公司
  viewTime: string; // 查看时间
  viewOrder: number; // 查看次序（第几次查看）
}

/**
 * 查看历史记录接口
 */
interface ViewHistory {
  bidId: string; // 标书ID
  totalViews: number; // 总查看次数
  records: ViewHistoryRecord[]; // 查看记录列表，按时间倒序排列
}

/**
 * 路线信息接口
 */
interface RouteInfo {
  id: string;
  route: string;
  originCountry: string;
  originPort: string;
  destinationCountry: string;
  destinationPort: string;
  applicantDepartment: string;
  applicant: string;
  containerTypes: {
    [key: string]: {
      quantity: number;
      maxPrice: number;
      minPrice: number;
    };
  };
}

/**
 * 标的物信息
 */
interface SubjectInfo {
  commonConfig: CommonConfig;
  routes: RouteInfo[];
}

/**
 * 供应商信息
 */
interface SupplierInfo {
  id: string;
  name: string;
  email: string;
  inviteLink: string;
}

/**
 * 招标方式信息
 */
interface TenderMethodInfo {
  method: TenderMethod;
  suppliers: SupplierInfo[];
}

/**
 * 完整的招标详情数据
 */
interface BidderInfoItem {
  id: string;
  supplierName: string;
  email: string;
  bidStatus: 'not_bid' | 'bid';
  inviteLink: string;
}

interface TenderDetailData {
  basicInfo: BasicInfo;
  subjectInfo: SubjectInfo;
  methodInfo: TenderMethodInfo;
  bidderInfo?: BidderInfoItem[];
  status?: 'draft' | 'published' | 'bidding' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 应标人信息接口
 */
interface BidderInfo {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

/**
 * 应标标书接口
 */
interface BidDocument {
  id: string;
  bidder: BidderInfo;
  submitTime: string;
  viewCount: number;
  status: 'submitted' | 'opened' | 'evaluated';
  coverColor: string; // 书本封面颜色
  bidDetails?: {
    totalPrice: number;
    currency: string;
    validityPeriod: string;
    deliveryTime: string;
    paymentTerms: string;
    technicalSpecs: string;
    remarks: string;
  };
}

/**
 * 招标详情页面组件
 */
const TenderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [tenderData, setTenderData] = useState<TenderDetailData | null>(null);
  const [bidDocuments, setBidDocuments] = useState<BidDocument[]>([]);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<BidDocument | null>(null);
  const [showBidDetails, setShowBidDetails] = useState(false);
  const [showResendConfirmModal, setShowResendConfirmModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<BidderInfoItem | null>(null);
  const [showViewHistoryModal, setShowViewHistoryModal] = useState(false);
  const [selectedBidForHistory, setSelectedBidForHistory] = useState<BidDocument | null>(null);
  const [viewHistoryData, setViewHistoryData] = useState<ViewHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  /**
   * 获取招标详情数据
   */
  const fetchTenderDetail = async () => {
    setLoading(true);
    try {
      // TODO: 调用API获取招标详情
      // const response = await api.getTenderDetail(id);
      // setTenderData(response.data);
      
      // 模拟数据
      const mockData: TenderDetailData = {
        basicInfo: {
          tenderCode: id ? `TB${id.toUpperCase()}` : 'TBABCD123456',
          title: '2024年度海运物流招标',
          tenderCompany: '广东奥马冰箱有限公司',
          tenderType: 'annual',
          biddingMethod: 'public',
          startTime: '2024-01-15 09:00:00',
          endTime: '2024-01-25 18:00:00',
          remark: '本次招标为年度海运物流服务采购，请各供应商认真准备投标文件。',
          attachments: [
            { name: '招标文件.pdf', url: '/files/tender-doc.pdf' },
            { name: '技术规格书.docx', url: '/files/tech-spec.docx' }
          ]
        },
        subjectInfo: {
          commonConfig: {
            maxBidCount: 10,
            minBidCount: 3,
            winningBidCount: 2,
            contractStartDate: '2024-02-01',
            contractEndDate: '2024-12-31',
            remark: '合同期内价格固定，不得随意调整。'
          },
          routes: [
            {
              id: '1',
              route: '中国-美国西海岸',
              originCountry: '中国',
              originPort: '南沙',
              destinationCountry: '美国',
              destinationPort: '洛杉矶',
              applicantDepartment: '物流部',
              applicant: '张三',
              containerTypes: {
                '40HQ': {
                  quantity: 100,
                  maxPrice: 2500,
                  minPrice: 2000
                },
                '20GP': {
                  quantity: 50,
                  maxPrice: 1500,
                  minPrice: 1200
                }
              }
            },
            {
              id: '2',
              route: '中国-欧洲',
              originCountry: '中国',
              originPort: '上海',
              destinationCountry: '德国',
              destinationPort: '汉堡',
              applicantDepartment: '采购部',
              applicant: '李四',
              containerTypes: {
                '40HQ': {
                  quantity: 80,
                  maxPrice: 3000,
                  minPrice: 2500
                },
                '20GP': {
                  quantity: 40,
                  maxPrice: 1800,
                  minPrice: 1500
                }
              }
            }
          ]
        },
        methodInfo: {
          method: 'open',
          suppliers: [
            {
              id: '1',
              name: '中远海运集团',
              email: 'contact@cosco.com',
              inviteLink: 'https://tender.example.com/invite/1?token=abc123'
            },
            {
              id: '2',
              name: '马士基航运',
              email: 'info@maersk.com',
              inviteLink: 'https://tender.example.com/invite/2?token=def456'
            }
          ]
        },
        bidderInfo: [
          {
            id: '1',
            supplierName: '中远海运集团',
            email: 'contact@cosco.com',
            bidStatus: 'bid',
            inviteLink: 'https://tender.example.com/invite/1?token=abc123'
          },
          {
            id: '2',
            supplierName: '马士基航运',
            email: 'info@maersk.com',
            bidStatus: 'not_bid',
            inviteLink: 'https://tender.example.com/invite/2?token=def456'
          },
          {
            id: '3',
            supplierName: '东方海外物流',
            email: 'oocl@example.com',
            bidStatus: 'bid',
            inviteLink: 'https://tender.example.com/invite/3?token=ghi789'
          }
        ],
        status: 'published',
        createdAt: '2024-01-10 14:30:00',
        updatedAt: '2024-01-12 16:45:00'
      };
      
      setTenderData(mockData);
      
      // 模拟应标标书数据
      const mockBidDocuments: BidDocument[] = [
        {
          id: generateBidId(),
          bidder: {
            id: 'bidder1',
            name: '张三',
            company: '中远海运物流有限公司',
            email: 'zhangsan@cosco.com',
            phone: '13800138001'
          },
          submitTime: '2024-01-20 14:30:00',
          viewCount: 5,
          status: 'submitted',
          coverColor: '#4A90E2',
          bidDetails: {
            totalPrice: 1250000,
            currency: 'CNY',
            validityPeriod: '30天',
            deliveryTime: '7-10个工作日',
            paymentTerms: '货到付款',
            technicalSpecs: '符合国际海运标准，提供全程跟踪服务',
            remarks: '我司具有丰富的海运经验，可提供优质服务'
          }
        },
        {
          id: generateBidId(),
          bidder: {
            id: 'bidder2',
            name: '李四',
            company: '马士基物流（中国）有限公司',
            email: 'lisi@maersk.com',
            phone: '13800138002'
          },
          submitTime: '2024-01-21 09:15:00',
          viewCount: 3,
          status: 'submitted',
          coverColor: '#50C878',
          bidDetails: {
            totalPrice: 1180000,
            currency: 'CNY',
            validityPeriod: '45天',
            deliveryTime: '5-8个工作日',
            paymentTerms: '预付30%，余款货到付款',
            technicalSpecs: '全球领先的集装箱运输服务，GPS实时跟踪',
            remarks: '全球网络覆盖，服务可靠'
          }
        },
        {
          id: generateBidId(),
          bidder: {
            id: 'bidder3',
            name: '王五',
            company: '东方海外货柜航运有限公司',
            email: 'wangwu@oocl.com',
            phone: '13800138003'
          },
          submitTime: '2024-01-22 16:45:00',
          viewCount: 8,
          status: 'submitted',
          coverColor: '#FF6B6B',
          bidDetails: {
            totalPrice: 1320000,
            currency: 'CNY',
            validityPeriod: '60天',
            deliveryTime: '6-9个工作日',
            paymentTerms: '月结30天',
            technicalSpecs: '智能化物流管理系统，24小时客服支持',
            remarks: '亚洲区域优势明显，服务网点密集'
          }
        }
      ];
      
      setBidDocuments(mockBidDocuments);
    } catch (error) {
      console.error('获取招标详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenderDetail();
  }, [id]);

  /**
   * 处理返回按钮点击事件
   */
  const handleBack = () => {
    navigate('/controltower/saas/tender');
  };

  /**
   * 编辑招标
   */
  const handleEdit = () => {
    navigate(`/controltower/saas/tender/edit/${id}`);
  };

  /**
   * 下载附件
   */
  const handleDownload = (attachment: any) => {
    // TODO: 实现文件下载逻辑
    console.log('下载附件:', attachment);
  };

  /**
   * 跨标书评标
   */
  const handleCrossBidEvaluation = () => {
    // TODO: 实现跨标书评标逻辑
    console.log('跨标书评标');
  };

  /**
   * 设定中标人
   */
  const handleSetWinner = () => {
    // TODO: 实现设定中标人逻辑
    console.log('设定中标人');
  };

  /**
   * 撤回招标
   */
  const handleWithdraw = () => {
    // TODO: 实现撤回招标逻辑
    Modal.confirm({
      title: '确认撤回',
      content: '确定要撤回此招标吗？撤回后将无法恢复。',
      onOk: () => {
        console.log('撤回招标');
      }
    });
  };

  /**
   * 发布招标
   */
  const handlePublish = () => {
    // TODO: 实现发布招标逻辑
    console.log('发布招标');
  };

  /**
   * 获取招标类型标签
   */
  const getTenderTypeTag = (type: TenderType) => {
    const typeMap = {
      annual: { text: '年度招标', color: 'blue' },
      semiannual: { text: '半年度招标', color: 'green' },
      shortterm: { text: '短期招标', color: 'orange' },
      single: { text: '单次招标', color: 'purple' }
    };
    const config = typeMap[type];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /**
   * 获取开标方式标签
   */
  const getBiddingMethodTag = (method: BiddingMethod) => {
    const methodMap = {
      internal: { text: '内部开标', color: 'gray' },
      public: { text: '公开开标', color: 'green' }
    };
    const config = methodMap[method];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /**
   * 获取招标方式标签
   */
  const getTenderMethodTag = (method: TenderMethod) => {
    const methodMap = {
      directed: { text: '定向邀约', color: 'orange' },
      open: { text: '公开招标', color: 'blue' }
    };
    const config = methodMap[method];
    return <Tag color={config.color}>{config.text}</Tag>;
  };



  /**
   * 处理开标按钮点击 - 显示确认弹窗
   */
  const handleOpenBid = (bid: BidDocument) => {
    setSelectedBid(bid);
    setShowOpenModal(true);
  };

  /**
   * 处理重发邀请邮件 - 显示确认弹窗
   */
  const handleResendInvite = (supplierId: string) => {
    // 查找对应的供应商信息
    const supplier = tenderData?.bidderInfo?.find(item => item.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
      setShowResendConfirmModal(true);
    }
  };

  /**
   * 确认重发邀请邮件
   */
  const handleConfirmResendInvite = async () => {
    if (!selectedSupplier) return;
    
    try {
      // TODO: 调用重发邮件API
      // await api.resendInviteEmail(selectedSupplier.id);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 关闭确认弹窗
      setShowResendConfirmModal(false);
      setSelectedSupplier(null);
      
      // 显示成功提示
      Message.success('邀请邮件发送成功！');
      
      console.log('重发邮件成功，供应商:', selectedSupplier.supplierName);
    } catch (error) {
      console.error('重发邮件失败:', error);
      Message.error('邮件发送失败，请稍后重试');
    }
  };

  /**
   * 取消重发邮件
   */
  const handleCancelResendInvite = () => {
    setShowResendConfirmModal(false);
    setSelectedSupplier(null);
  };

  /**
   * 处理查看历史记录 - 点击小眼睛图标
   */
  const handleViewHistory = async (bid: BidDocument) => {
    setSelectedBidForHistory(bid);
    setShowViewHistoryModal(true);
    setHistoryLoading(true);
    
    try {
      // TODO: 调用API获取查看历史记录
      // const response = await api.getViewHistory(bid.id);
      // setViewHistoryData(response.data);
      
      // 模拟API调用和数据
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockHistoryData: ViewHistory = {
        bidId: bid.id,
        totalViews: bid.viewCount,
        records: [
          {
            id: '1',
            viewerName: '张三',
            viewerCompany: '广东奥马冰箱有限公司',
            viewTime: '2024-01-20 14:30:25',
            viewOrder: bid.viewCount
          },
          {
            id: '2',
            viewerName: '李四',
            viewerCompany: '广东奥马冰箱有限公司',
            viewTime: '2024-01-20 10:15:42',
            viewOrder: bid.viewCount - 1
          },
          {
            id: '3',
            viewerName: '王五',
            viewerCompany: '广东奥马冰箱有限公司',
            viewTime: '2024-01-19 16:22:18',
            viewOrder: bid.viewCount - 2
          }
        ].slice(0, bid.viewCount) // 根据实际查看次数截取记录
      };
      
      setViewHistoryData(mockHistoryData);
    } catch (error) {
      console.error('获取查看历史记录失败:', error);
      Message.error('获取查看历史记录失败，请稍后重试');
    } finally {
      setHistoryLoading(false);
    }
  };

  /**
   * 关闭查看历史记录弹窗
   */
  const handleCloseViewHistory = () => {
    setShowViewHistoryModal(false);
    setSelectedBidForHistory(null);
    setViewHistoryData(null);
  };

  /**
   * 确认开标 - 跳转到标书详情页面
   */
  const handleConfirmOpen = () => {
    setShowOpenModal(false);
    if (selectedBid) {
      // 跳转到标书详情页面
      navigate(`/controltower/bidding/bid-detail/${id}/${selectedBid.id}`);
    }
  };

  /**
   * 取消开标
   */
  const handleCancelOpen = () => {
    setShowOpenModal(false);
    setSelectedBid(null);
  };

  /**
   * 关闭标书详情
   */
  const handleCloseBidDetails = () => {
    setShowBidDetails(false);
    setSelectedBid(null);
  };

  if (!tenderData) {
    return (
      <SaasPageWrapper>
        <Card loading={loading}>
          <Empty description="暂无数据" />
        </Card>
      </SaasPageWrapper>
    );
  }

  const { basicInfo, subjectInfo, methodInfo, createdAt, updatedAt } = tenderData;

  /**
 * 供应商表格列定义
 */
const supplierColumns = [
  {
    title: '供应商名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '联系邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '邀请链接',
    dataIndex: 'inviteLink',
    key: 'inviteLink',
    render: (value: string) => (
      <Button type="text" size="small" onClick={() => window.open(value, '_blank')}>
        查看链接
      </Button>
    )
  }
];

/**
 * 应标人信息表格列定义
 */
const bidderInfoColumns = [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    key: 'supplierName'
  },
  {
    title: '邮箱地址',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '应标状态',
    dataIndex: 'bidStatus',
    key: 'bidStatus',
    render: (status: 'not_bid' | 'bid') => (
      <Tag color={status === 'bid' ? 'green' : 'orange'}>
        {status === 'bid' ? '已应标' : '未应标'}
      </Tag>
    )
  },
  {
    title: '邀请链接',
    dataIndex: 'inviteLink',
    key: 'inviteLink',
    render: (value: string) => (
      <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => window.open(value, '_blank')}>
        {value}
      </span>
    )
  },
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: any) => (
      <Button
        type="primary"
        size="small"
        onClick={() => handleResendInvite(record.id)}
      >
        重发邀请邮件
      </Button>
    )
  }
];

  return (
    <SaasPageWrapper>
      <div className="tender-detail-page">
        {/* 页面头部 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={<IconLeft />}
              onClick={handleBack}
            >
              返回列表
            </Button>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<IconEye />}
              onClick={handleCrossBidEvaluation}
            >
              跨标书评标
            </Button>
            <Button
              type="primary"
              icon={<IconUser />}
              onClick={handleSetWinner}
            >
              设定中标人
            </Button>
            <Button
              type="primary"
              icon={<IconUndo />}
              onClick={handleWithdraw}
            >
              撤回
            </Button>
            <Button
              type="primary"
              icon={<IconSend />}
              onClick={handlePublish}
            >
              发布
            </Button>
            <Button
              type="primary"
              icon={<IconEdit />}
              onClick={handleEdit}
            >
              编辑
            </Button>
          </Space>
        </div>

        {/* 基本信息 */}
        <Card title="基本信息" className="mb-6">
          <Descriptions
            column={2}
            data={[
              {
                label: '招标编号',
                value: <Text copyable>{basicInfo.tenderCode}</Text>
              },
              {
                label: '招标标题',
                value: basicInfo.title
              },
              {
                label: '招标公司',
                value: basicInfo.tenderCompany
              },
              {
                label: '招标类型',
                value: getTenderTypeTag(basicInfo.tenderType)
              },
              {
                label: '开标方式',
                value: getBiddingMethodTag(basicInfo.biddingMethod)
              },
              {
                label: '开始时间',
                value: basicInfo.startTime
              },
              {
                label: '结束时间',
                value: basicInfo.endTime
              },
              {
                label: '创建时间',
                value: createdAt
              },
              {
                label: '更新时间',
                value: updatedAt
              }
            ]}
          />
          
          {basicInfo.remark && (
            <>
              <Divider />
              <div>
                <Text bold>备注说明：</Text>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <Text>{basicInfo.remark}</Text>
                </div>
              </div>
            </>
          )}

          {basicInfo.attachments && basicInfo.attachments.length > 0 && (
            <>
              <Divider />
              <div>
                <Text bold>附件文件：</Text>
                <div className="mt-2 space-y-2">
                  {basicInfo.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Button
                        type="text"
                        size="small"
                        icon={<IconDownload />}
                        onClick={() => handleDownload(attachment)}
                      >
                        {attachment.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>

        {/* 标的物信息 */}
        <Card title="标的物信息" className="mb-6">
          {/* 公共配置 */}
          <div>
            <Text bold>公共配置：</Text>
            <Descriptions
              className="mt-3"
              column={2}
              data={[
                 {
                   label: '招标方式',
                   value: getTenderMethodTag(methodInfo.method)
                 },
                 {
                   label: '最大投标数',
                   value: `${subjectInfo.commonConfig.maxBidCount} 个`
                 },
                 {
                   label: '最小投标数',
                   value: `${subjectInfo.commonConfig.minBidCount} 个`
                 },
                 {
                   label: '中标数量',
                   value: `${subjectInfo.commonConfig.winningBidCount} 个`
                 },
                 {
                   label: '合同开始日期',
                   value: subjectInfo.commonConfig.contractStartDate
                 },
                 {
                   label: '合同结束日期',
                   value: subjectInfo.commonConfig.contractEndDate
                 },
                 {
                   label: '备注',
                   value: subjectInfo.commonConfig.remark || '-'
                 }
               ]}
            />
          </div>

          <Divider />
          
          {/* 线路信息 */}
          <div>
            <Text bold>线路信息：</Text>
            {subjectInfo.routes.map((route, index) => (
              <Card key={route.id} className="mt-3" size="small">
                <div className="mb-3">
                  <Text bold>线路 {index + 1}</Text>
                </div>
                <Descriptions
                  column={2}
                  data={[
                    {
                      label: '航线',
                      value: route.route
                    },
                    {
                      label: '起运国',
                      value: route.originCountry
                    },
                    {
                      label: '起运港',
                      value: route.originPort
                    },
                    {
                      label: '目的国',
                      value: route.destinationCountry
                    },
                    {
                      label: '目的港',
                      value: route.destinationPort
                    },
                    {
                      label: '申请部门',
                      value: route.applicantDepartment
                    },
                    {
                      label: '申请人',
                      value: route.applicant
                    }
                  ]}
                />
                
                {/* 箱型配置 */}
                <div className="mt-3">
                  <Text bold>箱型配置：</Text>
                  <Table
                    className="mt-2"
                    columns={[
                      {
                        title: '箱型',
                        dataIndex: 'containerType',
                        key: 'containerType'
                      },
                      {
                        title: '数量',
                        dataIndex: 'quantity',
                        key: 'quantity',
                        render: (value) => `${value} 个`
                      },
                      {
                        title: '最高限价',
                        dataIndex: 'maxPrice',
                        key: 'maxPrice',
                        render: (value) => `¥${value.toLocaleString()}`
                      },
                      {
                        title: '最低限价',
                        dataIndex: 'minPrice',
                        key: 'minPrice',
                        render: (value) => `¥${value.toLocaleString()}`
                      }
                    ]}
                    data={Object.entries(route.containerTypes).map(([containerType, config]) => ({
                      containerType,
                      quantity: config.quantity,
                      maxPrice: config.maxPrice,
                      minPrice: config.minPrice
                    }))}
                    pagination={false}
                    size="small"
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* 邀约供应商信息 */}
          {methodInfo.method === 'directed' && methodInfo.suppliers.length > 0 && (
            <div className="mt-4">
              <Divider />
              <Text bold>邀约供应商：</Text>
              <Table
                className="mt-3"
                columns={supplierColumns}
                data={methodInfo.suppliers}
                pagination={false}
                size="small"
              />
            </div>
          )}
        </Card>

        {/* 应标人信息 */}
        <Card title="应标人信息" className="mb-6">
          <div>
            <Text bold>应标人列表：</Text>
            <Table
              className="mt-3"
              columns={bidderInfoColumns}
              data={tenderData?.bidderInfo || []}
              pagination={false}
              size="small"
            />
          </div>
        </Card>

        {/* 应标标书区块 */}
        <Card title="应标标书" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bidDocuments.map((bid) => (
              <div
                key={bid.id}
                className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200"
                style={{
                  minHeight: '432px',
                  width: '288px'
                }}
              >
                {/* 蓝色装饰波浪作为底色 - 从右上角向左下角延伸 */}
                 <div className="absolute top-0 right-0 bottom-0 left-0 overflow-hidden rounded-lg">
                   <svg
                     className="absolute top-0 right-0 w-full h-full"
                     viewBox="0 0 288 432"
                     preserveAspectRatio="none"
                   >
                     <path
                       d="M288,0 C216,50 144,100 72,150 C48,165 24,180 0,195 L0,0 Z"
                       fill="#e3f2fd"
                       opacity="0.6"
                     />
                     <path
                       d="M288,0 C240,40 192,80 144,120 C96,160 48,200 0,240 L0,0 Z"
                       fill="#bbdefb"
                       opacity="0.4"
                     />
                     <path
                       d="M288,0 C192,60 96,120 0,180 L0,0 Z"
                       fill="#90caf9"
                       opacity="0.3"
                     />
                   </svg>
                 </div>
                
                {/* 投标文件封面 */}
                <div className="relative p-4 h-full flex flex-col z-10">
                  {/* 右上角查看次数标签 */}
                  <div className="absolute top-3 right-3 z-20">
                    <div 
                      className="relative bg-gradient-to-r from-orange-500 to-orange-400 px-3 py-1.5 rounded-full shadow-lg border border-orange-300 transform hover:scale-105 transition-all duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        handleViewHistory(bid);
                      }}
                      title="点击查看历史记录"
                    >
                      {/* 内部光泽效果 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/10 rounded-full" />
                      {/* 小图标 */}
                      <div className="flex items-center space-x-1.5 relative z-10">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium text-white drop-shadow-sm">{bid.viewCount}</span>
                      </div>
                      {/* 外部光晕 */}
                      <div className="absolute -inset-1 bg-orange-400/30 rounded-full blur-sm -z-10" />
                    </div>
                  </div>
                  
                  {/* 顶部项目信息 */}
                  <div className="text-center mb-6">
                    <div className="text-xs text-blue-600 mb-2">2026年度海运物流招标</div>
                    <div className="text-2xl font-bold text-blue-600 mb-4">投标文件</div>
                  </div>
                  
                  {/* 中间空白区域 */}
                  <div className="flex-1" />
                  
                  {/* 底部信息表单 */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">投标编号：</span>
                      <div className="flex-1 border-b border-gray-300 pb-1">{bid.id}</div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">投标企业：</span>
                      <div className="flex-1 border-b border-gray-300 pb-1">{bid.bidder.company}</div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">法人代表：</span>
                      <div className="flex-1 border-b border-gray-300 pb-1">{bid.bidder.name}</div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">投标日期：</span>
                      <div className="flex-1 border-b border-gray-300 pb-1">{bid.submitTime}</div>
                    </div>
                  </div>
                  
                  {/* 开标按钮 - 带呼吸灯效果 */}
                    <Button
                      type="primary"
                      size="small"
                      className="mt-4 w-full relative overflow-hidden group animate-pulse hover:animate-none"
                      style={{
                        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.5)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onClick={() => handleOpenBid(bid)}
                    >
                      <span className="relative z-10 font-medium">开标</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </div>

              </div>
            ))}
          </div>
        </Card>

        {/* 开标确认弹窗 */}
        <Modal
          title="开标确认"
          visible={showOpenModal}
          onOk={handleConfirmOpen}
          onCancel={handleCancelOpen}
          okText="确认"
          cancelText="取消"
        >
          <div className="py-4">
            <p className="text-gray-700 leading-relaxed">
              此招标为长期合约，请确保相关领导层均已在场并授权开标。
            </p>
            {selectedBid && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <div>应标公司：{selectedBid.bidder.company}</div>
                  <div>应标人：{selectedBid.bidder.name}</div>
                  <div>提交时间：{selectedBid.submitTime}</div>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* 标书详情弹窗 */}
        <Modal
          title={`标书详情 - ${selectedBid?.bidder.company}`}
          visible={showBidDetails}
          onCancel={handleCloseBidDetails}
          footer={[
            <Button key="close" onClick={handleCloseBidDetails}>
              关闭
            </Button>
          ]}
          style={{ width: '800px' }}
        >
          {selectedBid?.bidDetails && (
            <div className="space-y-6">
              {/* 书本打开动画效果 */}
              <div className="text-center py-4">
                <div className="inline-block animate-pulse">
                  📖 标书已开启
                </div>
              </div>
              
              {/* 报价详情 */}
              <Descriptions
                title="报价信息"
                column={2}
                data={[
                  {
                    label: '总报价',
                    value: `${selectedBid.bidDetails.totalPrice.toLocaleString()} ${selectedBid.bidDetails.currency}`
                  },
                  {
                    label: '报价有效期',
                    value: selectedBid.bidDetails.validityPeriod
                  },
                  {
                    label: '交货时间',
                    value: selectedBid.bidDetails.deliveryTime
                  },
                  {
                    label: '付款条件',
                    value: selectedBid.bidDetails.paymentTerms
                  }
                ]}
              />
              
              <Divider />
              
              {/* 技术规格 */}
              <div>
                <Text bold>技术规格：</Text>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  {selectedBid.bidDetails.technicalSpecs}
                </div>
              </div>
              
              {/* 备注信息 */}
              <div>
                <Text bold>备注信息：</Text>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  {selectedBid.bidDetails.remarks}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* 重发邮件确认弹窗 */}
        <Modal
          title="确认重发邀请邮件"
          visible={showResendConfirmModal}
          onOk={handleConfirmResendInvite}
          onCancel={handleCancelResendInvite}
          okText="确认发送"
          cancelText="取消"
          okButtonProps={{ type: 'primary' }}
        >
          <div style={{ padding: '20px 0' }}>
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <Text style={{ fontSize: '14px', color: '#FF7D00' }}>
                ⚠️ 您确定要向该供应商重新发送邀请邮件吗？
              </Text>
            </div>
            
            {selectedSupplier && (
              <div>
                <Text style={{ fontSize: '14px', color: '#86909C', marginBottom: '8px', display: 'block' }}>
                  供应商信息：
                </Text>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div style={{ marginBottom: '8px' }}>
                    <Text style={{ fontWeight: 'bold' }}>供应商名称：</Text>
                    <Text>{selectedSupplier.supplierName}</Text>
                  </div>
                  <div>
                    <Text style={{ fontWeight: 'bold' }}>邮箱地址：</Text>
                    <Text>{selectedSupplier.email}</Text>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#86909C' }}>
                系统将向该供应商发送招标邀请提醒邮件，请确认操作。
              </Text>
            </div>
          </div>
        </Modal>

        {/* 查看历史记录弹窗 */}
        <Modal
          title="查看历史"
          visible={showViewHistoryModal}
          onCancel={handleCloseViewHistory}
          footer={[
            <Button key="close" onClick={handleCloseViewHistory}>
              关闭
            </Button>
          ]}
          style={{ top: 50, width: 600 }}
        >
          <div style={{ padding: '20px 0' }}>
            {historyLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div className="mt-2 text-gray-600">加载中...</div>
              </div>
            ) : viewHistoryData ? (
              <div>
                {/* 标书信息 */}
                {selectedBidForHistory && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {selectedBidForHistory.bidder.company}
                        </Text>
                        <div className="mt-1">
                          <Text style={{ color: '#86909C', fontSize: '14px' }}>
                            投标编号：{selectedBidForHistory.id}
                          </Text>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          总查看次数：{viewHistoryData.totalViews}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 历史记录列表 */}
                <div className="space-y-3">
                  <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', display: 'block' }}>
                    查看记录（按时间倒序）
                  </Text>
                  
                  {viewHistoryData.records.length > 0 ? (
                    viewHistoryData.records.map((record) => (
                      <div 
                        key={record.id} 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {/* 查看次序 */}
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                              {record.viewOrder}
                            </div>
                          </div>
                          
                          {/* 查看人信息 */}
                          <div>
                            <div className="font-medium text-gray-900">
                              {record.viewerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.viewerCompany}
                            </div>
                          </div>
                        </div>
                        
                        {/* 查看时间 */}
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {record.viewTime.split(' ')[0]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.viewTime.split(' ')[1]}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      暂无查看记录
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无数据
              </div>
            )}
          </div>
        </Modal>
      </div>
    </SaasPageWrapper>
  );
};

  export default TenderDetail;