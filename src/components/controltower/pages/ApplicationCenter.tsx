import React, { useState } from 'react';
import { Card, Grid, Typography, Button, Tag, Input, Space } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { AgreementModal, SuccessModal, RejectionModal } from '../../common/CustomModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import appBannerImage from '../../../assets/application.png';
import { 
  faRobot, 
  faFileAlt, 
  faDatabase, 
  faChartLine, 
  faBoxes, 
  faShip, 
  faTruck, 
  faGlobe, 
  faHandshake, 
  faFileContract, 
  faClipboardList, 
  faExchangeAlt, 
  faBalanceScale, 
  faGlobeAmericas, 
  faCode, 
  faDesktop,
  faMobile,
  faUsers,
  faBuilding,
  faFileInvoice,
  faShieldAlt,
  faFileSignature,
  faLaptopCode,
  faRoute
} from '@fortawesome/free-solid-svg-icons';

const { Row, Col } = Grid;
const { Title, Text } = Typography;

interface AppItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  subcategory?: string;
  status: 'not_activated' | 'pending' | 'approved' | 'rejected' | 'disabled';
  isNew?: boolean;
  url?: string;
  rejectionReason?: string; // 拒绝原因
}

/**
 * 状态标签组件
 * @param status 应用状态
 * @returns 状态标签JSX元素
 */
const StatusTag: React.FC<{ status: AppItem['status'] }> = ({ status }) => {
  const getStatusConfig = (status: AppItem['status']) => {
    switch (status) {
      case 'not_activated':
        return { text: '未开通', color: '#8C8C8C', bgColor: '#F5F5F5' };
      case 'pending':
        return { text: '审核中', color: '#FF7D00', bgColor: '#FFF7E6' };
      case 'approved':
        return { text: '审核通过', color: '#00B42A', bgColor: '#F6FFED' };
      case 'rejected':
        return { text: '审核拒绝', color: '#F53F3F', bgColor: '#FFECE8' };
      case 'disabled':
        return { text: '禁用', color: '#86909C', bgColor: '#F2F3F5' };
      default:
        return { text: '未知', color: '#8C8C8C', bgColor: '#F5F5F5' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Tag
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 2,
        fontSize: '12px',
        fontWeight: '500',
        padding: '4px 8px',
        border: 'none',
        borderRadius: '4px',
        color: config.color,
        backgroundColor: config.bgColor,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }}
    >
      {config.text}
    </Tag>
  );
};

