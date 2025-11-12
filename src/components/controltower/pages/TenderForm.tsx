import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Steps,
  Form,
  Input,
  Select,
  Cascader,
  DatePicker,
  Upload,
  Message,
  Typography,
  Radio,
  InputNumber,
  Grid,
  Modal,
  Switch,
  Tooltip
} from '@arco-design/web-react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  IconPlus,
  IconCopy,
  IconUpload,
  IconLeft,
  IconDelete
} from '@arco-design/web-react/icon';
import SaasPageWrapper from './SaasPageWrapper';

const { Title } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;

const { Row, Col } = Grid;

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
 * 箱型枚举
 */
type ContainerType = '20GP' | '40GP' | '40HC' | '40HQ' | '45HQ' | '20NOR' | '40NOR' | '20RF' | '40RF' | '20OT' | '40OT';

/**
 * 航线枚举
 */
const ROUTES = [
  '南非',
  '欧洲',
  '中东',
  '东南亚',
  '北美',
  '南美',
  '澳洲',
  '日韩',
  '地中海',
  '印巴'
];

/**
 * 国家枚举
 */
const COUNTRIES = [
  '中国',
  '美国',
  '德国',
  '英国',
  '法国',
  '意大利',
  '西班牙',
  '荷兰',
  '比利时',
  '南非',
  '阿联酋',
  '沙特阿拉伯',
  '新加坡',
  '马来西亚',
  '泰国',
  '越南',
  '印度',
  '巴基斯坦',
  '日本',
  '韩国',
  '澳大利亚'
];

/**
 * 港口枚举
 */
const PORTS = [
  'Nansha-南沙',
  'Shenzhen-深圳',
  'Shanghai-上海',
  'Ningbo-宁波',
  'Qingdao-青岛',
  'Tianjin-天津',
  'Xiamen-厦门',
  'Hamburg-汉堡',
  'Rotterdam-鹿特丹',
  'Antwerp-安特卫普',
  'Le Havre-勒阿弗尔',
  'Felixstowe-费利克斯托',
  'Valencia-瓦伦西亚',
  'Durban-德班',
  'Cape Town-开普敦',
  'Jebel Ali-杰贝阿里',
  'Singapore-新加坡',
  'Port Klang-巴生港',
  'Bangkok-曼谷',
  'Ho Chi Minh-胡志明',
  'Mumbai-孟买',
  'Karachi-卡拉奇',
  'Tokyo-东京',
  'Busan-釜山',
  'Sydney-悉尼',
  'Melbourne-墨尔本'
];

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
 * 箱型组合配置接口（箱型、箱量、最高限价、最低限价为一组）
 */
interface ContainerTypeConfig {
  id: string;
  containerType: ContainerType;
  quantity: number;
  maxPrice: number;
  minPrice: number;
}

/**
 * 公共配置接口（其他字段作为公共配置）
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
 * 线路信息接口
 */
interface RouteInfo {
  id: string;
  route: string; // 航线
  originCountry: string; // 起运国
  originPort: string; // 起运港
  destinationCountry: string; // 目的国
  destinationPort: string; // 目的港
  department: string[]; // 申请部门（级联选择器返回数组）
  applicant: string; // 申请人
  containerTypes: ContainerTypeConfig[]; // 箱型配置
  frozen: boolean; // 是否冻结
}

/**
 * 标的物信息（新版）
 */
