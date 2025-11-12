import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Typography,
  Upload,
  Grid
} from '@arco-design/web-react';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import {
  IconLeft,
  IconUpload,
  IconFile,
  IconEye
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { Row, Col } = Grid;

interface BCUploadProps {}

/**
 * BC上传页面组件
 * 用于处理BC件的文件上传和信息核对校验
 */
const BCUpload: React.FC<BCUploadProps> = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [showVerification, setShowVerification] = useState(false);

  /**
   * 返回订单详情页面
   */
  const handleGoBack = () => {
    navigate(`/controltower/order-detail/${orderId}`);
  };

  /**
   * 处理文件上传
   */
  const handleFileUpload = (fileList: UploadItem[]) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      setUploadedFile(file);
      // 模拟文件上传成功后显示信息核对界面
      setTimeout(() => {
        setShowVerification(true);
      }, 1000);
    }
  };

  /**
   * 模拟识别的数据字段
   */
  const recognizedData = [
    { field: '发货人(Shipper)', value: 'ROOM 2701, BUILDING A, 970 DALIAN ROAD, YANGPU DISTRICT, SHANGHAI WALLTECH LIMIT CO., LTD' },
    { field: '收货人(Consignee)', value: 'ROOM 2701, BUILDING A, 970 DALIAN ROAD, YANGPU DISTRICT, SHANGHAI WALLTECH LIMIT CO., LTD' },
    { field: '通知方(Notify Party)', value: 'SAME AS CONSIGNEE' },
    { field: '船舶(Vessel)', value: 'MSC SHANGHAI / 750643' },
    { field: '航次(Voyage)', value: 'QHW2412JCH' },
    { field: '装货港(Port of Loading)', value: 'PALEMBANG, INDONESIA' },
    { field: '卸货港(Port of Discharge)', value: 'SHENZHEN, CHINA' }
  ];

  /**
   * 系统已有字段数据
   */
  const systemData = [
    { field: '发货人(Shipper)', value: 'ROOM 2701, BUILDING A, 970 DALIAN ROAD, YANGPU DISTRICT, SHANGHAI WALLTECH LIMIT CO., LTD' },
    { field: '收货人(Consignee)', value: 'ROOM 2701, BUILDING A, 970 DALIAN ROAD, YANGPU DISTRICT, SHANGHAI WALLTECH LIMIT CO., LTD' },
    { field: '通知方(Notify Party)', value: 'SAME AS CONSIGNEE' },
    { field: '船舶(Vessel)', value: 'MSC SHANGHAI / 750643' },
    { field: '航次(Voyage)', value: 'QHW2412JCH' },
    { field: '装货港(Port of Loading)', value: 'PALEMBANG, INDONESIA' },
    { field: '卸货港(Port of Discharge)', value: 'SHENZHEN, CHINA' }
  ];

  /**
   * 渲染文件上传界面
   */
  const renderUploadInterface = () => (
    <Card className="h-full flex flex-col justify-center items-center">
      <div className="text-center max-w-lg mx-auto">
        <Title heading={4} className="mb-8">BC件上传</Title>
        
        <Upload
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple={false}
          showUploadList={false}
          onChange={(fileList) => handleFileUpload(fileList)}
          className="mb-8"
          style={{ 
            minHeight: '280px',
            border: '2px dashed #d9d9d9',
            borderRadius: '12px',
            backgroundColor: '#fafafa',
            transition: 'all 0.3s ease'
          }}
          drag
        >
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <IconUpload className="text-2xl text-blue-500" />
            </div>
            <Text className="text-xl font-medium mb-3 text-gray-800">拖拽文件到此处，或点击上传</Text>
            <Text type="secondary" className="text-base mb-4">
              支持 PDF、JPG、PNG、DOC、DOCX 格式
            </Text>
            <Text type="secondary" className="text-sm text-gray-500">
              文件大小不超过 10MB
            </Text>
          </div>
        </Upload>
        
        <Text type="secondary" className="text-sm">
          请上传清晰的BC件文档，系统将自动识别关键信息
        </Text>
      </div>
    </Card>
  );

  /**
   * 渲染信息核对校验界面
   */
  const renderVerificationInterface = () => {
    return (
      <div className="h-full">
        <Title heading={4} className="mb-6">信息核对校验</Title>
        
        <Row gutter={16} className="h-full">
          {/* 文件预览列 */}
          <Col span={8}>
            <Card title="文件预览" className="h-full">
              <div className="flex flex-col items-center">
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <IconFile className="text-4xl text-gray-400 mb-2" />
                    <Text type="secondary">{uploadedFile?.name}</Text>
                  </div>
                </div>
                <Button 
                  type="outline" 
                  icon={<IconEye />}
                  className="w-full"
                >
                  查看原文件
                </Button>
              </div>
            </Card>
          </Col>
          
          {/* 识别数据字段列 */}
          <Col span={8}>
            <Card title="识别数据字段" className="h-full">
              <div className="space-y-3">
                {recognizedData.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <Text className="font-medium text-gray-700 block mb-2">{item.field}</Text>
                    <Text className="text-sm text-gray-600 break-words">{item.value}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          
          {/* 系统已有字段列 */}
          <Col span={8}>
            <Card title="系统已有字段" className="h-full">
              <div className="space-y-3">
                {systemData.map((item, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                    <Text className="font-medium text-gray-700 block mb-2">{item.field}</Text>
                    <Text className="text-sm text-gray-600 break-words">{item.value}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* 操作按钮 */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button 
            type="outline"
            onClick={() => setShowVerification(false)}
          >
            重新上传
          </Button>
          <Button 
            type="primary"
            onClick={() => {
              // 处理确认逻辑
              console.log('确认信息核对');
              handleGoBack();
            }}
          >
            确认无误
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={<IconLeft />} 
            onClick={handleGoBack}
            className="mr-4"
          >
            返回
          </Button>
          <Title heading={5} className="m-0">
            BC上传 - 订单号: {orderId}
          </Title>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="h-full">
        {!showVerification ? renderUploadInterface() : renderVerificationInterface()}
      </div>
    </div>
  );
};

export default BCUpload;