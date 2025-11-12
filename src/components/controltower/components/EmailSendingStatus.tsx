import React, { useState, useEffect } from 'react';
import { Button, Progress, Result } from '@arco-design/web-react';
import { IconLoading, IconCheckCircle, IconCloseCircle } from '@arco-design/web-react/icon';

interface EmailSendingStatusProps {
  recipients: number;
  onBack: () => void;
  onRetry?: () => void;
}

const EmailSendingStatus: React.FC<EmailSendingStatusProps> = ({ 
  recipients, 
  onBack,
  onRetry 
}) => {
  const [status, setStatus] = useState<'sending' | 'success' | 'partial' | 'error'>('sending');
  const [progress, setProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  // 模拟发送过程
  useEffect(() => {
    if (status !== 'sending') return;

    const total = recipients;
    let sent = 0;
    let failed = 0;

    const interval = setInterval(() => {
      // 随机决定是成功还是失败
      if (Math.random() > 0.1) { // 90% 成功率
        sent++;
        setSentCount(sent);
      } else {
        failed++;
        setFailedCount(failed);
      }

      const newProgress = Math.round(((sent + failed) / total) * 100);
      setProgress(newProgress);

      // 检查是否完成
      if (sent + failed >= total) {
        clearInterval(interval);
        if (failed === 0) {
          setStatus('success');
        } else if (sent > 0) {
          setStatus('partial');
        } else {
          setStatus('error');
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [status, recipients]);

  const renderContent = () => {
    switch (status) {
      case 'sending':
        return (
          <div className="text-center py-8">
            <IconLoading className="text-4xl text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">正在发送邮件</h3>
            <p className="text-gray-600 mb-6">正在向 {recipients} 个收件人发送邮件，请稍候...</p>
            <div className="max-w-md mx-auto">
              <Progress percent={progress} showText />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>已发送: {sentCount}</span>
                <span>失败: {failedCount}</span>
                <span>总计: {recipients}</span>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <Result
            status="success"
            title="邮件发送成功"
            subTitle={`已成功向 ${sentCount} 个收件人发送邮件`}
            extra={[
              <Button key="back" type="primary" onClick={onBack}>
                返回首页
              </Button>
            ]}
          />
        );

      case 'partial':
        return (
          <Result
            status="warning"
            title="邮件发送部分成功"
            subTitle={`成功发送 ${sentCount} 封邮件，${failedCount} 封邮件发送失败`}
            extra={[
              <Button key="retry" type="primary" onClick={onRetry}>
                重新发送失败邮件
              </Button>,
              <Button key="back" onClick={onBack}>
                返回首页
              </Button>
            ]}
          />
        );

      case 'error':
        return (
          <Result
            status="error"
            title="邮件发送失败"
            subTitle="所有邮件发送失败，请检查网络连接或收件人信息后重试"
            extra={[
              <Button key="retry" type="primary" onClick={onRetry}>
                重新发送
              </Button>,
              <Button key="back" onClick={onBack}>
                返回首页
              </Button>
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="email-sending-status">
      {renderContent()}
    </div>
  );
};

export default EmailSendingStatus;