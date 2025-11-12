import React, { useState } from 'react';
import { Upload, Card, Button, Typography, Space, Progress, Alert } from '@arco-design/web-react';
import { IconUpload, IconFile, IconDelete, IconCheck } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

interface FileUploadProps {
  /** 上传类型 */
  uploadType: 'ai' | 'excel';
  /** 文件上传成功回调 */
  onUploadSuccess?: (file: any) => void;
  /** 文件删除回调 */
  onFileRemove?: (file: any) => void;
}

/**
 * 文件上传组件
 * @description 支持AI识别和表格导入的文件上传功能，包含全面的文件合规性检测
 */
const FileUpload: React.FC<FileUploadProps> = ({
  uploadType,
  onUploadSuccess,
  onFileRemove
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'normal' | 'uploading' | 'success' | 'error'>('normal');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 根据上传类型配置不同的参数
  const getUploadConfig = () => {
    if (uploadType === 'ai') {
      return {
        title: 'AI识别文件上传',
        description: '支持上传图片、PDF等文件，AI将自动识别并提取申报信息',
        accept: '.jpg,.jpeg,.png,.pdf,.tiff,.bmp',
        maxSize: 10 * 1024 * 1024, // 10MB
        tips: '支持格式：JPG、PNG、PDF、TIFF、BMP，文件大小不超过10MB',
        // 添加MIME类型验证
        allowedMimeTypes: [
          'image/jpeg', 'image/png', 'image/tiff', 'image/bmp',
          'application/pdf'
        ]
      };
    } else {
      return {
        title: '表格文件上传',
        description: '上传Excel或CSV文件，系统将自动解析申报数据',
        accept: '.xlsx,.xls,.csv',
        maxSize: 5 * 1024 * 1024, // 5MB
        tips: '支持格式：XLSX、XLS、CSV，文件大小不超过5MB',
        // 添加MIME类型验证
        allowedMimeTypes: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv'
        ]
      };
    }
  };

  const config = getUploadConfig();

  /**
   * 检查文件名是否合规
   * @param filename 文件名
   * @returns 是否合规及错误信息
   */
  const validateFileName = (filename: string): { valid: boolean; message?: string } => {
    // 检查文件名长度
    if (filename.length > 100) {
      return { valid: false, message: '文件名长度不能超过100个字符' };
    }

    // 检查文件名是否为空或只有扩展名
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    if (!nameWithoutExt.trim()) {
      return { valid: false, message: '文件名不能为空，请提供有效的文件名' };
    }

    // 检查文件名是否包含特殊字符
    const invalidChars = /[\\/:*?"<>|]/g;
    if (invalidChars.test(filename)) {
      return { valid: false, message: '文件名不能包含特殊字符: \\ / : * ? " < > |' };
    }

    return { valid: true };
  };

  /**
   * 检查文件MIME类型是否合规
   * @param file 文件对象
   * @returns 是否合规及错误信息
   */
  const validateMimeType = (file: File): { valid: boolean; message?: string } => {
    // 检查文件的MIME类型
    if (!config.allowedMimeTypes.includes(file.type)) {
      // 如果MIME类型不在允许列表中，可能是因为浏览器无法正确识别MIME类型
      // 此时可以通过文件扩展名进行辅助验证
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedTypes = config.accept.split(',');
      
      if (!acceptedTypes.includes(fileExtension)) {
        return { valid: false, message: `文件类型不支持，请上传${config.tips.split('，')[0].replace('支持格式：', '')}` };
      }
    }
    return { valid: true };
  };

  /**
   * 文件上传前的验证
   */
  const beforeUpload = (file: File): boolean => {
    try {
      // 1. 检查文件名合规性
      const filenameValidation = validateFileName(file.name);
      if (!filenameValidation.valid) {
        setErrorMessage(filenameValidation.message || '文件名不合规');
        setUploadStatus('error');
        return false;
      }

      // 2. 检查文件大小
      if (file.size > config.maxSize) {
        setErrorMessage(`文件大小不能超过${Math.round(config.maxSize / 1024 / 1024)}MB`);
        setUploadStatus('error');
        return false;
      }

      // 3. 检查文件类型和MIME类型
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedTypes = config.accept.split(',');
      
      // 双重验证：扩展名和MIME类型
      if (!acceptedTypes.includes(fileExtension)) {
        setErrorMessage(`文件格式不支持，请上传${config.tips.split('，')[0].replace('支持格式：', '')}`);
        setUploadStatus('error');
        return false;
      }

      // MIME类型验证（更严格的检查）
      const mimeTypeValidation = validateMimeType(file);
      if (!mimeTypeValidation.valid) {
        setErrorMessage(mimeTypeValidation.message || '文件MIME类型不支持');
        setUploadStatus('error');
        return false;
      }

      // 4. 检查文件是否为空
      if (file.size === 0) {
        setErrorMessage('不能上传空文件');
        setUploadStatus('error');
        return false;
      }

      setErrorMessage('');
      setUploadStatus('uploading');
      setUploadProgress(0);
    
    // 模拟上传过程
    simulateUploadProgress();
    
    // 模拟上传成功
      setTimeout(() => {
        try {
          const fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            uploadTime: new Date().toISOString()
          };
          
          setUploadedFile(fileInfo);
          setUploadStatus('success');
          onUploadSuccess?.(fileInfo);
        } catch (error) {
          // 处理文件信息创建过程中的异常
          setErrorMessage('文件处理过程中发生错误，请重试');
          setUploadStatus('error');
        }
      }, 2000);
      
      return false; // 阻止默认上传行为
    } catch (error) {
      // 全局异常捕获，处理不可预见的错误
      setErrorMessage('文件验证过程中发生未知错误，请重试');
      setUploadStatus('error');
      return false;
    }
  };

  /**
   * 模拟文件上传进度
   */
  const simulateUploadProgress = () => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  /**
   * 删除已上传文件
   */
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadStatus('normal');
    setUploadProgress(0);
    setErrorMessage('');
    onFileRemove?.(uploadedFile);
  };

  /**
   * 重新上传
   */
  const handleReUpload = () => {
    setUploadedFile(null);
    setUploadStatus('normal');
    setUploadProgress(0);
    setErrorMessage('');
  };

  return (
    <div className="space-y-4">
      {/* 上传区域标题 */}
      <div className="text-center">
        <Title heading={5} className="mb-2">{config.title}</Title>
        <Text type="secondary">{config.description}</Text>
      </div>

      {/* 错误提示 */}
      {uploadStatus === 'error' && errorMessage && (
        <Alert
          type="error"
          content={errorMessage}
          closable
          onClose={() => {
            setErrorMessage('');
            setUploadStatus('normal');
          }}
        />
      )}

      {/* 上传成功显示 */}
      {uploadStatus === 'success' && uploadedFile && (
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <IconCheck className="text-green-600" />
              </div>
              <div>
                <Text className="font-medium text-green-800">{uploadedFile.name}</Text>
                <br />
                <Text type="secondary" className="text-sm text-green-600">
                  {Math.round(uploadedFile.size / 1024)}KB • 上传成功
                </Text>
              </div>
            </div>
            <Space>
              <Button size="small" onClick={handleReUpload}>
                重新上传
              </Button>
              <Button
                size="small"
                type="text"
                icon={<IconDelete />}
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700"
              >
                删除
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* 上传进度显示 */}
      {uploadStatus === 'uploading' && (
        <Card>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <IconFile className="text-blue-500" />
              <Text>正在上传文件...</Text>
            </div>
            <Progress percent={uploadProgress} status="normal" />
          </div>
        </Card>
      )}

      {/* 上传拖拽区域 */}
      {uploadStatus === 'normal' && (
        <Upload
          accept={config.accept}
          beforeUpload={beforeUpload}
          showUploadList={false}
          drag
          className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
        >
          <div className="py-8 text-center">
            <div className="mb-4">
              <IconUpload className="text-4xl text-gray-400" />
            </div>
            <Title heading={6} className="mb-2 text-gray-700">
              点击或拖拽文件到此区域上传
            </Title>
            <Text type="secondary" className="block mb-4">
              {config.tips}
            </Text>
            <Button type="primary" size="large">
              选择文件
            </Button>
          </div>
        </Upload>
      )}

      {/* 功能说明 */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="text-center py-3">
          <Title heading={6} className="text-blue-800 mb-2">
            {uploadType === 'ai' ? '🤖 AI智能识别' : '📊 表格数据解析'}
          </Title>
          <Text type="secondary" className="text-blue-600">
            {uploadType === 'ai' 
              ? '上传成功后，AI将自动识别文件中的申报信息，并填充到表单中'
              : '上传成功后，系统将自动解析表格数据，并生成对应的申报记录'
            }
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;