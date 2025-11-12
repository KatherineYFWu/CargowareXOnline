import React from 'react';
import { Progress, Typography } from '@arco-design/web-react';

const { Text } = Typography;

interface AIRecognitionLoaderProps {
  /** 是否显示加载状态 */
  loading: boolean;
  /** 是否显示识别成功状态 */
  success: boolean;
  /** 进度百分比 */
  percent: number;
}

/**
 * AI识别加载组件
 * 显示机器人头像和识别进度
 */
const AIRecognitionLoader: React.FC<AIRecognitionLoaderProps> = ({
  loading,
  success,
  percent
}) => {
  if (!loading && !success) {
    return null;
  }

  return (
    <div className="ai-recognition-loader" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      borderRadius: '12px',
      border: '1px solid #0ea5e9',
      margin: '16px 0'
    }}>
      {/* 机器人头像 */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: loading 
          ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' 
          : 'linear-gradient(45deg, #10b981, #059669)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        animation: loading ? 'pulse 2s infinite' : 'none',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
      }}>
        {loading ? (
          // 加载中的机器人图标
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15C3 16.1 3.9 17 5 17H8V21C8 22.1 8.9 23 10 23H14C15.1 23 16 22.1 16 21V17H19C20.1 17 21 16.1 21 15V9H21ZM7 15V9H17V15H7Z"/>
          </svg>
        ) : (
          // 成功的机器人图标
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
          </svg>
        )}
      </div>

      {/* 状态文字 */}
      <Text style={{
        fontSize: '16px',
        fontWeight: '600',
        color: loading ? '#1e40af' : '#059669',
        marginBottom: '12px'
      }}>
        {loading ? 'AI正在努力识别中~' : '识别成功！'}
      </Text>

      {/* 进度条 */}
      {loading && (
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <Progress
            percent={percent}
            status="normal"
            showText={false}
            style={{ marginBottom: '8px' }}
          />
          <Text style={{
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center',
            display: 'block'
          }}>
            正在分析文档内容... {percent}%
          </Text>
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <Text style={{
          fontSize: '14px',
          color: '#059669',
          textAlign: 'center'
        }}>
          文档识别完成，信息已自动填充到表单中
        </Text>
      )}


    </div>
  );
};

export default AIRecognitionLoader;