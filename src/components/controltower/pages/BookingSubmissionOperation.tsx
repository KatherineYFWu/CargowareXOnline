import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Form, 
  Input, 
  Select, 
  Upload,
  Checkbox,
  Divider,
  Grid,
  Message,
  Radio
} from '@arco-design/web-react';
import { IconLeft, IconPlus, IconMinus, IconUpload } from '@arco-design/web-react/icon';
import ConfirmModal from '../../common/ConfirmModal';
import Tooltip from '../../common/Tooltip';
import AIRecognitionLoader from '../../common/AIRecognitionLoader';
import RateDetailDrawer from '../../controltower-client/common/RateDetailDrawer';

const { Title, Text } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface BookingSubmissionProps {}

// 容器类型定义
type ContainerType = '20GP' | '40GP' | '40HQ' | '40NOR';
type ContainerCounts = Record<ContainerType, number>;

/**
 * 提交订舱页面组件
 * 用于处理客户端控制塔的订舱申请功能
 */
const BookingSubmission: React.FC<BookingSubmissionProps> = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [form] = Form.useForm();
  
  // 箱型数量状态
  const [containerCounts, setContainerCounts] = useState<ContainerCounts>({
    '20GP': 0,
    '40GP': 0,
    '40HQ': 1,
    '40NOR': 0
  });
  
  // 复选框状态管理
  const [isToOrder, setIsToOrder] = useState(false);
  const [isSameAsConsignee, setIsSameAsConsignee] = useState(false);
  
  // 货物类型状态管理
  const [cargoType, setCargoType] = useState('普货');
  const [showCargoTypeDropdown, setShowCargoTypeDropdown] = useState(false);
  
  // 船名航次状态管理
  const [vesselVoyage, setVesselVoyage] = useState('ILAN MAERSK / 536W');
  const [showVesselVoyageDropdown, setShowVesselVoyageDropdown] = useState(false);
  
  // 货物类型选项
  const cargoTypeOptions = [
    { label: '普货', value: '普货' },
    { label: '危险品', value: '危险品' },
    { label: '冷冻品', value: '冷冻品' },
    { label: '特种箱', value: '特种箱' },
    { label: '卷钢', value: '卷钢' },
    { label: '液体', value: '液体' },
    { label: '化工品', value: '化工品' },
    { label: '纺织品', value: '纺织品' }
  ];
  
  // 船名航次选项
  const vesselVoyageOptions = [
    { label: 'ILAN MAERSK / 536W', value: 'ILAN MAERSK / 536W' },
    { label: 'COSCO SHIPPING UNIVERSE / 2401E', value: 'COSCO SHIPPING UNIVERSE / 2401E' },
    { label: 'EVER GIVEN / 0224E', value: 'EVER GIVEN / 0224E' },
    { label: 'MSC GULSUN / 2401W', value: 'MSC GULSUN / 2401W' },
    { label: 'CMA CGM MARCO POLO / 2401N', value: 'CMA CGM MARCO POLO / 2401N' },
    { label: 'HAPAG LLOYD BERLIN EXPRESS / 2401S', value: 'HAPAG LLOYD BERLIN EXPRESS / 2401S' }
  ];
  
  // 运价备注展开缩起状态
  const [isFreightExpanded, setIsFreightExpanded] = useState(false);
  
  // 确认弹窗状态管理
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingContainerChange, setPendingContainerChange] = useState<{
    type: string;
    action: 'increase' | 'decrease';
    increment: boolean;
  } | null>(null);
  
  // 费用明细抽屉状态管理
  const [rateDetailVisible, setRateDetailVisible] = useState(false);
  const [hasConfirmedChange, setHasConfirmedChange] = useState(false);
  
  // 订舱确认弹窗状态管理
  const [showBookingConfirmModal, setShowBookingConfirmModal] = useState(false);
  
  // AI识别状态管理
  const [isAIRecognizing, setIsAIRecognizing] = useState(false);
  const [aiRecognitionSuccess, setAiRecognitionSuccess] = useState(false);
  const [recognitionProgress, setRecognitionProgress] = useState(0);

  /**
   * 返回订单详情页面
   */
  const handleGoBack = () => {
    navigate(`/controltower-client/order-detail/${orderId}`);
  };

  /**
   * 更新箱型数量
   */
  const updateContainerCount = (type: string, increment: boolean) => {
    // 如果是第一次修改箱型，显示确认弹窗
    if (!hasConfirmedChange) {
      setPendingContainerChange({ type, action: increment ? 'increase' : 'decrease', increment });
      setShowConfirmModal(true);
      return;
    }
    
    // 执行箱型数量更新
    setContainerCounts(prev => ({
      ...prev,
      [type as ContainerType]: Math.max(0, prev[type as ContainerType] + (increment ? 1 : -1))
    }));
  };
  
  /**
   * 确认修改箱型
   */
  const handleConfirmChange = () => {
    if (pendingContainerChange) {
      const { type, increment } = pendingContainerChange;
      setContainerCounts(prev => ({
        ...prev,
        [type as ContainerType]: Math.max(0, prev[type as ContainerType] + (increment ? 1 : -1))
      }));
      setHasConfirmedChange(true);
    }
    setShowConfirmModal(false);
    setPendingContainerChange(null);
  };
  
  /**
   * 取消修改箱型
   */
  const handleCancelChange = () => {
    setShowConfirmModal(false);
    setPendingContainerChange(null);
  };

  /**
   * 处理立即订舱按钮点击
   */
  const handleBookingClick = () => {
    setShowBookingConfirmModal(true);
  };

  /**
   * 确认提交订舱
   */
  const handleConfirmBooking = () => {
    console.log('handleConfirmBooking 函数被调用');
    // 获取表单数据
    form.validate().then((values) => {
      console.log('订舱数据:', values);
      console.log('准备显示成功消息');
      Message.success('提交成功');
      console.log('成功消息已调用');
      setShowBookingConfirmModal(false);
      // 跳转到订单详情页面
      setTimeout(() => {
        navigate(`/controltower-client/order-detail/${orderId}`);
      }, 1500);
    }).catch((error) => {
      console.log('表单验证失败:', error);
      Message.error('请完善必填信息');
      setShowBookingConfirmModal(false);
    });
  };

  /**
   * 取消订舱确认
   */
  const handleCancelBooking = () => {
    setShowBookingConfirmModal(false);
  };

  /**
   * 处理暂存按钮点击
   */
  const handleSaveDraft = () => {
    console.log('暂存按钮被点击');
    Message.success('暂存成功');
  };

  /**
   * 处理表单提交（保留原有逻辑）
   */
  const handleSubmit = (values: any) => {
    console.log('表单数据:', values);
    Message.success('订舱申请已提交');
  };

  /**
   * 处理货物类型更换
   */
  const handleCargoTypeChange = (value: string) => {
    setCargoType(value);
    setShowCargoTypeDropdown(false);
  };
  
  /**
   * 处理船名航次更换
   */
  const handleVesselVoyageChange = (value: string) => {
    setVesselVoyage(value);
    setShowVesselVoyageDropdown(false);
  };
  
  /**
   * 处理查看明细点击事件
   */
  const handleViewRateDetail = () => {
    setRateDetailVisible(true);
  };
  
  /**
   * 关闭费用明细抽屉
   */
  const handleCloseRateDetail = () => {
    setRateDetailVisible(false);
  };
  
  // 模拟费用明细数据
  const mockRateData = {
    // 按箱型计费 - 海运费
    containerRateList: [
      {
        key: '1',
        feeName: 'Ocean Freight',
        currency: 'USD',
        '20gp': '1200',
        '40gp': '2400',
        '40hc': '2450',
        '40nor': '2400',
        specialNote: 'Basic ocean freight rate'
      }
    ],
    // 按箱型计费 - 附加费
    containerSurchargeList: [
      {
        key: '1',
        feeName: 'BAF (Bunker Adjustment Factor)',
        currency: 'USD',
        '20gp': '150',
        '40gp': '300',
        '40hc': '300',
        '40nor': '300',
        specialNote: 'Fuel surcharge'
      },
      {
        key: '2',
        feeName: 'CAF (Currency Adjustment Factor)',
        currency: 'USD',
        '20gp': '50',
        '40gp': '100',
        '40hc': '100',
        '40nor': '100',
        specialNote: 'Currency fluctuation adjustment'
      },
      {
        key: '3',
        feeName: 'PSS (Peak Season Surcharge)',
        currency: 'USD',
        '20gp': '200',
        '40gp': '400',
        '40hc': '400',
        '40nor': '400',
        specialNote: 'Peak season additional charge'
      }
    ],
    // 非按箱型计费 - 海运费
    nonContainerRateList: [],
    // 非按箱型计费 - 附加费
    nonContainerSurchargeList: [
      {
        key: '1',
        feeName: 'Documentation Fee',
        currency: 'CNY',
        unit: 'per BL',
        price: '350',
        specialNote: 'Bill of lading processing fee'
      },
      {
        key: '2',
        feeName: 'Terminal Handling Charge',
        currency: 'CNY',
        unit: 'per container',
        price: '580',
        specialNote: 'Port terminal handling'
      },
      {
        key: '3',
        feeName: 'Customs Declaration Fee',
        currency: 'CNY',
        unit: 'per declaration',
        price: '120',
        specialNote: 'Customs clearance service'
      }
    ],
    // 箱型显示配置
    boxTypeVisibility: {
      '20gp': true,
      '40gp': true,
      '40hc': true,
      '40nor': true
    }
  };

  /**
   * 处理托书文件上传
   */
  const handleFileUpload = (fileList: any[]) => {
    if (fileList.length > 0) {
      // 开始AI识别
      setIsAIRecognizing(true);
      setAiRecognitionSuccess(false);
      setRecognitionProgress(0);
      
      // 模拟进度条增长
      const progressInterval = setInterval(() => {
        setRecognitionProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      // 3秒后显示识别成功并填充数据
      setTimeout(() => {
        clearInterval(progressInterval);
        setRecognitionProgress(100);
        setIsAIRecognizing(false);
        setAiRecognitionSuccess(true);
        
        // 填充mock数据
        fillMockData();
        
        // 2秒后隐藏成功提示
        setTimeout(() => {
          setAiRecognitionSuccess(false);
        }, 2000);
      }, 3000);
    }
  };
  
  /**
   * 填充mock数据到表单
   */
  const fillMockData = () => {
    const mockData = {
      // 货物信息
      packages: '100',
      grossWeight: '2500',
      measurement: '15.5',
      packageType: 'carton',
      incoTerms: 'FOB',
      releaseType: 'telex',
      goodsDescription: 'Electronic Components and Accessories for Industrial Equipment Manufacturing',
      marksNumbers: 'MADE IN CHINA\nSHIPMENT NO: EC2024001\nP.O. NO: ABC123456\nN.M.',
      remarks: 'Handle with care - Fragile electronic components',
      
      // 发货人信息
      shipperName: 'Shanghai Electronics Manufacturing Co., Ltd.',
      shipperAddress: 'Room 1501, Building A, No. 123 Huaihai Road, Huangpu District, Shanghai, China 200021\nTel: +86-21-12345678\nFax: +86-21-87654321',
      
      // 收货人信息
      consigneeName: 'ABC Trading Company LLC',
      consigneeAddress: '456 Main Street, Suite 200, Los Angeles, CA 90012, USA\nTel: +1-213-555-0123\nEmail: info@abctrading.com',
      
      // 通知人信息
      notifierName: 'XYZ Logistics International Inc.',
      notifierAddress: '789 Business Avenue, Floor 15, New York, NY 10001, USA\nTel: +1-212-555-0456\nEmail: notify@xyzlogistics.com',
      
      // 订单备注
      orderRemarks: 'Please handle with special care due to sensitive electronic components. Delivery required before end of month. Contact consignee 24 hours before delivery.'
    };
    
    // 使用form.setFieldsValue填充数据
    form.setFieldsValue(mockData);
    
    Message.success('AI Recognition Completed - Booking information has been automatically filled');
  };

  /**
   * 切换货物类型下拉显示
   */
  const toggleCargoTypeDropdown = () => {
    setShowCargoTypeDropdown(!showCargoTypeDropdown);
  };
  
  /**
   * 切换船名航次下拉显示
   */
  const toggleVesselVoyageDropdown = () => {
    setShowVesselVoyageDropdown(!showVesselVoyageDropdown);
  };

  /**
   * 切换运价备注展开缩起状态
   */
  const toggleFreightExpanded = () => {
    setIsFreightExpanded(!isFreightExpanded);
  };

  /**
   * 处理To Order复选框变化
   */
  const handleToOrderChange = (checked: boolean) => {
    setIsToOrder(checked);
    if (checked) {
      form.setFieldValue('consigneeName', 'To order');
      form.setFieldValue('consigneeAddress', '');
      // 当勾选To order时，通知人变为必填，Same as cnee变为不可选
      setIsSameAsConsignee(false);
      form.setFieldValue('notifierName', '');
      form.setFieldValue('notifierAddress', '');
    } else {
      form.setFieldValue('consigneeName', '');
    }
  };

  /**
   * 处理Same as cnee复选框变化
   */
  const handleSameAsConsigneeChange = (checked: boolean) => {
    setIsSameAsConsignee(checked);
    if (checked) {
      const consigneeName = form.getFieldValue('consigneeName');
      const consigneeAddress = form.getFieldValue('consigneeAddress');
      form.setFieldValue('notifierName', consigneeName);
      form.setFieldValue('notifierAddress', consigneeAddress);
    } else {
      form.setFieldValue('notifierName', '');
      form.setFieldValue('notifierAddress', '');
    }
  };

  return (
    <div style={{ 
      padding: '24px', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <Form form={form} onSubmit={handleSubmit} layout="vertical">
        {/* 合并的标题和航线信息卡片 */}
        <Card 
          className="mb-4" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)',
            position: 'relative'
          }}
        >
          {/* 顶部导航区域 */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <Button
                 icon={<IconLeft />}
                 onClick={handleGoBack}
                 className="mr-4"
                 style={{
                   background: 'transparent',
                   border: 'none',
                   boxShadow: 'none'
                 }}
               />
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                 <Title 
                   heading={3} 
                   style={{ 
                     margin: 0,
                     color: '#1e293b',
                     background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent'
                   }}
                 >
                   海运整箱订舱
                 </Title>
                 <span style={{
                   fontSize: '12px',
                   color: '#6b7280',
                   fontStyle: 'italic',
                   marginLeft: '8px'
                 }}>
                   运价号：FCLTE1111111111
                 </span>
               </div>
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            fontSize: '12px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            有效期: 2025-09-01 ~ 2025-09-30
          </div>
          
          {/* 航线信息区域 */}
          <div className="flex justify-between items-center">
            {/* 船公司信息 */}
            <div className="flex flex-col items-center w-32">
              {/* 标签 */}
              <div className="flex items-center space-x-1 mb-4 w-full justify-center">
                <div className="px-3 py-1 text-xs text-white font-medium rounded bg-blue-500 whitespace-nowrap">
                  合约价
                </div>
                <div className="px-3 py-1 text-xs font-medium rounded border bg-yellow-50 text-yellow-700 border-yellow-200 whitespace-nowrap">
                  中转
                </div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mt-2">
                <img
                  src="/assets/carrier/MSK.png"
                  alt="MSK"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.textContent = 'MSK';
                  }}
                />
                <span className="text-sm font-medium text-gray-600 hidden">MSK</span>
              </div>
              <div className="text-sm font-medium text-gray-700 text-center">MSK</div>
            </div>

            {/* 起始港 */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">09/04</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">SHANGHAI</div>
              <div className="text-sm text-gray-600 mb-1">(CNSHA)</div>
              <Text className="text-gray-500">CHINA</Text>
            </div>

            {/* 航线信息 */}
            <div className="flex-1 mx-8">
              <div className="text-center mb-2">
                <div className="text-sm text-gray-600 font-medium mb-1">中转港</div>
                <div className="text-sm text-blue-600">Singapore</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-px bg-gray-300 flex-1"></div>
                <div className="mx-4 text-center">
                  <div className="text-sm text-gray-500">航程 • 43天</div>
                </div>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
            </div>

            {/* 目的港 */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">10/17</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">HAMBURG</div>
              <div className="text-sm text-gray-600 mb-1">(DEHAM)</div>
              <Text className="text-gray-500">GERMANY</Text>
            </div>

            {/* 价格信息 */}
            <div className="text-right ml-8">
              <div className="text-sm text-gray-500 mb-1">预估费用总计</div>
              <div className="flex items-center justify-end mb-1">
                 <span className="px-3 py-1 text-sm font-semibold text-red-600 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg shadow-sm">
                   折合¥ 19313.65
                 </span>
                 <Tooltip 
                   content="1美元 = 7.1419人民币 (2025-07-28 09:26:03更新) ——汇率仅供参考，请以银行实际结算汇率为准。海运整箱的报价，的价、附加费、增值服务根据委托的实际情况可能会有所调整，以最终确认的为准。"
                   placement="bottom"
                 >
                   <div className="ml-2 w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center cursor-help">
                     ?
                   </div>
                 </Tooltip>
               </div>
              <Text className="text-sm text-gray-500">(USD 2450 + CNY 1840)</Text>
              <div className="mt-1">
                <Text className="text-sm text-orange-600">其中海运费 USD 2450 附加费 CNY 1840</Text>
                <Button 
                  type="text" 
                  size="small" 
                  className="ml-2 text-blue-600"
                  style={{ borderRadius: '6px', padding: '0 4px' }}
                  onClick={handleViewRateDetail}
                >
                  查看明细
                </Button>
              </div>
            </div>
          </div>
          
          {/* 详细信息区域 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">航线代码</div>
                <div className="text-gray-800">SHA-HAM</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">免用箱</div>
                <div className="text-gray-800">7天</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">免堆存</div>
                <div className="text-gray-800">5天</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">舱位状态</div>
                <div className="text-gray-800">畅接</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">超重说明</div>
                <div className="text-gray-800">18MT/20GP +USD100</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">运价备注:</span>
                  <Button 
                    type="text" 
                    size="mini" 
                    onClick={toggleFreightExpanded}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {isFreightExpanded ? '收起' : '展开'}
                  </Button>
                </div>
                {isFreightExpanded && (
                  <div className="text-gray-600">
                    <div>ENS USD35</div>
                    <div>VGM 18MT/20GP +USD100</div>
                    <div>VGM 23MT/20GP +USD350</div>
                    <div>退关费CNY300/TEU</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 选择箱型箱量 */}
        <Card 
          className="mb-4" 
          title="选择箱型箱量" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>货物类型: {cargoType}</span>
              <Button 
                type="text" 
                size="mini"
                style={{ color: '#1890ff', padding: '0 4px', height: 'auto' }}
                onClick={toggleCargoTypeDropdown}
              >
                更换
              </Button>
              {showCargoTypeDropdown && (
                <div className="relative">
                  <Select
                    value={cargoType}
                    onChange={handleCargoTypeChange}
                    style={{ width: 120 }}
                    size="small"
                    popupVisible={showCargoTypeDropdown}
                    onVisibleChange={(visible) => {
                      if (!visible) setShowCargoTypeDropdown(false);
                    }}
                  >
                    {cargoTypeOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
              <span>船名航次: {vesselVoyage}</span>
              <Button 
                type="text" 
                size="mini"
                style={{ color: '#1890ff', padding: '0 4px', height: 'auto' }}
                onClick={toggleVesselVoyageDropdown}
              >
                更换
              </Button>
              {showVesselVoyageDropdown && (
                <div className="relative">
                  <Select
                    value={vesselVoyage}
                    onChange={handleVesselVoyageChange}
                    style={{ width: 200 }}
                    size="small"
                    popupVisible={showVesselVoyageDropdown}
                    onVisibleChange={(visible) => {
                      if (!visible) setShowVesselVoyageDropdown(false);
                    }}
                  >
                    {vesselVoyageOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <Row gutter={16}>
            {Object.entries(containerCounts).map(([type, count]) => {
              const prices = {
                '20GP': 'USD 1425',
                '40GP': 'USD 2450', 
                '40HQ': 'USD 2450',
                '40NOR': 'USD 2350'
              };
              
              return (
                <Col span={6} key={type}>
                  <div 
                    className="rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md" 
                    style={{
                      border: '2px solid #e2e8f0',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '10px'
                    }}
                  >
                    <Title heading={6} style={{ margin: '0 0 8px 0', color: '#475569' }}>{type}</Title>
                    <div className="flex items-center justify-center mb-3">
                      <Button 
                        size="small" 
                        icon={<IconMinus />} 
                        onClick={() => updateContainerCount(type, false)}
                        disabled={count === 0}
                        style={{ borderRadius: '6px' }}
                      />
                      <span className="mx-3 text-lg font-semibold" style={{ color: '#1e293b' }}>{count}</span>
                      <Button 
                        size="small" 
                        icon={<IconPlus />} 
                        onClick={() => updateContainerCount(type, true)}
                        style={{ borderRadius: '6px' }}
                      />
                    </div>
                    <Text className="text-sm text-gray-600">单价: {prices[type as ContainerType]}</Text>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>



        {/* 上传托书 */}
        <Card 
          className="mb-4" 
          title={
            <div className="flex items-center">
              <span>上传托书 *</span>
              <span className="text-sm text-blue-600 ml-2 font-normal">
                上传托书将自动调用AI识别，快速帮您录入订舱信息
              </span>
            </div>
          }
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          
          {/* AI识别状态显示 */}
          {(isAIRecognizing || aiRecognitionSuccess) && (
            <div className="mb-4">
              <AIRecognitionLoader 
                loading={isAIRecognizing}
                success={aiRecognitionSuccess}
                percent={recognitionProgress}
              />
            </div>
          )}
          
          {/* 上传组件 */}
          {!isAIRecognizing && !aiRecognitionSuccess && (
            <Upload
              drag
              multiple
              action="/api/upload"
              tip="点击或拖拽文件到此区域上传"
              style={{ borderRadius: '10px' }}
              onChange={handleFileUpload}
            >
              <div className="text-center py-8">
                <IconUpload style={{ fontSize: '48px', color: '#3b82f6' }} />
                <div className="mt-2" style={{ color: '#475569' }}>点击或拖拽文件到此区域上传</div>
                <div className="text-sm text-gray-500 mt-1">最多可上传10个文件</div>
              </div>
            </Upload>
          )}
        </Card>

        {/* 货物信息 */}
        <Card 
          className="mb-4" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          <div 
            className="p-3 rounded mb-4 text-sm" 
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '1px solid #f59e0b',
              borderRadius: '8px'
            }}
          >
            ⚠️ 以下信息需要填写准确信息，请仔细填写。如有变更请及时联系客服备案
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="No.of(件数)" field="packages" required>
                <Input placeholder="请输入" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Gross Weight (毛重)" field="grossWeight" required>
                <div className="flex">
                  <Input placeholder="请输入" style={{ flex: 1 }} />
                  <span className="ml-2 flex items-center">KG</span>
                </div>
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Measurement (体积)" field="measurement" required>
                <div className="flex">
                  <Input placeholder="请输入" style={{ flex: 1 }} />
                  <span className="ml-2 flex items-center">m³</span>
                </div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Packages (包装)" field="packageType" required>
                <Select placeholder="请输入关键字进行搜索">
                  <Option value="CT-CARTONS">CT-CARTONS</Option>
                  <Option value="PK-PACKAGE">PK-PACKAGE</Option>
                  <Option value="PL-PALLETS">PL-PALLETS</Option>
                  <Option value="BG-BAGS">BG-BAGS</Option>
                  <Option value="CS-CASES">CS-CASES</Option>
                  <Option value="DR-DRUMS">DR-DRUMS</Option>
                  <Option value="BX-BOXES">BX-BOXES</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="条款类型" field="incoTerms" required>
                <Select placeholder="请选择">
                  <Option value="FOB">FOB</Option>
                  <Option value="FCA">FCA</Option>
                  <Option value="DDU">DDU</Option>
                  <Option value="CFR">CFR</Option>
                  <Option value="DAT">DAT</Option>
                  <Option value="DAP">DAP</Option>
                  <Option value="CIF">CIF</Option>
                  <Option value="C&F">C&F</Option>
                  <Option value="DDP">DDP</Option>
                  <Option value="EXW">EXW</Option>
                  <Option value="CPT">CPT</Option>
                  <Option value="CIP">CIP</Option>
                  <Option value="FAS">FAS</Option>
                  <Option value="DES">DES</Option>
                  <Option value="DEQ">DEQ</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="货好时间" field="cargoReadyTime" required>
                <div className="flex items-center">
                  <div className="mr-3 flex items-center">
                    <Radio.Group
                      type="button"
                      name="cargoReadyTimeType"
                      defaultValue="区间"
                    >
                      <Radio value="区间">区间</Radio>
                      <Radio value="日期">日期</Radio>
                    </Radio.Group>
                  </div>
                  <div className="flex-1">
                    <Select 
                      placeholder="请选择" 
                      style={{ width: '100%' }}
                      defaultValue="一周内"
                    >
                      <Option value="一周内">一周内</Option>
                      <Option value="二周内">二周内</Option>
                      <Option value="一个月内">一个月内</Option>
                      <Option value="一月以上">一月以上</Option>
                      <Option value="时间未知">时间未知</Option>
                    </Select>
                  </div>
                </div>
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Type of Release(放货方式)" field="releaseType" required>
                <Select placeholder="请选择">
                  <Option value="正本">正本</Option>
                  <Option value="电放">电放</Option>
                  <Option value="导地提单">导地提单</Option>
                  <Option value="SEAWAYBILL">SEAWAYBILL</Option>
                  <Option value="目的港放单">目的港放单</Option>
                  <Option value="PENDING">PENDING</Option>
                  <Option value="等通知放单">等通知放单</Option>
                  <Option value="EBL">EBL</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              {/* 空列，保持布局平衡 */}
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="English Description of Goods (英文品名)" field="goodsDescription" required>
                <TextArea placeholder="请输入" rows={3} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Marks & Numbers (唛头标识)" field="marksNumbers">
                <TextArea placeholder="请输入" rows={3} />
              </FormItem>
            </Col>
          </Row>
        </Card>

        {/* 联系人信息 */}
        <Card 
          className="mb-4" 
          title="联系人信息" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          {/* 发货人信息 */}
          <div className="mb-6">

            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="Shipper(发货人名称)" field="shipperName" required>
                  <Input 
                    placeholder="请输入发货人名称" 
                    style={{ borderRadius: '8px' }}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Shipper's Address(发货人地址)" field="shipperAddress" required>
                  <TextArea 
                    placeholder="请输入发货人地址" 
                    rows={3} 
                    style={{ borderRadius: '8px' }}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 收货人信息 */}
          <div className="mb-6">

            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="Consignee(收货人名称)" field="consigneeName" required>
                  <Input 
                    placeholder="请输入收货人名称" 
                    style={{ borderRadius: '8px' }}
                    disabled={isToOrder}
                  />
                  <div className="mt-2">
                    <Checkbox 
                      checked={isToOrder}
                      onChange={handleToOrderChange}
                    >
                      TO ORDER
                    </Checkbox>
                  </div>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Consignee's Address(收货人地址)" field="consigneeAddress" required>
                  <TextArea 
                    placeholder="请输入收货人地址" 
                    rows={3} 
                    style={{ borderRadius: '8px' }}
                    disabled={isToOrder}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 通知人信息 */}
          <div>

            <Row gutter={16}>
              <Col span={12}>
                <FormItem 
                  label="Notifier(通知人名称)" 
                  field="notifierName" 
                  required={isToOrder}
                >
                  <Input 
                    placeholder="请输入通知人名称" 
                    style={{ borderRadius: '8px' }}
                  />
                  <div className="mt-2">
                    <Checkbox 
                      checked={isSameAsConsignee}
                      onChange={handleSameAsConsigneeChange}
                      disabled={isToOrder}
                    >
                      SAME AS CONSIGNEE
                    </Checkbox>
                  </div>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem 
                  label="Notify's Address(通知人地址)" 
                  field="notifierAddress" 
                  required={isToOrder}
                >
                  <TextArea 
                    placeholder="请输入通知人地址" 
                    rows={3} 
                    style={{ borderRadius: '8px' }}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
        </Card>



        {/* 上传其他文件 */}
        <Card 
          className="mb-4" 
          title="上传其他文件" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          <Upload
            drag
            multiple
            action="/api/upload"
            tip="点击或拖拽文件到此区域上传"
            style={{ borderRadius: '10px' }}
          >
            <div className="text-center py-8">
              <IconUpload style={{ fontSize: '48px', color: '#3b82f6' }} />
              <div className="mt-2" style={{ color: '#475569' }}>点击或拖拽文件到此区域上传</div>
              <div className="text-sm text-gray-500 mt-1">最多可上传10个文件</div>
            </div>
          </Upload>
        </Card>

        {/* 订单备注 */}
        <Card 
          className="mb-4" 
          title="订单备注" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          <FormItem field="orderRemarks">
            <TextArea 
              placeholder="如有特殊要求请在此填写订单备注" 
              rows={4} 
              style={{ borderRadius: '8px' }}
            />
          </FormItem>
        </Card>

        {/* 底部价格和操作按钮 */}
        <Card 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-1">
                 <Text className="text-sm text-gray-600">预估费用总计:</Text>
                 <span className="ml-2 px-3 py-1 text-sm font-semibold text-red-600 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg shadow-sm">
                   折合¥ 19313.65
                 </span>
                 <Tooltip 
                   content="1美元 = 7.1419人民币 (2025-07-28 09:26:03更新) ——汇率仅供参考，请以银行实际结算汇率为准。海运整箱的报价，的价、附加费、增值服务根据委托的实际情况可能会有所调整，以最终确认的为准。"
                   placement="bottom"
                 >
                   <div className="ml-2 w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center cursor-help">
                     ?
                   </div>
                 </Tooltip>
               </div>
              <Text className="text-sm text-gray-500">(USD 2450 + CNY 1840)</Text>
              <div className="mt-1">
                <Text className="text-sm text-orange-600">其中海运费 USD 2450 附加费 CNY 1840</Text>
                <Button 
                  type="text" 
                  size="small" 
                  className="ml-2 text-blue-600"
                  style={{ borderRadius: '6px', padding: '0 4px' }}
                  onClick={handleViewRateDetail}
                >
                  查看明细
                </Button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                type="outline" 
                size="large" 
                onClick={handleSaveDraft}
                style={{ 
                  borderColor: '#3b82f6',
                  color: '#3b82f6'
                }}
              >
                暂存
              </Button>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleBookingClick}
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none'
                }}
              >
                立即订舱
              </Button>
            </div>
          </div>
        </Card>
      </Form>
      
      {/* 确认修改箱型弹窗 */}
      <ConfirmModal
        visible={showConfirmModal}
        title="确认修改"
        content="修改箱型箱量可能导致运价变化，请以后续客服确认为准，确认修改？"
        okText="确定"
        cancelText="取消"
        onOk={handleConfirmChange}
        onCancel={handleCancelChange}
      />
      
      {/* 订舱确认弹窗 */}
      <ConfirmModal
        visible={showBookingConfirmModal}
        title="确认提交"
        content="确认提交订舱信息？"
        okText="确认"
        cancelText="取消"
        onOk={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />
      
      {/* 费用明细抽屉 */}
      <RateDetailDrawer
        visible={rateDetailVisible}
        onClose={handleCloseRateDetail}
        containerRateList={mockRateData.containerRateList}
        containerSurchargeList={mockRateData.containerSurchargeList}
        nonContainerRateList={mockRateData.nonContainerRateList}
        nonContainerSurchargeList={mockRateData.nonContainerSurchargeList}
        boxTypeVisibility={mockRateData.boxTypeVisibility}
      />
    </div>
  );
};

export default BookingSubmission;