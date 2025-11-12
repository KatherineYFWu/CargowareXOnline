import React from 'react';
import { Progress } from '@arco-design/web-react';
import { IconRobot, IconCheck } from '@arco-design/web-react/icon';

interface AIRecognitionLoaderProps {
  loading: boolean;
  success: boolean;
  percent: number;
}

/**
 * AI识别加载组件
 * 显示机器人头像、识别状态和进度条
 */
const AIRecognitionLoader: React.FC<AIRecognitionLoaderProps> = ({ 
  loading, 
  success, 
  percent 
}) => {
  return (
    <div className="ai-recognition-loader" style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      borderRadius: '12px',
      border: '1px solid #0ea5e9',
      textAlign: 'center'
    }}>
      {/* 机器人头像和状态文字 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        {loading && (
          <>
            <IconRobot style={{ 
              fontSize: '32px', 
              color: '#0ea5e9',
              marginRight: '12px',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ 
              fontSize: '16px', 
              color: '#0369a1',
              fontWeight: '500'
            }}>
              AI正在努力识别中~
            </span>
          </>
        )}
        
        {success && (
          <>
            <IconCheck style={{ 
              fontSize: '32px', 
              color: '#10b981',
              marginRight: '12px'
            }} />
            <span style={{ 
              fontSize: '16px', 
              color: '#059669',
              fontWeight: '500'
            }}>
              识别成功！
            </span>
          </>
        )}
      </div>
      
      {/* 进度条 */}
      {loading && (
        <Progress 
          percent={percent} 
          status="normal"
          showText={false}
          size="large"
          style={{ marginBottom: '8px' }}
        />
      )}
      
      {/* 进度百分比 */}
      {loading && (
        <div style={{ 
          fontSize: '14px', 
          color: '#0369a1',
          marginTop: '8px'
        }}>
          {Math.round(percent)}%
        </div>
      )}
    </div>
  );
};

export default AIRecognitionLoader;