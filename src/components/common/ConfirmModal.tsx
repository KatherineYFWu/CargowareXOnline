import React from 'react';
import { Button } from '@arco-design/web-react';

interface ConfirmModalProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 弹窗标题 */
  title?: string;
  /** 弹窗内容 */
  content: string;
  /** 确认按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 点击确认的回调 */
  onOk: () => void;
  /** 点击取消的回调 */
  onCancel: () => void;
  /** 确认按钮是否加载中 */
  loading?: boolean;
}

/**
 * 自定义确认弹窗组件
 * 避免ArcoDesign Modal组件的兼容性问题
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = '确认',
  content,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  loading = false
}) => {
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
        onClick={onCancel}
      >
        {/* 弹窗主体 */}
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '28rem',
            width: '100%',
            margin: '0 1rem',
            animation: visible ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
          }}
        >
          {/* 弹窗头部 */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              {title}
            </h3>
          </div>
          
          {/* 弹窗内容 */}
          <div style={{
            padding: '1rem 1.5rem'
          }}>
            <p style={{
              color: '#374151',
              lineHeight: '1.625',
              margin: 0
            }}>
              {content}
            </p>
          </div>
          
          {/* 弹窗底部按钮 */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}>
            <Button 
              onClick={onCancel}
              disabled={loading}
              style={{
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                color: '#374151'
              }}
            >
              {cancelText}
            </Button>
            <Button 
              type="primary"
              onClick={onOk}
              loading={loading}
              style={{
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none'
              }}
            >
              {okText}
            </Button>
          </div>
        </div>
      </div>
      
      {/* CSS动画样式 */}

    </>
  );
};

export default ConfirmModal;