import React, { createContext, useContext, useState, ReactNode } from 'react';

// Template data types
interface EmailTemplate {
  id: string;
  operationId: string;
  status: '启用' | '停用';
}

interface WechatTemplate {
  id: string;
  operationId: string;
  status: '启用' | '停用';
}

interface SmsTemplate {
  id: string;
  operationId: string;
  status: '启用' | '停用';
}

interface TemplateContextType {
  emailTemplates: EmailTemplate[];
  wechatTemplates: WechatTemplate[];
  smsTemplates: SmsTemplate[];
  updateEmailTemplates: (templates: EmailTemplate[]) => void;
  updateWechatTemplates: (templates: WechatTemplate[]) => void;
  updateSmsTemplates: (templates: SmsTemplate[]) => void;
  hasTemplates: (operationId: string, type?: 'email' | 'wechat' | 'sms') => boolean;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Mock initial data
// 注意：只有 OP001(提交询价) 和 OP002(更改询价) 有启用的模板
// 其他操作都没有模板，用于演示无模板时的提示
const mockEmailTemplates: EmailTemplate[] = [
  { id: 'EM001', operationId: 'OP001', status: '启用' },
  { id: 'EM002', operationId: 'OP002', status: '启用' }
];

const mockWechatTemplates: WechatTemplate[] = [
  { id: 'WC001', operationId: 'OP001', status: '启用' },
  { id: 'WC002', operationId: 'OP002', status: '启用' }
];

const mockSmsTemplates: SmsTemplate[] = [
  { id: 'SMS001', operationId: 'OP001', status: '启用' },
  { id: 'SMS002', operationId: 'OP002', status: '启用' }
];

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [wechatTemplates, setWechatTemplates] = useState<WechatTemplate[]>(mockWechatTemplates);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>(mockSmsTemplates);

  const updateEmailTemplates = (templates: EmailTemplate[]) => {
    setEmailTemplates(templates);
  };

  const updateWechatTemplates = (templates: WechatTemplate[]) => {
    setWechatTemplates(templates);
  };

  const updateSmsTemplates = (templates: SmsTemplate[]) => {
    setSmsTemplates(templates);
  };

  const hasTemplates = (operationId: string, type?: 'email' | 'wechat' | 'sms'): boolean => {
    // Check if operation has at least one enabled template of specific type
    if (type === 'email') {
      return emailTemplates.some(t => t.operationId === operationId && t.status === '启用');
    }
    if (type === 'wechat') {
      return wechatTemplates.some(t => t.operationId === operationId && t.status === '启用');
    }
    if (type === 'sms') {
      return smsTemplates.some(t => t.operationId === operationId && t.status === '启用');
    }
    
    // If no type specified, check any
    const hasEmailTemplate = emailTemplates.some(
      t => t.operationId === operationId && t.status === '启用'
    );
    const hasWechatTemplate = wechatTemplates.some(
      t => t.operationId === operationId && t.status === '启用'
    );
    const hasSmsTemplate = smsTemplates.some(
      t => t.operationId === operationId && t.status === '启用'
    );
    
    return hasEmailTemplate || hasWechatTemplate || hasSmsTemplate;
  };

  return (
    <TemplateContext.Provider
      value={{
        emailTemplates,
        wechatTemplates,
        smsTemplates,
        updateEmailTemplates,
        updateWechatTemplates,
        updateSmsTemplates,
        hasTemplates
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplateContext = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplateContext must be used within a TemplateProvider');
  }
  return context;
};
