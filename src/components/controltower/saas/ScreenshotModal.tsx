import React, { useState } from 'react';
import {
  Modal,
  Button,
  Input,
  Switch,
  Typography,
  Space,
  Radio
} from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ScreenshotModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave?: (data: { customDisplay: boolean; displayText: string; content: string }) => void;
}

/**
 * 截图弹窗组件
 * 提供自定义展示文本的功能
 */
const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  visible,
  onCancel,
  onSave
}) => {
  const [customDisplay, setCustomDisplay] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const [content, setContent] = useState('');
  const [displayPosition, setDisplayPosition] = useState('top');

  /**
   * 处理保存操作
   */
  const handleSave = () => {
    if (onSave) {
      onSave({
        customDisplay,
        displayText,
        content
      });
    }
    onCancel();
  };

  /**
   * 处理取消操作
   */
  const handleCancel = () => {
    // 重置表单数据
    setCustomDisplay(true);
    setDisplayText('');
    setContent('');
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title heading={6} style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>
            快速报价
          </Title>
          <Button
            type="text"
            icon={<IconClose />}
            onClick={handleCancel}
            style={{
              color: '#666',
              fontSize: '16px',
              padding: '4px',
              height: '24px',
              width: '24px'
            }}
          />
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      closable={false}
      style={{
        width: '400px'
      }}
      wrapStyle={{
        padding: '16px 20px'
      }}
    >
      {/* 提示信息 */}
      <div style={{ 
        backgroundColor: '#e6f7ff', 
        padding: '8px 12px', 
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '12px',
        color: '#1890ff'
      }}>
        此处设置内容将展示在生成的报价文本中
      </div>

      {/* 自定义展示文本开关 */}
      <div style={{ marginBottom: '16px' }}>
        <Space align="center">
          <Switch
            checked={customDisplay}
            onChange={setCustomDisplay}
            size="small"
          />
          <Text style={{ fontSize: '14px' }}>自定义展示文本</Text>
        </Space>
      </div>

      {/* 文本输入区域 */}
      <div style={{ marginBottom: '16px' }}>
        <TextArea
          placeholder="请输入默认展示文本"
          value={content}
          onChange={setContent}
          style={{
            minHeight: '120px',
            fontSize: '12px',
            resize: 'none'
          }}
          showWordLimit
          maxLength={50}
        />
      </div>

      {/* 展示位置选择 */}
      <div style={{ marginBottom: '20px' }}>
        <Text style={{ fontSize: '14px', color: '#666', marginRight: '16px' }}>展示位置：</Text>
        <Radio.Group
          value={displayPosition}
          onChange={setDisplayPosition}
          style={{
            '--color-radio-checked': '#1890ff',
            '--color-radio-checked-hover': '#40a9ff'
          } as React.CSSProperties}
        >
          <Radio value="top" style={{ fontSize: '12px', color: '#666' }}>
            置顶展示
          </Radio>
          <Radio value="bottom" style={{ fontSize: '12px', color: '#666', marginLeft: '16px' }}>
            置底展示
          </Radio>
        </Radio.Group>
      </div>

      {/* 底部按钮 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: '8px'
      }}>
        <Button 
          onClick={handleCancel}
          style={{
            height: '32px',
            fontSize: '14px'
          }}
        >
          取消
        </Button>
        <Button 
          type="primary"
          onClick={handleSave}
          style={{
            height: '32px',
            fontSize: '14px',
            backgroundColor: '#1890ff',
            borderColor: '#1890ff'
          }}
        >
          保存
        </Button>
      </div>
    </Modal>
  );
};

export default ScreenshotModal;