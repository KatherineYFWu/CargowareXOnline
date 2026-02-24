import React, { useState, useEffect } from 'react';
import {
  Card,
  Space,
  Button,
  Modal,
  Tabs,
  Table,
  Typography,
  Message,
  Input,
  Form,
  Select,
  Popconfirm,
  Tag,
  Grid,
  Tooltip
} from '@arco-design/web-react';
import EmailEditor from '../components/EmailEditor';
import EnhancedOperationSelector from '../components/EnhancedOperationSelector';
import VariableSelector from '../components/VariableSelector';
import {
  IconPlus,
  IconSearch,
  IconInfoCircle,
  IconClose,
  IconDelete
} from '@arco-design/web-react/icon';
import { useTemplateContext } from '../../../contexts/TemplateContext';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Row, Col } = Grid;
const FormItem = Form.Item;

// 数据类型定义
interface EmailTemplate {
  id: string;
  templateName: string;
  operationId: string;
  operationName: string;
  description?: string;
  status: '启用' | '停用';
  creator: string;
  lastUpdated: string;
  subject: string;
  content: string;
  footer?: string;
  redirectLink?: string;
}

interface WechatTemplate {
  id: string;
  operationId: string;
  operationName: string;
  description?: string;
  status: '启用' | '停用';
  templateType: '纯文本' | '文本卡片' | '图文消息' | '文件';
  creator: string;
  lastUpdated: string;
  content: any; // 根据模板类型动态变化
  file?: {
    name: string;
    size: number;
    url: string;
  };
}

interface SmsTemplate {
  id: string;
  templateName: string;
  operationId: string;
  operationName: string;
  description?: string;
  status: '启用' | '停用' | '审核中' | '审核失败';
  creator: string;
  lastUpdated: string;
  content: string;
  rejectReason?: string;
  sceneDescription?: string; // 场景说明
}

// 预制短信模板
const prefabricatedSmsTemplates = [
  {
    id: 'PRE-004',
    templateName: '报价完成通知',
    content: '【CargoWare X】尊敬的客户，您的询价单${inquiryNo}已完成报价，请登录系统查看详情。',
    description: '报价完成通知'
  }
];

// 操作管理数据
const mockOperations = [
  { id: 'OP001', name: '提交询价' },
  { id: 'OP002', name: '更改询价' },
  { id: 'OP003', name: '撤回询价' },
  { id: 'OP004', name: '提交报价' },
  { id: 'OP005', name: '更改报价' },
  { id: 'OP006', name: '撤回报价' },
  { id: 'OP007', name: '确认订单' },
  { id: 'OP008', name: '取消订单' },
];

// 变量列表
const variableList = [
  "操作人姓名", "操作人邮箱", "操作时间", "接收人姓名", "接收人邮箱",
  "询价单编号", "询价客户", "询价单状态", "询价单创建日期", "业务类型",
  "报价金额", "报价货币", "报价有效期", "报价备注", "操作链接"
];

// 模拟数据
const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'EM001',
    templateName: '询价提交通知模板',
    operationId: 'OP001',
    operationName: '提交询价',
    description: '客户提交询价单时的邮件通知模板',
    status: '启用',
    creator: 'admin',
    lastUpdated: '2024-01-15 10:30:00',
    subject: '询价单已提交 - {询价单编号}',
    content: '<p>尊敬的{接收人姓名}：</p><p>您收到一个新的询价单：</p><ul><li>询价单编号：{询价单编号}</li><li>客户：{询价客户}</li><li>业务类型：{业务类型}</li></ul><p>请及时处理。</p>',
    footer: '此邮件由系统自动发送，请勿回复。'
  },
  {
    id: 'EM002',
    templateName: '报价提交通知模板',
    operationId: 'OP004',
    operationName: '提交报价',
    description: '销售提交报价给客户的邮件通知模板',
    status: '启用',
    creator: 'sales',
    lastUpdated: '2024-01-14 14:20:00',
    subject: '报价已提交 - {报价单编号}',
    content: '<p>尊敬的{接收人姓名}：</p><p>您收到一个新的报价：</p><ul><li>报价单编号：{报价单编号}</li><li>报价金额：{报价金额} {报价货币}</li><li>有效期：{报价有效期}</li></ul><p>请及时确认。</p>',
    footer: '此邮件由系统自动发送，请勿回复。'
  },
  {
    id: 'EM003',
    templateName: '询价备用模板',
    operationId: 'OP001',
    operationName: '提交询价',
    description: '备用询价邮件模板',
    status: '停用',
    creator: 'admin',
    lastUpdated: '2024-01-13 09:15:00',
    subject: '新的询价需求 - {询价单编号}',
    content: '<p>您好：</p><p>有新的询价需求等待处理。</p>',
    footer: '此邮件由系统自动发送，请勿回复。'
  }
];

const mockWechatTemplates: WechatTemplate[] = [
  {
    id: 'WC001',
    operationId: 'OP001',
    operationName: '提交询价',
    description: '客户提交询价单时的企微通知模板',
    status: '启用',
    templateType: '文本卡片',
    creator: 'admin',
    lastUpdated: '2024-01-15 10:30:00',
    content: {
      title: '新的询价单',
      description: '客户{询价客户}提交了询价单{询价单编号}',
      url: '{操作链接}',
      btntxt: '查看详情'
    }
  },
  {
    id: 'WC002',
    operationId: 'OP004',
    operationName: '提交报价',
    description: '报价提交成功的企微通知模板',
    status: '启用',
    templateType: '纯文本',
    creator: 'sales',
    lastUpdated: '2024-01-14 14:20:00',
    content: {
      text: '报价单{报价单编号}已提交给客户{询价客户}，金额{报价金额}{报价货币}',
      safe: 0
    }
  },
  {
    id: 'WC003',
    operationId: 'OP007',
    operationName: '确认订单',
    description: '订单确认的企微图文消息模板',
    status: '停用',
    templateType: '图文消息',
    creator: 'admin',
    lastUpdated: '2024-01-13 09:15:00',
    content: {
      title: '订单已确认',
      description: '客户已确认订单{订单编号}，金额{订单金额}',
      url: '{操作链接}',
      picurl: 'https://example.com/order.png'
    }
  }
];

const mockSmsTemplates: SmsTemplate[] = [
  {
    id: 'SMS-001',
    templateName: '询价提交通知短信',
    operationId: 'OP001',
    operationName: '提交询价',
    description: '客户提交询价单时的短信通知',
    status: '启用',
    creator: 'admin',
    lastUpdated: '2024-01-15 10:30:00',
    content: '【CargoWare X】尊敬的客户，您的询价单{询价单编号}已提交，我们会尽快处理。'
  },
  {
    id: 'SMS-002',
    templateName: '报价提交通知短信',
    operationId: 'OP004',
    operationName: '提交报价',
    description: '销售提交报价给客户的短信通知',
    status: '停用',
    creator: 'sales',
    lastUpdated: '2024-01-14 14:20:00',
    content: '【CargoWare X】尊敬的客户，您的报价单{报价单编号}已生成，金额{报价金额}。'
  }
];

