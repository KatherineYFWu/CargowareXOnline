import React, { useState, useEffect } from 'react';
import { IconArrowUp, IconArrowDown, IconEye, IconClose, IconArrowRight, IconSun, IconMoon, IconDown, IconUp } from '@arco-design/web-react/icon';
import { Select, DatePicker, Modal } from '@arco-design/web-react';
import { Dayjs } from 'dayjs';
import LeafletMap from './LeafletMap';
import './ControlTowerPanelStyles.css';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';

// 导入世界地图数据
import 'echarts-countries-js/echarts-countries-js/world';

// 声明全局类型
declare global {
  interface Window {
    InfogramEmbeds?: {
      process: () => void;
    };
  }
}

// 任务类型定义
interface TaskItem {
  id: string;
  orderNumber: string;
  taskType: string;
  customerName: string;
  deadline: Date;
  overdueHours?: number;
  status: 'pending' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

// 任务弹窗组件
const TaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tasks: TaskItem[];
}> = ({ isOpen, onClose, title, tasks }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const formatDeadline = (deadline: Date) => {
    return deadline.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatOverdueTime = (hours: number) => {
    if (hours < 24) {
      return `${hours}小时`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours > 0 ? `${days}天${remainingHours}小时` : `${days}天`;
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    const colors = {
      '待报价': '#ff9500',
      '待确认提单': '#1890ff',
      '待确认账单': '#722ed1',
      '待提交VGM': '#eb2f96',
      '待上传SI': '#13c2c2',
      '待补充文件': '#faad14',
      '待客户确认': '#52c41a',
      '待海关放行': '#f5222d'
    };
    return colors[taskType as keyof typeof colors] || '#1890ff';
  };

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="task-modal-content">
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-modal-item ${task.status}`}>
                {/* 优先级绸带 */}
                <div className={`task-priority-ribbon ${task.priority}`}>
                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </div>
                
                <div className="task-main-info">
                  <div className="task-left">
                    <div className="task-order-info">
                      <span className="task-order-number">{task.orderNumber}</span>
                      <span className="task-customer">{task.customerName}</span>
                    </div>
                    <div className="task-type-info">
                      <span 
                        className="task-type-tag"
                        style={{ 
                          backgroundColor: `${getTaskTypeColor(task.taskType)}20`,
                          borderColor: getTaskTypeColor(task.taskType),
                          color: getTaskTypeColor(task.taskType)
                        }}
                      >
                        {task.taskType}
                      </span>
                    </div>
                  </div>
                  <div className="task-right">
                    <div className="task-deadline">
                      <span className="deadline-label">截止时间</span>
                      <span className="deadline-time">{formatDeadline(task.deadline)}</span>
                    </div>
                    {task.status === 'overdue' && task.overdueHours && (
                      <div className="task-overdue">
                        <span className="overdue-label">逾期时间</span>
                        <span className="overdue-time">{formatOverdueTime(task.overdueHours)}</span>
                      </div>
                    )}
                    <button 
                      className="view-button"
                      onClick={() => navigate(`/controltower/order-detail/ORD000001`)}
                      title="查看订单详情"
                    >
                      <IconArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="task-modal-footer">
          <div className="task-summary">
            共 {tasks.length} 个任务
            {title.includes('逾期') && (
              <span className="overdue-summary">
                ，逾期总时长：{tasks.reduce((total, task) => total + (task.overdueHours || 0), 0)}小时
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlTowerPanel: React.FC = () => {

  const [realtimeOrders, setRealtimeOrders] = useState<Array<{id: string, source: string, time: string}>>([]);
  const [realtimeTasks, setRealtimeTasks] = useState<Array<{id: string, task: string, time: string}>>([]);
  
  // 主题状态
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // 图表显示状态 - 默认隐藏
  const [isChartsVisible, setIsChartsVisible] = useState(false);
  
  // 弹窗状态
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalTitle, setTaskModalTitle] = useState('');
  const [taskModalData, setTaskModalData] = useState<TaskItem[]>([]);
  
  // 时间选择器状态
  const [timeRange, setTimeRange] = useState<string>('本周');
  const [customDateRange, setCustomDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  
  // 数据范围选择器状态
  const [dataScope, setDataScope] = useState<string>('本人');
  
  // 真实运价指数数据配置
  const freightIndicesConfig = [
    { 
      code: 'FAX', 
      name: 'Freightos Air Index (Global)', 
      description: '全球航空运价指数',
      embedId: '_/11uV8DUwjiugBxwssg1C',
      type: 'air',
      price: 2845.3,
      change: 5.2
    },
    { 
      code: 'FBX', 
      name: 'Freightos Baltic Index (Global)', 
      description: '全球集装箱运价指数',
      embedId: '_/AcDi5xXouXrzQMLqbVpj',
      type: 'ocean',
      price: 1662.6,
      change: 7.51
    },
    { 
      code: 'FBX01', 
      name: 'China/East Asia → North America West Coast', 
      description: '中国/东亚→北美西海岸',
      embedId: '_/iWaVJnijhUTxyFOJszmw',
      type: 'ocean',
      price: 1687.2,
      change: 17.9
    },
    { 
      code: 'FBX02', 
      name: 'China/East Asia → North America East Coast', 
      description: '中国/东亚→北美东海岸',
      embedId: '_/iU90H18RtmIZ82eRtOdF',
      type: 'ocean',
      price: 377,
      change: -0.26
    },
    { 
      code: 'FBX03', 
      name: 'China/East Asia → North Europe', 
      description: '中国/东亚→北欧',
      embedId: '_/64yDIIsZPdLEdOaaq4q6',
      type: 'ocean',
      price: 3071.4,
      change: 1.87
    },
    { 
      code: 'FBX13', 
      name: 'China/East Asia → Mediterranean', 
      description: '中国/东亚→地中海',
      embedId: '_/yaGUtPV8Th3j5czlzctX',
      type: 'ocean',
      price: 2456.8,
      change: -2.15
    }
  ];

  // 加载Infogram嵌入脚本
  useEffect(() => {
    const loadInfogramScript = () => {
      // 检查脚本是否已经加载
      if (document.getElementById('infogram-async')) {
        // 如果已存在，重新初始化
        if (window.InfogramEmbeds?.process) {
          setTimeout(() => {
            window.InfogramEmbeds?.process();
          }, 100);
        }
        return;
      }

      // 创建并加载Infogram脚本
      const script = document.createElement('script');
      script.id = 'infogram-async';
      script.src = 'https://e.infogram.com/js/dist/embed-loader-min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Infogram script loaded successfully');
        // 脚本加载完成后，延迟初始化嵌入内容
        setTimeout(() => {
          if (window.InfogramEmbeds?.process) {
            console.log('Processing Infogram embeds...');
            window.InfogramEmbeds.process();
          }
        }, 500);
      };

      script.onerror = () => {
        console.error('Failed to load Infogram script');
      };

      document.head.appendChild(script);
    };

    // 延迟加载脚本，确保DOM已准备好
    const timer = setTimeout(loadInfogramScript, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 当图表可见性改变时，重新处理Infogram嵌入
  useEffect(() => {
    if (isChartsVisible && window.InfogramEmbeds?.process) {
      setTimeout(() => {
        console.log('Re-processing Infogram embeds after visibility change...');
        window.InfogramEmbeds?.process();
      }, 300);
    }
  }, [isChartsVisible]);

  // 注册世界地图数据（使用懒加载避免阻塞）
  useEffect(() => {
    const registerWorldMap = () => {
      // 延迟加载地图数据，避免阻塞初始渲染
      setTimeout(async () => {
      try {
        // 使用CDN加载世界地图GeoJSON数据
        await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        
        // Map registration completed
      } catch (error) {
        console.error('Failed to load world map:', error);
        // 如果加载失败，使用备用方案
      }
      }, 1000); // 延迟1秒加载，确保界面先渲染
    };

    registerWorldMap();
  }, []);



  // 实时订单生成
  useEffect(() => {
    const sources = ['创建询价', 'API同步', '创建订舱', 'AI识别'];
    
    const generateOrder = () => {
      const orderNumber = `WO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
      const source = sources[Math.floor(Math.random() * sources.length)];
      const time = new Date().toLocaleTimeString('zh-CN');
      
      setRealtimeOrders(prev => {
        const newOrders = [{
          id: orderNumber,
          source: source,
          time: time
        }, ...prev];
        // 保持最多15条记录
        return newOrders.slice(0, 15);
      });
    };

    // 初始生成几条订单
    for (let i = 0; i < 3; i++) {
      setTimeout(() => generateOrder(), i * 500);
    }

    // 每4-7秒随机生成一条新订单
    const interval = setInterval(() => {
      generateOrder();
    }, Math.random() * 3000 + 4000);

    return () => clearInterval(interval);
  }, []);

  // 实时任务生成
  useEffect(() => {
    const tasks = ['待报价', '待确认提单', '待确认账单', '待提交VGM'];
    
    const generateTask = () => {
      const orderNumber = `WO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      const time = new Date().toLocaleTimeString('zh-CN');
      
      setRealtimeTasks(prev => {
        const newTasks = [{
          id: orderNumber,
          task: task,
          time: time
        }, ...prev];
        // 保持最多15条记录
        return newTasks.slice(0, 15);
      });
    };

    // 初始生成几条任务
    for (let i = 0; i < 3; i++) {
      setTimeout(() => generateTask(), i * 800);
    }

    // 每5-9秒随机生成一条新任务
    const interval = setInterval(() => {
      generateTask();
    }, Math.random() * 4000 + 5000);

    return () => clearInterval(interval);
  }, []);

  // 通关异常订单直方图初始化
  useEffect(() => {
    const chartElement = document.getElementById('customs-anomaly-bar-chart');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);
    
    // 生成初始数据
    const ports = ['上海港', '宁波舟山港', '深圳港', '青岛港', '广州港', '天津港', '厦门港', '大连港'];
    let anomalyData = ports.map(() => Math.floor(Math.random() * 30) + 5);

    const updateChart = () => {
      const option = {
        backgroundColor: 'transparent',
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: isDarkTheme ? 'rgba(0, 20, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDarkTheme ? '#ff6b6b' : '#ef4444',
          borderWidth: 1,
          textStyle: {
            color: isDarkTheme ? '#ffffff' : '#1e293b'
          },
          formatter: (params: unknown) => {
            const dataArray = Array.isArray(params) ? params : [params];
            const data = dataArray[0] as { name: string; value: number };
            return `${data.name}<br/>异常订单: ${data.value} 单`;
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ports,
          axisLine: {
            lineStyle: {
              color: isDarkTheme ? '#ff6b6b' : '#ef4444'
            }
          },
          axisLabel: {
            color: isDarkTheme ? '#99ccff' : '#475569',
            fontSize: 12,
            rotate: 30
          },
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: isDarkTheme ? '#ff6b6b' : '#ef4444'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '异常订单数',
          nameTextStyle: {
            color: isDarkTheme ? '#ff6b6b' : '#ef4444',
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: isDarkTheme ? '#ff6b6b' : '#ef4444'
            }
          },
          axisLabel: {
            color: isDarkTheme ? '#99ccff' : '#475569',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: isDarkTheme ? 'rgba(255, 107, 107, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              type: 'dashed'
            }
          }
        },
        series: [{
          type: 'bar',
          data: anomalyData,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: isDarkTheme ? '#ff6b6b' : '#ef4444' },
              { offset: 1, color: isDarkTheme ? '#ff9999' : '#fca5a5' }
            ]),
            borderRadius: [4, 4, 0, 0],
            shadowColor: isDarkTheme ? 'rgba(255, 107, 107, 0.5)' : 'rgba(239, 68, 68, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 3
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: isDarkTheme ? '#ff5555' : '#dc2626' },
                { offset: 1, color: isDarkTheme ? '#ff8888' : '#f87171' }
              ])
            }
          },
          animationDelay: (idx: number) => idx * 100,
          animationEasing: 'elasticOut'
        }]
      };

      chart.setOption(option);
    };

    updateChart();

    // 定时更新数据
    const updateInterval = setInterval(() => {
      anomalyData = anomalyData.map(() => Math.floor(Math.random() * 30) + 5);
      updateChart();
    }, 10000); // 每10秒更新一次

    // 响应式处理
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [isDarkTheme]);

  // 询价成交趋势折线图初始化
  useEffect(() => {
    const chartElement = document.getElementById('inquiry-deal-line-chart');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);
    
    // 生成过去30天的数据
    const generateDateRange = (days: number) => {
      const dates: string[] = [];
      const inquiryData: number[] = [];
      const dealData: number[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
        
        const inquiry = Math.floor(Math.random() * 100) + 50;
        const deal = Math.floor(inquiry * (0.3 + Math.random() * 0.4));
        
        inquiryData.push(inquiry);
        dealData.push(deal);
      }
      
      return { dates, inquiryData, dealData };
    };

    const { dates, inquiryData, dealData } = generateDateRange(30);

    const updateChart = () => {
      const option = {
        backgroundColor: 'transparent',
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: isDarkTheme ? 'rgba(0, 20, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDarkTheme ? '#00f7ff' : '#3b82f6',
          borderWidth: 1,
          textStyle: {
            color: isDarkTheme ? '#ffffff' : '#1e293b'
          },
          axisPointer: {
            type: 'cross',
            lineStyle: {
              color: isDarkTheme ? '#00f7ff' : '#3b82f6',
              width: 1,
              type: 'dashed'
            }
          }
        },
        legend: {
          data: ['询价数量', '成交数量'],
          textStyle: {
            color: isDarkTheme ? '#99ccff' : '#475569'
          },
          top: 'top',
          right: '10%'
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: {
            lineStyle: {
              color: isDarkTheme ? '#00f7ff' : '#3b82f6'
            }
          },
          axisLabel: {
            color: isDarkTheme ? '#99ccff' : '#475569',
            fontSize: 12,
            rotate: 45
          },
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: isDarkTheme ? '#00f7ff' : '#3b82f6'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '数量',
          nameTextStyle: {
            color: isDarkTheme ? '#00f7ff' : '#3b82f6',
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: isDarkTheme ? '#00f7ff' : '#3b82f6'
            }
          },
          axisLabel: {
            color: isDarkTheme ? '#99ccff' : '#475569',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: isDarkTheme ? 'rgba(0, 247, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '询价数量',
            type: 'line',
            data: inquiryData,
            lineStyle: {
              color: isDarkTheme ? '#00f7ff' : '#3b82f6',
              width: 3,
              shadowColor: isDarkTheme ? 'rgba(0, 247, 255, 0.5)' : 'rgba(59, 130, 246, 0.3)',
              shadowBlur: 10
            },
            itemStyle: {
              color: isDarkTheme ? '#00f7ff' : '#3b82f6',
              borderColor: '#ffffff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: isDarkTheme ? 'rgba(0, 247, 255, 0.3)' : 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: isDarkTheme ? 'rgba(0, 247, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)' }
              ])
            },
            smooth: true,
            symbol: 'circle',
            symbolSize: 6
          },
          {
            name: '成交数量',
            type: 'line',
            data: dealData,
            lineStyle: {
              color: isDarkTheme ? '#00ff88' : '#10b981',
              width: 3,
              shadowColor: isDarkTheme ? 'rgba(0, 255, 136, 0.5)' : 'rgba(16, 185, 129, 0.3)',
              shadowBlur: 10
            },
            itemStyle: {
              color: isDarkTheme ? '#00ff88' : '#10b981',
              borderColor: '#ffffff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: isDarkTheme ? 'rgba(0, 255, 136, 0.3)' : 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: isDarkTheme ? 'rgba(0, 255, 136, 0.05)' : 'rgba(16, 185, 129, 0.05)' }
              ])
            },
            smooth: true,
            symbol: 'circle',
            symbolSize: 6
          }
        ]
      };

      chart.setOption(option);
    };

    updateChart();

    // 定时更新数据
    const updateInterval = setInterval(() => {
      // 移除第一个数据点，添加新的数据点
      dates.shift();
      inquiryData.shift();
      dealData.shift();
      
      const today = new Date();
      dates.push(today.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
      
      const newInquiry = Math.floor(Math.random() * 100) + 50;
      const newDeal = Math.floor(newInquiry * (0.3 + Math.random() * 0.4));
      
      inquiryData.push(newInquiry);
      dealData.push(newDeal);
      
      updateChart();
    }, 15000); // 每15秒更新一次

    // 响应式处理
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [isDarkTheme]);

  // 热门询价排行榜初始化
  useEffect(() => {
    const contentElement = document.getElementById('hot-inquiry-ranking-content');
    if (contentElement) {
      
      // 热门航线数据
      const hotRoutes = [
        { route: 'Shanghai → Los Angeles', count: Math.floor(Math.random() * 200) + 300, rank: 1 },
        { route: 'Qingdao → Rotterdam', count: Math.floor(Math.random() * 180) + 250, rank: 2 },
        { route: 'Shenzhen → Hamburg', count: Math.floor(Math.random() * 160) + 220, rank: 3 },
        { route: 'Ningbo → Long Beach', count: Math.floor(Math.random() * 150) + 200, rank: 4 },
        { route: 'Tianjin → Dubai', count: Math.floor(Math.random() * 140) + 180, rank: 5 },
        { route: 'Xiamen → Singapore', count: Math.floor(Math.random() * 130) + 160, rank: 6 },
        { route: 'Dalian → Antwerp', count: Math.floor(Math.random() * 120) + 140, rank: 7 },
        { route: 'Guangzhou → New York', count: Math.floor(Math.random() * 110) + 120, rank: 8 },
        { route: 'Yantai → Felixstowe', count: Math.floor(Math.random() * 100) + 100, rank: 9 },
        { route: 'Lianyungang → Le Havre', count: Math.floor(Math.random() * 90) + 80, rank: 10 }
      ];

      const renderRanking = () => {
        // 重新排序（基于count降序）
        const sortedRoutes = [...hotRoutes].sort((a, b) => b.count - a.count);
        
        const rankingHTML = sortedRoutes.map((item, index) => {
          const rank = index + 1;
          const rankClass = rank <= 3 ? `top-${rank}` : 'normal';
          const trendClass = Math.random() > 0.5 ? 'up' : 'down';
          const trendIcon = trendClass === 'up' ? '↗' : '↘';
          
          return `
            <div class="ranking-item ${rankClass}" style="animation-delay: ${index * 0.1}s;">
              <div class="rank-number">
                <span class="rank">${rank}</span>
                ${rank <= 3 ? '<span class="crown">👑</span>' : ''}
              </div>
              <div class="route-info">
                <div class="route-name">${item.route}</div>
                <div class="route-meta">
                  <span class="inquiry-count">${item.count} 次询价</span>
                  <span class="trend ${trendClass}">${trendIcon} ${Math.floor(Math.random() * 20) + 5}%</span>
                </div>
              </div>
              <div class="ranking-bar">
                <div class="bar-fill ${rankClass}" style="width: ${(item.count / sortedRoutes[0].count) * 100}%"></div>
              </div>
            </div>
          `;
        }).join('');
        
        contentElement.innerHTML = rankingHTML;
      };

      // 初始渲染
      renderRanking();

      // 定时更新数据
      const updateInterval = setInterval(() => {
        // 随机更新部分航线的询价次数
        hotRoutes.forEach(route => {
          const change = Math.floor(Math.random() * 20) - 10; // -10 到 +10 的变化
          route.count = Math.max(50, route.count + change); // 确保最小值为50
        });
        
        renderRanking();
      }, 20000); // 每20秒更新一次

      return () => {
        clearInterval(updateInterval);
      };
    }
  }, []);

  // 销售报价时效排行榜初始化
  useEffect(() => {
    const contentElement = document.getElementById('sales-quote-efficiency-content');
    if (contentElement) {
      
      // 销售员报价时效数据
      const salesQuoteData = [
        { name: '张明', avgTime: '0.8h', efficiency: 95, orders: 142, rank: 1 },
        { name: '李思雨', avgTime: '1.2h', efficiency: 89, orders: 128, rank: 2 },
        { name: '王建华', avgTime: '1.5h', efficiency: 84, orders: 115, rank: 3 },
        { name: '陈晓东', avgTime: '1.8h', efficiency: 78, orders: 98, rank: 4 },
        { name: '赵美玲', avgTime: '2.1h', efficiency: 72, orders: 87, rank: 5 },
        { name: '刘志强', avgTime: '2.4h', efficiency: 68, orders: 76, rank: 6 },
        { name: '周雪婷', avgTime: '2.7h', efficiency: 63, orders: 69, rank: 7 },
        { name: '孙浩然', avgTime: '3.1h', efficiency: 58, orders: 58, rank: 8 },
        { name: '吴佳琪', avgTime: '3.5h', efficiency: 52, orders: 45, rank: 9 },
        { name: '胡锦涛', avgTime: '4.2h', efficiency: 46, orders: 38, rank: 10 }
      ];

      const renderSalesQuoteRanking = () => {
        // 按效率重新排序
        const sortedData = [...salesQuoteData].sort((a, b) => b.efficiency - a.efficiency);
        
        const rankingHTML = sortedData.map((item, index) => {
          const rank = index + 1;
          const rankClass = rank <= 3 ? `top-${rank}` : 'normal';
          const trendClass = Math.random() > 0.5 ? 'up' : 'down';
          const trendIcon = trendClass === 'up' ? '↗' : '↘';
          
          return `
            <div class="ranking-item ${rankClass}" style="animation-delay: ${index * 0.1}s;">
              <div class="rank-number">
                <span class="rank">${rank}</span>
                ${rank <= 3 ? '<span class="crown">🏆</span>' : ''}
              </div>
              <div class="route-info">
                <div class="route-name">${item.name}</div>
                <div class="route-meta">
                  <span class="inquiry-count">平均 ${item.avgTime}</span>
                  <span class="trend ${trendClass}">${trendIcon} ${item.efficiency}%</span>
                </div>
              </div>
              <div class="ranking-bar">
                <div class="bar-fill ${rankClass}" style="width: ${item.efficiency}%"></div>
              </div>
            </div>
          `;
        }).join('');
        
        contentElement.innerHTML = rankingHTML;
      };

      // 初始渲染
      renderSalesQuoteRanking();

      // 定时更新数据
      const updateInterval = setInterval(() => {
        // 随机更新销售员数据
        salesQuoteData.forEach(sales => {
          const efficiencyChange = Math.floor(Math.random() * 10) - 5; // -5 到 +5 的变化
          sales.efficiency = Math.max(30, Math.min(100, sales.efficiency + efficiencyChange)); // 30-100范围
          const avgTimeChange = (Math.random() - 0.5) * 0.5; // -0.25h 到 +0.25h 的变化
          const currentTime = parseFloat(sales.avgTime.replace('h', ''));
          const newTime = Math.max(0.5, currentTime + avgTimeChange);
          sales.avgTime = `${newTime.toFixed(1)}h`;
        });
        
        renderSalesQuoteRanking();
      }, 25000); // 每25秒更新一次

      return () => {
        clearInterval(updateInterval);
      };
    }
  }, []);

  // 成交订单量客户排行榜初始化
  useEffect(() => {
    const contentElement = document.getElementById('customer-orders-ranking-content');
    if (contentElement) {
      
      // 客户成交订单数据
      const customerOrdersData = [
        { company: '华为技术有限公司', orders: 2847, revenue: '¥1.24亿', growth: 15.6, rank: 1 },
        { company: '阿里巴巴集团', orders: 2156, revenue: '¥9680万', growth: 12.3, rank: 2 },
        { company: '腾讯科技', orders: 1893, revenue: '¥8520万', growth: 8.9, rank: 3 },
        { company: '比亚迪股份', orders: 1647, revenue: '¥7410万', growth: 22.1, rank: 4 },
        { company: '海康威视', orders: 1425, revenue: '¥6380万', growth: -3.2, rank: 5 },
        { company: '小米集团', orders: 1238, revenue: '¥5560万', growth: 18.7, rank: 6 },
        { company: '京东集团', orders: 1089, revenue: '¥4890万', growth: 5.4, rank: 7 },
        { company: '宁德时代', orders: 947, revenue: '¥4250万', growth: 28.9, rank: 8 },
        { company: '美的集团', orders: 856, revenue: '¥3840万', growth: 7.2, rank: 9 },
        { company: '格力电器', orders: 723, revenue: '¥3250万', growth: -1.8, rank: 10 }
      ];

      const renderCustomerOrdersRanking = () => {
        // 按订单量重新排序
        const sortedData = [...customerOrdersData].sort((a, b) => b.orders - a.orders);
        
        const rankingHTML = sortedData.map((item, index) => {
          const rank = index + 1;
          const rankClass = rank <= 3 ? `top-${rank}` : 'normal';
          const trendClass = item.growth >= 0 ? 'up' : 'down';
          const trendIcon = trendClass === 'up' ? '↗' : '↘';
          
          return `
            <div class="ranking-item ${rankClass}" style="animation-delay: ${index * 0.1}s;">
              <div class="rank-number">
                <span class="rank">${rank}</span>
                ${rank <= 3 ? '<span class="crown">💎</span>' : ''}
              </div>
              <div class="route-info">
                <div class="route-name">${item.company}</div>
                <div class="route-meta">
                  <span class="inquiry-count">${item.orders} 订单</span>
                  <span class="trend ${trendClass}">${trendIcon} ${Math.abs(item.growth)}%</span>
                </div>
              </div>
              <div class="ranking-bar">
                <div class="bar-fill ${rankClass}" style="width: ${(item.orders / sortedData[0].orders) * 100}%"></div>
              </div>
            </div>
          `;
        }).join('');
        
        contentElement.innerHTML = rankingHTML;
      };

      // 初始渲染
      renderCustomerOrdersRanking();

      // 定时更新数据
      const updateInterval = setInterval(() => {
        // 随机更新客户订单数据
        customerOrdersData.forEach(customer => {
          const orderChange = Math.floor(Math.random() * 40) - 20; // -20 到 +20 的变化
          customer.orders = Math.max(500, customer.orders + orderChange); // 确保最小值为500
          const growthChange = (Math.random() - 0.5) * 10; // -5% 到 +5% 的变化
          customer.growth = Math.round((customer.growth + growthChange) * 10) / 10;
        });
        
        renderCustomerOrdersRanking();
      }, 30000); // 每30秒更新一次

      return () => {
        clearInterval(updateInterval);
      };
    }
  }, []);

  // 数据总览配置
  const overviewData = [
    { title: '总订单数', value: 4823, change: 156, trend: 'up', unit: '单' },
    { title: '在途订单', value: 1247, change: 23, trend: 'up', unit: '单' },
    { title: '待处理任务', value: 89, change: -12, trend: 'down', unit: '个' },
    { title: '逾期任务', value: 15, change: -8, trend: 'down', unit: '个' },
    { title: '异常预警订单', value: 6, change: 2, trend: 'up', unit: '单' },
  ];

  // 生成虚拟任务数据
  const generateTaskData = (type: 'pending' | 'overdue', count: number): TaskItem[] => {
    const taskTypes = ['待报价', '待确认提单', '待确认账单', '待提交VGM', '待上传SI', '待补充文件', '待客户确认', '待海关放行'];
    const customers = ['华为技术有限公司', '阿里巴巴集团', '腾讯科技', '比亚迪股份', '海康威视', '小米集团', '京东集团', '宁德时代'];
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    
    const tasks: TaskItem[] = [];
    
    for (let i = 0; i < count; i++) {
      const now = new Date();
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      let deadline: Date;
      let overdueHours: number | undefined;
      
      if (type === 'pending') {
        // 待处理任务：截止时间在未来1-48小时内
        deadline = new Date(now.getTime() + (Math.random() * 48 + 1) * 60 * 60 * 1000);
      } else {
        // 逾期任务：截止时间在过去，逾期1-168小时（1周）
        overdueHours = Math.floor(Math.random() * 168) + 1;
        deadline = new Date(now.getTime() - overdueHours * 60 * 60 * 1000);
      }
      
      const orderNumber = `WO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
      
      tasks.push({
        id: `task-${i}-${Date.now()}`,
        orderNumber,
        taskType,
        customerName: customer,
        deadline,
        overdueHours,
        status: type,
        priority
      });
    }
    
    // 按优先级和截止时间排序
    return tasks.sort((a, b) => {
      // 优先级排序：high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // 同优先级按截止时间排序
      if (type === 'pending') {
        return a.deadline.getTime() - b.deadline.getTime(); // 即将到期的在前
      } else {
        return (b.overdueHours || 0) - (a.overdueHours || 0); // 逾期时间长的在前
      }
    });
  };
  
  // 打开任务弹窗
  const openTaskModal = (type: 'pending' | 'overdue') => {
    if (type === 'pending') {
      setTaskModalTitle('待处理任务列表');
      setTaskModalData(generateTaskData('pending', 89));
    } else {
      setTaskModalTitle('逾期任务列表');
      setTaskModalData(generateTaskData('overdue', 15));
    }
    setIsTaskModalOpen(true);
  };

  // 关闭任务弹窗
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskModalTitle('');
    setTaskModalData([]);
  };

  // 在实时任务列表中添加"查看"按钮
  const openRealtimeTaskModal = (taskId: string) => {
    const task = realtimeTasks.find(t => t.id === taskId);
    if (task) {
      setTaskModalTitle(`任务详情 - ${task.id}`);
      setTaskModalData([{
        id: task.id,
        orderNumber: task.id,
        taskType: task.task,
        customerName: '未知客户', // 假设没有客户信息
        deadline: new Date(), // 假设没有截止时间
        status: 'pending',
        priority: 'medium' // 假设中等优先级
      }]);
      setIsTaskModalOpen(true);
    }
  };

  // 主题切换函数
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // 图表显示切换函数
  const toggleCharts = () => {
    setIsChartsVisible(!isChartsVisible);
  };

  /**
   * 处理时间范围选择变化
   * @param value 选择的时间范围值
   */
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    if (value === '自定义') {
      setIsCustomDateModalOpen(true);
    } else {
      setCustomDateRange(null);
    }
  };

  /**
   * 处理自定义日期范围确认
   */
  const handleCustomDateConfirm = () => {
    if (customDateRange && customDateRange[0] && customDateRange[1]) {
      const [startDate, endDate] = customDateRange;
      const diffDays = endDate.diff(startDate, 'day');
      
      // 检查日期跨度是否超过1年
      if (diffDays > 365) {
        alert('日期范围不能超过1年');
        return;
      }
      
      // 格式化日期范围显示
      const customRangeText = `${startDate.format('YYYY-MM-DD')} 至 ${endDate.format('YYYY-MM-DD')}`;
      setTimeRange(customRangeText);
      setIsCustomDateModalOpen(false);
    } else {
      alert('请选择有效的日期范围');
    }
  };

  /**
   * 处理数据范围选择变化
   * @param value 选择的数据范围值
   */
  const handleDataScopeChange = (value: string) => {
    setDataScope(value);
  };

  return (
    <div className={`control-tower-panel ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* 顶部标题栏 */}
      <div className="panel-header">
        <div className="header-left">
          <div className="panel-title">
            <span className="title-icon">◆</span>
            <span>Wo AI 控制塔面板</span>
          </div>
        </div>
        <div className="header-center">
          <div className="control-selectors">
            {/* 时间选择器 */}
            <div className="time-selector">
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                style={{ width: 120 }}
                size="small"
                placeholder="选择时间范围"
                options={[
                  { label: '今日', value: '今日' },
                  { label: '本周', value: '本周' },
                  { label: '本月', value: '本月' },
                  { label: '本年', value: '本年' },
                  { label: '自定义', value: '自定义' }
                ]}
              />
            </div>
            
            {/* 数据范围选择器 */}
            <div className="data-scope-selector">
              <Select
                value={dataScope}
                onChange={handleDataScopeChange}
                style={{ width: 100 }}
                size="small"
                placeholder="数据范围"
                options={[
                  { label: '本人', value: '本人' },
                  { label: '本部门', value: '本部门' },
                  { label: '本分公司', value: '本分公司' },
                  { label: '本租户', value: '本租户' }
                ]}
              />
            </div>
            

          </div>
        </div>
        <div className="header-right">
          <button 
            className="charts-toggle-button"
            onClick={toggleCharts}
            title={isChartsVisible ? '收起指数详情' : '展开指数详情'}
          >
            {isChartsVisible ? <IconUp /> : <IconDown />}
            <span>{isChartsVisible ? '收起指数详情' : '展开指数详情'}</span>
          </button>
          <button 
            className="theme-toggle-button"
            onClick={toggleTheme}
            title={isDarkTheme ? '切换到浅色主题' : '切换到深色主题'}
          >
            {isDarkTheme ? <IconSun /> : <IconMoon />}
          </button>
          <div className="system-status">
            <span className="status-indicator online"></span>
            订单流转正常
          </div>
        </div>
      </div>

      {/* 运价指数滚动条 - 真实数据展示 */}
      <div className="freight-ticker">
        <div className="ticker-content">
          {[...freightIndicesConfig, ...freightIndicesConfig].map((item, index) => (
            <div key={`${item.code}-${index}`} className="ticker-item">
              <span className="ticker-code">{item.code}</span>
              <span className="ticker-separator">-</span>
              <span className="ticker-price">${item.price}</span>
              <span className={`ticker-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {item.change >= 0 ? (
                  <>
                    <IconArrowUp className="ticker-arrow" />
                    {item.change.toFixed(2)}%
                  </>
                ) : (
                  <>
                    <IconArrowDown className="ticker-arrow" />
                    {Math.abs(item.change).toFixed(2)}%
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 运价指数详细图表区域 */}
      {isChartsVisible && (
        <div className="freight-charts-section" style={{ 
          padding: '20px', 
          backgroundColor: isDarkTheme ? 'rgba(0, 20, 40, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          margin: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="charts-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {freightIndicesConfig.map((config) => (
              <div key={config.code} className="chart-container" style={{
                backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                padding: '20px',
                borderRadius: '12px',
                border: `1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
              }}>
                <h4 style={{ 
                  color: isDarkTheme ? '#ffffff' : '#1e293b',
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {config.code} - {config.description}
                </h4>
                <div 
                  className="infogram-embed" 
                  data-id={config.embedId}
                  data-type="interactive" 
                  data-title={`${config.code} Chart`}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '400px'
                  }}
                >
                  <div style={{ padding: '8px 0', fontFamily: 'Arial', fontSize: '13px', lineHeight: '15px', textAlign: 'center' }}>
                    <a 
                      href={`https://infogram.com/${config.embedId}`}
                      style={{ color: '#989898', textDecoration: 'none' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {config.description}
                    </a>
                    <br />
                    <a 
                      href="https://infogram.com"
                      style={{ color: '#989898', textDecoration: 'none' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Infogram
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="panel-content">
        {/* 顶部数据概览 */}
        <div className="overview-section">
          {overviewData.map((item, index) => (
            <div key={index} className="overview-card">
              <div className="card-header">
                <span className="card-title">{item.title}</span>
                <div className="card-header-right">
                <div className={`trend-indicator ${item.trend}`}>
                  {item.trend === 'up' ? <IconArrowUp /> : <IconArrowDown />}
                  {Math.abs(item.change)}
                  </div>
                  {(item.title === '待处理任务' || item.title === '逾期任务') && (
                    <button 
                      className="view-button"
                      onClick={() => openTaskModal(item.title === '待处理任务' ? 'pending' : 'overdue')}
                      title={`查看${item.title}详情`}
                    >
                      <IconEye />
                    </button>
                  )}
                </div>
              </div>
              <div className="card-value">
                <span className="value">{item.value.toLocaleString()}</span>
                <span className="unit">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="charts-section">
          {/* 三列布局：实时订单列表 + 全球订单流向图 + 实时任务列表 */}
          <div className="charts-row three-column">
            {/* 左侧实时订单列表 */}
            <div className="chart-card realtime-orders">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                实时订单
              </div>
              <div className="orders-list">
                {realtimeOrders.map((order, index) => (
                  <div key={order.id} className={`order-item ${index === 0 ? 'new-order' : ''}`}>
                    <div className="order-header">
                      <span className="order-number">{order.id}</span>
                      <span className="order-time">{order.time}</span>
                    </div>
                    <div className="order-source">
                      <span className={`source-tag source-${order.source}`}>{order.source}</span>
                    </div>
                  </div>
                ))}
                {realtimeOrders.length === 0 && (
                  <div className="no-orders">暂无实时订单</div>
                )}
              </div>
            </div>
            
            {/* 中间全球订单流向图 */}
            <div className="chart-card map-container">
              <LeafletMap height="600px" isDarkTheme={isDarkTheme} />
            </div>

            {/* 右侧实时任务列表 */}
            <div className="chart-card realtime-tasks">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                实时任务
              </div>
              <div className="tasks-list">
                {realtimeTasks.map((task, index) => (
                  <div key={`${task.id}-${task.time}`} className={`task-item ${index === 0 ? 'new-task' : ''}`}>
                    <div className="task-header">
                      <span className="task-order-number">{task.id}</span>
                      <span className="task-time">{task.time}</span>
                      <button 
                        className="view-button"
                        onClick={() => openRealtimeTaskModal(task.id)}
                        title="查看任务详情"
                      >
                        <IconEye />
                      </button>
                    </div>
                    <div className="task-content">
                      <span className={`task-tag task-${task.task}`}>{task.task}</span>
                    </div>
                  </div>
                ))}
                {realtimeTasks.length === 0 && (
                  <div className="no-tasks">暂无实时任务</div>
                )}
              </div>
            </div>
          </div>

          {/* 通关异常订单直方图 */}
          <div className="charts-row two-column">
            <div className="chart-card customs-anomaly-chart">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                通关异常订单统计
              </div>
              <div id="customs-anomaly-bar-chart" style={{ width: '100%', height: '300px' }}></div>
            </div>

            {/* 询价成交趋势折线图 */}
            <div className="chart-card inquiry-deal-chart">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                询价成交趋势
              </div>
              <div id="inquiry-deal-line-chart" style={{ width: '100%', height: '300px' }}></div>
            </div>
          </div>

          {/* 三个排行榜并排布局 */}
          <div className="charts-row three-column-equal">
            {/* 热门询价排行榜 */}
            <div className="chart-card hot-inquiry-ranking">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                热门询价排行榜 TOP10
              </div>
              <div className="ranking-list">
                {/* 排行榜内容将通过useEffect动态生成 */}
                <div id="hot-inquiry-ranking-content" className="ranking-content">
                  {/* 动态内容 */}
                </div>
              </div>
            </div>

            {/* 销售报价时效排行榜 */}
            <div className="chart-card sales-quote-efficiency-ranking">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                销售报价时效排行榜 TOP10
              </div>
              <div className="ranking-list">
                <div id="sales-quote-efficiency-content" className="ranking-content">
                  {/* 动态内容 */}
                </div>
              </div>
            </div>

            {/* 成交订单量客户排行榜 */}
            <div className="chart-card customer-orders-ranking">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                成交订单量客户排行榜 TOP10
              </div>
              <div className="ranking-list">
                <div id="customer-orders-ranking-content" className="ranking-content">
                  {/* 动态内容 */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 任务弹窗 */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          title={taskModalTitle}
          tasks={taskModalData}
        />
      )}

      {/* 自定义日期选择Modal */}
      <Modal
        title="选择自定义日期范围"
        visible={isCustomDateModalOpen}
        onOk={handleCustomDateConfirm}
        onCancel={() => setIsCustomDateModalOpen(false)}
        okText="确认"
        cancelText="取消"
        style={{ width: 400 }}
      >
        <div style={{ padding: '20px 0' }}>
          <DatePicker.RangePicker
            value={customDateRange as any}
            onChange={(dates: any) => {
              // 确保dates是有效的Dayjs数组或null
              if (dates && Array.isArray(dates) && dates.length === 2) {
                setCustomDateRange([dates[0], dates[1]] as [Dayjs, Dayjs]);
              } else {
                setCustomDateRange(null);
              }
            }}
            style={{ width: '100%' }}
            placeholder={['开始日期', '结束日期']}
            format="YYYY-MM-DD"
            disabledDate={(current: any) => {
              if (!customDateRange || !customDateRange[0]) return false;
              const startDate = customDateRange[0];
              // 确保startDate是Dayjs对象
              if (!startDate || typeof startDate.add !== 'function') return false;
              const oneYearLater = startDate.add(1, 'year');
              return current.isAfter(oneYearLater);
            }}
          />
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
            注：日期范围最大跨度不超过1年
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ControlTowerPanel;