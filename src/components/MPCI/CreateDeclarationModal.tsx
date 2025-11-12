import React, { useState } from 'react';
import { Modal, Button, Card, Typography } from '@arco-design/web-react';
import { IconRobot, IconEdit, IconUpload, IconClose, IconArrowRight } from '@arco-design/web-react/icon';
import FileUpload from './FileUpload';


const { Title, Text } = Typography;

/**
 * 申报类型枚举
 */
type DeclarationType = 'ai' | 'manual' | 'import';

/**
 * 弹窗步骤枚举
 */
type ModalStep = 'select' | 'action';

/**
 * 新建申报弹窗组件属性
 */
interface CreateDeclarationModalProps {
  /** 弹窗是否可见 */
  visible: boolean;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 手工录入回调 */
  onManualCreate: () => void;
}

/**
 * 申报选项配置
 */
const declarationOptions = [
  {
    type: 'ai' as const,
    title: 'AI识别',
    description: '智能识别文件内容，自动填充申报信息',
    icon: <IconRobot className="text-2xl" />,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    type: 'manual' as const,
    title: '手工录入',
    description: '手动填写申报信息，适合复杂场景',
    icon: <IconEdit className="text-2xl" />,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    type: 'import' as const,
    title: '表格导入',
    description: '批量导入Excel表格，快速创建申报',
    icon: <IconUpload className="text-2xl" />,
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconColor: 'text-purple-600'
  }
];

/**
 * 新建申报弹窗组件
 * @description 提供三种申报创建方式：AI识别、手工录入、表格导入
 */
const CreateDeclarationModal: React.FC<CreateDeclarationModalProps> = ({
  visible,
  onClose,
  onManualCreate
}) => {
  // 当前选择的申报类型
  const [selectedType, setSelectedType] = useState<DeclarationType | null>(null);
  // 当前弹窗步骤
  const [currentStep, setCurrentStep] = useState<ModalStep>('select');
  // 上传文件列表
  const [fileList, setFileList] = useState([]);

  /**
   * 重置弹窗状态
   */
  const resetModal = () => {
    setSelectedType(null);
    setCurrentStep('select');
    setFileList([]);
  };

  /**
   * 关闭弹窗处理
   */
  const handleClose = () => {
    resetModal();
    onClose();
  };

  /**
   * 选择申报类型
   */
  const handleSelectType = (type: DeclarationType) => {
    setSelectedType(type);
  };

  /**
   * 下一步处理
   */
  const handleNext = () => {
    if (!selectedType) return;
    
    if (selectedType === 'manual') {
      // 手工录入直接跳转到新建页面
      handleClose();
      onManualCreate();
      return;
    }
    
    // AI识别和表格导入进入文件上传步骤
    setCurrentStep('action');
  };

  /**
   * 返回上一步
   */
  const handleBack = () => {
    setCurrentStep('select');
    setSelectedType(null);
  };



  /**
   * 确认上传处理
   */
  const handleConfirmUpload = () => {
    if (fileList.length === 0) return;
    
    // TODO: 实现文件上传逻辑
    console.log('上传文件:', fileList);
    console.log('申报类型:', selectedType);
    
    // 关闭弹窗
    handleClose();
  };

  /**
   * 处理文件上传成功
   */
  const handleUploadSuccess = (file: any) => {
    console.log('文件上传成功:', file);
    // TODO: 处理文件上传成功后的逻辑
  };

  /**
   * 处理文件删除
   */
  const handleFileRemove = (file: any) => {
    console.log('文件已删除:', file);
  };

  /**
   * 渲染选择步骤
   */
  const renderSelectStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {declarationOptions.map((option) => (
          <Card
            key={option.type}
            className={`cursor-pointer transition-all duration-200 border-2 ${
              selectedType === option.type
                ? 'border-blue-500 bg-blue-50'
                : option.color
            }`}
            hoverable
            onClick={() => handleSelectType(option.type)}
          >
            <div className="flex items-center space-x-4 p-2">
              <div className={`flex-shrink-0 p-3 rounded-lg bg-white ${
                selectedType === option.type ? 'text-blue-600' : option.iconColor
              }`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <Title heading={6} className="mb-1">{option.title}</Title>
                <Text type="secondary" className="text-sm">
                  {option.description}
                </Text>
              </div>
              {selectedType === option.type && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  /**
   * 渲染文件上传步骤
   */
  const renderActionStep = () => {
    // 只有AI识别和表格导入会进入这个步骤
    if (selectedType === 'ai') {
      return (
        <FileUpload
          uploadType="ai"
          onUploadSuccess={handleUploadSuccess}
          onFileRemove={handleFileRemove}
        />
      );
    }
    
    if (selectedType === 'import') {
      return (
        <FileUpload
          uploadType="excel"
          onUploadSuccess={handleUploadSuccess}
          onFileRemove={handleFileRemove}
        />
      );
    }
    
    // 默认返回空内容
    return null;
  };

  return (
    <Modal
      title={null}
      visible={visible}
      footer={null}
      closable={false}
      className="create-declaration-modal"
      maskClosable={false}
      style={{ width: '600px' }}
    >
      {/* 自定义头部 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <Title heading={4} className="mb-0">新建申报</Title>
        <Button
          type="text"
          icon={<IconClose />}
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        />
      </div>

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {currentStep === 'select' ? renderSelectStep() : renderActionStep()}
      </div>

      {/* 底部按钮 */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
        <div>
          {currentStep === 'action' && (
            <Button onClick={handleBack}>
              上一步
            </Button>
          )}
        </div>
        
        <div className="flex gap-4">
          {currentStep === 'select' ? (
            <Button
              type="primary"
              disabled={!selectedType}
              onClick={handleNext}
            >
              下一步 <IconArrowRight className="ml-1" />
            </Button>
          ) : (
            <Button
              type="primary"
              disabled={fileList.length === 0}
              onClick={handleConfirmUpload}
            >
              确认上传
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateDeclarationModal;