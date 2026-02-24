import React, { useState, useMemo } from 'react';
import { Drawer, Button, Switch, Input, DatePicker, List, Badge, Empty, Message } from '@arco-design/web-react';
import { IconSearch, IconNotification } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';

export interface MessageItem {
  id: string;
  title: string;
  type: 'inquiry' | 'system'; // extended for future proofing
  date: string;
  inquiryId?: string;
  read: boolean;
  content?: string;
}

// Mock data generation
export const generateMockMessages = (): MessageItem[] => {
  const messages: MessageItem[] = [];
  for (let i = 0; i < 20; i++) {
    const isRead = Math.random() > 0.3;
    const date = dayjs().subtract(Math.floor(Math.random() * 10), 'day').subtract(Math.floor(Math.random() * 24), 'hour').format('YYYY-MM-DD HH:mm');
    messages.push({
      id: `msg-${i}`,
      title: '报价已完成',
      type: 'inquiry',
      date: date,
      inquiryId: `Q${dayjs().format('YYYYMMDD')}${String(i).padStart(3, '0')}`,
      read: isRead,
    });
  }
  return messages.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
};

interface MessageCenterProps {
  visible: boolean;
  onCancel: () => void;
  messages: MessageItem[];
  onMessagesChange: (messages: MessageItem[]) => void;
}