// 文件上传组件
interface FileUploadAreaProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
  onError?: (error: string) => void;
  maxSize?: number; // in MB
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ 
  file, 
  onFileChange, 
  error = '',
  onError,
  maxSize = 10 
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `文件大小超过限制（最大${maxSize}MB）`;
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      if (validationError) {
        onError?.(validationError);
        Message.error(validationError);
      } else {
        onFileChange(droppedFile);
        onError?.('');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        onError?.(validationError);
        Message.error(validationError);
      } else {
        onFileChange(selectedFile);
        onError?.('');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    onFileChange(null);
    onError?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: `2px dashed ${isDragging ? '#7466F0' : error ? '#f53f3f' : '#e5e6eb'}`,
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#f7f6fe' : '#fafafa',
          transition: 'all 0.3s ease',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        
        {!file ? (
          <>
            <div style={{ fontSize: '32px', marginBottom: '8px', color: '#86909c' }}>📁</div>
            <div style={{ color: '#4e5969', marginBottom: '4px' }}>
              拖拽文件到此处或点击上传
            </div>
            <div style={{ fontSize: '12px', color: '#86909c' }}>
              最大文件大小: {maxSize}MB
            </div>
          </>
        ) : (
          <div style={{ width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #e5e6eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '20px', marginRight: '12px' }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: 500, 
                    color: '#1d2129',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#86909c' }}>
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <Button
                type="text"
                size="small"
                status="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                style={{ marginLeft: '12px' }}
              >
                删除
              </Button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div style={{ color: '#f53f3f', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

interface ContentTextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  isPrefabricated?: boolean;
  onClear?: () => void;
}

const ContentTextArea: React.FC<ContentTextAreaProps> = ({ 
  value, 
  onChange, 
  disabled, 
  isPrefabricated, 
  onClear 
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <Input.TextArea
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="请输入短信内容..."
        autoSize={{ minRows: 4, maxRows: 8 }}
        showWordLimit
      />
      {isPrefabricated && (
        <Button
          icon={<IconClose />}
          shape="circle"
          size="mini"
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
          onClick={onClear}
        />
      )}
    </div>
  );
};

const NotificationTemplateSettings: React.FC = () => {
  const { updateEmailTemplates, updateWechatTemplates, updateSmsTemplates } = useTemplateContext();
  const [activeTab, setActiveTab] = useState('sms');
  
  // 邮件模板状态
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [filteredEmailTemplates, setFilteredEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  // Separate state for email filter inputs (not applied until search is clicked)
  const [emailFilterInputs, setEmailFilterInputs] = useState({
    id: '',
    operationName: '',
    description: '',
    status: '',
    creator: ''
  });
  
  // 企微模板状态
  const [wechatTemplates, setWechatTemplates] = useState<WechatTemplate[]>(mockWechatTemplates);
  const [filteredWechatTemplates, setFilteredWechatTemplates] = useState<WechatTemplate[]>(mockWechatTemplates);
  // Separate state for wechat filter inputs (not applied until search is clicked)
  const [wechatFilterInputs, setWechatFilterInputs] = useState({
    id: '',
    operationName: '',
    templateType: '',
    status: '',
    creator: ''
  });

  // 短信模板状态
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>(mockSmsTemplates);
  const [filteredSmsTemplates, setFilteredSmsTemplates] = useState<SmsTemplate[]>(mockSmsTemplates);
  const [smsFilterInputs, setSmsFilterInputs] = useState({
    id: '',
    operationName: '',
    description: '',
    status: '',
    creator: ''
  });
  
  // 弹窗状态
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [wechatModalVisible, setWechatModalVisible] = useState(false);
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [smsPreviewModalVisible, setSmsPreviewModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | WechatTemplate | SmsTemplate | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isPrefabricated, setIsPrefabricated] = useState(false);
  
  // 文件上传状态
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  
  // 表单状态
  const [emailForm] = Form.useForm();
  const [wechatForm] = Form.useForm();
  const [smsForm] = Form.useForm();
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Apply email filters when search button is clicked
  const handleSearchEmailFilters = () => {
    const filtered = emailTemplates.filter(template => {
      return (
        (!emailFilterInputs.id || template.id.toLowerCase().includes(emailFilterInputs.id.toLowerCase())) &&
        (!emailFilterInputs.operationName || template.operationName.toLowerCase().includes(emailFilterInputs.operationName.toLowerCase())) &&
        (!emailFilterInputs.description || (template.description && template.description.toLowerCase().includes(emailFilterInputs.description.toLowerCase()))) &&
        (!emailFilterInputs.status || template.status === emailFilterInputs.status) &&
        (!emailFilterInputs.creator || template.creator.toLowerCase().includes(emailFilterInputs.creator.toLowerCase()))
      );
    });
    setFilteredEmailTemplates(filtered);
  };

  // Apply wechat filters when search button is clicked
  const handleSearchWechatFilters = () => {
    const filtered = wechatTemplates.filter(template => {
      return (
        (!wechatFilterInputs.id || template.id.toLowerCase().includes(wechatFilterInputs.id.toLowerCase())) &&
        (!wechatFilterInputs.operationName || template.operationName.toLowerCase().includes(wechatFilterInputs.operationName.toLowerCase())) &&
        (!wechatFilterInputs.templateType || template.templateType === wechatFilterInputs.templateType) &&
        (!wechatFilterInputs.status || template.status === wechatFilterInputs.status) &&
        (!wechatFilterInputs.creator || template.creator.toLowerCase().includes(wechatFilterInputs.creator.toLowerCase()))
      );
    });
    setFilteredWechatTemplates(filtered);
  };

  // Apply sms filters when search button is clicked
  const handleSearchSmsFilters = () => {
    const filtered = smsTemplates.filter(template => {
      return (
        (!smsFilterInputs.id || template.id.toLowerCase().includes(smsFilterInputs.id.toLowerCase())) &&
        (!smsFilterInputs.operationName || template.operationName.toLowerCase().includes(smsFilterInputs.operationName.toLowerCase())) &&
        (!smsFilterInputs.description || (template.description && template.description.toLowerCase().includes(smsFilterInputs.description.toLowerCase()))) &&
        (!smsFilterInputs.status || template.status === smsFilterInputs.status) &&
        (!smsFilterInputs.creator || template.creator.toLowerCase().includes(smsFilterInputs.creator.toLowerCase()))
      );
    });
    setFilteredSmsTemplates(filtered);
  };

  // 处理邮件模板筛选变化
  const handleEmailFilterChange = (field: string, value: string) => {
    setEmailFilterInputs(prev => ({ ...prev, [field]: value }));
  };

  // 处理企微模板筛选变化
  const handleWechatFilterChange = (field: string, value: string) => {
    setWechatFilterInputs(prev => ({ ...prev, [field]: value }));
  };

  // 处理短信模板筛选变化
  const handleSmsFilterChange = (field: string, value: string) => {
    setSmsFilterInputs(prev => ({ ...prev, [field]: value }));
  };

  // 重置邮件模板筛选
  const handleResetEmailFilters = () => {
    setEmailFilterInputs({
      id: '',
      operationName: '',
      description: '',
      status: '',
      creator: ''
    });
    setFilteredEmailTemplates(emailTemplates);
  };

  // 重置企微模板筛选
  const handleResetWechatFilters = () => {
    setWechatFilterInputs({
      id: '',
      operationName: '',
      templateType: '',
      status: '',
      creator: ''
    });
    setFilteredWechatTemplates(wechatTemplates);
  };

  // 重置短信模板筛选
  const handleResetSmsFilters = () => {
    setSmsFilterInputs({
      id: '',
      operationName: '',
      description: '',
      status: '',
      creator: ''
    });
    setFilteredSmsTemplates(smsTemplates);
  };

  // 切换邮件模板状态
  const handleToggleEmailTemplateStatus = (template: EmailTemplate) => {
    const newStatus: '启用' | '停用' = template.status === '启用' ? '停用' : '启用';
    
    const updatedTemplates = emailTemplates.map(t => {
      if (t.operationId === template.operationId) {
        // 如果正在启用当前模板，停用同操作的其他模板
        if (newStatus === '启用') {
          return { ...t, status: (t.id === template.id ? '启用' : '停用') as '启用' | '停用' };
        }
        // 如果正在停用当前模板，只更新当前模板
        if (t.id === template.id) {
          return { ...t, status: newStatus as '启用' | '停用' };
        }
      }
      return t;
    });
    
    setEmailTemplates(updatedTemplates);
    // Update context to trigger warning icon updates
    updateEmailTemplates(updatedTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
    
    setFilteredEmailTemplates(updatedTemplates.filter(t => {
      return (
        (!emailFilterInputs.id || t.id.toLowerCase().includes(emailFilterInputs.id.toLowerCase())) &&
        (!emailFilterInputs.operationName || t.operationName.toLowerCase().includes(emailFilterInputs.operationName.toLowerCase())) &&
        (!emailFilterInputs.description || (t.description && t.description.toLowerCase().includes(emailFilterInputs.description.toLowerCase()))) &&
        (!emailFilterInputs.status || t.status === emailFilterInputs.status) &&
        (!emailFilterInputs.creator || t.creator.toLowerCase().includes(emailFilterInputs.creator.toLowerCase()))
      );
    }));
    
    if (newStatus === '启用') {
      Message.success('模板已启用');
    } else {
      Message.success('模板已停用');
    }
  };

  // 切换企微模板状态
  const handleToggleWechatTemplateStatus = (template: WechatTemplate) => {
    const newStatus: '启用' | '停用' = template.status === '启用' ? '停用' : '启用';
    
    const updatedTemplates = wechatTemplates.map(t => {
      if (t.operationId === template.operationId) {
        // 如果正在启用当前模板，停用同操作的其他模板
        if (newStatus === '启用') {
          return { ...t, status: (t.id === template.id ? '启用' : '停用') as '启用' | '停用' };
        }
        // 如果正在停用当前模板，只更新当前模板
        if (t.id === template.id) {
          return { ...t, status: newStatus as '启用' | '停用' };
        }
      }
      return t;
    });
    
    setWechatTemplates(updatedTemplates);
    // Update context to trigger warning icon updates
    updateWechatTemplates(updatedTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
    
    setFilteredWechatTemplates(updatedTemplates.filter(t => {
      return (
        (!wechatFilterInputs.id || t.id.toLowerCase().includes(wechatFilterInputs.id.toLowerCase())) &&
        (!wechatFilterInputs.operationName || t.operationName.toLowerCase().includes(wechatFilterInputs.operationName.toLowerCase())) &&
        (!wechatFilterInputs.templateType || t.templateType === wechatFilterInputs.templateType) &&
        (!wechatFilterInputs.status || t.status === wechatFilterInputs.status) &&
        (!wechatFilterInputs.creator || t.creator.toLowerCase().includes(wechatFilterInputs.creator.toLowerCase()))
      );
    }));
    
    if (newStatus === '启用') {
      Message.success('模板已启用');
    } else {
      Message.success('模板已停用');
    }
  };

  // 切换短信模板状态
  const handleToggleSmsTemplateStatus = (template: SmsTemplate) => {
    const newStatus: '启用' | '停用' = template.status === '启用' ? '停用' : '启用';
    
    const updatedTemplates = smsTemplates.map(t => {
      if (t.operationId === template.operationId) {
        // 如果正在启用当前模板，停用同操作的其他模板
        if (newStatus === '启用') {
          return { ...t, status: (t.id === template.id ? '启用' : '停用') as '启用' | '停用' };
        }
        // 如果正在停用当前模板，只更新当前模板
        if (t.id === template.id) {
          return { ...t, status: newStatus as '启用' | '停用' };
        }
      }
      return t;
    });
    
    setSmsTemplates(updatedTemplates);
    // Update context to trigger warning icon updates
    updateSmsTemplates(updatedTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
    
    setFilteredSmsTemplates(updatedTemplates.filter(t => {
      return (
        (!smsFilterInputs.id || t.id.toLowerCase().includes(smsFilterInputs.id.toLowerCase())) &&
        (!smsFilterInputs.operationName || t.operationName.toLowerCase().includes(smsFilterInputs.operationName.toLowerCase())) &&
        (!smsFilterInputs.description || (t.description && t.description.toLowerCase().includes(smsFilterInputs.description.toLowerCase()))) &&
        (!smsFilterInputs.status || t.status === smsFilterInputs.status) &&
        (!smsFilterInputs.creator || t.creator.toLowerCase().includes(smsFilterInputs.creator.toLowerCase()))
      );
    }));
    
    if (newStatus === '启用') {
      Message.success('模板已启用');
    } else {
      Message.success('模板已停用');
    }
  };

  // 删除邮件模板
  const handleDeleteEmailTemplate = (template: EmailTemplate) => {
    // 检查是否是最后一个同操作模板
    const sameOperationTemplates = emailTemplates.filter(t => t.operationId === template.operationId);
    if (sameOperationTemplates.length <= 1) {
      Message.error('不能删除最后一个同操作模板');
      return;
    }
    
    const updatedTemplates = emailTemplates.filter(t => t.id !== template.id);
    setEmailTemplates(updatedTemplates);
    // Update context to trigger warning icon updates
    updateEmailTemplates(updatedTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
    Message.success('模板删除成功');
  };

  // 删除企微模板
  const handleDeleteWechatTemplate = (template: WechatTemplate) => {
    // 检查是否是最后一个同操作模板
    const sameOperationTemplates = wechatTemplates.filter(t => t.operationId === template.operationId);
    if (sameOperationTemplates.length <= 1) {
      Message.error('不能删除最后一个同操作模板');
      return;
    }
    
    const updatedTemplates = wechatTemplates.filter(t => t.id !== template.id);
    setWechatTemplates(updatedTemplates);
    // Update context to trigger warning icon updates
    updateWechatTemplates(updatedTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
    Message.success('模板删除成功');
  };

  // 删除短信模板
  const handleDeleteSmsTemplate = (template: SmsTemplate) => {
    // 检查是否是最后一个同操作模板
    const sameOperationTemplates = smsTemplates.filter(t => t.operationId === template.operationId);
    if (sameOperationTemplates.length <= 1) {
      Message.error('不能删除最后一个同操作模板');
      return;
    }
    
    const updatedTemplates = smsTemplates.filter(t => t.id !== template.id);
    setSmsTemplates(updatedTemplates);
    // Update context to trigger warning icon updates
    updateSmsTemplates(updatedTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
    Message.success('模板删除成功');
  };

  // 新建邮件模板
  const handleCreateEmailTemplate = () => {
    setEditingTemplate(null);
    setIsEdit(false);
    emailForm.resetFields();
    setEmailModalVisible(true);
  };

  // 新建企微模板
  const handleCreateWechatTemplate = () => {
    setEditingTemplate(null);
    setIsEdit(false);
    wechatForm.resetFields();
    setUploadedFile(null);
    setFileError('');
    setWechatModalVisible(true);
  };

  // 新建短信模板
  const handleCreateSmsTemplate = () => {
    setEditingTemplate(null);
    setIsEdit(false);
    setIsPrefabricated(false);
    smsForm.resetFields();
    setSmsModalVisible(true);
  };

  // 编辑邮件模板
  const handleEditEmailTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsEdit(true);
    emailForm.setFieldsValue({
      operationId: template.operationId,
      description: template.description,
      subject: template.subject,
      content: template.content,
      footer: template.footer,
      redirectLink: template.redirectLink
    });
    setEmailModalVisible(true);
  };

  // 编辑企微模板
  const handleEditWechatTemplate = (template: WechatTemplate) => {
    setEditingTemplate(template);
    setIsEdit(true);
    
    // 根据模板类型设置不同的字段名
    const formValues: any = {
      operationId: template.operationId,
      templateType: template.templateType,
      description: template.description
    };
    
    if (template.templateType === '纯文本') {
      formValues.text = template.content.text;
      formValues.safe = template.content.safe;
    } else if (template.templateType === '文本卡片') {
      formValues.title = template.content.title;
      formValues.cardDescription = template.content.description;
      formValues.url = template.content.url;
      formValues.btntxt = template.content.btntxt;
    } else if (template.templateType === '图文消息') {
      formValues.title = template.content.title;
      formValues.newsDescription = template.content.description;
      formValues.url = template.content.url;
      formValues.picurl = template.content.picurl;
    } else if (template.templateType === '文件') {
      // For file type, we don't have the actual File object, just metadata
      setUploadedFile(null);
      setFileError('');
    }
    
    wechatForm.setFieldsValue(formValues);
    setWechatModalVisible(true);
  };

  // 编辑短信模板
  const handleEditSmsTemplate = (template: SmsTemplate) => {
    setEditingTemplate(template);
    setIsEdit(true);
    setIsPrefabricated(!!template.isPrefabricated);
    smsForm.setFieldsValue({
      templateName: template.templateName,
      operationId: template.operationId,
      content: template.content,
      description: template.description,
      sceneDescription: template.sceneDescription
    });
    setSmsModalVisible(true);
  };


  // 预览邮件模板
  const handlePreviewEmailTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setPreviewModalVisible(true);
  };

  // 预览短信模板
  const handlePreviewSmsTemplate = (template: SmsTemplate) => {
    setEditingTemplate(template);
    setSmsPreviewModalVisible(true);
  };

  // 保存邮件模板
  const handleSaveEmailTemplate = async (values: any) => {
    try {
      await emailForm.validate();
      
      let finalTemplates: EmailTemplate[];
      
      if (isEdit && editingTemplate) {
        // 编辑现有模板
        const updatedTemplates = emailTemplates.map(t => 
          t.id === editingTemplate.id 
            ? { 
                ...t, 
                ...values,
                operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
                lastUpdated: new Date().toLocaleString('zh-CN'),
                status: t.status
              }
            : t
        );
        finalTemplates = updatedTemplates;
        setEmailTemplates(updatedTemplates);
        Message.success('邮件模板更新成功');
      } else {
        // 创建新模板
        const newTemplate: EmailTemplate = {
          id: `EM${String(emailTemplates.length + 1).padStart(3, '0')}`,
          ...values,
          operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
          status: '启用', // 新建时自动启用
          creator: 'admin',
          lastUpdated: new Date().toLocaleString('zh-CN'),
          attachments: []
        };
        
        // 停用同操作的其他模板
        const updatedTemplates = emailTemplates.map(t => 
          t.operationId === values.operationId ? { ...t, status: '停用' as '启用' | '停用' } : t
        );
        
        finalTemplates = [...updatedTemplates, newTemplate];
        setEmailTemplates(finalTemplates);
        Message.success('邮件模板创建成功');
      }
      
      // Update context to trigger warning icon updates
      updateEmailTemplates(finalTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
      
      setEmailModalVisible(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 保存企微模板
  const handleSaveWechatTemplate = async (values: any) => {
    try {
      await wechatForm.validate();
      
      // 验证文件上传（当模板类型为"文件"时）
      if (values.templateType === '文件') {
        if (!uploadedFile && !isEdit) {
          setFileError('文件未上传');
          Message.error('文件未上传');
          return;
        }
      }
      
      let content: any;
      let fileData: any = undefined;
      
      if (values.templateType === '纯文本') {
        content = { text: values.text, safe: values.safe || 0 };
      } else if (values.templateType === '文本卡片') {
        content = { title: values.title, description: values.cardDescription, url: values.url, btntxt: values.btntxt };
      } else if (values.templateType === '图文消息') {
        content = { title: values.title, description: values.newsDescription, url: values.url, picurl: values.picurl };
      } else if (values.templateType === '文件') {
        content = {};
        if (uploadedFile) {
          // In a real application, you would upload the file to a server here
          // For now, we'll create a mock file object
          fileData = {
            name: uploadedFile.name,
            size: uploadedFile.size,
            url: URL.createObjectURL(uploadedFile) // Mock URL
          };
        }
      }
      
      let finalTemplates: WechatTemplate[];
      
      if (isEdit && editingTemplate) {
        // 编辑现有模板
        const updatedTemplates = wechatTemplates.map(t => 
          t.id === editingTemplate.id 
            ? { 
                ...t, 
                ...values,
                content,
                file: fileData || t.file,
                operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
                lastUpdated: new Date().toLocaleString('zh-CN'),
                status: t.status
              }
            : t
        );
        finalTemplates = updatedTemplates;
        setWechatTemplates(updatedTemplates);
        Message.success('企微模板更新成功');
      } else {
        // 创建新模板
        const newTemplate: WechatTemplate = {
          id: `WC${String(wechatTemplates.length + 1).padStart(3, '0')}`,
          ...values,
          content,
          file: fileData,
          operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
          status: '启用', // 新建时自动启用
          creator: 'admin',
          lastUpdated: new Date().toLocaleString('zh-CN')
        };
        
        // 停用同操作的其他模板
        const updatedTemplates = wechatTemplates.map(t => 
          t.operationId === values.operationId ? { ...t, status: '停用' as '启用' | '停用' } : t
        );
        
        finalTemplates = [...updatedTemplates, newTemplate];
        setWechatTemplates(finalTemplates);
        Message.success('企微模板创建成功');
      }
      
      // Update context to trigger warning icon updates
      updateWechatTemplates(finalTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status })));
      
      setWechatModalVisible(false);
      setEditingTemplate(null);
      setUploadedFile(null);
      setFileError('');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 保存短信模板
  const handleSaveSmsTemplate = async (values: any) => {
    try {
      await smsForm.validate();
      
      let finalTemplates: SmsTemplate[];
      // Determine status based on prefabricated or custom
      const newStatus = isPrefabricated ? '启用' : '审核中';
      
      if (isEdit && editingTemplate) {
        // 编辑现有模板
        const updatedTemplates = smsTemplates.map(t => 
          t.id === editingTemplate.id 
            ? { 
                ...t, 
                ...values,
                operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
                lastUpdated: new Date().toLocaleString('zh-CN'),
                status: newStatus,
                isPrefabricated,
                rejectReason: undefined // Clear reject reason on re-submit
              }
            : t
        );
        finalTemplates = updatedTemplates;
        setSmsTemplates(updatedTemplates);
        Message.success('短信模板更新成功');
      } else {
        // 创建新模板
        const newTemplate: SmsTemplate = {
          id: `SMS${String(smsTemplates.length + 1).padStart(3, '0')}`,
          ...values,
          operationName: mockOperations.find(op => op.id === values.operationId)?.name || '',
          status: newStatus,
          creator: 'admin',
          lastUpdated: new Date().toLocaleString('zh-CN'),
          isPrefabricated
        };
        
        // 停用同操作的其他模板
        const updatedTemplates = smsTemplates.map(t => 
          t.operationId === values.operationId ? { ...t, status: '停用' as any } : t
        );
        
        finalTemplates = [...updatedTemplates, newTemplate];
        setSmsTemplates(finalTemplates);
        Message.success('短信模板创建成功');
      }
      
      // Update context to trigger warning icon updates
      updateSmsTemplates(finalTemplates.map(t => ({ id: t.id, operationId: t.operationId, status: t.status as any })));
      
      setSmsModalVisible(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 插入变量
  const handleInsertVariable = (variable: string, field: string) => {
    const currentValue = emailForm.getFieldValue(field) || '';
    emailForm.setFieldValue(field, currentValue + `{${variable}}`);
  };

  // 插入短信变量
  const handleInsertSmsVariable = (variable: string) => {
    const currentValue = smsForm.getFieldValue('content') || '';
    smsForm.setFieldValue('content', currentValue + `{${variable}}`);
  };

  // 邮件模板列定义
  const emailTemplateColumns = [
    {
      title: '模板ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 150
    },
    {
      title: '触发操作',
      dataIndex: 'operationName',
      key: 'operationName',
      width: 120
    },
    {
      title: '模板描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (value: string) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    {
      title: '模板状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => (
        <Tag color={value === '启用' ? 'green' : 'red'}>{value}</Tag>
      )
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '最近更新时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 150
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: EmailTemplate) => (
        <Space>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handleToggleEmailTemplateStatus(record)}
          >
            {record.status === '启用' ? '停用' : '启用'}
          </Button>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handleEditEmailTemplate(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handlePreviewEmailTemplate(record)}
          >
            预览
          </Button>
          <Popconfirm
            title="确认删除"
            content="是否确认删除该邮件模板？"
            onOk={() => handleDeleteEmailTemplate(record)}
          >
            <Button 
              type="text" 
              size="mini" 
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 企微模板列定义
  const wechatTemplateColumns = [
    {
      title: '模板ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '触发操作',
      dataIndex: 'operationName',
      key: 'operationName',
      width: 120
    },
    {
      title: '模板类型',
      dataIndex: 'templateType',
      key: 'templateType',
      width: 100,
      render: (value: string) => (
        <Tag color="blue">{value}</Tag>
      )
    },
    {
      title: '模板描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (value: string) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    {
      title: '模板状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => (
        <Tag color={value === '启用' ? 'green' : 'red'}>{value}</Tag>
      )
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '最近更新时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 150
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: WechatTemplate) => (
        <Space>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handleToggleWechatTemplateStatus(record)}
          >
            {record.status === '启用' ? '停用' : '启用'}
          </Button>
          <Button 
            type="text" 
            size="mini"
            onClick={() => handleEditWechatTemplate(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            content="是否确认删除该企微模板？"
            onOk={() => handleDeleteWechatTemplate(record)}
          >
            <Button 
              type="text" 
              size="mini" 
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 短信模板列定义
  const smsTemplateColumns = [
    {
      title: '模板ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 150
    },
    {
      title: '触发操作',
      dataIndex: 'operationName',
      key: 'operationName',
      width: 120
    },
    {
      title: '模板状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: string, record: SmsTemplate) => {
        if (value === '审核失败') {
          return (
            <Tooltip content={record.rejectReason || '未知原因'}>
              <Tag color="red" style={{ cursor: 'pointer' }}>
                {value} <IconInfoCircle />
              </Tag>
            </Tooltip>
          );
        }
        let color = 'gray';
        if (value === '启用') color = 'green';
        if (value === '审核中') color = 'orange';
        if (value === '停用') color = 'red';
        return <Tag color={color}>{value}</Tag>;
      }
    },
    {
      title: '更新者',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '最近更新时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 150
    },
    {
      title: '模板描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (value: string) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: SmsTemplate) => (
        <Space>
          <Button 
            type="text" 
            size="mini"
            style={{color: '#165DFF'}}
            onClick={() => handleEditSmsTemplate(record)}
          >
            编辑
          </Button>
          {record.status !== '审核中' && record.status !== '审核失败' && (
            <Button 
              type="text" 
              size="mini"
              onClick={() => handleToggleSmsTemplateStatus(record)}
            >
              {record.status === '启用' ? '停用' : '启用'}
            </Button>
          )}
          <Button 
            type="text" 
            size="mini"
            onClick={() => handlePreviewSmsTemplate(record)}
          >
            预览
          </Button>
          <Popconfirm
            title="确认删除"
            content="是否确认删除该短信模板？"
            onOk={() => handleDeleteSmsTemplate(record)}
          >
            <Button 
              type="text" 
              size="mini"
              style={{color: '#F53F3F'}}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 短信模板表单弹窗
  const renderSmsTemplateModal = () => (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          {isEdit ? '编辑短信模板' : '新建短信模板'}
        </div>
      }
      visible={smsModalVisible}
      onCancel={() => {
        setSmsModalVisible(false);
        setEditingTemplate(null);
      }}
      footer={[
        <Button 
          key="cancel" 
          onClick={() => {
            setSmsModalVisible(false);
            setEditingTemplate(null);
          }}
        >
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => smsForm.submit()}>
          确定
        </Button>
      ]}
      style={{ width: '600px' }}
    >
      <div style={{ 
        backgroundColor: '#f7f8fa', 
        padding: '12px', 
        borderRadius: '4px',
        marginBottom: '24px',
        fontSize: '12px', 
        color: '#86909c', 
        lineHeight: '1.5',
        textAlign: 'right'
      }}>
        短信模板服务由阿里云提供，当前仅支持选择已有短信模板。
      </div>
      
      <Form
        form={smsForm}
        onSubmit={handleSaveSmsTemplate}
        layout="vertical"
        style={{ padding: '0' }}
      >
        <FormItem 
          label="模板名称" 
          field="templateName"
          rules={[
            { required: true, message: '模板名称未填写' },
            { max: 50, message: '模板名称过长' }
          ]}
        >
          <Input placeholder="请输入模板名称" />
        </FormItem>
        
        <FormItem 
          label="触发操作" 
          field="operationId"
          rules={[{ required: true, message: '触发操作未填写' }]}
        >
          <EnhancedOperationSelector
            operations={mockOperations}
            value={smsForm.getFieldValue('operationId')}
            onChange={(value) => smsForm.setFieldValue('operationId', value)}
            placeholder="请选择触发操作"
          />
        </FormItem>
        
        <FormItem 
          label={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span>短信内容</span>
              <Space>
                 <Space>
                    <EnhancedOperationSelector
                        operations={prefabricatedSmsTemplates.map(t => ({ id: t.id, name: t.templateName }))}
                        placeholder="预制模板"
                        style={{ width: 160 }}
                        dropdownStyle={{ width: 240 }}
                        onChange={(value) => {
                            const template = prefabricatedSmsTemplates.find(t => t.id === value);
                            if (template) {
                                smsForm.setFieldsValue({
                                    templateName: template.templateName,
                                    content: template.content,
                                    description: template.description
                                });
                                setIsPrefabricated(true);
                            }
                        }}
                    />
                </Space>
              </Space>
            </div>
          }
          field="content"
          rules={[
            { required: true, message: '短信内容未填写' },
            { max: 500, message: '短信内容过长' }
          ]}
        >
          <div>
            <ContentTextArea 
              disabled={isPrefabricated}
              isPrefabricated={isPrefabricated}
              onClear={() => {
                   smsForm.setFieldValue('content', '');
                   setIsPrefabricated(false);
              }}
            />
          </div>
        </FormItem>
        
        <FormItem 
          label="模板描述" 
          field="description"
          rules={[{ max: 200, message: '模板描述过长' }]}
        >
          <Input.TextArea placeholder="请输入模板描述" autoSize={{ minRows: 2, maxRows: 4 }} />
        </FormItem>
      </Form>
    </Modal>
  );

  // 短信预览弹窗
  const renderSmsPreviewModal = () => {
    const template = editingTemplate as SmsTemplate;
    if (!template) return null;
    
    // 简单的变量替换逻辑，用于预览
    let content = template.content || '';
    
    return (
      <Modal
        visible={smsPreviewModalVisible}
        onCancel={() => {
          setSmsPreviewModalVisible(false);
          setEditingTemplate(null);
        }}
        footer={null}
        title="短信预览"
        style={{ width: '400px' }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          padding: '20px 0'
        }}>
          {/* 手机外壳 */}
          <div style={{
            width: '300px',
            height: '580px',
            backgroundColor: '#fff',
            borderRadius: '40px',
            border: '12px solid #1a1a1a',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          }}>
            {/* 顶部刘海/状态栏 */}
            <div style={{
              height: '30px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              fontSize: '12px',
              color: '#333'
            }}>
              <span>9:41</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#333' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#333' }}></div>
              </div>
            </div>

            {/* 顶部导航栏 */}
            <div style={{
              height: '44px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              backgroundColor: '#fff'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>CargoWare X</div>
            </div>
            
            {/* 消息内容区域 */}
            <div style={{
              padding: '20px 16px',
              backgroundColor: '#fff',
              height: 'calc(100% - 74px)',
              overflowY: 'auto'
            }}>
              {/* 接收到的消息气泡 */}
              <div style={{
                display: 'flex',
                marginBottom: '20px'
              }}>
                <div style={{
                  backgroundColor: '#e5e5ea',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  borderTopLeftRadius: '4px',
                  maxWidth: '80%',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#000'
                }}>
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  // 邮件模板表单弹窗
  const renderEmailTemplateModal = () => (
    <Modal
      title={
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 500, 
          padding: '16px 24px', 
          borderBottom: '1px solid #e5e6eb',
          margin: '-24px -24px 0 -24px',
          borderRadius: '8px 8px 0 0'
        }}>
          {isEdit ? '' : '新建邮件模板'}
        </div>
      }
      visible={emailModalVisible}
      onCancel={() => {
        setEmailModalVisible(false);
        setEditingTemplate(null);
      }}
      footer={[
        <Button 
          key="cancel" 
          onClick={() => {
            setEmailModalVisible(false);
            setEditingTemplate(null);
          }}
          style={{ 
            borderColor: '#e5e6eb',
            color: '#1d2129',
            borderRadius: '4px'
          }}
        >
          取消
        </Button>,
        <Button 
          key="save" 
          type="primary"
          onClick={() => emailForm.submit()}
          style={{ 
            backgroundColor: '#165DFF', 
            borderColor: '#165DFF',
            borderRadius: '4px'
          }}
        >
          确定
        </Button>
      ]}
      style={{ width: 800, borderRadius: '8px' }}
      bodyStyle={{ padding: '28px 32px', height: '70vh', overflowY: 'auto' }}
    >
      <Form
        form={emailForm}
        layout="vertical"
        onSubmit={handleSaveEmailTemplate}
        style={{ paddingRight: '8px' }}
      >
        <FormItem
          label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>模板名称</span>}
          field="templateName"
          rules={[
            { required: true, message: '模板名称未填写' },
            { max: 50, message: '模板名称过长' }
          ]}
          style={{ marginBottom: '20px' }}
        >
          <Input placeholder="请输入模板名称" />
        </FormItem>
        
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>触发操作</span>}
              field="operationId"
              rules={[{ required: true, message: '触发操作未填写' }]}
              style={{ marginBottom: '20px' }}
            >
              <EnhancedOperationSelector
                operations={mockOperations}
                placeholder="请选择触发操作"
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>模板描述</span>}
              field="description"
              rules={[{ max: 200, message: '模板描述过长' }]}
              style={{ marginBottom: '20px' }}
            >
              <Input.TextArea 
                placeholder="请输入模板描述" 
                rows={3}
              />
            </FormItem>
          </Col>
        </Row>
        
        <FormItem
          label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>邮件主题</span>}
          field="subject"
          rules={[
            { required: true, message: '邮件主题未填写' },
            { max: 100, message: '邮件主题过长' }
          ]}
          style={{ marginBottom: '20px' }}
        >
          <Input 
            placeholder="请输入邮件主题" 
            suffix={
              <VariableSelector
                variableList={variableList}
                onInsert={(variable) => handleInsertVariable(variable, 'subject')}
                buttonSize="mini"
                position="relative"
                positionStyle={{}}
                buttonStyle={{
                  backgroundColor: '#b1b1b1ff',
                  borderColor: '#b1b1b1ff'
                }}
              />
            }
          />
        </FormItem>
        
        <FormItem
          label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>邮件内容</span>}
          field="content"
          rules={[{ required: true, message: '邮件内容未填写' }]}
          style={{ marginBottom: '20px' }}
        >
          <EmailEditor 
            value={emailForm.getFieldValue('content') || ''}
            onChange={(value) => emailForm.setFieldValue('content', value)}
            variableList={variableList}
            onInsertVariable={handleInsertVariable}
            fieldName="content"
          />
        </FormItem>
        
        <FormItem
          label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>页脚签名</span>}
          field="footer"
          rules={[{ max: 500, message: '页脚签名过长' }]}
          style={{ marginBottom: '20px' }}
        >
          <EmailEditor 
            value={emailForm.getFieldValue('footer') || ''}
            onChange={(value) => emailForm.setFieldValue('footer', value)}
            variableList={variableList}
            onInsertVariable={handleInsertVariable}
            fieldName="footer"
          />
        </FormItem>
        
        <FormItem
          label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>跳转链接</span>}
          field="redirectLink"
          rules={[{ type: 'url', message: '跳转链接应该为URL格式' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input placeholder="请输入跳转链接" />
        </FormItem>
      </Form>
    </Modal>
  );

  // 企微模板表单弹窗
  const renderWechatTemplateModal = () => (
    <Modal
      title={
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 500, 
          padding: '16px 24px', 
          borderBottom: '1px solid #e5e6eb',
          margin: '-24px -24px 0 -24px',
          borderRadius: '8px 8px 0 0'
        }}>
          {isEdit ? '编辑企微模板' : '新建企微模板'}
        </div>
      }
      visible={wechatModalVisible}
      onCancel={() => {
        setWechatModalVisible(false);
        setEditingTemplate(null);
        setUploadedFile(null);
        setFileError('');
      }}
      footer={[
        <Button 
          key="cancel" 
          onClick={() => {
            setWechatModalVisible(false);
            setEditingTemplate(null);
            setUploadedFile(null);
            setFileError('');
          }}
          style={{ 
            borderColor: '#e5e6eb',
            color: '#1d2129',
            borderRadius: '4px'
          }}
        >
          取消
        </Button>,
        <Button 
          key="save" 
          type="primary"
          onClick={() => wechatForm.submit()}
          style={{ 
            backgroundColor: '#165DFF', 
            borderColor: '#165DFF',
            borderRadius: '4px'
          }}
        >
          确定
        </Button>
      ]}
      style={{ width: 600, borderRadius: '8px' }}
      bodyStyle={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form
        form={wechatForm}
        layout="vertical"
        onSubmit={handleSaveWechatTemplate}
        style={{ paddingRight: '8px' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label="触发操作"
              field="operationId"
              rules={[{ required: true, message: '触发操作未填写' }]}
            >
              <EnhancedOperationSelector
                operations={mockOperations}
                placeholder="请选择触发操作"
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="模板类型"
              field="templateType"
              rules={[{ required: true, message: '模板类型未填写' }]}
              initialValue="纯文本"
            >
              <Select placeholder="请选择模板类型">
                <Select.Option value="纯文本">纯文本</Select.Option>
                <Select.Option value="文本卡片">文本卡片</Select.Option>
                <Select.Option value="图文消息">图文消息</Select.Option>
                <Select.Option value="文件">文件</Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        
        <FormItem
          label="模板描述"
          field="description"
          rules={[{ max: 200, message: '模板描述过长' }]}
        >
          <Input.TextArea 
            placeholder="请输入模板描述" 
            rows={3}
          />
        </FormItem>
        
        <Form.Item noStyle shouldUpdate>
          {() => {
            const templateType = wechatForm.getFieldValue('templateType');
            
            if (templateType === '纯文本') {
              return (
                <>
                  <FormItem
                    label="文本内容"
                    field="text"
                    rules={[
                      { required: true, message: '文本内容未填写' },
                      { max: 512, message: '文本内容过长' }
                    ]}
                  >
                    <div style={{ position: 'relative' }}>
                      <Input.TextArea 
                        placeholder="请输入文本内容"
                        rows={3}
                      />
                      <VariableSelector
                        variableList={variableList}
                        onInsert={(variable) => {
                          const currentValue = wechatForm.getFieldValue('text') || '';
                          wechatForm.setFieldValue('text', currentValue + `{${variable}}`);
                        }}
                        position="absolute"
                        positionStyle={{ top: '4px', right: '4px' }}
                        buttonStyle={{
                          backgroundColor: '#b1b1b1ff',
                          borderColor: '#b1b1b1ff'
                        }}
                      />
                    </div>
                  </FormItem>
                  <FormItem
                    label="是否是保密消息"
                    field="safe"
                    initialValue={0}
                  >
                    <Select>
                      <Select.Option value={0}>否</Select.Option>
                      <Select.Option value={1}>是</Select.Option>
                    </Select>
                  </FormItem>
                </>
              );
            } else if (templateType === '文本卡片') {
              return (
                <>
                  <FormItem
                    label="标题"
                    field="title"
                    rules={[
                      { required: true, message: '标题未填写' },
                      { max: 128, message: '标题过长' }
                    ]}
                  >
                    <div style={{ position: 'relative' }}>
                      <Input 
                        placeholder="请输入标题"
                      />
                      <VariableSelector
                        variableList={variableList}
                        onInsert={(variable) => {
                          const currentValue = wechatForm.getFieldValue('title') || '';
                          wechatForm.setFieldValue('title', currentValue + `{${variable}}`);
                        }}
                        position="absolute"
                        positionStyle={{ top: '4px', right: '4px' }}
                        buttonSize="mini"
                        buttonStyle={{
                          backgroundColor: '#b1b1b1ff',
                          borderColor: '#b1b1b1ff'
                        }}
                      />
                    </div>
                  </FormItem>
                  <FormItem
                    label="描述"
                    field="cardDescription"
                    rules={[
                      { required: true, message: '描述未填写' },
                      { max: 512, message: '描述过长' }
                    ]}
                  >
                    <div style={{ position: 'relative' }}>
                      <Input.TextArea 
                        placeholder="请输入描述"
                        rows={3}
                      />
                      <VariableSelector
                        variableList={variableList}
                        onInsert={(variable) => {
                          const currentValue = wechatForm.getFieldValue('cardDescription') || '';
                          wechatForm.setFieldValue('cardDescription', currentValue + `{${variable}}`);
                        }}
                        position="absolute"
                        positionStyle={{ top: '4px', right: '4px' }}
                        buttonStyle={{
                          backgroundColor: '#b1b1b1ff',
                          borderColor: '#b1b1b1ff'
                        }}
                      />
                    </div>
                  </FormItem>
                  <FormItem
                    label="链接"
                    field="url"
                    rules={[
                      { required: true, message: '链接未填写' },
                      { type: 'url', message: '链接应该为URL格式' }
                    ]}
                  >
                    <Input placeholder="请输入链接" />
                  </FormItem>
                  <FormItem
                    label="按钮文字"
                    field="btntxt"
                    rules={[{ max: 4, message: '按钮文字过长' }]}
                  >
                    <Input placeholder="请输入按钮文字" />
                  </FormItem>
                </>
              );
            } else if (templateType === '图文消息') {
              return (
                <>
                  <FormItem
                    label="标题"
                    field="title"
                    rules={[
                      { required: true, message: '标题未填写' },
                      { max: 128, message: '标题过长' }
                    ]}
                  >
                    <div style={{ position: 'relative' }}>
                      <Input 
                        placeholder="请输入标题"
                      />
                      <VariableSelector
                        variableList={variableList}
                        onInsert={(variable) => {
                          const currentValue = wechatForm.getFieldValue('title') || '';
                          wechatForm.setFieldValue('title', currentValue + `{${variable}}`);
                        }}
                        position="absolute"
                        positionStyle={{ top: '4px', right: '4px' }}
                        buttonSize="mini"
                        buttonStyle={{
                          backgroundColor: '#b1b1b1ff',
                          borderColor: '#b1b1b1ff'
                        }}
                      />
                    </div>
                  </FormItem>
                  <FormItem
                    label="描述"
                    field="newsDescription"
                    rules={[
                      { required: true, message: '描述未填写' },
                      { max: 512, message: '描述过长' }
                    ]}
                  >
                    <div style={{ position: 'relative' }}>
                      <Input.TextArea 
                        placeholder="请输入描述" 
                        rows={3}
                      />
                      <VariableSelector
                        variableList={variableList}
                        onInsert={(variable) => {
                          const currentValue = wechatForm.getFieldValue('newsDescription') || '';
                          wechatForm.setFieldValue('newsDescription', currentValue + `{${variable}}`);
                        }}
                        position="absolute"
                        positionStyle={{ top: '4px', right: '4px' }}
                        buttonStyle={{
                          backgroundColor: '#b1b1b1ff',
                          borderColor: '#b1b1b1ff'
                        }}
                      />
                    </div>
                  </FormItem>
                  <FormItem
                    label="链接"
                    field="url"
                    rules={[
                      { required: true, message: '链接未填写' },
                      { type: 'url', message: '链接应该为URL格式' }
                    ]}
                  >
                    <Input placeholder="请输入链接" />
                  </FormItem>
                  <FormItem
                    label="图片链接"
                    field="picurl"
                    rules={[{ type: 'url', message: '图片链接应该为URL格式' }]}
                  >
                    <Input placeholder="请输入图片链接" />
                  </FormItem>
                </>
              );
            } else if (templateType === '文件') {
              return (
                <FormItem
                  label="文件上传"
                  field="file"
                  rules={[{ required: true, message: '文件未上传' }]}
                >
                  <FileUploadArea
                    file={uploadedFile}
                    onFileChange={(file) => {
                      setUploadedFile(file);
                      setFileError('');
                      wechatForm.setFieldValue('file', file);
                    }}
                    error={fileError}
                    onError={setFileError}
                  />
                </FormItem>
              );
            }
            
            return null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );

  // 邮件预览弹窗
  const renderPreviewModal = () => {
    if (!editingTemplate || !('subject' in editingTemplate)) return null;
    
    const template = editingTemplate as EmailTemplate;
    
    // 渲染跳转链接按钮
    const renderJumpLinkButton = () => {
      if (!template.redirectLink) return null;
      
      return (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="small"
            onClick={() => window.open(template.redirectLink, '_blank')}
            style={{ 
              backgroundColor: '#165DFF', 
              borderColor: '#165DFF',
              borderRadius: '4px'
            }}
          >
            查看详情
          </Button>
        </div>
      );
    };
    
    return (
      <Modal
        title={
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 500, 
            padding: '16px 24px', 
            borderBottom: '1px solid #e5e6eb',
            margin: '-24px -24px 0 -24px',
            borderRadius: '8px 8px 0 0'
          }}>
            邮件模板预览
          </div>
        }
        visible={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setPreviewModalVisible(false)}
            style={{ 
              backgroundColor: '#165DFF', 
              borderColor: '#165DFF',
              color: 'white',
              borderRadius: '4px'
            }}
          >
            关闭
          </Button>
        ]}
        style={{ width: 700, borderRadius: '8px' }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ 
          border: '1px solid #e5e6eb', 
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#1d2129'
          }}>
            {template.subject}
          </div>
          
          <div 
            style={{ 
              marginBottom: '16px',
              lineHeight: '1.6',
              color: '#4e5969',
              minHeight: '100px'
            }}
            dangerouslySetInnerHTML={{ __html: template.content || '<div style="color: #999; font-style: italic;">暂无邮件内容</div>' }}
          />
          
          {renderJumpLinkButton()}
          
          {template.footer && (
            <div style={{ 
              borderTop: '1px solid #e5e6eb',
              paddingTop: '16px',
              marginTop: '16px',
              fontSize: '12px',
              color: '#86909c'
            }}>
              {template.footer}
            </div>
          )}
          
        </div>
      </Modal>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane key="email" title="邮件模板">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="模板ID"
                  style={{ width: 120 }}
                  value={emailFilterInputs.id}
                  onChange={(value) => handleEmailFilterChange('id', value)}
                />
                <Input
                  placeholder="触发操作"
                  style={{ width: 120 }}
                  value={emailFilterInputs.operationName}
                  onChange={(value) => handleEmailFilterChange('operationName', value)}
                />
                <Input
                  placeholder="模板描述"
                  style={{ width: 150 }}
                  value={emailFilterInputs.description}
                  onChange={(value) => handleEmailFilterChange('description', value)}
                />
                <Select
                  placeholder="模板状态"
                  style={{ width: 120 }}
                  allowClear
                  value={emailFilterInputs.status}
                  onChange={(value) => handleEmailFilterChange('status', value)}
                >
                  <Select.Option value="启用">启用</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                </Select>
                <Input
                  placeholder="创建者"
                  style={{ width: 120 }}
                  value={emailFilterInputs.creator}
                  onChange={(value) => handleEmailFilterChange('creator', value)}
                />
                <Button type="primary" icon={<IconSearch />} onClick={handleSearchEmailFilters}>
                  搜索
                </Button>
                <Button type="outline" onClick={handleResetEmailFilters}>
                  重置
                </Button>
              </div>
              <Button type="primary" onClick={handleCreateEmailTemplate}>
                <IconPlus /> 新建
              </Button>
            </div>
            
            <Table
              columns={emailTemplateColumns}
              data={filteredEmailTemplates}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredEmailTemplates.length,
                onChange: (page) => setCurrentPage(page),
                showTotal: true,
                showJumper: true
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          
          <TabPane key="wechat" title="企微模板">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="模板ID"
                  style={{ width: 120 }}
                  value={wechatFilterInputs.id}
                  onChange={(value) => handleWechatFilterChange('id', value)}
                />
                <Input
                  placeholder="触发操作"
                  style={{ width: 120 }}
                  value={wechatFilterInputs.operationName}
                  onChange={(value) => handleWechatFilterChange('operationName', value)}
                />
                <Select
                  placeholder="模板类型"
                  style={{ width: 120 }}
                  allowClear
                  value={wechatFilterInputs.templateType}
                  onChange={(value) => handleWechatFilterChange('templateType', value)}
                >
                  <Select.Option value="纯文本">纯文本</Select.Option>
                  <Select.Option value="文本卡片">文本卡片</Select.Option>
                  <Select.Option value="图文消息">图文消息</Select.Option>
                  <Select.Option value="文件">文件</Select.Option>
                </Select>
                <Select
                  placeholder="模板状态"
                  style={{ width: 120 }}
                  allowClear
                  value={wechatFilterInputs.status}
                  onChange={(value) => handleWechatFilterChange('status', value)}
                >
                  <Select.Option value="启用">启用</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                </Select>
                <Input
                  placeholder="创建者"
                  style={{ width: 120 }}
                  value={wechatFilterInputs.creator}
                  onChange={(value) => handleWechatFilterChange('creator', value)}
                />
                <Button type="primary" icon={<IconSearch />} onClick={handleSearchWechatFilters}>
                  搜索
                </Button>
                <Button type="outline" onClick={handleResetWechatFilters}>
                  重置
                </Button>
              </div>
              <Button type="primary" onClick={handleCreateWechatTemplate}>
                <IconPlus /> 新建
              </Button>
            </div>
            
            <Table
              columns={wechatTemplateColumns}
              data={filteredWechatTemplates}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredWechatTemplates.length,
                onChange: (page) => setCurrentPage(page),
                showTotal: true,
                showJumper: true
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane key="sms" title="短信模板">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                  placeholder="模板ID"
                  style={{ width: 120 }}
                  value={smsFilterInputs.id}
                  onChange={(value) => handleSmsFilterChange('id', value)}
                />
                <Input
                  placeholder="触发操作"
                  style={{ width: 120 }}
                  value={smsFilterInputs.operationName}
                  onChange={(value) => handleSmsFilterChange('operationName', value)}
                />
                <Input
                  placeholder="模板描述"
                  style={{ width: 150 }}
                  value={smsFilterInputs.description}
                  onChange={(value) => handleSmsFilterChange('description', value)}
                />
                <Select
                  placeholder="模板状态"
                  style={{ width: 120 }}
                  allowClear
                  value={smsFilterInputs.status}
                  onChange={(value) => handleSmsFilterChange('status', value)}
                >
                  <Select.Option value="启用">启用</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                </Select>
                <Input
                  placeholder="创建者"
                  style={{ width: 120 }}
                  value={smsFilterInputs.creator}
                  onChange={(value) => handleSmsFilterChange('creator', value)}
                />
                <Button type="primary" icon={<IconSearch />} onClick={handleSearchSmsFilters}>
                  搜索
                </Button>
                <Button type="outline" onClick={handleResetSmsFilters}>
                  重置
                </Button>
              </div>
              <Button type="primary" onClick={handleCreateSmsTemplate}>
                <IconPlus /> 新建
              </Button>
            </div>
            
            <Table
              columns={smsTemplateColumns}
              data={filteredSmsTemplates}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredSmsTemplates.length,
                onChange: (page) => setCurrentPage(page),
                showTotal: true,
                showJumper: true
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 弹窗组件 */}
      {renderEmailTemplateModal()}
      {renderWechatTemplateModal()}
      {renderSmsTemplateModal()}
      {renderSmsPreviewModal()}
      {renderPreviewModal()}
    </div>
  );
};

export default NotificationTemplateSettings;