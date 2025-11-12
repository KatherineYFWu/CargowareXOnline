import React from 'react';
import { Button } from '@arco-design/web-react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  /** 是否显示对话框 */
  visible: boolean;
  /** 对话框标题 */
  title?: string;
  /** 对话框内容 */
  content?: string;
  /** 确认按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 点击确认按钮的回调 */
  onOk?: () => void;
  /** 点击取消按钮的回调 */
  onCancel?: () => void;
  /** 确认按钮类型 */
  okType?: 'primary' | 'secondary' | 'dashed' | 'text' | 'outline';
}

/**
 * 自定义确认对话框组件
 * 用于替代 Arco Design 的 Modal.confirm，避免 React 19 兼容性问题
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title = '确认',
  content,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  okType = 'primary'
}) => {
  if (!visible) return null;

  /**
   * 处理确认按钮点击事件
   */
  const handleOk = () => {
    onOk?.();
  };

  /**
   * 处理取消按钮点击事件
   */
  const handleCancel = () => {
    onCancel?.();
  };

  /**
   * 处理遮罩层点击事件
   */
  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="confirm-dialog-mask" onClick={handleMaskClick}>
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <h3 className="confirm-dialog-title">{title}</h3>
        </div>
        
        <div className="confirm-dialog-body">
          <div className="confirm-dialog-content">{content}</div>
        </div>
        
        <div className="confirm-dialog-footer">
          <Button 
            onClick={handleCancel}
            style={{ marginRight: '8px' }}
          >
            {cancelText}
          </Button>
          <Button 
            type={okType}
            onClick={handleOk}
          >
            {okText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;