import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer, Button, Input, Dropdown, Menu, Tag } from '@arco-design/web-react';
import { 
  IconSync, 
  IconApps, 
  IconFile, 
  IconAttachment, 
  IconClose, 
  IconSearch, 
  IconUpload, 
  IconMessage, 
  IconMore, 
  IconSend,
  IconCopy,
  IconRefresh,
  IconThumbUp,
  IconThumbDown,
  IconFullscreenExit,
  IconDashboard,
  IconTool,
  IconBook,
  IconNotification
} from '@arco-design/web-react/icon';
import { getSOPByOrderId } from './sopData';
import SOPQuery from './SOPQuery';

interface AIFullscreenProps {
  visible: boolean;
  onClose: () => void;
  onExitFullscreen?: () => void;
}

interface AIMessage {
  text?: string;
  component?: React.ReactNode;
  isUser: boolean;
}

const AIFullscreen: React.FC<AIFullscreenProps> = ({ visible, onClose, onExitFullscreen }) => {
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [skillPrefix, setSkillPrefix] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 处理AI对话
  const handleSendMessage = () => {
    const fullInput = skillPrefix ? `${skillPrefix} ${userInput}` : userInput;
    if (!fullInput.trim()) return;
    
    // 添加用户消息
    setAiMessages([...aiMessages, {text: fullInput, isUser: true}]);
    
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
          component: <SOPQuery sopData={sopData} />,
          isUser: false
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
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
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

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isVoiceMode && !isRecording) {
        e.preventDefault();
        startRecording();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isVoiceMode && isRecording) {
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
    <Menu 
      onClickMenuItem={(key) => handleQuickAction(key)}
      style={{ 
        zIndex: 9999999,
        position: 'relative',
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid #e5e5e5'
      }}
    >
      <Menu.Item key="生成报价">生成报价</Menu.Item>
      <Menu.Item key="订单跟踪">订单跟踪</Menu.Item>
      <Menu.Item key="船期查询">船期查询</Menu.Item>
      <Menu.Item key="系统配置">系统配置</Menu.Item>
    </Menu>
  );

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50/30"
      style={{ backdropFilter: 'blur(10px)', zIndex: 1000 }}
    >
      <div className="h-full flex flex-col">
        {/* 头部导航栏 */}
        <div className="bg-white/90 backdrop-blur-md border-b border-purple-200/50 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* 左侧标题区域 */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-4 shadow-md">
                  <img src="/assets/g6qmm-vsolk.gif" alt="自定义名字的AI助手" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    自定义名字的AI助手
                  </div>
                  <div className="text-sm text-purple-600">你的工作，可以更简单</div>
                </div>
              </div>
              
              {/* 右侧按钮区域 - 增加间距 */}
              <div className="flex items-center gap-4">
                <Button 
                  type="outline"
                  className="text-purple-600 border-purple-300 hover:border-purple-400"
                  icon={<IconSync />}
                  onClick={startNewConversation}
                >
                  新对话
                </Button>
                <Button 
                  type="text"
                  className="text-gray-600 hover:text-gray-800"
                  icon={<IconFullscreenExit />}
                  onClick={onExitFullscreen || onClose}
                  title="退出全屏"
                >
                  退出全屏
                </Button>
                <Button 
                  type="text"
                  className="text-gray-400 hover:text-gray-600"
                  icon={<IconClose />}
                  onClick={onClose}
                  title="关闭对话"
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 主体内容区 */}
        <div className="flex-1 flex relative">
          {/* 左侧边栏 - 历史记录 */}
          <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-purple-200/50 p-4 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-800 mb-4">对话历史</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors">
                <div className="text-sm font-medium text-purple-700">当前对话</div>
                <div className="text-xs text-gray-600 mt-1">正在进行中...</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="text-sm text-gray-700">查看今日新增客户数量和注册情况</div>
                <div className="text-xs text-gray-500 mt-1">10分钟前</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="text-sm text-gray-700">分析本月询价转化率和热门航线</div>
                <div className="text-xs text-gray-500 mt-1">1小时前</div>
              </div>
            </div>
          </div>

          {/* 中间对话区域 */}
          <div className="flex-1 flex flex-col" style={{ zIndex: 1 }}>
            {/* 消息展示区 */}
            <div className="flex-1 overflow-y-auto" style={{ zIndex: 1 }}>
              <div className="max-w-4xl mx-auto p-6">
                {/* 欢迎消息 - 只在没有对话消息时显示 */}
                {aiMessages.length === 0 && (
                  <div className="flex mb-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <img src="/assets/g6qmm-vsolk.gif" alt="自定义名字的AI助手" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="text-lg text-purple-600 font-medium">👋 你好，我是自定义名字的AI助手</span>
                      </div>
                      <div className="text-gray-700 leading-relaxed mb-4">
                        你好，我是你的AI助理。我汇集了控制塔各项智能服务，可以帮你处理导入运价、询价报价、系统配置、订单操作等问题，虽然我初出茅庐，但是我每天都在进步哦！
                      </div>
                      
                      <div className="mt-6">
                        <div className="font-medium mb-4 text-gray-800">你可以试试这样问我</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div 
                            className="p-4 flex items-center cursor-pointer bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all border border-purple-200 shadow-sm hover:shadow-md min-h-[80px]"
                            onClick={() => handleExampleClick('查看今日新增客户数量和注册情况')}
                          >
                            <span className="text-purple-500 mr-3 text-lg">›</span>
                            <span className="text-gray-700">查看今日新增客户数量和注册情况</span>
                          </div>
                          <div 
                            className="p-4 flex items-center cursor-pointer bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all border border-purple-200 shadow-sm hover:shadow-md min-h-[80px]"
                            onClick={() => handleExampleClick('分析本月询价转化率和热门航线')}
                          >
                            <span className="text-purple-500 mr-3 text-lg">›</span>
                            <span className="text-gray-700">分析本月询价转化率和热门航线</span>
                          </div>
                          <div 
                            className="p-4 flex items-center cursor-pointer bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all border border-purple-200 shadow-sm hover:shadow-md min-h-[80px]"
                            onClick={() => handleExampleClick('批量更新Shanghai到Bangkok的运价')}
                          >
                            <span className="text-purple-500 mr-3 text-lg">›</span>
                            <span className="text-gray-700">批量更新Shanghai到Bangkok的运价</span>
                          </div>
                          <div 
                            className="p-4 flex items-center cursor-pointer bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all border border-purple-200 shadow-sm hover:shadow-md min-h-[80px]"
                            onClick={() => handleExampleClick('查询 宁波到洛杉矶 下周的空运价格')}
                          >
                            <span className="text-purple-500 mr-3 text-lg">›</span>
                            <span className="text-gray-700">查询 宁波到洛杉矶 下周的空运价格</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 显示对话消息 */}
                {aiMessages.map((message, index) => (
                  <div key={index} className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!message.isUser && (
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                        <img src="/assets/g6qmm-vsolk.gif" alt="AI" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${message.isUser ? 'flex justify-end' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md' 
                          : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                      }`}>
                        {message.component ? message.component : message.text}
                      </div>
                      {!message.isUser && (
                        <div className="flex items-center gap-2 mt-2 ml-2">
                          <Button
                            type="text"
                            size="small"
                            className="text-gray-400 hover:text-gray-600"
                            icon={<IconCopy />}
                            onClick={() => handleMessageAction('copy', message.text)}
                            title="复制"
                          />
                          <Button
                            type="text"
                            size="small"
                            className="text-gray-400 hover:text-gray-600"
                            icon={<IconRefresh />}
                            onClick={() => handleMessageAction('regenerate', message.text)}
                            title="重新回答"
                          />
                          <Button
                            type="text"
                            size="small"
                            className="text-gray-400 hover:text-green-600"
                            icon={<IconThumbUp />}
                            onClick={() => handleMessageAction('like', message.text)}
                            title="点赞"
                          />
                          <Button
                            type="text"
                            size="small"
                            className="text-gray-400 hover:text-red-600"
                            icon={<IconThumbDown />}
                            onClick={() => handleMessageAction('dislike', message.text)}
                            title="吐槽"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部输入区域 */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-purple-200/50" style={{ zIndex: 100, position: 'relative' }}>
              <div className="max-w-4xl mx-auto p-6">
                {/* 常用技能按钮 - 增加更多间距 */}
                <div className="flex items-center gap-6 justify-center mb-4">
                  <Button 
                    size="small"
                    type="outline"
                    className="text-purple-600 border-purple-300 hover:border-purple-400"
                    icon={<IconSearch style={{ color: '#7C3AED' }} />}
                    onClick={() => handleQuickAction('运价查询')}
                  >
                    运价查询
                  </Button>
                  <Button 
                    size="small"
                    type="outline"
                    className="text-blue-600 border-blue-300 hover:border-blue-400"
                    icon={<IconUpload style={{ color: '#3B82F6' }} />}
                    onClick={() => handleQuickAction('运价导入')}
                  >
                    运价导入
                  </Button>
                  <Button 
                    size="small"
                    type="outline"
                    className="text-pink-600 border-pink-300 hover:border-pink-400"
                    icon={<IconFile style={{ color: '#EC4899' }} />}
                    onClick={() => handleQuickAction('ChatBI')}
                  >
                    ChatBI
                  </Button>
                  <Button 
                    size="small"
                    type="outline"
                    className="text-indigo-600 border-indigo-300 hover:border-indigo-400"
                    icon={<IconMessage style={{ color: '#6366F1' }} />}
                    onClick={() => handleQuickAction('内部询价')}
                  >
                    内部询价
                  </Button>
                  <div style={{ zIndex: 10000000, position: 'relative' }}>
                    <Dropdown 
                      droplist={moreMenuDroplist} 
                      position="top" 
                      trigger="click"
                      getPopupContainer={() => document.body}
                    >
                      <Button 
                        size="small"
                        type="outline"
                        className="text-gray-600 border-gray-300 hover:border-gray-400"
                        icon={<IconMore />}
                        style={{ zIndex: 10000000, position: 'relative' }}
                      >
                        更多功能
                      </Button>
                    </Dropdown>
                  </div>
                </div>

                {/* 输入框 */}
                <div className="relative">
                  <div 
                    className="relative overflow-hidden"
                    style={{ 
                      background: isVoiceMode 
                        ? 'linear-gradient(to right, #E0E7FF, #EDE9FE, #F3E8FF)' 
                        : 'linear-gradient(to right, #EFF6FF, #F3E8FF, #FDF2F8)', 
                      borderRadius: '24px', 
                      border: isVoiceMode ? '1px solid #A5B4FC' : '1px solid #C7D2FE',
                      boxShadow: isVoiceMode 
                        ? '0 4px 20px rgba(165, 180, 252, 0.3)' 
                        : '0 4px 20px rgba(79, 70, 229, 0.1)'
                    }}
                  >
                    {/* 技能标签区域 */}
                    {skillPrefix && (
                      <div className="px-6 pt-3 pb-1">
                        <Tag
                          color="purple"
                          size="medium"
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
                      <div className="mb-3 p-3 bg-white/95 border border-purple-200 rounded-lg text-base text-gray-800 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-purple-600">语音识别:</span>
                          {isTyping && <WaveAnimation />}
                        </div>
                        <div className="mt-2">{recognizedText || '正在识别中...'}</div>
                      </div>
                    )}
                    
                    {/* 输入框和按钮容器 */}
                    <div className="relative">
                      {isVoiceMode ? (
                        <div
                          className="text-base resize-none cursor-pointer flex items-center justify-center"
                          style={{ 
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 0,
                            minHeight: '48px',
                            paddingLeft: '24px',
                            paddingRight: '120px',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            color: '#4B5563',
                            fontSize: '16px'
                          }}
                          onMouseDown={startRecording}
                          onMouseUp={stopRecording}
                          onMouseLeave={stopRecording}
                        >
                          {isRecording ? (
                            <div className="flex items-center gap-3">
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
                          className="text-base resize-none"
                          style={{ 
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 0,
                            minHeight: '48px',
                            paddingLeft: '24px',
                            paddingRight: '120px',
                            paddingTop: skillPrefix ? '8px' : '12px',
                            paddingBottom: '12px',
                            boxShadow: 'none',
                            fontSize: '16px'
                          }}
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          onPressEnter={(e) => {
                            if (!e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                      )}
                      
                      {/* 按钮组 */}
                      <div className="absolute right-4 top-2 flex items-center gap-2">
                        <Button
                          type="text"
                          size="large"
                          style={{ 
                            height: '36px',
                            width: '36px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          icon={<IconAttachment style={{ color: '#86909C', fontSize: '18px' }} />}
                        />
                        <Button
                          type="text"
                          size="large"
                          style={{ 
                            height: '36px',
                            width: '36px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isVoiceMode ? '#7C3AED' : 'transparent'
                          }}
                          icon={<img src="/assets/micro.png" alt="麦克风" style={{ width: '18px', height: '18px', filter: isVoiceMode ? 'brightness(0) invert(1)' : 'none' }} />}
                          onClick={toggleVoiceMode}
                          title="语音输入"
                        />
                        <Button 
                          type="primary" 
                          size="large"
                          style={{ 
                            borderRadius: '18px', 
                            height: '36px',
                            width: '36px',
                            padding: 0,
                            background: 'linear-gradient(to right, #3B82F6, #7C3AED)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={handleSendMessage}
                          icon={<IconSend style={{ fontSize: '18px' }} />}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧边栏 - 快捷工具 */}
          <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-purple-200/50 p-4 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-800 mb-4">快捷工具</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start">
                  <IconDashboard style={{ color: '#3B82F6', fontSize: '24px' }} className="mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">数据分析</h4>
                    <p className="text-sm text-gray-600">快速分析运营数据，生成可视化报表</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start">
                  <IconTool style={{ color: '#EC4899', fontSize: '24px' }} className="mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-pink-700 mb-2">批量处理</h4>
                    <p className="text-sm text-gray-600">批量导入运价、更新订单状态等操作</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start">
                  <IconBook style={{ color: '#6366F1', fontSize: '24px' }} className="mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-700 mb-2">市场报告</h4>
                    <p className="text-sm text-gray-600">快速根据市场运价行情生成运价报告</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start">
                  <IconNotification style={{ color: '#10B981', fontSize: '24px' }} className="mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">资讯生成</h4>
                    <p className="text-sm text-gray-600">快速收集最新行业新闻，更新网站资讯模块</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFullscreen;
