import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Space, Tag, Tooltip, Popconfirm, Message } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconCheck, IconClose, IconRobot } from '@arco-design/web-react/icon';
import EmailEditor from './EmailEditor';

interface Recipient {
  email: string;
  name?: string;
  company?: string;
}

interface EmailFineTuningModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: (data: { subject: string; content: string; recipients: Recipient[] }) => void;
  initialData?: {
    subject?: string;
    content?: string;
    recipients?: Recipient[];
  };
}

const EmailFineTuningModal: React.FC<EmailFineTuningModalProps> = ({ 
  visible, 
  onClose, 
  onSend,
  initialData 
}) => {
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [recipients, setRecipients] = useState<Recipient[]>(initialData?.recipients || []);
  const [newRecipient, setNewRecipient] = useState('');
  const [editingRecipientIndex, setEditingRecipientIndex] = useState<number | null>(null);
  const [editingRecipient, setEditingRecipient] = useState<Recipient>({ email: '' });
  const [aiGeneratingSubject, setAiGeneratingSubject] = useState(false);

  // 模拟AI生成主题
  const generateSubjectWithAI = () => {
    setAiGeneratingSubject(true);
    // 模拟AI生成过程
    setTimeout(() => {
      const sampleSubjects = [
        '最新的运价信息，助您优化物流成本',
        '专属运价方案，为您量身定制',
        '限时优惠运价，不容错过',
        '高效物流解决方案，助力您的业务发展',
        '专业货运服务，值得信赖的选择'
      ];
      const randomSubject = sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)];
      setSubject(randomSubject);
      setAiGeneratingSubject(false);
      Message.success('AI已生成邮件主题');
    }, 1500);
  };

  // 添加收件人
  const addRecipient = () => {
    if (!newRecipient) return;
    
    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient)) {
      Message.error('请输入有效的邮箱地址');
      return;
    }
    
    // 检查是否已存在
    if (recipients.some(r => r.email === newRecipient)) {
      Message.warning('该邮箱已存在');
      return;
    }
    
    setRecipients([...recipients, { email: newRecipient }]);
    setNewRecipient('');
  };

  // 删除收件人
  const removeRecipient = (index: number) => {
    const newRecipients = [...recipients];
    newRecipients.splice(index, 1);
    setRecipients(newRecipients);
  };

  // 开始编辑收件人
  const startEditingRecipient = (index: number) => {
    setEditingRecipientIndex(index);
    setEditingRecipient({ ...recipients[index] });
  };

  // 保存收件人编辑
  const saveRecipientEdit = () => {
    if (editingRecipientIndex === null) return;
    
    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingRecipient.email)) {
      Message.error('请输入有效的邮箱地址');
      return;
    }
    
    const newRecipients = [...recipients];
    newRecipients[editingRecipientIndex] = editingRecipient;
    setRecipients(newRecipients);
    cancelRecipientEdit();
  };

  // 取消收件人编辑
  const cancelRecipientEdit = () => {
    setEditingRecipientIndex(null);
    setEditingRecipient({ email: '' });
  };

  // 处理发送
  const handleSend = () => {
    if (!subject.trim()) {
      Message.error('请输入邮件主题');
      return;
    }
    
    if (!content.trim()) {
      Message.error('请输入邮件内容');
      return;
    }
    
    if (recipients.length === 0) {
      Message.error('请至少添加一个收件人');
      return;
    }
    
    onSend({ subject, content, recipients });
  };

  // 当模态框关闭时重置状态
  useEffect(() => {
    if (!visible) {
      setSubject(initialData?.subject || '');
      setContent(initialData?.content || '');
      setRecipients(initialData?.recipients || []);
      setNewRecipient('');
      setEditingRecipientIndex(null);
      setEditingRecipient({ email: '' });
    }
  }, [visible, initialData]);

  return (
    <Modal
      title="营销文案人工微调"
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="email-fine-tuning-modal"
      style={{ width: '800px', maxWidth: '90vw' }}
      autoFocus={false}
      focusLock={false}
    >
      <div className="fine-tuning-content">
        {/* 收件人管理 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-gray-800">收件人</label>
          </div>
          
          {/* 收件人列表 */}
          <div className="mb-3">
            {recipients.map((recipient, index) => (
              <div key={index} className="mb-2 flex items-center">
                {editingRecipientIndex === index ? (
                  <>
                    <Input
                      value={editingRecipient.email}
                      onChange={(value) => setEditingRecipient({ ...editingRecipient, email: value })}
                      className="flex-1 mr-2"
                      placeholder="请输入邮箱地址"
                    />
                    <Button 
                      type="primary" 
                      size="mini" 
                      icon={<IconCheck />}
                      onClick={saveRecipientEdit}
                    />
                    <Button 
                      size="mini" 
                      icon={<IconClose />}
                      className="ml-1"
                      onClick={cancelRecipientEdit}
                    />
                  </>
                ) : (
                  <>
                    <Tag 
                      color="arcoblue" 
                      className="flex items-center"
                      closable
                      onClose={() => removeRecipient(index)}
                    >
                      <span className="mr-1">{recipient.email}</span>
                      <IconEdit 
                        className="cursor-pointer text-gray-500 hover:text-gray-800" 
                        onClick={() => startEditingRecipient(index)}
                      />
                    </Tag>
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* 添加收件人 */}
          <div className="flex">
            <Input
              value={newRecipient}
              onChange={setNewRecipient}
              placeholder="请输入邮箱地址"
              className="flex-1 mr-2"
              onPressEnter={addRecipient}
            />
            <Button type="primary" onClick={addRecipient}>
              添加
            </Button>
          </div>
        </div>
        
        {/* 邮件主题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-gray-800">主题</label>
            <Button 
              type="primary" 
              ghost 
              size="mini" 
              onClick={generateSubjectWithAI}
              loading={aiGeneratingSubject}
              icon={<IconRobot />}
            >
              AI题目
            </Button>
          </div>
          <Input
            value={subject}
            onChange={setSubject}
            placeholder="请输入邮件主题"
          />
        </div>
        
        {/* 邮件内容编辑器 */}
        <div className="mb-6">
          <label className="font-medium text-gray-800 block mb-2">邮件内容</label>
          <EmailEditor
            initialValue={content}
            onChange={setContent}
          />
        </div>
        
        {/* 底部操作按钮 */}
        <div className="flex justify-end">
          <Space>
            <Button onClick={onClose}>返回</Button>
            <Button type="primary" onClick={handleSend}>
              确认并发送
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default EmailFineTuningModal;