const MessageCenter: React.FC<MessageCenterProps> = ({ visible, onCancel, messages, onMessagesChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Category settings
  const [categories, setCategories] = useState({
    all: { enabled: true, label: '全部消息' },
    inquiry: { enabled: true, label: '询报价' },
  });
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'inquiry'>('all');

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState<string[]>([]);

  // Computed stats
  const stats = useMemo(() => {
    const totalUnread = messages.filter(m => !m.read).length;
    const inquiryUnread = messages.filter(m => m.type === 'inquiry' && !m.read).length;
    return {
      all: totalUnread,
      inquiry: inquiryUnread,
    };
  }, [messages]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      // 1. Category Switch Filter
      if (msg.type === 'inquiry' && !categories.inquiry.enabled) return false;

      // 2. Selected Category Filter
      if (selectedCategory !== 'all' && msg.type !== selectedCategory) return false;

      // 3. Unread Only Filter
      if (showUnreadOnly && msg.read) return false;

      // 4. Keyword Search (Fuzzy)
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchTitle = msg.title.toLowerCase().includes(keyword);
        const matchContent = msg.inquiryId?.toLowerCase().includes(keyword);
        if (!matchTitle && !matchContent) return false;
      }

      // 5. Date Range Filter
      if (dateRange && dateRange.length === 2) {
        const msgDate = dayjs(msg.date);
        const start = dayjs(dateRange[0]).startOf('day');
        const end = dayjs(dateRange[1]).endOf('day');
        if (msgDate.isBefore(start) || msgDate.isAfter(end)) return false;
      }

      return true;
    });
  }, [messages, showUnreadOnly, selectedCategory, categories, searchKeyword, dateRange]);

  // Handlers
  const handleMarkAllRead = () => {
    onMessagesChange(messages.map(msg => ({ ...msg, read: true })));
    Message.success('已全部标记为已读');
  };

  const handleMarkRead = (id: string) => {
    onMessagesChange(messages.map(msg => msg.id === id ? { ...msg, read: true } : msg));
  };

  const handleNavigate = (msg: MessageItem) => {
    handleMarkRead(msg.id);
    if (location.pathname.startsWith('/controltower-client')) {
      navigate(`/controltower-client/saas/rate-query?inquiryId=${msg.inquiryId}`);
    } else {
      navigate(`/controltower/freight-rate-query?inquiryId=${msg.inquiryId}`);
    }
  };

  const getBadgeColor = (count: number) => {
    if (count === 0) return '#52c41a'; // Green
    if (count < 100) return '#faad14'; // Yellow
    return '#f5222d'; // Red
  };

  const renderBadge = (count: number) => {
    const displayCount = count > 99 ? '99+' : count;
    return (
      <span 
        style={{ 
          backgroundColor: getBadgeColor(count),
          color: 'white',
          padding: '0 6px',
          borderRadius: '10px',
          fontSize: '12px',
          marginLeft: '4px',
          minWidth: '20px',
          textAlign: 'center',
          display: 'inline-block',
          lineHeight: '18px'
        }}
      >
        {displayCount}
      </span>
    );
  };

  return (
    <Drawer
      visible={visible}
      onCancel={onCancel}
      width={400}
      title="消息中心"
      footer={null}
      mask={true}
      maskClosable={true}
      style={{ zIndex: 9999 }}
    >
      {/* Action Bar */}
      <div className="flex justify-between mb-4 border-b border-gray-100 pb-4">
        <Button 
          type={showUnreadOnly ? 'primary' : 'secondary'} 
          size="small"
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
        >
          只看未读
        </Button>
        <Button 
          type="text" 
          size="small" 
          onClick={handleMarkAllRead}
        >
          全部标为已读
        </Button>
      </div>

      {/* Category Bar */}
      <div className="mb-4 border-b border-gray-100 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {/* All Messages */}
          <div 
            className={`flex flex-col gap-2 p-2 rounded cursor-pointer transition-colors border border-transparent ${selectedCategory === 'all' ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50 hover:border-gray-200'}`}
            onClick={() => setSelectedCategory('all')}
          >
            <div className="flex justify-between items-center w-full">
              <span className="font-medium text-gray-700 text-sm truncate">全部消息</span>
              {renderBadge(stats.all)}
            </div>
            <div className="flex justify-end w-full" onClick={e => e.stopPropagation()}>
              <Switch 
                size="small" 
                checked={categories.all.enabled}
                onChange={(val) => setCategories(prev => ({ ...prev, all: { ...prev.all, enabled: val } }))}
              />
            </div>
          </div>

          {/* Inquiry Messages */}
          <div 
            className={`flex flex-col gap-2 p-2 rounded cursor-pointer transition-colors border border-transparent ${selectedCategory === 'inquiry' ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50 hover:border-gray-200'}`}
            onClick={() => setSelectedCategory('inquiry')}
          >
            <div className="flex justify-between items-center w-full">
              <span className="font-medium text-gray-700 text-sm truncate">询报价</span>
              {renderBadge(stats.inquiry)}
            </div>
            <div className="flex justify-end w-full" onClick={e => e.stopPropagation()}>
              <Switch 
                size="small" 
                checked={categories.inquiry.enabled}
                onChange={(val) => setCategories(prev => ({ ...prev, inquiry: { ...prev.inquiry, enabled: val } }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 space-y-3 border-b border-gray-100 pb-4">
        <div className="flex gap-2">
          <Input 
            prefix={<IconSearch />} 
            placeholder="搜索消息..." 
            value={searchKeyword}
            onChange={setSearchKeyword}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={() => {}}>查询</Button>
        </div>
        <DatePicker.RangePicker 
          style={{ width: '100%' }}
          onChange={(dateString) => setDateRange(dateString)}
        />
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-auto -mr-4 pr-4">
        <List
          dataSource={filteredMessages}
          render={(msg, index) => (
            <List.Item 
              key={msg.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 rounded-lg mb-2 p-3 ${msg.read ? 'opacity-70' : 'bg-blue-50/50'}`}
              style={{ padding: '12px', border: '1px solid #f0f0f0' }}
              onClick={() => handleMarkRead(msg.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="mt-1.5 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${msg.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium truncate ${msg.read ? 'text-gray-600' : 'text-gray-900'}`}>{msg.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{msg.date}</span>
                  </div>
                  <div className="text-sm text-gray-600 break-words">
                    {msg.type === 'inquiry' && (
                      <span>
                        {msg.inquiryId}号询价已收到完整报价，点击前往查看
                        <span 
                          className="text-blue-600 ml-1 hover:underline cursor-pointer inline-block"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(msg);
                          }}
                        >
                          客户端运价查询
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
          noDataElement={<Empty description="暂无消息" />}
        />
      </div>
    </Drawer>
  );
};

export default MessageCenter;
