import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer, Button, Input, Dropdown, Menu, Tag, Message } from '@arco-design/web-react';
import { IconSync, IconApps, IconFile, IconAttachment, IconClose, IconSearch, IconUpload, IconMessage, IconMore, IconSend, IconCopy, IconRefresh, IconThumbUp, IconThumbDown } from '@arco-design/web-react/icon';
import { getSOPByOrderId, OrderSOP } from './sopData';
import SOPQuery from './SOPQuery';
import FreightRateAnalysisResult from './FreightRateAnalysisResult';

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onFullscreen?: () => void;
}

interface AIMessage {
  text?: string;
  isUser: boolean;
  component?: React.ReactNode;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose, onFullscreen }) => {
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [skillPrefix, setSkillPrefix] = useState('');
  const [context, setContext] = useState<any>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 监听外部打开AI助手事件
  useEffect(() => {
    const handleOpenAiAssistant = (event: CustomEvent) => {
      const { skill, input, context } = event.detail || {};
      if (skill) {
        setSkillPrefix(skill);
      }
      if (input) {
        setUserInput(input);
      }
      if (context) {
        setContext(context);
      }
    };

    window.addEventListener('openAiAssistant', handleOpenAiAssistant as EventListener);
    return () => {
      window.removeEventListener('openAiAssistant', handleOpenAiAssistant as EventListener);
    };
  }, []);

  // 处理AI对话
  const handleSendMessage = () => {
    const fullInput = skillPrefix ? `${skillPrefix} ${userInput}` : userInput;
    if (!fullInput.trim()) return;
    
    // 添加用户消息
    setAiMessages([...aiMessages, {text: fullInput, isUser: true}]);
    
    // 检查是否是运价分析请求
    if (skillPrefix === '运价分析') {
      // 检查上下文
      if (context && context.type === 'filter' && Object.keys(context.filters).every(k => !context.filters[k])) {
        // 筛选栏为空且用户未提供额外信息（简单判断）
        if (userInput === '根据当前筛选条件与本页运价，进行运价分析') {
          setTimeout(() => {
            setAiMessages(prev => [...prev, {
              text: '检测到您的筛选栏为空，请先选择筛选条件或直接告诉我您想分析的运价需求（例如："分析上海到洛杉矶的20GP运价"）。',
              isUser: false
            }]);
            setUserInput('');
          }, 500);
          return;
        }
      }

      // 模拟AI分析过程
      setTimeout(() => {
        setAiMessages(prev => [...prev, {
          text: `收到，正在为您进行运价分析...`,
          isUser: false,
          component: <FreightRateAnalysisResult context={context} />
        }]);
        setUserInput('');
        setSkillPrefix('');
        setContext(null); // 清除上下文
      }, 500);
      return;
    }

    // 检查是否是订单跟踪请求
    if (skillPrefix === '订单跟踪' && userInput.trim() !== '') {
      // 提取订单号（假设用户输入的就是订单号）
      const orderId = userInput.trim();
      
      // 获取SOP流程数据
      const sopData = getSOPByOrderId(orderId);
      
      // 模拟AI回复订单跟踪结果
      setTimeout(() => {
        setAiMessages(prev => [...prev, {
          text: `已为您查询订单 ${orderId} 的SOP运踪流程：`,
          isUser: false,
          component: <SOPQuery sopData={sopData} />
        }]);
        setUserInput('');
        setSkillPrefix('');
      }, 500);
    } else {
      // 模拟AI回复
      setTimeout(() => {
        setAiMessages(prev => [...prev, {
          text: `我已收到你的问题："${fullInput}"。作为自定义名字的AI助手，我正在处理中，请稍候...`,
          isUser: false
        }]);
        setUserInput('');
        setSkillPrefix('');
      }, 500);
    }
  };

  // 处理快捷按钮点击
  const handleQuickAction = (action: string) => {
    setSkillPrefix(action);
    setUserInput('');
  };

  // 处理示例问题点击
  const handleExampleClick = (question: string) => {
    setAiMessages([...aiMessages, {text: question, isUser: true}]);
    
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        text: `我已收到你的问题："${question}"。作为自定义名字的AI助手，我正在处理中，请稍候...`,
        isUser: false
      }]);
    }, 500);
  };

  // 处理消息操作
  const handleMessageAction = (action: string, messageText: string) => {
    switch(action) {
      case 'copy':
        navigator.clipboard.writeText(messageText);
        break;
      case 'regenerate':
        // 重新生成回答
        break;
      case 'like':
        // 点赞
        break;
      case 'dislike':
        // 吐槽
        break;
    }
  };

  // 清空技能标签
  const clearSkillPrefix = () => {
    setSkillPrefix('');
  };

  // 开启新对话
  const startNewConversation = () => {
    setAiMessages([]);
    setUserInput('');
    setSkillPrefix('');
    setIsVoiceMode(false);
    setIsRecording(false);
    setRecognizedText('');
    setIsTyping(false);
  };

  // 切换语音输入模式
  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isVoiceMode) {
      setIsRecording(false);
      setRecognizedText('');
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }
  };

  // 开始语音录制
  const startRecording = useCallback(() => {
    if (!isVoiceMode) return;
    setIsRecording(true);
    setRecognizedText('');
    setIsTyping(true);
    
    // 模拟打字机效果
    const demoText = "这是一段对于语音识别转文字的演示，我正在聆听您的指令，并把它转换为具体的文字内容，让您免去文字输入的工作";
    let currentIndex = 0;
    
    const typeText = () => {
      if (currentIndex < demoText.length) {
        setRecognizedText(demoText.substring(0, currentIndex + 1));
        currentIndex++;
        typingTimeoutRef.current = setTimeout(typeText, 50);
      } else {
        setIsTyping(false);
      }
    };
    
    typingTimeoutRef.current = setTimeout(typeText, 300);
  }, [isVoiceMode]);

  // 停止语音录制
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsTyping(false);
    
    // 清除定时器
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    
    // 将识别的文本设置到输入框
    if (recognizedText && recognizedText.trim()) {
      setUserInput(recognizedText);
    }
    
    // 清空识别文本并退出语音模式
    setRecognizedText('');
    setIsVoiceMode(false);
  }, [recognizedText]);

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVoiceMode && e.code === 'Space' && !isRecording) {
        e.preventDefault();
        startRecording();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isVoiceMode && e.code === 'Space' && isRecording) {
        e.preventDefault();
        stopRecording();
      }
    };

    if (isVoiceMode) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVoiceMode, isRecording, startRecording, stopRecording]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // 音波动效组件
  const WaveAnimation = () => {
    return (
      <>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-purple-500 rounded-full wave-bar"
              style={{
                width: '3px',
                height: '12px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        <style>{`
          .wave-bar {
            animation: wave 1.2s ease-in-out infinite;
          }
          @keyframes wave {
            0%, 100% { 
              transform: scaleY(0.3);
              opacity: 0.7;
            }
            50% { 
              transform: scaleY(1.8);
              opacity: 1;
            }
          }
        `}</style>
      </>
    );
  };

  // 更多功能下拉菜单
  const moreMenuDroplist = (
    <Menu onClickMenuItem={(key) => handleQuickAction(key)}>
      <Menu.Item key="生成报价">生成报价</Menu.Item>
      <Menu.Item key="订单跟踪">订单跟踪</Menu.Item>
      <Menu.Item key="船期查询">船期查询</Menu.Item>
      <Menu.Item key="系统配置">系统配置</Menu.Item>
    </Menu>
  );

  return (
    <Drawer
      title={null}
      visible={visible}
      onCancel={onClose}
      placement="right"
      width={420}
      footer={null}
      mask={false}
      closable={false}
      autoFocus={false}
      focusLock={false}
      escToExit={false}
      style={{
        position: 'fixed',
        right: '20px',
        top: '80px',
        height: 'calc(100vh - 100px)',
        borderRadius: '16px',
        boxShadow: '0 8px 40px rgba(79, 70, 229, 0.15)',
        border: '1px solid rgba(79, 70, 229, 0.1)',
        zIndex: 1000
      }}
      bodyStyle={{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 shadow-sm">
            <img src="/assets/g6qmm-vsolk.gif" alt="自定义名字的AI助手" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-base font-medium text-gray-800">自定义名字的AI助手</div>
            <div className="text-xs text-purple-600">你的工作，可以更简单</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            type="text" 
            size="small"
            className="text-purple-600"
            icon={<IconSync style={{ color: '#7C3AED' }} />}
            title="开启新对话"
            onClick={startNewConversation}
          />
          <Button 
            type="text" 
            size="small"
            className="text-purple-600"
            icon={<IconApps style={{ color: '#7C3AED' }} />}
            title="全屏模式"
            onClick={onFullscreen}
          />
          <Button 
            type="text" 
            size="small"
            className="text-gray-500 hover:text-gray-700"
            icon={<IconClose />}
            onClick={onClose}
            title="关闭"
          />
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/20">
        <div className="flex mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
            <img src="/assets/g6qmm-vsolk.gif" alt="自定义名字的AI助手" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-purple-600 font-medium">👋 你好，我是自定义名字的AI助手</span>
            </div>
            <div className="text-gray-700 text-sm leading-relaxed">
              你好，我是你的AI助理。我汇集了控制塔各项智能服务，可以帮你处理导入运价、询价报价、系统配置、订单操作等问题，虽然我初出茅庐，但是我每天都在进步哦！
            </div>
            
            <div className="mt-4">
              <div className="font-medium mb-3 text-sm">你可以试试这样问我</div>
              <div className="space-y-2">
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('查看今日新增客户数量和注册情况')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">查看今日新增客户数量和注册情况</span>
                </div>
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('分析本月询价转化率和热门航线')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">分析本月询价转化率和热门航线</span>
                </div>
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('批量更新Shanghai到Bangkok的运价')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">批量更新Shanghai到Bangkok的运价</span>
                </div>
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('查询 宁波到洛杉矶 下周的空运价格')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">查询 宁波到洛杉矶 下周的空运价格</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 显示对话消息 */}
        {aiMessages.map((message, index) => (
          <div key={index} className={`flex mb-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            {!message.isUser && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center mr-2 flex-shrink-0">
                <img src="/assets/g6qmm-vsolk.gif" alt="AI" className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`max-w-[80%] ${message.isUser ? 'flex justify-end' : ''}`}>
              <div className={`p-2 rounded-lg text-sm ${
                message.isUser 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
              }`}>
                {message.component ? message.component : message.text}
              </div>
              {!message.isUser && (
                <div className="flex items-center gap-1 mt-1 ml-1">
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-gray-600"
                    icon={<IconCopy style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('copy', message.text)}
                    title="复制"
                  />
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-gray-600"
                    icon={<IconRefresh style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('regenerate', message.text)}
                    title="重新回答"
                  />
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-green-600"
                    icon={<IconThumbUp style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('like', message.text)}
                    title="点赞"
                  />
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-red-600"
                    icon={<IconThumbDown style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('dislike', message.text)}
                    title="吐槽"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 常用技能区域 */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        <div className="flex items-center gap-2.5 justify-center">
          <Button 
            size="mini" 
            type="outline"
            className="text-purple-600 border-purple-200 text-xs"
            icon={<IconSearch style={{ color: '#7C3AED', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('运价查询')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            运价查询
          </Button>
          <Button 
            size="mini" 
            type="outline"
            className="text-blue-600 border-blue-200 text-xs"
            icon={<IconUpload style={{ color: '#3B82F6', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('运价导入')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            运价导入
          </Button>
          <Button 
            size="mini" 
            type="outline"
            className="text-pink-600 border-pink-200 text-xs"
            icon={<IconFile style={{ color: '#EC4899', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('ChatBI')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            ChatBI
          </Button>
          <Button 
            size="mini" 
            type="outline"
            className="text-indigo-600 border-indigo-200 text-xs"
            icon={<IconMessage style={{ color: '#6366F1', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('内部询价')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            内部询价
          </Button>
          <Dropdown 
            droplist={moreMenuDroplist} 
            position="top" 
            trigger="click"
          >
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors"
              style={{ color: '#6B7280' }}
            >
              <IconMore style={{ fontSize: '10px' }} />
            </div>
          </Dropdown>
        </div>
      </div>
      
      {/* 底部输入区域 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="relative">
          <div 
            className="relative overflow-hidden"
            style={{ 
              background: isVoiceMode 
                ? 'linear-gradient(to right, #E0E7FF, #EDE9FE, #F3E8FF)' 
                : 'linear-gradient(to right, #EFF6FF, #F3E8FF, #FDF2F8)', 
              borderRadius: '16px', 
              border: isVoiceMode ? '1px solid #A5B4FC' : '1px solid #C7D2FE'
            }}
          >
            {/* 技能标签区域 */}
            {skillPrefix && (
              <div className="px-3 pt-2 pb-1">
                <Tag
                  color="purple"
                  size="small"
                  closable
                  onClose={clearSkillPrefix}
                  style={{ cursor: 'default' }}
                >
                  {skillPrefix}
                </Tag>
              </div>
            )}
            
            {/* 语音识别文本显示 */}
            {isVoiceMode && isRecording && (
              <div className="mb-2 p-2 bg-white/95 border border-purple-200 rounded-lg text-sm text-gray-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-600">语音识别:</span>
                  {isTyping && <WaveAnimation />}
                </div>
                <div className="mt-1">{recognizedText || '正在识别中...'}</div>
              </div>
            )}
            
            {/* 输入框和按钮容器 */}
            <div className="relative">
              {isVoiceMode ? (
                <div
                  className="text-sm resize-none cursor-pointer flex items-center justify-center"
                  style={{ 
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    minHeight: '36px',
                    paddingLeft: '12px',
                    paddingRight: '80px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    color: '#4B5563'
                  }}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onMouseLeave={stopRecording}
                >
                  {isRecording ? (
                    <div className="flex items-center gap-2">
                      <WaveAnimation />
                      <span>正在录音...</span>
                    </div>
                  ) : (
                    "长按此处或者空格键，进行语音输入"
                  )}
                </div>
              ) : (
                <Input.TextArea
                  value={userInput}
                  onChange={value => setUserInput(value)}
                  placeholder={skillPrefix ? "继续输入你的具体需求..." : "需要我帮你处理什么工作呢？"}
                  className="text-sm resize-none"
                  style={{ 
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    minHeight: '36px',
                    paddingLeft: '12px',
                    paddingRight: '80px',
                    paddingTop: skillPrefix ? '4px' : '8px',
                    paddingBottom: '8px',
                    boxShadow: 'none'
                  }}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              )}
              
              {/* 按钮组 */}
              <div className="absolute right-2 top-1 flex items-center gap-1">
                <Button
                  type="text"
                  size="mini"
                  style={{ 
                    height: '28px',
                    width: '28px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  icon={<IconAttachment style={{ color: '#86909C', fontSize: '14px' }} />}
                />
                <Button
                  type="text"
                  size="mini"
                  style={{ 
                    height: '28px',
                    width: '28px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isVoiceMode ? '#7C3AED' : 'transparent'
                  }}
                  icon={<img src="/assets/micro.png" alt="麦克风" style={{ width: '14px', height: '14px', filter: isVoiceMode ? 'brightness(0) invert(1)' : 'none' }} />}
                  onClick={toggleVoiceMode}
                  title="语音输入"
                />
                <Button 
                  type="primary" 
                  size="small"
                  style={{ 
                    borderRadius: '12px', 
                    height: '28px',
                    width: '28px',
                    padding: 0,
                    background: 'linear-gradient(to right, #3B82F6, #7C3AED)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={handleSendMessage}
                  icon={<IconSend style={{ fontSize: '14px' }} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AIAssistant;