const ApplicationCenter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [searchValue, setSearchValue] = useState('');
  const [agreementModalVisible, setAgreementModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  // 应用数据
  const applications: AppItem[] = [
    // AI创新场
    {
      id: '1',
      name: 'AI沃宝',
      description: '智能客服助手，提供24小时在线服务',
      icon: faRobot,
      category: 'ai-innovation',
      status: 'approved'
    },
    {
      id: '2',
      name: '文件识别',
      description: '自动识别和处理各类贸易单证',
      icon: faFileAlt,
      category: 'ai-innovation',
      status: 'pending'
    },
    {
      id: '3',
      name: '超级运价',
      description: '智能运价分析和报价系统',
      icon: faDatabase,
      category: 'ai-innovation',
      status: 'approved'
    },
    {
      id: '4',
      name: '智能BI',
      description: '智能商业分析和数据洞察',
      icon: faChartLine,
      category: 'ai-innovation',
      status: 'rejected',
      isNew: true,
      rejectionReason: '申请材料不完整，缺少企业营业执照副本和法人身份证明文件。请补充相关材料后重新提交申请。'
    },
    {
      id: '5',
      name: '智慧集装箱',
      description: '智能集装箱管理和追踪系统',
      icon: faBoxes,
      category: 'ai-innovation',
      status: 'not_activated',
      isNew: true
    },

    // 海关专区 - 美加专区
    {
      id: '6',
      name: 'AMS申报',
      description: '美国海关自动舱单系统申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'approved'
    },
    {
      id: '7',
      name: 'ISF申报',
      description: '进口商安全申报系统',
      icon: faFileSignature,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'approved'
    },
    {
      id: '8',
      name: 'ACI申报',
      description: '加拿大预先货物信息系统',
      icon: faClipboardList,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'disabled'
    },
    {
      id: '9',
      name: '美国换单',
      description: '美国目的港换单服务',
      icon: faFileAlt,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'pending'
    },
    {
      id: '10',
      name: '美国清关',
      description: '美国海关清关服务',
      icon: faShieldAlt,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'not_activated'
    },

    // 海关专区 - 欧盟业务
    {
      id: '11',
      name: 'ICS2申报',
      description: '欧盟进口控制系统2.0申报',
      icon: faFileInvoice,
      category: 'customs',
      subcategory: 'eu',
      status: 'not_activated'
    },

    // 海关专区 - 中国业务
    {
      id: '12',
      name: '上海预配舱单',
      description: '上海港预配舱单申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'china',
      status: 'approved'
    },
    {
      id: '13',
      name: '青岛预配舱单',
      description: '青岛港预配舱单申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'china',
      status: 'pending'
    },
    {
      id: '14',
      name: '华南预配舱单',
      description: '华南地区预配舱单申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'china',
      status: 'disabled'
    },
    {
      id: '15',
      name: 'VGM申报',
      description: '集装箱重量验证申报',
      icon: faBalanceScale,
      category: 'customs',
      subcategory: 'china',
      status: 'rejected',
      rejectionReason: '提交的称重证明文件格式不符合要求，请提供符合SOLAS公约标准的称重证明文件。'
    },
    {
      id: '16',
      name: '上海进口换单',
      description: '上海港进口换单服务',
      icon: faExchangeAlt,
      category: 'customs',
      subcategory: 'china',
      status: 'not_activated'
    },

    // 海关专区 - 其他
    {
      id: '17',
      name: 'AFR申报',
      description: '日本海关申报',
      icon: faGlobeAmericas,
      category: 'customs',
      subcategory: 'other',
      status: 'pending'
    },
    {
      id: '18',
      name: '墨西哥反恐申报',
      description: '墨西哥海关反恐申报系统',
      icon: faShieldAlt,
      category: 'customs',
      subcategory: 'other',
      status: 'approved'
    },

    // 智慧物流系统 - 定制门户
    {
      id: '19',
      name: 'Web门户',
      description: '基于Web的物流管理门户',
      icon: faDesktop,
      category: 'smart-logistics',
      subcategory: 'portal',
      status: 'approved'
    },
    {
      id: '20',
      name: '小程序',
      description: '移动端物流服务小程序',
      icon: faMobile,
      category: 'smart-logistics',
      subcategory: 'portal',
      status: 'pending'
    },
    {
      id: '21',
      name: 'B2B平台',
      description: '企业间物流服务平台',
      icon: faBuilding,
      category: 'smart-logistics',
      subcategory: 'portal',
      status: 'disabled'
    },

    // 智慧物流系统 - 协作云平台
    {
      id: '22',
      name: '控制塔协作系统',
      description: '物流控制塔协作管理系统',
      icon: faUsers,
      category: 'smart-logistics',
      subcategory: 'collaboration',
      status: 'approved'
    },
    {
      id: '23',
      name: 'CargoWare',
      description: '货物管理和追踪系统',
      icon: faTruck,
      category: 'smart-logistics',
      subcategory: 'collaboration',
      status: 'rejected',
      rejectionReason: '系统安全评估未通过，数据加密方案不符合行业标准要求，请完善安全防护措施后重新申请。'
    },

    // 经纪代理 - 美国业务
    {
      id: '24',
      name: '美国公司注册',
      description: '美国公司注册服务',
      icon: faBuilding,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'not_activated'
    },
    {
      id: '25',
      name: '美国公司EIN申请',
      description: '美国雇主识别号申请',
      icon: faFileAlt,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'pending'
    },
    {
      id: '26',
      name: '美国海关Bond',
      description: '美国海关保证金服务',
      icon: faHandshake,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'approved'
    },
    {
      id: '27',
      name: '美国FMC申请',
      description: '美国联邦海事委员会申请',
      icon: faFileSignature,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'disabled'
    },
    {
      id: '28',
      name: '加拿大海关Bond',
      description: '加拿大海关保证金服务',
      icon: faHandshake,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'rejected',
      rejectionReason: '申请企业信用评级不符合要求，需要提供近三年财务审计报告和银行资信证明。'
    },

    // 经纪代理 - 欧盟业务
    {
      id: '29',
      name: 'EORI申请',
      description: '欧盟经济经营者注册识别号申请',
      icon: faFileAlt,
      category: 'broker-agent',
      subcategory: 'eu',
      status: 'pending'
    },
    {
      id: '30',
      name: 'VAT申请',
      description: '欧盟增值税号申请',
      icon: faFileInvoice,
      category: 'broker-agent',
      subcategory: 'eu',
      status: 'approved'
    },

    // 经纪代理 - 中国业务
    {
      id: '31',
      name: 'NVOCC注册',
      description: '无船承运人注册服务',
      icon: faShip,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'approved'
    },
    {
      id: '32',
      name: '进出口权备案',
      description: '进出口经营权备案服务',
      icon: faBuilding,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'pending'
    },
    {
      id: '33',
      name: '商务部备代备案',
      description: '商务部备案代理服务',
      icon: faFileContract,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'not_activated'
    },
    {
      id: '34',
      name: '原产地证',
      description: '原产地证明申请服务',
      icon: faFileSignature,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'disabled'
    },

    // 经纪代理 - 其他
    {
      id: '35',
      name: '船代签约',
      description: '船舶代理签约服务',
      icon: faShip,
      category: 'broker-agent',
      subcategory: 'other',
      status: 'rejected',
      rejectionReason: '船舶代理资质证书已过期，请更新有效的船舶代理经营许可证后重新提交申请。'
    },

    // 订舱门户 - 船东
    {
      id: '36',
      name: '船司订舱',
      description: '船公司直接订舱服务',
      icon: faShip,
      category: 'booking-portal',
      subcategory: 'carrier',
      status: 'approved'
    },
    {
      id: '37',
      name: '船司截单',
      description: '船公司截单管理',
      icon: faClipboardList,
      category: 'booking-portal',
      subcategory: 'carrier',
      status: 'pending'
    },

    // 订舱门户 - 代理
    {
      id: '38',
      name: '代理订舱',
      description: '代理商订舱服务',
      icon: faUsers,
      category: 'booking-portal',
      subcategory: 'agent',
      status: 'not_activated'
    },
    {
      id: '39',
      name: '代理截单',
      description: '代理商截单管理',
      icon: faFileAlt,
      category: 'booking-portal',
      subcategory: 'agent',
      status: 'disabled'
    },

    // 工具箱 - 可视化
    {
      id: '40',
      name: '全链路跟踪',
      description: '全程物流链路可视化跟踪',
      icon: faRoute,
      category: 'toolbox',
      subcategory: 'visualization',
      status: 'approved'
    },
    {
      id: '41',
      name: '全球船期',
      description: '全球船期信息查询',
      icon: faShip,
      category: 'toolbox',
      subcategory: 'visualization',
      status: 'pending'
    },
    {
      id: '42',
      name: '货车轨迹',
      description: '货车运输轨迹追踪',
      icon: faTruck,
      category: 'toolbox',
      subcategory: 'visualization',
      status: 'rejected'
    },

    // 工具箱 - 实用助手
    {
      id: '43',
      name: 'HS归类大师',
      description: 'HS编码智能归类工具',
      icon: faCode,
      category: 'toolbox',
      subcategory: 'tools',
      status: 'not_activated'
    },
    {
      id: '44',
      name: '舱单转换',
      description: '各种舱单格式转换工具',
      icon: faExchangeAlt,
      category: 'toolbox',
      subcategory: 'tools',
      status: 'disabled'
    },
    {
      id: '45',
      name: '货代名录',
      description: '全球货代公司信息查询',
      icon: faGlobe,
      category: 'toolbox',
      subcategory: 'tools',
      status: 'approved'
    }
  ];

  // 分类配置
  const categories = [
    {
      key: 'ai-innovation',
      name: 'AI创新场',
      description: 'AI驱动的创新解决方案',
      icon: faRobot,
      color: '#165dff'
    },
    {
      key: 'customs',
      name: '海关专区',
      description: '海关业务专业解决方案',
      icon: faShieldAlt,
      color: '#165dff'
    },
    {
      key: 'smart-logistics',
      name: '智慧物流系统',
      description: '智能高效的物流管理系统',
      icon: faTruck,
      color: '#165dff'
    },
    {
      key: 'broker-agent',
      name: '经纪代理',
      description: '专业的经纪代理服务',
      icon: faHandshake,
      color: '#165dff'
    },
    {
      key: 'booking-portal',
      name: '订舱门户',
      description: '高效便捷的订舱服务平台',
      icon: faShip,
      color: '#165dff'
    },
    {
      key: 'toolbox',
      name: '工具箱',
      description: '多样化的实用工具集合',
      icon: faLaptopCode,
      color: '#165dff'
    }
  ];

  // 子分类配置
  const subcategories = {
    'customs': [
      { key: 'us-canada', name: '美加专区' },
      { key: 'eu', name: '欧盟业务' },
      { key: 'china', name: '中国业务' },
      { key: 'other', name: '其他' }
    ],
    'smart-logistics': [
      { key: 'portal', name: '定制门户' },
      { key: 'collaboration', name: '协作云平台' }
    ],
    'broker-agent': [
      { key: 'us', name: '美国业务' },
      { key: 'eu', name: '欧盟业务' },
      { key: 'china', name: '中国业务' },
      { key: 'other', name: '其他' }
    ],
    'booking-portal': [
      { key: 'carrier', name: '船东' },
      { key: 'agent', name: '代理' }
    ],
    'toolbox': [
      { key: 'visualization', name: '可视化' },
      { key: 'tools', name: '实用助手' }
    ]
  };

  // 获取当前分类的应用
  const currentApps = applications.filter(app => app.category === activeCategory);
  const currentCategory = categories.find(cat => cat.key === activeCategory);
  const currentSubcategories = subcategories[activeCategory as keyof typeof subcategories] || [];

  // 按子分类分组应用
  const groupedApps = currentSubcategories.reduce((acc, subcat) => {
    acc[subcat.key] = currentApps.filter(app => app.subcategory === subcat.key);
    return acc;
  }, {} as Record<string, AppItem[]>);

  // 过滤应用数据
  const filteredApps = applications.filter(app => {
    const matchesCategory = activeCategory === '全部' || app.category === activeCategory;
    const matchesSearch = searchValue === '' || 
      app.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      app.description.toLowerCase().includes(searchValue.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 处理应用操作
  /**
   * 处理应用操作
   * @param app 应用信息
   */
  const handleAppAction = (app: AppItem) => {
    if (app.status === 'approved') {
      // 进入应用
      if (app.url) {
        window.open(app.url, '_blank');
      } else {
        console.log('进入应用:', app.name);
      }
    } else if (app.status === 'rejected') {
      // 显示拒绝原因弹窗
      setSelectedApp(app);
      setRejectionModalVisible(true);
    } else {
      // 申请开通 - 根据应用名称显示不同弹窗
      if (app.name === 'ICS2申报') {
        setAgreementModalVisible(true);
      } else if (app.name === '美国清关') {
        setSuccessModalVisible(true);
      } else {
        console.log('申请开通:', app.name);
      }
    }
  };

  /**
   * 处理重新上传操作
   */
  const handleReupload = () => {
    // 这里可以添加重新上传后的逻辑，比如更新应用状态为pending
    console.log('重新上传完成，应用状态将更新为待审核');
    // 可以在这里调用API更新应用状态
  };

  /**
   * 处理协议上传成功
   */
  const handleUploadSuccess = () => {
    console.log('协议上传成功');
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Banner区域 */}
      <div className="api-banner" style={{
        backgroundImage: `url(${appBannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '32px'
      }}>
        {/* 黑色蒙版 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 0
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'white'
        }}>
          <Typography.Title heading={1} style={{ color: 'white', marginBottom: '16px', fontSize: '48px', fontWeight: 'bold' }}>
            应用中心
          </Typography.Title>
          <Typography.Text style={{ color: 'white', fontSize: '18px', marginBottom: '32px', display: 'block' }}>
            探索丰富的应用生态，提升您的工作效率
          </Typography.Text>
          
          {/* 搜索框 */}
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Input
              size="large"
              placeholder="搜索应用名称或描述..."
              prefix={<IconSearch />}
              value={searchValue}
              onChange={setSearchValue}
              style={{
                height: '50px',
                fontSize: '16px',
                borderRadius: '25px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        </div>
      </div>
      {/* 分类筛选标签 */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ 
          background: '#f7f8fa',
          padding: '16px 20px',
          borderRadius: 6,
          marginBottom: 24
        }}>
          <Space wrap>
            <Button
              key="all"
              type={activeCategory === '全部' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setActiveCategory('全部')}
              style={{
                borderRadius: 0,
                ...(activeCategory === '全部' ? {
                  background: '#165dff',
                  borderColor: '#165dff'
                } : {
                  background: 'white',
                  borderColor: '#d9d9d9',
                  color: '#86909c'
                })
              }}
            >
              全部
            </Button>
            {categories.map(category => (
              <Button
                key={category.key}
                type={activeCategory === category.key ? 'primary' : 'outline'}
                size="small"
                onClick={() => setActiveCategory(category.key)}
                style={{
                  borderRadius: 0,
                  ...(activeCategory === category.key ? {
                    background: '#165dff',
                    borderColor: '#165dff'
                  } : {
                    background: 'white',
                    borderColor: '#d9d9d9',
                    color: '#86909c'
                  })
                }}
              >
                {category.name}
              </Button>
            ))}
          </Space>
        </div>
      </div>

      

      {/* 应用列表 */}
      {activeCategory === '全部' ? (
        // 显示所有应用
        <Row gutter={[24, 24]}>
          {filteredApps.map(app => {
            const appCategory = categories.find(cat => cat.key === app.category);
            return (
              <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                <Card
              className="app-card"
              hoverable
              style={{ 
                height: '220px',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                overflow: 'hidden',
                position: 'relative'
              }}
              bodyStyle={{ 
                padding: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative'
              }}
            >
              <StatusTag status={app.status} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      marginBottom: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${appCategory?.color}15, ${appCategory?.color}25)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FontAwesomeIcon 
                          icon={app.icon} 
                          size="lg" 
                          style={{ color: appCategory?.color }} 
                        />
                      </div>
                      <div>
                      </div>
                    </div>
                    <Title heading={6} style={{ 
                      margin: '0 0 8px 0', 
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      {app.name}
                    </Title>
                    <Text style={{ 
                      fontSize: '13px', 
                      color: '#666666', 
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden'
                    }}>
                      {app.description}
                    </Text>
                  </div>
                  
                  <Button 
                    type={app.status === 'approved' ? 'primary' : 'outline'}
                    size="small"
                    long
                    onClick={() => handleAppAction(app)}
                    disabled={app.status === 'disabled'}
                    style={{
                      height: '36px',
                      fontWeight: '500',
                      border: app.status === 'approved' ? 'none' : `1px solid ${appCategory?.color}`,
                      background: app.status === 'approved' 
                        ? `linear-gradient(135deg, ${appCategory?.color}, ${appCategory?.color}dd)`
                        : 'transparent',
                      color: app.status === 'approved' ? 'white' : appCategory?.color,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      opacity: app.status === 'disabled' ? 0.5 : 1
                    }}
                  >
                    {app.status === 'approved' ? '进入应用' : 
                     app.status === 'pending' ? '审核中' :
                     app.status === 'rejected' ? '已拒绝' :
                     app.status === 'disabled' ? '已禁用' : '申请开通'}
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : activeCategory === 'ai-innovation' ? (
        // AI创新场 - 直接显示应用卡片
        <Row gutter={[24, 24]}>
          {currentApps.map(app => (
            <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                className="app-card"
                hoverable
                style={{ 
                  height: '220px',
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                bodyStyle={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  height: '100%',
                  position: 'relative'
                }}
              >
                <StatusTag status={app.status} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    marginBottom: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${currentCategory?.color}15, ${currentCategory?.color}25)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon 
                        icon={app.icon} 
                        size="lg" 
                        style={{ color: currentCategory?.color }} 
                      />
                    </div>
                    <div>
                    </div>
                  </div>
                  <Title heading={6} style={{ 
                    margin: '0 0 8px 0', 
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    {app.name}
                  </Title>
                  <Text style={{ 
                    fontSize: '13px', 
                    color: '#666666', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden'
                  }}>
                    {app.description}
                  </Text>
                </div>
                
                <Button 
                  type={app.status === 'approved' ? 'primary' : 'outline'}
                  size="small"
                  long
                  onClick={() => handleAppAction(app)}
                  disabled={app.status === 'disabled'}
                  style={{
                    height: '36px',
                    fontWeight: '500',
                    border: app.status === 'approved' ? 'none' : `1px solid ${currentCategory?.color}`,
                    background: app.status === 'approved' 
                      ? `linear-gradient(135deg, ${currentCategory?.color}, ${currentCategory?.color}dd)`
                      : 'transparent',
                    color: app.status === 'approved' ? 'white' : currentCategory?.color,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: app.status === 'disabled' ? 0.5 : 1
                  }}
                >
                  {app.status === 'approved' ? '进入应用' : 
                   app.status === 'pending' ? '审核中' :
                   app.status === 'rejected' ? '已拒绝' :
                   app.status === 'disabled' ? '已禁用' : '申请开通'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        // 其他分类 - 按子分类显示
        <div>
          {currentSubcategories.map(subcat => {
            const subcatApps = groupedApps[subcat.key] || [];
            if (subcatApps.length === 0) return null;
            
            return (
              <div key={subcat.key} style={{ marginBottom: '40px' }}>
                <Title heading={4} style={{ marginBottom: '20px', color: '#1d2129' }}>
                  {subcat.name}
                  <div style={{ 
                    width: '40px', 
                    height: '3px', 
                    backgroundColor: currentCategory?.color, 
                    marginTop: '8px' 
                  }} />
                </Title>
                <Row gutter={[24, 24]}>
                  {subcatApps.map(app => (
                    <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        className="app-card"
                        hoverable
                        style={{ 
                          height: '220px',
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                        bodyStyle={{ 
                          padding: '24px', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'space-between',
                          height: '100%',
                          position: 'relative'
                        }}
                      >
                        <StatusTag status={app.status} />
                        {/* 背景装饰 */}
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          background: `linear-gradient(135deg, ${currentCategory?.color}20, ${currentCategory?.color}10)`,
                          borderRadius: '50%',
                          zIndex: 0
                        }} />
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div style={{ 
                            marginBottom: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between' 
                          }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '12px',
                              background: `linear-gradient(135deg, ${currentCategory?.color}15, ${currentCategory?.color}25)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <FontAwesomeIcon 
                                icon={app.icon} 
                                size="lg" 
                                style={{ color: currentCategory?.color }} 
                              />
                            </div>
                            <div>
                            </div>
                          </div>
                          <Title heading={6} style={{ 
                            margin: '0 0 8px 0', 
                            fontWeight: '600',
                            color: '#1a1a1a'
                          }}>
                            {app.name}
                          </Title>
                          <Text style={{ 
                            fontSize: '13px', 
                            color: '#666666', 
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden'
                          }}>
                            {app.description}
                          </Text>
                        </div>
                        
                        <Button 
                          type={app.status === 'approved' ? 'primary' : 'outline'}
                          size="small"
                          long
                          onClick={() => handleAppAction(app)}
                          disabled={app.status === 'disabled'}
                          style={{
                            height: '36px',
                            fontWeight: '500',
                            border: app.status === 'approved' ? 'none' : `1px solid ${currentCategory?.color}`,
                            background: app.status === 'approved' 
                              ? `linear-gradient(135deg, ${currentCategory?.color}, ${currentCategory?.color}dd)`
                              : 'transparent',
                            color: app.status === 'approved' ? 'white' : currentCategory?.color,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            opacity: app.status === 'disabled' ? 0.5 : 1
                          }}
                        >
                          {app.status === 'approved' ? '进入应用' : 
                           app.status === 'pending' ? '审核中' :
                           app.status === 'rejected' ? '已拒绝' :
                           app.status === 'disabled' ? '已禁用' : '申请开通'}
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            );
          })}
        </div>
      )}

      {/* 自定义样式 */}
      <style>{`
        .arco-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease;
        }
      `}</style>

      {/* 弹窗组件 */}
      <AgreementModal
        visible={agreementModalVisible}
        onClose={() => setAgreementModalVisible(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
      />
      
      <RejectionModal
        visible={rejectionModalVisible}
        onClose={() => setRejectionModalVisible(false)}
        rejectionReason={selectedApp?.rejectionReason || ''}
        appName={selectedApp?.name || ''}
        onReupload={handleReupload}
      />
    </div>
  );
};

export default ApplicationCenter;