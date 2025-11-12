import React from 'react';
import { Button, Typography, Upload, Message } from '@arco-design/web-react';
import { IconClose, IconUpload, IconCheckCircle } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'agreement' | 'success' | 'rejection';
  title: string;
  children?: React.ReactNode;
}

/**
 * 自定义弹窗组件
 * @description 避免ArcoDesign Modal兼容性问题的自定义弹窗实现
 */
const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, type, title, children }) => {
  if (!visible) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        {/* 弹窗内容 */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: type === 'agreement' || type === 'rejection' ? '520px' : '400px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 弹窗头部 */}
          <div style={{
            padding: '24px 24px 0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Title heading={5} style={{ margin: 0, color: '#1d2129' }}>
              {title}
            </Title>
            <Button 
              type="text" 
              icon={<IconClose />} 
              onClick={onClose}
              style={{
                color: '#86909c',
                padding: '4px'
              }}
            />
          </div>
          
          {/* 弹窗内容 */}
          <div style={{ padding: '20px 24px 24px 24px' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * 协议上传弹窗组件
 */
interface AgreementModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const AgreementModal: React.FC<AgreementModalProps> = ({ visible, onClose, onUploadSuccess }) => {
  const [uploading, setUploading] = React.useState(false);

  /**
   * 处理文件上传
   */
  const handleUpload = async (file: File) => {
    setUploading(true);
    
    // 这里可以添加实际的文件上传逻辑
    // 例如：调用API上传文件
    console.log('上传文件:', file.name);
    
    // 模拟上传过程
    setTimeout(() => {
      setUploading(false);
      onUploadSuccess();
      onClose();
      Message.success('上传成功');
    }, 2000);
    
    return false; // 阻止默认上传行为
  };

  /**
   * 下载协议模板
   */
  const handleDownloadTemplate = () => {
    // 模拟下载协议模板
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'service_agreement_template.pdf';
    link.click();
    Message.info('协议模板下载中...');
  };

  return (
    <CustomModal visible={visible} onClose={onClose} type="agreement" title="申请开通">
      <div style={{ textAlign: 'center' }}>
        <Text style={{ color: '#4e5969', fontSize: '14px', lineHeight: '1.6' }}>
          此应用需签订协议后使用，请上传加盖公章的协议文本等待审核开通。
        </Text>
        
        {/* 文件上传区域 */}
        <div style={{ margin: '24px 0' }}>
          <Upload
            drag
            accept=".pdf,.jpg,.jpeg,.png"
            limit={1}
            beforeUpload={handleUpload}
            showUploadList={false}
            style={{
              width: '100%'
            }}
          >
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              transition: 'all 0.3s ease'
            }}>
              <IconUpload style={{ fontSize: '32px', color: '#86909c', marginBottom: '12px' }} />
              <div>
                <Text style={{ color: '#1d2129', fontSize: '14px', fontWeight: '500' }}>
                  点击或拖拽文件到此区域上传
                </Text>
                <br />
                <Text style={{ color: '#86909c', fontSize: '12px' }}>
                  支持 PDF、JPG、PNG 格式，大小不超过 10M
                </Text>
              </div>
            </div>
          </Upload>
        </div>
        
        {/* 下载模板提示 */}
        <div style={{ marginBottom: '24px' }}>
          <Text style={{ color: '#4e5969', fontSize: '13px' }}>
            如您没有协议文件，请
            <span 
              style={{ 
                color: '#165dff', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={handleDownloadTemplate}
            >
              下载模板
            </span>
          </Text>
        </div>
        
        {/* 底部按钮 */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button onClick={onClose} style={{ minWidth: '80px' }}>
            取消
          </Button>
          <Button 
            type="primary" 
            loading={uploading}
            style={{ minWidth: '80px' }}
            onClick={() => {
              // 这里可以添加确认上传的逻辑
              Message.info('请先选择文件上传');
            }}
          >
            确认上传
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

/**
 * 开通成功弹窗组件
 */
interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => {
  return (
    <CustomModal visible={visible} onClose={onClose} type="success" title="开通成功">
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <IconCheckCircle 
          style={{ 
            fontSize: '64px', 
            color: '#00b42a', 
            marginBottom: '20px' 
          }} 
        />
        <div style={{ marginBottom: '24px' }}>
          <Text style={{ 
            color: '#1d2129', 
            fontSize: '16px', 
            fontWeight: '500',
            lineHeight: '1.6'
          }}>
            开通成功！请尽情体验我们的工具化服务！
          </Text>
        </div>
        
        {/* 关闭按钮 */}
        <Button 
          type="primary" 
          onClick={onClose}
          style={{ minWidth: '100px' }}
        >
          关闭
        </Button>
      </div>
    </CustomModal>
  );
};

/**
 * 拒绝原因弹窗组件属性
 */
interface RejectionModalProps {
  visible: boolean;
  onClose: () => void;
  onReupload: () => void;
  rejectionReason: string;
  appName: string;
}

/**
 * 拒绝原因弹窗组件
 * @description 显示应用审核拒绝原因，并提供重新上传功能
 */
export const RejectionModal: React.FC<RejectionModalProps> = ({ 
  visible, 
  onClose, 
  onReupload, 
  rejectionReason, 
  appName 
}) => {
  const [uploading, setUploading] = React.useState(false);

  /**
   * 处理文件上传
   */
  const handleUpload = async (file: File) => {
    setUploading(true);
    
    // 这里可以添加实际的文件上传逻辑
    console.log('重新上传文件:', file.name);
    
    // 模拟上传过程
    setTimeout(() => {
      setUploading(false);
      onReupload();
      onClose();
      Message.success('重新上传成功，请等待审核');
    }, 2000);
    
    return false; // 阻止默认上传行为
  };

  /**
   * 下载协议模板
   */
  const handleDownloadTemplate = () => {
    // 模拟下载协议模板
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'service_agreement_template.pdf';
    link.click();
    Message.info('协议模板下载中...');
  };

  return (
    <CustomModal visible={visible} onClose={onClose} type="rejection" title={`${appName} - 审核结果`}>
      <div style={{ textAlign: 'center' }}>
        {/* 拒绝原因显示 */}
        <div style={{ 
          backgroundColor: '#fff2f0', 
          border: '1px solid #ffccc7', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <Title heading={6} style={{ margin: '0 0 8px 0', color: '#cf1322' }}>
            拒绝原因
          </Title>
          <Text style={{ color: '#8c8c8c', fontSize: '14px', lineHeight: '1.6' }}>
            {rejectionReason}
          </Text>
        </div>
        
        <Text style={{ color: '#4e5969', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', display: 'block' }}>
          请根据拒绝原因修改相关材料后重新上传，我们将重新进行审核。
        </Text>
        
        {/* 文件上传区域 */}
        <div style={{ margin: '24px 0' }}>
          <Upload
            drag
            accept=".pdf,.jpg,.jpeg,.png"
            limit={1}
            beforeUpload={handleUpload}
            showUploadList={false}
            style={{
              width: '100%'
            }}
          >
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              transition: 'all 0.3s ease'
            }}>
              <IconUpload style={{ fontSize: '32px', color: '#86909c', marginBottom: '12px' }} />
              <div>
                <Text style={{ color: '#1d2129', fontSize: '14px', fontWeight: '500' }}>
                  点击或拖拽文件到此区域上传
                </Text>
                <br />
                <Text style={{ color: '#86909c', fontSize: '12px' }}>
                  支持 PDF、JPG、PNG 格式，大小不超过 10M
                </Text>
              </div>
            </div>
          </Upload>
        </div>
        
        {/* 下载模板提示 */}
        <div style={{ marginBottom: '24px' }}>
          <Text style={{ color: '#4e5969', fontSize: '13px' }}>
            如您没有协议文件，请
            <span 
              style={{ 
                color: '#165dff', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={handleDownloadTemplate}
            >
              下载模板
            </span>
          </Text>
        </div>
        
        {/* 底部按钮 */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button onClick={onClose} style={{ minWidth: '80px' }}>
            取消
          </Button>
          <Button 
            type="primary" 
            loading={uploading}
            style={{ minWidth: '80px' }}
            onClick={() => {
              // 这里可以添加确认上传的逻辑
              Message.info('请先选择文件上传');
            }}
          >
            重新上传
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default CustomModal;