interface SubjectInfo {
  commonConfig: CommonConfig; // 公共配置
  routes: RouteInfo[]; // 线路信息列表
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
 * 完整的表单数据
 */
interface TenderFormData {
  basicInfo: BasicInfo;
  subjectInfo: SubjectInfo;
  methodInfo: TenderMethodInfo;
}

/**
 * 生成招标编号
 * 生成格式：TB + 4位大写字母 + 6位数字
 * 例如：TBABCD123456
 */
const generateTenderCode = (): string => {
  // 生成4位随机大写字母
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomLetters = '';
  for (let i = 0; i < 4; i++) {
    randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // 生成6位随机数字
  const randomNumbers = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `TB${randomLetters}${randomNumbers}`;
};

/**
 * 生成邀请链接
 */
const generateInviteLink = (supplierId: string): string => {
  return `https://tender.example.com/invite/${supplierId}?token=${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 招标表单组件
 */

/**
 * 部门级联数据结构
 */
const DEPARTMENTS = [
  {
    label: '运营部',
    value: '运营部',
    children: [
      { label: '海运运营部', value: '海运运营部' },
      { label: '空运运营部', value: '空运运营部' },
      { label: '陆运运营部', value: '陆运运营部' },
      { label: '仓储运营部', value: '仓储运营部' }
    ]
  },
  {
    label: '销售部',
    value: '销售部',
    children: [
      { label: '国内销售部', value: '国内销售部' },
      { label: '国际销售部', value: '国际销售部' },
      { label: '大客户销售部', value: '大客户销售部' },
      { label: '渠道销售部', value: '渠道销售部' }
    ]
  },
  {
    label: '技术部',
    value: '技术部',
    children: [
      { label: '产品研发部', value: '产品研发部' },
      { label: '系统运维部', value: '系统运维部' },
      { label: '数据分析部', value: '数据分析部' },
      { label: '技术支持部', value: '技术支持部' }
    ]
  },
  {
    label: '财务部',
    value: '财务部',
    children: [
      { label: '会计核算部', value: '会计核算部' },
      { label: '成本控制部', value: '成本控制部' },
      { label: '资金管理部', value: '资金管理部' },
      { label: '税务筹划部', value: '税务筹划部' }
    ]
  },
  {
    label: '人力资源部',
    value: '人力资源部',
    children: [
      { label: '招聘培训部', value: '招聘培训部' },
      { label: '薪酬福利部', value: '薪酬福利部' },
      { label: '绩效管理部', value: '绩效管理部' },
      { label: '员工关系部', value: '员工关系部' }
    ]
  }
];

/**
 * 申请人枚举数据
 */
const APPLICANTS = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '钱七',
  '孙八',
  '周九',
  '吴十',
  '郑十一',
  '王十二',
  '冯十三',
  '陈十四',
  '褚十五',
  '卫十六',
  '蒋十七',
  '沈十八',
  '韩十九',
  '杨二十'
];

/**
 * 供应商列表 - 包含船公司和货代公司
 */
const SUPPLIERS = [
  // 船公司
  'COSCO SHIPPING 中远海运',
  'EVERGREEN 长荣海运',
  'CMA CGM 达飞轮船',
  'MSC 地中海航运',
  'MAERSK 马士基',
  'HAPAG-LLOYD 赫伯罗特',
  'ONE 海洋网联船务',
  'YANG MING 阳明海运',
  'HMM 现代商船',
  'PIL 太平船务',
  'OOCL 东方海外',
  'APL 美国总统轮船',
  'ZIM 以星综合航运',
  'WAN HAI 万海航运',
  'HYUNDAI 现代商船',
  
  // 货代公司
  'DHL Global Forwarding',
  'Kuehne + Nagel 德迅',
  'DB Schenker 德铁信可',
  'DSV Panalpina',
  'GEODIS 捷递',
  'Expeditors 康捷空',
  'CEVA Logistics',
  'Pantos Logistics 泛亚班拿',
  'Sinotrans 中外运',
  'COSCO Logistics 中远海运物流',
  'Kerry Logistics 嘉里物流',
  'Nippon Express 日本通运',
  'Yusen Logistics 郵船物流',
  'CJ Logistics 希杰物流',
  'Agility 敏捷物流',
  'Bollore Logistics 博洛雷物流',
  'Rhenus Logistics 莱茵物流',
  'DACHSER 德莎',
  'UPS Supply Chain Solutions',
  'FedEx Trade Networks'
];

/**
 * 供应商历史表现数据接口
 */
interface SupplierPerformance {
  /** 历史运量 (TEU) */
  historicalVolume: number;
  /** 准班率 (%) */
  onTimeRate: number;
  /** 帅规律 (%) */
  complianceRate: number;
}

/**
 * 供应商历史表现mock数据
 */
const SUPPLIER_PERFORMANCE: Record<string, SupplierPerformance> = {
  'COSCO SHIPPING 中远海运': {
    historicalVolume: 125000,
    onTimeRate: 94.5,
    complianceRate: 98.2
  },
  'EVERGREEN 长荣海运': {
    historicalVolume: 98000,
    onTimeRate: 92.8,
    complianceRate: 96.7
  },
  'CMA CGM 达飞轮船': {
    historicalVolume: 87000,
    onTimeRate: 91.2,
    complianceRate: 95.4
  },
  'MSC 地中海航运': {
    historicalVolume: 110000,
    onTimeRate: 93.6,
    complianceRate: 97.1
  },
  'MAERSK 马士基': {
    historicalVolume: 135000,
    onTimeRate: 95.2,
    complianceRate: 98.8
  },
  'HAPAG-LLOYD 赫伯罗特': {
    historicalVolume: 76000,
    onTimeRate: 90.4,
    complianceRate: 94.9
  },
  'ONE 海洋网联船务': {
    historicalVolume: 65000,
    onTimeRate: 89.7,
    complianceRate: 93.5
  },
  'YANG MING 阳明海运': {
    historicalVolume: 54000,
    onTimeRate: 88.9,
    complianceRate: 92.8
  },
  'HMM 现代商船': {
    historicalVolume: 48000,
    onTimeRate: 87.3,
    complianceRate: 91.6
  },
  'PIL 太平船务': {
    historicalVolume: 32000,
    onTimeRate: 85.6,
    complianceRate: 90.2
  },
  'OOCL 东方海外': {
    historicalVolume: 72000,
    onTimeRate: 91.8,
    complianceRate: 95.7
  },
  'APL 美国总统轮船': {
    historicalVolume: 58000,
    onTimeRate: 89.4,
    complianceRate: 93.1
  },
  'ZIM 以星综合航运': {
    historicalVolume: 41000,
    onTimeRate: 86.7,
    complianceRate: 91.3
  },
  'WAN HAI 万海航运': {
    historicalVolume: 28000,
    onTimeRate: 84.2,
    complianceRate: 89.5
  },
  'HYUNDAI 现代商船': {
    historicalVolume: 45000,
    onTimeRate: 87.9,
    complianceRate: 92.4
  },
  // 货代公司数据
  'DHL Global Forwarding': {
    historicalVolume: 85000,
    onTimeRate: 93.2,
    complianceRate: 96.8
  },
  'Kuehne + Nagel 德迅': {
    historicalVolume: 92000,
    onTimeRate: 94.1,
    complianceRate: 97.5
  },
  'DB Schenker 德铁信可': {
    historicalVolume: 78000,
    onTimeRate: 92.6,
    complianceRate: 96.2
  },
  'DSV Panalpina': {
    historicalVolume: 71000,
    onTimeRate: 91.8,
    complianceRate: 95.6
  },
  'GEODIS 捷递': {
    historicalVolume: 64000,
    onTimeRate: 90.9,
    complianceRate: 94.8
  },
  'Expeditors 康捷空': {
    historicalVolume: 59000,
    onTimeRate: 90.2,
    complianceRate: 94.1
  },
  'CEVA Logistics': {
    historicalVolume: 52000,
    onTimeRate: 89.5,
    complianceRate: 93.4
  },
  'Pantos Logistics 泛亚班拿': {
    historicalVolume: 46000,
    onTimeRate: 88.7,
    complianceRate: 92.6
  },
  'Sinotrans 中外运': {
    historicalVolume: 88000,
    onTimeRate: 93.8,
    complianceRate: 97.2
  },
  'COSCO Logistics 中远海运物流': {
    historicalVolume: 95000,
    onTimeRate: 94.6,
    complianceRate: 97.9
  },
  'Kerry Logistics 嘉里物流': {
    historicalVolume: 67000,
    onTimeRate: 91.4,
    complianceRate: 95.3
  },
  'Nippon Express 日本通运': {
    historicalVolume: 73000,
    onTimeRate: 92.1,
    complianceRate: 95.8
  },
  'Yusen Logistics 郵船物流': {
    historicalVolume: 61000,
    onTimeRate: 90.6,
    complianceRate: 94.5
  },
  'CJ Logistics 希杰物流': {
    historicalVolume: 55000,
    onTimeRate: 89.8,
    complianceRate: 93.7
  },
  'Agility 敏捷物流': {
    historicalVolume: 49000,
    onTimeRate: 88.9,
    complianceRate: 92.9
  },
  'Bollore Logistics 博洛雷物流': {
    historicalVolume: 43000,
    onTimeRate: 87.6,
    complianceRate: 91.8
  },
  'Rhenus Logistics 莱茵物流': {
    historicalVolume: 38000,
    onTimeRate: 86.4,
    complianceRate: 90.7
  },
  'DACHSER 德莎': {
    historicalVolume: 35000,
    onTimeRate: 85.8,
    complianceRate: 90.1
  },
  'UPS Supply Chain Solutions': {
    historicalVolume: 69000,
    onTimeRate: 91.7,
    complianceRate: 95.4
  },
  'FedEx Trade Networks': {
    historicalVolume: 63000,
    onTimeRate: 90.8,
    complianceRate: 94.6
  }
};

const containerTypes: ContainerType[] = ['20GP', '40GP', '40HC', '40HQ', '45HQ', '20NOR', '40NOR', '20RF', '40RF', '20OT', '40OT'];

const TenderForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tenderId } = useParams<{ tenderId: string }>();
  const isEdit = !!tenderId; // 如果有tenderId参数，说明是编辑模式
  const tenderType = searchParams.get('type') as TenderType || 'annual';

  // 当前步骤
  const [currentStep, setCurrentStep] = useState(0);
  
  // 表单实例
  const [basicForm] = Form.useForm();

  const [subjectForm] = Form.useForm();
  const [methodForm] = Form.useForm();

  // 箱型选择弹窗状态
  const [showContainerModal, setShowContainerModal] = useState<string | null>(null);

  // 表单数据
  const [formData, setFormData] = useState<TenderFormData>({
    basicInfo: {
      tenderCode: generateTenderCode(),
      title: '',
      tenderCompany: '广东奥马冰箱有限公司',
      tenderType: tenderType,
      biddingMethod: 'public',
      startTime: '',
      endTime: '',
      remark: '',
      attachments: []
    },
    subjectInfo: {
      commonConfig: {
        maxBidCount: 0,
        minBidCount: 0,
        winningBidCount: 0,
        contractStartDate: '',
        contractEndDate: '',
        remark: ''
      },
      routes: [{
        id: '1',
        route: '',
        originCountry: '中国',
        originPort: 'Nansha-南沙',
        destinationCountry: '',
        destinationPort: '',
        department: [],
        applicant: '',
        containerTypes: [{
          id: '1',
          containerType: '40HC',
          quantity: 0,
          maxPrice: 0,
          minPrice: 0
        }],
        frozen: false
      }]
    },
    methodInfo: {
      method: 'open',
      suppliers: []
    }
  });

  /**
   * 编辑模式的mock数据
   */
  const getMockEditData = (): TenderFormData => {
    return {
      basicInfo: {
        tenderCode: 'TND-2024-001',
        title: '2024年度欧洲航线海运招标',
        tenderCompany: '广东奥马冰箱有限公司',
        tenderType: 'annual',
        biddingMethod: 'public',
        startTime: '2024-01-15 09:00:00',
        endTime: '2024-02-15 18:00:00',
        remark: '本次招标为年度招标，请各供应商认真准备投标文件。',
        attachments: [
          {
            uid: '1',
            name: '招标文件.pdf',
            status: 'done',
            url: '/files/tender-doc.pdf'
          }
        ]
      },
      subjectInfo: {
        commonConfig: {
          maxBidCount: 5,
          minBidCount: 2,
          winningBidCount: 2,
          contractStartDate: '2024-03-01',
          contractEndDate: '2024-12-31',
          remark: '合同期内价格保持稳定，如有调整需提前30天通知。'
        },
        routes: [
          {
            id: '1',
            route: '欧洲',
            originCountry: '中国',
            originPort: 'Nansha-南沙',
            destinationCountry: '德国',
            destinationPort: 'Hamburg-汉堡',
            department: ['运营部', '海运运营部'],
            applicant: '张三',
            containerTypes: [
              {
                id: '1',
                containerType: '40HC',
                quantity: 1000,
                maxPrice: 2500,
                minPrice: 2000
              },
              {
                id: '2',
                containerType: '20GP',
                quantity: 500,
                maxPrice: 1500,
                minPrice: 1200
              }
            ],
            frozen: false
          },
          {
            id: '2',
            route: '欧洲',
            originCountry: '中国',
            originPort: 'Shanghai-上海',
            destinationCountry: '荷兰',
            destinationPort: 'Rotterdam-鹿特丹',
            department: ['运营部', '海运运营部'],
            applicant: '李四',
            containerTypes: [
              {
                id: '3',
                containerType: '40HC',
                quantity: 800,
                maxPrice: 2400,
                minPrice: 1900
              }
            ],
            frozen: false
          }
        ]
      },
      methodInfo: {
        method: 'open',
        suppliers: [
          {
            id: '1',
            name: 'MAERSK 马士基',
            email: 'maersk@example.com',
            inviteLink: generateInviteLink('1')
          },
          {
            id: '2',
            name: 'COSCO SHIPPING 中远海运',
            email: 'cosco@example.com',
            inviteLink: generateInviteLink('2')
          },
          {
            id: '3',
            name: 'MSC 地中海航运',
            email: 'msc@example.com',
            inviteLink: generateInviteLink('3')
          }
        ]
      }
    };
  };

  /**
   * 初始化编辑数据
   */
  useEffect(() => {
    if (isEdit && tenderId) {
      // 模拟从API获取招标数据
      console.log('编辑模式，招标ID:', tenderId);
      const mockData = getMockEditData();
      setFormData(mockData);
      
      // 同步到各个表单实例
      basicForm.setFieldsValue(mockData.basicInfo);
      subjectForm.setFieldsValue({
        ...mockData.subjectInfo.commonConfig,
        routes: mockData.subjectInfo.routes
      });
      methodForm.setFieldsValue(mockData.methodInfo);
    }
  }, [isEdit, tenderId, basicForm, subjectForm, methodForm]);

  /**
   * 同步formData到表单实例
   */
  useEffect(() => {
    basicForm.setFieldsValue(formData.basicInfo);
  }, [formData.basicInfo, basicForm]);

  /**
   * 步骤配置
   */
  const steps = [
    {
      title: '基本信息',
      description: '填写招标基本信息'
    },
    {
      title: '标的物',
      description: '配置航线和箱型信息'
    },
    {
      title: '招标方式',
      description: '选择招标方式和供应商'
    }
  ];



  /**
   * 下一步
   */
  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await basicForm.validate();
        const values = basicForm.getFieldsValue();
        setFormData(prev => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, ...values }
        }));
      } else if (currentStep === 1) {
        await subjectForm.validate();
        const values = subjectForm.getFieldsValue();
        setFormData(prev => ({
          ...prev,
          subjectInfo: { ...prev.subjectInfo, ...values }
        }));
      }
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      Message.error('请完善必填信息');
    }
  };

  /**
   * 上一步
   */
  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  /**
   * 保存草稿
   */
  const handleSaveDraft = async () => {
    try {
      // TODO: 调用保存草稿API
      Message.success('保存草稿成功');
      navigate('/controltower/saas/tender');
    } catch (error) {
      Message.error('保存草稿失败');
    }
  };

  /**
   * 发布招标
   */
  const handlePublish = async () => {
    try {
      await methodForm.validate();
      const values = methodForm.getFieldsValue();
      const finalData = {
        ...formData,
        methodInfo: { ...formData.methodInfo, ...values }
      };
      
      // TODO: 调用发布API
      console.log('发布招标数据:', finalData);
      Message.success('发布成功');
      navigate('/controltower/saas/tender');
    } catch (error) {
      Message.error('发布失败，请检查必填信息');
    }
  };

  /**
   * 添加线路
   */
  const addRoute = () => {
    const newRoute: RouteInfo = {
      id: Date.now().toString(),
      route: '',
      originCountry: '中国',
      originPort: 'Nansha-南沙',
      destinationCountry: '',
      destinationPort: '',
      department: [],
      applicant: '',
      containerTypes: [{
        id: Date.now().toString(),
        containerType: '40HQ',
        quantity: 0,
        maxPrice: 0,
        minPrice: 0
      }],
      frozen: false
    };
    
    setFormData(prev => ({
      ...prev,
      subjectInfo: {
        ...prev.subjectInfo,
        routes: [...prev.subjectInfo.routes, newRoute]
      }
    }));
  };

  /**
   * 删除线路
   */
  const removeRoute = (routeId: string) => {
    setFormData(prev => ({
      ...prev,
      subjectInfo: {
        ...prev.subjectInfo,
        routes: prev.subjectInfo.routes.filter(route => route.id !== routeId)
      }
    }));
  };

  /**
   * 更新线路信息
   */
  const updateRoute = (routeId: string, updates: Partial<RouteInfo>) => {
    setFormData(prev => ({
      ...prev,
      subjectInfo: {
        ...prev.subjectInfo,
        routes: prev.subjectInfo.routes.map(route => 
          route.id === routeId ? { ...route, ...updates } : route
        )
      }
    }));
  };



  /**
   * 更新线路中的箱型配置
   */
  const updateContainerTypeInRoute = (routeId: string, configId: string, updates: Partial<ContainerTypeConfig>) => {
    setFormData(prev => ({
      ...prev,
      subjectInfo: {
        ...prev.subjectInfo,
        routes: prev.subjectInfo.routes.map(route => 
          route.id === routeId 
            ? { 
                ...route, 
                containerTypes: route.containerTypes.map(config => 
                  config.id === configId ? { ...config, ...updates } : config
                )
              }
            : route
        )
      }
    }));
  };

  /**
   * 更新箱型配置（别名函数）
   */
  const updateContainerConfig = updateContainerTypeInRoute;

  /**
   * 处理箱型开关切换
   */
  const handleContainerToggle = (containerType: ContainerType, enabled: boolean) => {
    if (showContainerModal) {
      setFormData(prev => ({
        ...prev,
        subjectInfo: {
          ...prev.subjectInfo,
          routes: prev.subjectInfo.routes.map(route => {
            if (route.id === showContainerModal) {
              if (enabled) {
                // 添加箱型配置
                const newConfig: ContainerTypeConfig = {
                  id: Date.now().toString(),
                  containerType,
                  quantity: 0,
                  maxPrice: 0,
                  minPrice: 0
                };
                return { ...route, containerTypes: [...route.containerTypes, newConfig] };
              } else {
                // 移除箱型配置
                return { 
                  ...route, 
                  containerTypes: route.containerTypes.filter(ct => ct.containerType !== containerType) 
                };
              }
            }
            return route;
          })
        }
      }));
    }
  };

  /**
   * 检查箱型是否已启用
   */
  const isContainerTypeEnabled = (containerType: ContainerType): boolean => {
    if (!showContainerModal) return false;
    const route = formData.subjectInfo.routes.find(r => r.id === showContainerModal);
    return route ? route.containerTypes.some(ct => ct.containerType === containerType) : false;
  };

  /**
   * 更新公共配置
   */
  const updateCommonConfig = (field: keyof CommonConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      subjectInfo: {
        ...prev.subjectInfo,
        commonConfig: {
          ...prev.subjectInfo.commonConfig,
          [field]: value
        }
      }
    }));
  };

  /**
   * 添加供应商
   */
  const addSupplier = () => {
    const newSupplier: SupplierInfo = {
      id: Date.now().toString(),
      name: '',
      email: '',
      inviteLink: generateInviteLink(Date.now().toString())
    };
    
    setFormData(prev => ({
      ...prev,
      methodInfo: {
        ...prev.methodInfo,
        suppliers: [...prev.methodInfo.suppliers, newSupplier]
      }
    }));
  };

  /**
   * 删除供应商
   */
  const removeSupplier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      methodInfo: {
        ...prev.methodInfo,
        suppliers: prev.methodInfo.suppliers.filter((_, i) => i !== index)
      }
    }));
  };

  /**
   * 更新供应商信息
   */
  const updateSupplier = (index: number, field: keyof SupplierInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      methodInfo: {
        ...prev.methodInfo,
        suppliers: prev.methodInfo.suppliers.map((supplier, i) => {
          if (i === index) {
            const updated = { ...supplier, [field]: value };
            // 当邮箱或名称变化时，重新生成邀请链接
            if (field === 'email' || field === 'name') {
              updated.inviteLink = generateInviteLink(supplier.id);
            }
            return updated;
          }
          return supplier;
        })
      }
    }));
  };

  /**
   * 复制邀请链接
   */
  const copyInviteLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      Message.success('邀请链接已复制到剪贴板');
    } catch (error) {
      Message.error('复制失败，请手动复制');
    }
  };

  /**
   * 返回列表
   */
  const handleBack = () => {
    navigate('/controltower/saas/tender');
  };

  return (
    <SaasPageWrapper>
      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                type="text"
                icon={<IconLeft />}
                onClick={handleBack}
              >
                返回
              </Button>
              <Title heading={4} className="!mb-0">
                {isEdit ? '编辑招标' : '新增海运招标'}
              </Title>
            </div>
          </div>
          
          <Steps current={currentStep} className="mb-8">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
              />
            ))}
          </Steps>
        </div>

        {/* 步骤内容区域 */}
        <div className="min-h-96">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">基本信息</h3>
              
              <Form form={basicForm} layout="vertical" className="space-y-4">
                <Row gutter={16}>
                  <Col span={12}>
                    {/* 招标编号 */}
                    <Form.Item 
                      label="招标编号" 
                      field="tenderCode"
                      rules={[{ required: true, message: '招标编号不能为空' }]}
                    >
                      <Input 
                        placeholder="自动生成" 
                        disabled 
                        style={{ backgroundColor: '#f5f5f5' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 标题 */}
                    <Form.Item 
                      label="标题" 
                      field="title"
                      rules={[{ required: true, message: '请输入招标标题' }]}
                    >
                      <Input 
                        placeholder="请输入招标标题"
                        value={formData.basicInfo.title}
                        onChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          basicInfo: { ...prev.basicInfo, title: value }
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* 招标单位 */}
                    <Form.Item 
                      label="招标单位" 
                      field="tenderCompany"
                      rules={[{ required: true, message: '请选择招标单位' }]}
                    >
                      <Select 
                        placeholder="请选择招标单位"
                        value={formData.basicInfo.tenderCompany}
                        onChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          basicInfo: { ...prev.basicInfo, tenderCompany: value }
                        }))}
                      >
                        <Option value="广东奥马冰箱有限公司">广东奥马冰箱有限公司</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 招标类型 */}
                    <Form.Item 
                      label="招标类型" 
                      field="tenderType"
                      rules={[{ required: true, message: '请选择招标类型' }]}
                    >
                      <Select 
                        placeholder="请选择招标类型"
                        value={formData.basicInfo.tenderType}
                        onChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          basicInfo: { ...prev.basicInfo, tenderType: value as TenderType }
                        }))}
                      >
                        <Option value="annual">年度招标</Option>
                        <Option value="semiannual">半年度招标</Option>
                        <Option value="shortterm">短期招标</Option>
                        <Option value="single">单票招标</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* 开标方式 */}
                    <Form.Item 
                      label="开标方式" 
                      field="biddingMethod"
                      rules={[{ required: true, message: '请选择开标方式' }]}
                    >
                      <Select 
                        placeholder="请选择开标方式"
                        value={formData.basicInfo.biddingMethod}
                        onChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          basicInfo: { ...prev.basicInfo, biddingMethod: value as BiddingMethod }
                        }))}
                      >
                        <Option value="internal">内部开标</Option>
                        <Option value="public">公开开标</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 开始时间 */}
                    <Form.Item 
                      label="开始时间" 
                      field="startTime"
                      rules={[{ required: true, message: '请选择开始时间' }]}
                    >
                      <DatePicker 
                        showTime
                        placeholder="请选择开始时间"
                        value={formData.basicInfo.startTime}
                        onChange={(dateString) => setFormData(prev => ({ 
                          ...prev, 
                          basicInfo: { ...prev.basicInfo, startTime: dateString }
                        }))}
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* 结束时间 */}
                    <Form.Item 
                      label="结束时间" 
                      field="endTime"
                      rules={[
                        { required: true, message: '请选择结束时间' },
                        {
                          validator: (value, callback) => {
                            if (value && formData.basicInfo.startTime && new Date(value) <= new Date(formData.basicInfo.startTime)) {
                              callback('结束时间必须晚于开始时间');
                            } else {
                              callback();
                            }
                          }
                        }
                      ]}
                    >
                      <DatePicker 
                        showTime
                        placeholder="请选择结束时间"
                        value={formData.basicInfo.endTime}
                        onChange={(dateString) => setFormData(prev => ({ 
                          ...prev, 
                          basicInfo: { ...prev.basicInfo, endTime: dateString }
                        }))}
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 空列，保持对齐 */}
                  </Col>
                </Row>

                {/* 备注说明 */}
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item 
                      label="备注说明" 
                      field="remark"
                    >
                      <TextArea 
                        placeholder="请输入备注说明"
                        value={formData.basicInfo.remark}
                        onChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          basicInfo: { ...prev.basicInfo, remark: value }
                        }))}
                        rows={4}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* 招标附件 */}
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item 
                       label="招标附件" 
                       field="attachments"
                     >
                       <Upload 
                          multiple
                          drag
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          fileList={formData.basicInfo.attachments}
                          onChange={(fileList) => setFormData(prev => ({ 
                            ...prev, 
                            basicInfo: { ...prev.basicInfo, attachments: fileList }
                          }))}
                          onProgress={(file, e) => {
                            console.log('上传进度:', file.name, e?.loaded || 0);
                          }}
                       >
                        <div className="text-center py-8">
                          <IconUpload className="text-4xl text-gray-400 mb-2" />
                          <div className="text-gray-600">点击或拖拽文件到此区域上传</div>
                          <div className="text-gray-400 text-sm mt-1">
                            支持 PDF、Word、Excel、图片格式，单个文件不超过 10MB
                          </div>
                        </div>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          )}
          
          {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">标的物填写</h3>
                
                <Form form={subjectForm} layout="vertical" className="space-y-6">
                  {/* 公共配置 */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium mb-4 text-gray-800">公共配置</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {/* 投标数上限 */}
                      <Form.Item 
                        label="投标数上限" 
                        field="maxBidCount"
                        rules={[{ required: true, message: '请输入投标数上限' }]}
                      >
                        <InputNumber 
                          placeholder="请输入投标数上限"
                          value={formData.subjectInfo.commonConfig.maxBidCount}
                          onChange={(value) => updateCommonConfig('maxBidCount', value || 0)}
                          min={1}
                          className="w-full"
                        />
                      </Form.Item>

                      {/* 投标数下限 */}
                      <Form.Item 
                        label="投标数下限" 
                        field="minBidCount"
                      >
                        <InputNumber 
                          placeholder="投标数下限"
                          value={formData.subjectInfo.commonConfig.minBidCount}
                          onChange={(value) => updateCommonConfig('minBidCount', value || 0)}
                          min={0}
                          className="w-full"
                        />
                      </Form.Item>

                      {/* 可中标数 */}
                      <Form.Item 
                        label="可中标数" 
                        field="winningBidCount"
                        rules={[{ required: true, message: '请输入可中标数' }]}
                      >
                        <InputNumber 
                          placeholder="请输入可中标数"
                          value={formData.subjectInfo.commonConfig.winningBidCount}
                          onChange={(value) => updateCommonConfig('winningBidCount', value || 0)}
                          min={1}
                          className="w-full"
                        />
                      </Form.Item>

                      {/* 合同开始日期 */}
                      <Form.Item 
                        label="合同开始日期" 
                        field="contractStartDate"
                        rules={[{ required: true, message: '请选择合同开始日期' }]}
                      >
                        <DatePicker 
                          placeholder="请选择合同开始日期"
                          value={formData.subjectInfo.commonConfig.contractStartDate}
                          onChange={(dateString) => updateCommonConfig('contractStartDate', dateString)}
                          className="w-full"
                        />
                      </Form.Item>

                      {/* 合同结束日期 */}
                      <Form.Item 
                        label="合同结束日期" 
                        field="contractEndDate"
                        rules={[
                          { required: true, message: '请选择合同结束日期' },
                          {
                            validator: (value, callback) => {
                              if (value && formData.subjectInfo.commonConfig.contractStartDate && new Date(value) <= new Date(formData.subjectInfo.commonConfig.contractStartDate)) {
                                callback('合同结束日期必须晚于开始日期');
                              } else {
                                callback();
                              }
                            }
                          }
                        ]}
                      >
                        <DatePicker 
                          placeholder="请选择合同结束日期"
                          value={formData.subjectInfo.commonConfig.contractEndDate}
                          onChange={(dateString) => updateCommonConfig('contractEndDate', dateString)}
                          className="w-full"
                        />
                      </Form.Item>

                      {/* 备注 */}
                      <Form.Item 
                        label="备注" 
                        field="commonRemark"
                      >
                        <TextArea 
                          placeholder="请输入备注"
                          value={formData.subjectInfo.commonConfig.remark}
                          onChange={(value) => updateCommonConfig('remark', value)}
                          rows={2}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {/* 线路信息 */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">线路信息</h4>
                      <Button 
                        type="primary" 
                        onClick={addRoute}
                        icon={<IconPlus />}
                      >
                        增加线路
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-max border-collapse border border-gray-300" style={{ minWidth: '1200px' }}>
                        <thead className="bg-gray-50">
                          {/* 第一行表头 */}
                          <tr>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '60px' }}>序号</th>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '120px' }}>航线</th>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '120px' }}>起运国</th>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '120px' }}>起运港</th>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '120px' }}>目的国</th>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '120px' }}>目的港</th>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '150px' }}>申请部门</th>
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '120px' }}>申请人</th>
                            {/* 动态生成箱型列 */}
                            {formData.subjectInfo.routes.length > 0 && formData.subjectInfo.routes[0].containerTypes.map((containerType) => (
                              <th key={containerType.id} colSpan={3} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '300px' }}>
                                {containerType.containerType}
                              </th>
                            ))}
                            <th rowSpan={2} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '120px' }}>操作</th>
                          </tr>
                          {/* 第二行表头 */}
                          <tr>
                            {/* 为每个箱型生成子列 */}
                            {formData.subjectInfo.routes.length > 0 && formData.subjectInfo.routes[0].containerTypes.map((containerType) => (
                              <React.Fragment key={`sub-${containerType.id}`}>
                                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '100px' }}>数量</th>
                                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '100px' }}>最高限价</th>
                                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300" style={{ minWidth: '100px' }}>最低限价</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.subjectInfo.routes.map((route, index) => (
                            <tr key={route.id} className={route.frozen ? 'bg-gray-100' : ''}>
                              <td className="px-4 py-3 text-sm text-gray-900 text-center border border-gray-300" style={{ minWidth: '60px' }}>{index + 1}</td>
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '120px' }}>
                                <Select
                                  placeholder="请选择航线"
                                  value={route.route}
                                  onChange={(value) => updateRoute(route.id, { route: value })}
                                  disabled={route.frozen}
                                  className="w-full"
                                  mode="multiple"
                                >
                                  {ROUTES.map(routeName => (
                                    <Option key={routeName} value={routeName}>{routeName}</Option>
                                  ))}
                                </Select>
                              </td>
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '120px' }}>
                                <Select
                                  placeholder="请选择起运国"
                                  value={route.originCountry}
                                  onChange={(value) => updateRoute(route.id, { originCountry: value })}
                                  disabled={route.frozen}
                                  className="w-full"
                                  mode="multiple"
                                >
                                  {COUNTRIES.map(country => (
                                    <Option key={country} value={country}>{country}</Option>
                                  ))}
                                </Select>
                              </td>
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '120px' }}>
                                <Select
                                  placeholder="请选择起运港"
                                  value={route.originPort}
                                  onChange={(value) => updateRoute(route.id, { originPort: value })}
                                  disabled={route.frozen}
                                  className="w-full"
                                  mode="multiple"
                                >
                                  {PORTS.map(port => (
                                    <Option key={port} value={port}>{port}</Option>
                                  ))}
                                </Select>
                              </td>
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '120px' }}>
                                <Select
                                  placeholder="请选择目的国"
                                  value={route.destinationCountry}
                                  onChange={(value) => updateRoute(route.id, { destinationCountry: value })}
                                  disabled={route.frozen}
                                  className="w-full"
                                  mode="multiple"
                                >
                                  {COUNTRIES.map(country => (
                                    <Option key={country} value={country}>{country}</Option>
                                  ))}
                                </Select>
                              </td>
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '120px' }}>
                                <Select
                                  placeholder="请选择目的港"
                                  value={route.destinationPort}
                                  onChange={(value) => updateRoute(route.id, { destinationPort: value })}
                                  disabled={route.frozen}
                                  className="w-full"
                                  mode="multiple"
                                >
                                  {PORTS.map(port => (
                                    <Option key={port} value={port}>{port}</Option>
                                  ))}
                                </Select>
                              </td>
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '150px' }}>
                                <Cascader
                                  placeholder="申请部门"
                                  options={DEPARTMENTS}
                                  value={route.department}
                                  onChange={(value) => updateRoute(route.id, { department: value as string[] })}
                                  disabled={route.frozen}
                                  className="w-full"
                                  showSearch
                                />
                              </td>
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '120px' }}>
                                <Select
                                  placeholder="申请人"
                                  value={route.applicant}
                                  onChange={(value) => updateRoute(route.id, { applicant: value })}
                                  disabled={route.frozen}
                                  className="w-full"
                                  showSearch
                                  allowClear
                                >
                                  {APPLICANTS.map(name => (
                                    <Option key={name} value={name}>
                                      {name}
                                    </Option>
                                  ))}
                                </Select>
                              </td>
                              {/* 动态生成箱型数据列 */}
                              {route.containerTypes.map((containerConfig) => (
                                <React.Fragment key={`data-${containerConfig.id}`}>
                                  {/* 数量列 */}
                                  <td className="px-2 py-3 border border-gray-300" style={{ minWidth: '100px' }}>
                                    <InputNumber
                                      placeholder="数量"
                                      value={containerConfig.quantity}
                                      onChange={(value) => updateContainerConfig(route.id, containerConfig.id, { quantity: value || 0 })}
                                      disabled={route.frozen}
                                      className="w-full"
                                      min={0}
                                      step={1}
                                      precision={0}
                                    />
                                  </td>
                                  {/* 最高限价列 */}
                                  <td className="px-2 py-3 border border-gray-300" style={{ minWidth: '100px' }}>
                                    <div className="relative">
                                      <InputNumber
                                        placeholder="最高限价"
                                        value={containerConfig.maxPrice}
                                        onChange={(value) => updateContainerConfig(route.id, containerConfig.id, { maxPrice: value || 0 })}
                                        disabled={route.frozen}
                                        className="w-full"
                                        min={0}
                                        step={0.01}
                                        precision={2}
                                        hideControl={true}
                                      />
                                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">USD</span>
                                    </div>
                                  </td>
                                  {/* 最低限价列 */}
                                  <td className="px-2 py-3 border border-gray-300" style={{ minWidth: '100px' }}>
                                    <div className="relative">
                                      <InputNumber
                                        placeholder="最低限价"
                                        value={containerConfig.minPrice}
                                        onChange={(value) => updateContainerConfig(route.id, containerConfig.id, { minPrice: value || 0 })}
                                        disabled={route.frozen}
                                        className="w-full"
                                        min={0}
                                        step={0.01}
                                        precision={2}
                                        hideControl={true}
                                      />
                                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">USD</span>
                                    </div>
                                  </td>
                                </React.Fragment>
                              ))}
                              <td className="px-4 py-3 border border-gray-300" style={{ minWidth: '120px' }}>
                                <div className="flex space-x-4">
                                  <Button
                                    type="text"
                                    size="small"
                                    onClick={() => removeRoute(route.id)}
                                    disabled={formData.subjectInfo.routes.length <= 1}
                                    icon={<IconDelete />}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    删除
                                  </Button>
                                  <Button
                                    type="text"
                                    size="small"
                                    onClick={() => setShowContainerModal(route.id)}
                                    icon={<IconPlus />}
                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    设置箱型
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>


                  </div>
                </Form>
              </div>
            )}
          
          {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">招标方式选择</h3>
                
                <Form form={methodForm} layout="vertical" className="space-y-4">
                  {/* 招标方式选择 */}
                  <Form.Item 
                    label="招标方式" 
                    field="method"
                    rules={[{ required: true, message: '请选择招标方式' }]}
                  >
                    <Radio.Group 
                      value={formData.methodInfo.method}
                      onChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        methodInfo: { ...prev.methodInfo, method: value }
                      }))}
                    >
                      <Radio value="directed">定向邀约</Radio>
                      <Radio value="open">公开招标</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {/* 定向邀约供应商选择 */}
                  {formData.methodInfo.method === 'directed' && (
                    <Form.Item label="供应商选择">
                      <div className="space-y-4">
                        {formData.methodInfo.suppliers.map((supplier, index) => (
                          <Card key={supplier.id} className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">供应商 {index + 1}</h4>
                              {formData.methodInfo.suppliers.length > 1 && (
                                <Button 
                                  type="text" 
                                  onClick={() => removeSupplier(index)}
                                  icon={<IconDelete />}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  删除
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              <Row gutter={16}>
                                <Col span={12}>
                                  {/* 供应商名称 */}
                                  <Form.Item 
                                    label="供应商名称" 
                                    field={`supplierName_${index}`}
                                    rules={[{ required: true, message: '请选择供应商名称' }]}
                                  >
                                    <Select 
                                      placeholder="请选择供应商名称"
                                      value={supplier.name}
                                      onChange={(value) => updateSupplier(index, 'name', value)}
                                      showSearch
                                      allowClear
                                    >
                                      {SUPPLIERS.map((supplierName) => {
                                        const performance = SUPPLIER_PERFORMANCE[supplierName];
                                        return (
                                          <Option key={supplierName} value={supplierName}>
                                            <div className="flex items-center justify-between w-full">
                                              <span>{supplierName}</span>
                                              {performance && (
                                                <Tooltip
                                                  content={
                                                    <div className="p-2">
                                                      <div className="text-sm font-medium mb-2">历史表现</div>
                                                      <div className="space-y-1 text-xs">
                                                        <div>历史运量: {performance.historicalVolume.toLocaleString()} TEU</div>
                                                        <div>准班率: {performance.onTimeRate}%</div>
                                                        <div>帅规律: {performance.complianceRate}%</div>
                                                      </div>
                                                    </div>
                                                  }
                                                  position="right"
                                                >
                                                  <Button
                                                    type="text"
                                                    size="mini"
                                                    className="text-blue-600 hover:text-blue-800 ml-2"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                    }}
                                                  >
                                                    历史表现
                                                  </Button>
                                                </Tooltip>
                                              )}
                                            </div>
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  {/* 邮箱地址 */}
                                  <Form.Item 
                                    label="邮箱地址" 
                                    field={`supplierEmail_${index}`}
                                    rules={[
                                      { required: true, message: '请输入邮箱地址' },
                                      { type: 'email', message: '请输入有效的邮箱地址' }
                                    ]}
                                  >
                                    <Input 
                                      placeholder="请输入邮箱地址"
                                      value={supplier.email}
                                      onChange={(value) => updateSupplier(index, 'email', value)}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>

                              {/* 邀请链接 */}
                              <Form.Item label="邀请链接">
                                <div className="flex items-center space-x-2">
                                  <Input 
                                    value={supplier.inviteLink}
                                    readOnly
                                    placeholder="邀请链接将自动生成"
                                    className="flex-1"
                                  />
                                  <Button 
                                    type="outline"
                                    icon={<IconCopy />}
                                    onClick={() => copyInviteLink(supplier.inviteLink)}
                                    disabled={!supplier.inviteLink}
                                  >
                                    复制
                                  </Button>
                                </div>
                              </Form.Item>
                            </div>
                          </Card>
                        ))}
                        
                        {/* 添加供应商按钮 */}
                        {formData.methodInfo.suppliers.length < 30 && (
                          <Button 
                            type="dashed" 
                            onClick={addSupplier}
                            className="w-full"
                            icon={<IconPlus />}
                          >
                            添加供应商
                          </Button>
                        )}
                      </div>
                    </Form.Item>
                  )}
                </Form>
              </div>
            )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end pt-6 border-t">
          <div className="flex space-x-4">
            {currentStep > 0 && (
                <Button onClick={handlePrev}>上一步</Button>
              )}
            
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext}>下一步</Button>
            ) : (
              <>
                <Button onClick={handleSaveDraft}>暂存草稿</Button>
                <Button type="primary" onClick={handlePublish}>直接发布</Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* 箱型设置弹窗 */}
      <Modal
        title="设置箱型"
        visible={!!showContainerModal}
        onCancel={() => setShowContainerModal(null)}
        footer={null}
        style={{ width: 600 }}
      >
        <div className="space-y-4">
          {containerTypes.map(type => (
            <div key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium">{type}</span>
              <Switch
                checked={isContainerTypeEnabled(type)}
                onChange={(checked) => handleContainerToggle(type, checked)}
              />
            </div>
          ))}
        </div>
      </Modal>
    </SaasPageWrapper>
  );
};

export default TenderForm;