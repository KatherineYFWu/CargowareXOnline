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
  Radio,
  Modal
} from '@arco-design/web-react';
import { IconLeft, IconPlus, IconMinus, IconUpload } from '@arco-design/web-react/icon';
import ConfirmModal from '../../common/ConfirmModal';

const { Title, Text } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface BookingSubmissionProps {}




// 箱型箱量组合类型定义
interface ContainerGroup {
  id: string;
  containerType: string;
  quantity: number;
}

// 港口数据定义
interface PortOption {
  value: string;
  label: string;
  code: string;
  nameEn: string;
  nameCn: string;
}

// 港口枚举数据
const PORT_OPTIONS: PortOption[] = [
  { value: 'CNSHA-SHANGHAI-上海', label: 'CNSHA-SHANGHAI-上海', code: 'CNSHA', nameEn: 'SHANGHAI', nameCn: '上海' },
  { value: 'CNYTN-YANTIAN-盐田', label: 'CNYTN-YANTIAN-盐田', code: 'CNYTN', nameEn: 'YANTIAN', nameCn: '盐田' },
  { value: 'CNNGB-NINGBO-宁波', label: 'CNNGB-NINGBO-宁波', code: 'CNNGB', nameEn: 'NINGBO', nameCn: '宁波' },
  { value: 'CNQIN-QINGDAO-青岛', label: 'CNQIN-QINGDAO-青岛', code: 'CNQIN', nameEn: 'QINGDAO', nameCn: '青岛' },
  { value: 'CNTXG-TIANJIN-天津', label: 'CNTXG-TIANJIN-天津', code: 'CNTXG', nameEn: 'TIANJIN', nameCn: '天津' },
  { value: 'CNXMN-XIAMEN-厦门', label: 'CNXMN-XIAMEN-厦门', code: 'CNXMN', nameEn: 'XIAMEN', nameCn: '厦门' },
  { value: 'CNSZX-SHENZHEN-深圳', label: 'CNSZX-SHENZHEN-深圳', code: 'CNSZX', nameEn: 'SHENZHEN', nameCn: '深圳' },
  { value: 'CNDLC-DALIAN-大连', label: 'CNDLC-DALIAN-大连', code: 'CNDLC', nameEn: 'DALIAN', nameCn: '大连' }
];

/**
 * 提交订舱页面组件
 * 用于处理客户端控制塔的订舱申请功能
 */
const BookingSubmission: React.FC<BookingSubmissionProps> = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [form] = Form.useForm();
  

  
  // 复选框状态管理
  const [isToOrder, setIsToOrder] = useState(false);
  const [isSameAsConsignee, setIsSameAsConsignee] = useState(false);
  

  


  
  // 订舱确认弹窗状态管理
  const [showBookingConfirmModal, setShowBookingConfirmModal] = useState(false);
  
  // 审核相关状态管理
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(true); // 默认只读模式
  const [showRejectModal, setShowRejectModal] = useState(false); // 拒绝订舱弹窗
  const [showApproveModal, setShowApproveModal] = useState(false); // 审核通过确认弹窗
  const [rejectReason, setRejectReason] = useState(''); // 拒绝理由
  
  // 箱型箱量组合状态管理
  const [containerGroups, setContainerGroups] = useState<ContainerGroup[]>([
    { id: '1', containerType: '20GP', quantity: 1 }
  ]);
  


  /**
   * 返回订单详情页面
   */
  const handleGoBack = () => {
    navigate('/controltower/order-detail/ORD000001');
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
   * 处理表单提交（保留原有逻辑）
   */
  const handleSubmit = (values: any) => {
    console.log('表单数据:', values);
    Message.success('订舱申请已提交');
  };

  /**
   * 处理拒绝订舱
   */
  const handleRejectBooking = () => {
    setShowRejectModal(true);
  };

  /**
   * 确认拒绝订舱
   */
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      Message.error('请填写拒绝理由');
      return;
    }
    console.log('拒绝理由:', rejectReason);
    Message.success('已拒绝订舱申请');
    setShowRejectModal(false);
    setRejectReason('');
    // 可以在这里添加跳转逻辑
  };

  /**
   * 取消拒绝订舱
   */
  const handleCancelReject = () => {
    setShowRejectModal(false);
    setRejectReason('');
  };

  /**
   * 处理强制编辑
   */
  const handleForceEdit = () => {
    setIsReadOnlyMode(false);
    Message.info('已开启编辑模式');
  };

  /**
   * 处理审核通过
   */
  const handleApproveBooking = () => {
    setShowApproveModal(true);
  };

  /**
   * 确认审核通过
   */
  const handleConfirmApprove = () => {
    console.log('审核通过');
    Message.success('审核成功');
    setShowApproveModal(false);
    // 可以在这里添加跳转逻辑
  };

  /**
   * 取消审核通过
   */
  const handleCancelApprove = () => {
    setShowApproveModal(false);
  };


  

  

  


  /**
   * 处理托书文件上传
   */
  const handleFileUpload = (fileList: any[]) => {
    if (fileList.length > 0) {
      // 填充mock数据
      fillMockData();
      Message.success('文件上传成功，订舱信息已自动填充');
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
   * 添加箱型箱量组合
   */
  const addContainerGroup = () => {
    if (containerGroups.length < 5) {
      const newId = (containerGroups.length + 1).toString();
      setContainerGroups([...containerGroups, { id: newId, containerType: '20GP', quantity: 1 }]);
    }
  };
  
  /**
   * 删除箱型箱量组合
   */
  const removeContainerGroup = (id: string) => {
    if (containerGroups.length > 1) {
      setContainerGroups(containerGroups.filter(group => group.id !== id));
    }
  };
  
  /**
   * 更新箱型箱量组合
   */
  const updateContainerGroup = (id: string, field: 'containerType' | 'quantity', value: string | number) => {
    setContainerGroups(containerGroups.map(group => 
      group.id === id ? { ...group, [field]: value } : group
    ));
  };
  
  /**
   * 增加箱量
   */
  const increaseQuantity = (id: string) => {
    setContainerGroups(containerGroups.map(group => 
      group.id === id ? { ...group, quantity: group.quantity + 1 } : group
    ));
  };
  
  /**
   * 减少箱量
   */
  const decreaseQuantity = (id: string) => {
    setContainerGroups(containerGroups.map(group => 
      group.id === id ? { ...group, quantity: Math.max(1, group.quantity - 1) } : group
    ));
  };
  
  /**
   * 获取已选择的箱型列表（排除当前组）
   */
  const getSelectedContainerTypes = (currentGroupId: string): string[] => {
    return containerGroups
      .filter(group => group.id !== currentGroupId)
      .map(group => group.containerType);
  };
  
  /**
   * 检查箱型是否可选
   */
  const isContainerTypeDisabled = (containerType: string, currentGroupId: string): boolean => {
    const selectedTypes = getSelectedContainerTypes(currentGroupId);
    return selectedTypes.includes(containerType);
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
        {/* 页面标题卡片 */}
        <Card 
          className="mb-4" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8f4fd',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafcff 100%)'
          }}
        >
          {/* 顶部导航区域 */}
          <div className="flex items-center justify-between">
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
            </div>
            
            {/* 右侧操作按钮 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                type="outline" 
                size="large" 
                onClick={handleRejectBooking}
                style={{ 
                  borderColor: '#f56565',
                  color: '#f56565'
                }}
              >
                拒绝订舱
              </Button>
              <Button 
                type="outline" 
                size="large" 
                onClick={handleForceEdit}
                style={{ 
                  borderColor: '#ed8936',
                  color: '#ed8936'
                }}
              >
                强制编辑
              </Button>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleApproveBooking}
                style={{ 
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  border: 'none'
                }}
              >
                审核通过
              </Button>
            </div>
          </div>
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
          
          {/* 上传组件 */}
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
          
          {/* 新增必填字段 */}
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="收货地" field="placeOfReceipt" required>
                <Select placeholder="请选择收货地" showSearch disabled={isReadOnlyMode}>
                  {PORT_OPTIONS.map(port => (
                    <Option key={port.value} value={port.value}>
                      {port.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="起运港" field="portOfLoading" required>
                <Select placeholder="请选择起运港" showSearch disabled={isReadOnlyMode}>
                  {PORT_OPTIONS.map(port => (
                    <Option key={port.value} value={port.value}>
                      {port.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="卸货港" field="portOfDischarge" required>
                <Select placeholder="请选择卸货港" showSearch disabled={isReadOnlyMode}>
                  {PORT_OPTIONS.map(port => (
                    <Option key={port.value} value={port.value}>
                      {port.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="目的港" field="portOfDestination" required>
                <Select placeholder="请选择目的港" showSearch disabled={isReadOnlyMode}>
                  {PORT_OPTIONS.map(port => (
                    <Option key={port.value} value={port.value}>
                      {port.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="船名" field="vesselName">
                <Input placeholder="请输入船名（非必填）" disabled={isReadOnlyMode} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="航次" field="voyage">
                <Input placeholder="请输入航次（非必填）" disabled={isReadOnlyMode} />
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="No.of(件数)" field="packages" required>
                <Input placeholder="请输入" disabled={isReadOnlyMode} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Gross Weight (毛重)" field="grossWeight" required>
                <div className="flex">
                  <Input placeholder="请输入" style={{ flex: 1 }} disabled={isReadOnlyMode} />
                  <span className="ml-2 flex items-center">KG</span>
                </div>
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Measurement (体积)" field="measurement" required>
                <div className="flex">
                  <Input placeholder="请输入" style={{ flex: 1 }} disabled={isReadOnlyMode} />
                  <span className="ml-2 flex items-center">m³</span>
                </div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Packages (包装)" field="packageType" required>
                <Select placeholder="请输入关键字进行搜索" disabled={isReadOnlyMode}>
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
                <Select placeholder="请选择" disabled={isReadOnlyMode}>
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
                      disabled={isReadOnlyMode}
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
                      disabled={isReadOnlyMode}
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
                <Select placeholder="请选择" disabled={isReadOnlyMode}>
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
                <TextArea placeholder="请输入" rows={3} disabled={isReadOnlyMode} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Marks & Numbers (唛头标识)" field="marksNumbers">
                <TextArea placeholder="请输入" rows={3} disabled={isReadOnlyMode} />
              </FormItem>
            </Col>
          </Row>
          
          {/* 箱型箱量组合 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <Text className="font-medium text-gray-700">箱型箱量</Text>
              {containerGroups.length < 5 && (
                <Button 
                   type="primary" 
                   size="small" 
                   icon={<IconPlus />}
                   onClick={addContainerGroup}
                   disabled={isReadOnlyMode}
                 >
                   添加箱型
                 </Button>
              )}
            </div>
            
            {containerGroups.map((group) => (
              <div key={group.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <Row gutter={16} align="center">
                  <Col span={8}>
                    <FormItem label="箱型" required>
                       <Select 
                         value={group.containerType}
                         onChange={(value) => updateContainerGroup(group.id, 'containerType', value)}
                         placeholder="请选择箱型"
                         disabled={isReadOnlyMode}
                       >
                         <Option 
                           value="20GP" 
                           disabled={isContainerTypeDisabled('20GP', group.id)}
                         >
                           20GP
                         </Option>
                         <Option 
                           value="40GP" 
                           disabled={isContainerTypeDisabled('40GP', group.id)}
                         >
                           40GP
                         </Option>
                         <Option 
                           value="40HQ" 
                           disabled={isContainerTypeDisabled('40HQ', group.id)}
                         >
                           40HQ
                         </Option>
                         <Option 
                           value="40NOR" 
                           disabled={isContainerTypeDisabled('40NOR', group.id)}
                         >
                           40NOR
                         </Option>
                       </Select>
                     </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="箱量" required>
                      <div className="flex items-center">
                        <Button 
                          size="small" 
                          icon={<IconMinus />}
                          onClick={() => decreaseQuantity(group.id)}
                          disabled={group.quantity <= 1 || isReadOnlyMode}
                        />
                        <Input 
                           value={group.quantity.toString()}
                           onChange={(value) => updateContainerGroup(group.id, 'quantity', parseInt(value) || 1)}
                           className="mx-2 text-center"
                           style={{ width: '80px' }}
                           disabled={isReadOnlyMode}
                         />
                        <Button 
                          size="small" 
                          icon={<IconPlus />}
                          onClick={() => increaseQuantity(group.id)}
                          disabled={isReadOnlyMode}
                        />
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    {containerGroups.length > 1 && (
                      <Button 
                         type="text" 
                         status="danger"
                         icon={<IconMinus />}
                         onClick={() => removeContainerGroup(group.id)}
                         className="mt-6"
                         disabled={isReadOnlyMode}
                       >
                         删除箱型
                       </Button>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </div>
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
                    disabled={isReadOnlyMode}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Shipper's Address(发货人地址)" field="shipperAddress" required>
                  <TextArea 
                    placeholder="请输入发货人地址" 
                    rows={3} 
                    style={{ borderRadius: '8px' }}
                    disabled={isReadOnlyMode}
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
                    disabled={isToOrder || isReadOnlyMode}
                  />
                  <div className="mt-2">
                    <Checkbox 
                      checked={isToOrder}
                      onChange={handleToOrderChange}
                      disabled={isReadOnlyMode}
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
                    disabled={isToOrder || isReadOnlyMode}
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
                    disabled={isReadOnlyMode}
                  />
                  <div className="mt-2">
                    <Checkbox 
                      checked={isSameAsConsignee}
                      onChange={handleSameAsConsigneeChange}
                      disabled={isToOrder || isReadOnlyMode}
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
                    disabled={isReadOnlyMode}
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
            disabled={isReadOnlyMode}
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
              disabled={isReadOnlyMode}
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
          <div className="flex justify-end items-center">
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                type="outline" 
                size="large" 
                onClick={handleRejectBooking}
                style={{ 
                  borderColor: '#f56565',
                  color: '#f56565'
                }}
              >
                拒绝订舱
              </Button>
              <Button 
                type="outline" 
                size="large" 
                onClick={handleForceEdit}
                style={{ 
                  borderColor: '#ed8936',
                  color: '#ed8936'
                }}
              >
                强制编辑
              </Button>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleApproveBooking}
                style={{ 
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  border: 'none'
                }}
              >
                审核通过
              </Button>
            </div>
          </div>
        </Card>
      </Form>
      

      
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
      
      {/* 拒绝订舱弹窗 */}
      <Modal
        title="拒绝订舱"
        visible={showRejectModal}
        onCancel={handleCancelReject}
        footer={[
          <Button key="cancel" onClick={handleCancelReject}>
            取消
          </Button>,
          <Button key="confirm" type="primary" status="danger" onClick={handleConfirmReject}>
            确认拒绝
          </Button>
        ]}
        style={{ width: 500 }}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ marginBottom: '12px', color: '#1d2129' }}>请填写拒绝理由：</p>
          <TextArea
            value={rejectReason}
            onChange={setRejectReason}
            placeholder="请输入拒绝理由"
            rows={4}
            maxLength={500}
            showWordLimit
          />
        </div>
      </Modal>
      
      {/* 审核通过确认弹窗 */}
      <ConfirmModal
        visible={showApproveModal}
        title="审核通过"
        content="确认审核通过？"
        okText="确认"
        cancelText="取消"
        onOk={handleConfirmApprove}
        onCancel={handleCancelApprove}
      />
      

    </div>
  );
};

export default BookingSubmission;