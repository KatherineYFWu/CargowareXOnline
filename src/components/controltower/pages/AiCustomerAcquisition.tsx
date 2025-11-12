import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Select, Tag, Checkbox, Avatar, Tabs, Drawer, Form, Radio, Modal, Upload, Message, Alert } from '@arco-design/web-react';
import { IconSearch, IconDown, IconPhone, IconEmail, IconBulb, IconUp, IconUpload, IconDownload, IconLoading, IconCheck, IconPause, IconPlayArrow, IconRobot } from '@arco-design/web-react/icon';
import { flushSync } from 'react-dom';
import EmailFineTuningModal from '../components/EmailFineTuningModal';
import EmailEditor from '../components/EmailEditor';
/**
 * AI获客页面组件 - 全球搜索
 * 根据截图100%复刻的全球搜索页面
 */
const AiCustomerAcquisition: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('按关键词');

  const [loading, setLoading] = useState(false);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const expandedWords = [
    'International Logistics 国际物流',
    'Supply Chain Management 供应链管理',
    'Import Export Trade 进出口贸易',
    'Freight Forwarding 货运代理',
    'Cross Border Shipping 跨境运输',
    'Customs Clearance 清关服务'
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>(expandedWords);
  const [selectedLanguage, setSelectedLanguage] = useState('英语');
  
  // AI文案抽屉相关状态
  const [drawerVisible, setDrawerVisible] = useState(false);// 添加收件人相关状态
  const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
  const [drawerOpenType, setDrawerOpenType] = useState<'single' | 'batch'>('single');
  
  // 收件人详情窗口相关状态
  const [recipientDetailVisible, setRecipientDetailVisible] = useState(false);
  const [searchRecipient, setSearchRecipient] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [editingRecipientIndex, setEditingRecipientIndex] = useState<number | null>(null);
  const [editingRecipientEmail, setEditingRecipientEmail] = useState(''); // 抽屉打开类型：单个客户或批量
  
  // 鼠标悬浮状态
  const [hoveredEmailIndex, setHoveredEmailIndex] = useState<number | null>(null);
  
  // 添加上传模态框相关状态
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [form] = Form.useForm();
  const [emailContent, setEmailContent] = useState('运价推广'); // 默认选中运价推广
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedSubject, setGeneratedSubject] = useState(''); // 邮件主题状态
  const [showRateList, setShowRateList] = useState(true); // 默认显示运价列表
  
  // 人工微调模态框可见性
  const [fineTuningModalVisible, setFineTuningModalVisible] = useState(false);
  
  // 抽屉页面状态管理
  const [currentPage, setCurrentPage] = useState<'generate' | 'fineTuning' | 'emailSending'>('generate');
  const fineTuningRef = useRef<HTMLDivElement>(null);
  
  // 启动邮件发送界面状态
  const [emailSendingVisible, setEmailSendingVisible] = useState(false);

  // 监听页面切换，当切换到人工微调页面时自动滚动到顶部
  useEffect(() => {
    if (currentPage === 'fineTuning' && fineTuningRef.current) {
      // 使用setTimeout确保在页面渲染完成后执行滚动
      setTimeout(() => {
        fineTuningRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentPage]);
  
  // 运价筛选状态
  const [selectedPOL, setSelectedPOL] = useState('');
  const [selectedPOD, setSelectedPOD] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  
  // 起运港选项 - 使用英文全称
  const polOptions = [
    { label: 'Shanghai, China', value: 'Shanghai, China' },
    { label: 'Shenzhen, China', value: 'Shenzhen, China' },
    { label: 'Qingdao, China', value: 'Qingdao, China' },
    { label: 'Ningbo, China', value: 'Ningbo, China' },
    { label: 'Tianjin, China', value: 'Tianjin, China' },
    { label: 'Guangzhou, China', value: 'Guangzhou, China' },
    { label: 'Xiamen, China', value: 'Xiamen, China' }
  ];
  
  // 目的港选项 - 使用英文全称
  const podOptions = [
    { label: 'Los Angeles, USA', value: 'Los Angeles, USA' },
    { label: 'New York, USA', value: 'New York, USA' },
    { label: 'Hamburg, Germany', value: 'Hamburg, Germany' },
    { label: 'Rotterdam, Netherlands', value: 'Rotterdam, Netherlands' },
    { label: 'Long Beach, USA', value: 'Long Beach, USA' },
    { label: 'Felixstowe, UK', value: 'Felixstowe, UK' },
    { label: 'Antwerp, Belgium', value: 'Antwerp, Belgium' }
  ];
  
  // 船公司选项
  const carrierOptions = [
    { label: 'COSCO SHIPPING', value: 'COSCO SHIPPING' },
    { label: 'MAERSK LINE', value: 'MAERSK LINE' },
    { label: 'MSC', value: 'MSC' },
    { label: 'CMA CGM', value: 'CMA CGM' },
    { label: 'EVERGREEN', value: 'EVERGREEN' },
    { label: 'HAPAG-LLOYD', value: 'HAPAG-LLOYD' },
    { label: 'ONE', value: 'ONE' }
  ];
  
  // 模拟运价数据 - 使用英文全称港口和固定航程天数
  const mockRateData = [
    {
      pol: 'Shanghai, China',
      pod: 'Los Angeles, USA',
      carrier: 'COSCO SHIPPING',
      etd: '2024-02-15',
      transitTime: '16天',
      prices: {
        '20GP': '2,850',
        '40GP': '3,200',
        '40HQ': '3,350'
      }
    },
    {
      pol: 'Shenzhen, China',
      pod: 'New York, USA',
      carrier: 'MAERSK LINE',
      etd: '2024-02-18',
      transitTime: '20天',
      prices: {
        '20GP': '3,100',
        '40GP': '3,200',
        '40HQ': '3,400'
      }
    },
    {
      pol: 'Qingdao, China',
      pod: 'Hamburg, Germany',
      carrier: 'MSC',
      etd: '2024-02-20',
      transitTime: '28天',
      prices: {
        '20GP': '2,650',
        '40GP': '2,980',
        '40HQ': '3,150'
      }
    },
    {
      pol: 'Ningbo, China',
      pod: 'Rotterdam, Netherlands',
      carrier: 'CMA CGM',
      etd: '2024-02-22',
      transitTime: '30天',
      prices: {
        '20GP': '2,750',
        '40GP': '2,980',
        '40HQ': '3,200'
      }
    },
    {
      pol: 'Tianjin, China',
      pod: 'Long Beach, USA',
      carrier: 'EVERGREEN',
      etd: '2024-02-25',
      transitTime: '18天',
      prices: {
        '20GP': '3,100',
        '40GP': '3,350',
        '40HQ': '3,500'
      }
    },
    {
      pol: 'Guangzhou, China',
      pod: 'Felixstowe, UK',
      carrier: 'HAPAG-LLOYD',
      etd: '2024-02-28',
      transitTime: '24天',
      prices: {
        '20GP': '2,900',
        '40GP': '3,150',
        '40HQ': '3,300'
      }
    }
  ];

  /**
   * 处理AI营销按钮点击（单个客户）
   * 打开抽屉并确保默认选中运价推广
   */
  const handleAiMarketingClick = (customerId?: string) => {
    setDrawerOpenType('single');
    
    // 根据客户ID生成单个客户的收件人邮箱列表
    if (customerId) {
      const customer = searchResults.find(item => item.id === customerId);
      if (customer) {
        // 为单个客户生成虚构的邮箱列表
        const singleCustomerEmails = [
          `contact@${customer.website.replace('www.', '')}`,
          `info@${customer.website.replace('www.', '')}`,
          `sales@${customer.website.replace('www.', '')}`,
          `support@${customer.website.replace('www.', '')}`
        ];
        setRecipientEmails(singleCustomerEmails);
      }
    }
    
    setEmailContent('运价推广'); // 确保默认选中运价推广
    setShowRateList(true); // 确保显示运价列表
    setDrawerVisible(true); // 打开抽屉
    
    // 重置筛选条件
    setSelectedPOL('');
    setSelectedPOD('');
    setSelectedCarrier('');
    
    // 清空之前生成的内容
    setGeneratedContent('');
  };

  /**
   * 处理一键营销按钮点击（批量客户）
   * 打开抽屉并填充所有选中客户的收件人信息
   */
  const handleBatchMarketingClick = () => {
    setDrawerOpenType('batch');
    
    // 为所有选中客户生成收件人邮箱列表
    const batchEmails: string[] = [];
    
    selectedItems.forEach(customerId => {
      const customer = searchResults.find(item => item.id === customerId);
      if (customer) {
        // 为每个客户生成多个虚构邮箱
        batchEmails.push(`contact@${customer.website.replace('www.', '')}`);
        batchEmails.push(`info@${customer.website.replace('www.', '')}`);
        batchEmails.push(`sales@${customer.website.replace('www.', '')}`);
        batchEmails.push(`support@${customer.website.replace('www.', '')}`);
      }
    });
    
    // 如果选中客户较多，限制邮箱数量避免UI过长
    setRecipientEmails(batchEmails.slice(0, 20));
    
    setEmailContent('运价推广'); // 确保默认选中运价推广
    setShowRateList(true); // 确保显示运价列表
    setDrawerVisible(true); // 打开抽屉
    
    // 重置筛选条件
    setSelectedPOL('');
    setSelectedPOD('');
    setSelectedCarrier('');
    
    // 清空之前生成的内容
    setGeneratedContent('');
  };

  // 处理生成内容
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setGeneratedContent('');
    
    // 模拟生成的营销文案内容 - 使用HTML格式保留文本结构
    const mockContent = emailContent === '运价推广' 
      ? `<p>尊敬的客户，您好！</p>

<p>我们为您精选了以下优质运价方案：</p>

<div style="margin: 10px 0;">
  <span style="color: #1e40af; font-weight: bold;">📦 上海→洛杉矶：</span>$2,850/20GP，COSCO SHIPPING承运，15-18天直达<br/>
  <span style="color: #1e40af; font-weight: bold;">📦 深圳→纽约：</span>$3,200/40GP，MAERSK LINE承运，18-22天安全送达<br/>
  <span style="color: #1e40af; font-weight: bold;">📦 青岛→汉堡：</span>$2,650/20GP，MSC承运，25-30天欧洲专线
</div>

<div style="margin: 10px 0;">
  <span style="color: #1e40af; font-weight: bold;">✅ 优势特色：</span><br/>
  <ul style="margin: 5px 0; padding-left: 20px;">
    <li>一手船东价格，无中间环节</li>
    <li>全程跟踪服务，实时更新货物状态</li>
    <li>专业清关团队，确保顺利通关</li>
    <li>7×24小时客服支持</li>
  </ul>
</div>

<div style="margin: 10px 0;">
  <span style="color: #1e40af; font-weight: bold;">现在预订还可享受：</span><br/>
  <div style="margin: 5px 0;">
    <span style="color: #f59e0b;">🎁</span> 免费仓储7天<br/>
    <span style="color: #f59e0b;">🎁</span> 免费装箱服务<br/>
    <span style="color: #f59e0b;">🎁</span> 免费货物保险
  </div>
</div>

<p>如需了解更多详情或有其他航线需求，请随时联系我们！</p>

<p>期待与您的合作！</p>

<p>此致<br/>敬礼！</p>`
      : `<p>尊敬的先生/女士，您好！</p>

<p>我是来自[公司名称]的[姓名]，专注于为企业提供专业的国际物流解决方案。</p>

<div style="margin: 10px 0;">
  <span style="color: #1e40af; font-weight: bold;">🌟 关于我们：</span><br/>
  我们是一家拥有15年经验的国际货运代理公司，与全球50+船公司建立了稳定的合作关系，为3000+企业客户提供优质的物流服务。
</div>

<div style="margin: 10px 0;">
  <span style="color: #1e40af; font-weight: bold;">🚢 核心服务：</span><br/>
  <ul style="margin: 5px 0; padding-left: 20px;">
    <li>海运整箱/拼箱服务</li>
    <li>空运快递服务</li>
    <li>多式联运解决方案</li>
    <li>清关及仓储服务</li>
    <li>供应链金融支持</li>
  </ul>
</div>

<div style="margin: 10px 0;">
  <span style="color: #1e40af; font-weight: bold;">💡 我们的优势：</span><br/>
  <div style="margin: 5px 0;">
    <span style="color: #10b981;">✅</span> 价格透明，无隐藏费用<br/>
    <span style="color: #10b981;">✅</span> 时效稳定，准点率98%+<br/>
    <span style="color: #10b981;">✅</span> 全程可视化跟踪<br/>
    <span style="color: #10b981;">✅</span> 专业客服团队支持
  </div>
</div>

<p>我注意到贵公司在[行业]领域的卓越表现，相信我们的专业服务能够为贵公司的国际业务发展提供有力支持。</p>

<p>如果您有任何物流需求或想了解我们的服务，欢迎随时联系我。我很乐意为您提供免费的物流方案咨询。</p>

<p>期待您的回复！</p>

<p>此致<br/>商祺！</p>

<p>[您的姓名]<br/>[公司名称]<br/>[联系方式]</p>`;
    
    // 模拟打字效果
    const words = mockContent.split('');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30)); // 每个字符间隔30ms
      setGeneratedContent(prev => prev + words[i]);
    }
    
    setIsGenerating(false);
  };

  // 处理AI生成主题
  const handleGenerateSubject = async () => {
    // 模拟AI生成主题的逻辑
    const mockSubjects = [
      "优质国际物流服务 - 为您提供专业的海运、空运解决方案",
      "全球货运代理服务 - 15年经验，3000+企业信赖选择",
      "专业物流合作伙伴 - 助力您的国际业务高效发展",
      "一站式供应链解决方案 - 从仓储到配送的完整服务",
      "高效物流服务 - 98%准点率，全程可视化跟踪"
    ];
    
    // 根据邮件内容类型选择不同的主题
    let subject = "";
    if (emailContent === '运价推广') {
      subject = mockSubjects[0]; // 运价推广相关主题
    } else {
      subject = mockSubjects[1]; // 客户开发相关主题
    }
    
    // 设置主题到表单中
    setEmailSubject(subject);
    
    // 显示成功提示
    Message.success('主题生成成功！');
  };

  // 全选标签 - 注释掉未使用的函数
  // const handleSelectAllTags = () => {
  //   if (selectedTags.length === expandedWords.length) {
  //     setSelectedTags([]);
  //   } else {
  //     setSelectedTags([...expandedWords]);
  //   }
  // };

  // 添加处理全选标签的函数
  const handleSelectAllTagsCheckbox = (checked: boolean) => {
    if (checked) {
      setSelectedTags(expandedWords);
    } else {
      setSelectedTags([]);
    }
  };

  // 模拟搜索结果数据
  const [searchResults] = useState([
    {
      id: '1',
      name: 'AL ASHAR TRADING EST.',
      country: '阿联酋',
      website: 'www.alashar-trading.com',
      description: '一家专业的贸易公司，主要从事各种商品的进出口业务',
      tags: ['贸易公司', '进出口', '商品贸易', '物流', '仓储'],
      contact: {
        phone: '(0097) 4 2219273',
        address: 'PO BOX 14165 DUBAI'
      },
      establishDate: '2008-06-10',
      employees: '2人',
      verified: true
    },
    {
      id: '2', 
      name: 'AHMED ALI MAINTENANCE AND SHIP REPAIRS LLC',
      country: '阿联酋',
      website: 'www.ahmed-repairs.com',
      description: '专业的船舶维修和保养服务公司，提供全方位的船舶技术支持',
      tags: ['船舶维修', '海事服务', '技术支持', '保养'],
      contact: {
        phone: '(0097) 4 3424656',
        address: 'PO BOX 9815 DUBAI'
      },
      establishDate: '1995-11-22',
      employees: '7人',
      verified: true
    },
    {
      id: '3',
      name: 'COSCO SHIPPING LINES CO., LTD.',
      country: '中国',
      website: 'www.cosco-shipping.com',
      description: '中远海运集装箱运输股份有限公司，全球领先的集装箱班轮运输公司',
      tags: ['国际物流', '集装箱运输', '班轮公司', '海运', '全球航线'],
      contact: {
        phone: '+86 21 6505 8888',
        address: '上海市浦东新区东方路1678号'
      },
      establishDate: '2005-12-30',
      employees: '15000人',
      verified: true
    },
    {
      id: '4',
      name: 'DHL GLOBAL FORWARDING',
      country: '德国',
      website: 'www.dhl.com/forwarding',
      description: '全球领先的国际货运代理公司，提供海运、空运、陆运等综合物流服务',
      tags: ['货代公司', '国际货运', '多式联运', '供应链管理', '全球网络'],
      contact: {
        phone: '+49 228 182 0',
        address: 'Charles-de-Gaulle-Str. 20, 53113 Bonn, Germany'
      },
      establishDate: '1969-08-25',
      employees: '45000人',
      verified: true
    },
    {
      id: '5',
      name: 'MAERSK LINE',
      country: '丹麦',
      website: 'www.maersk.com',
      description: '全球最大的集装箱航运公司，提供端到端的供应链解决方案',
      tags: ['集装箱运输', '全球航运', '供应链', '物流服务', '港口运营'],
      contact: {
        phone: '+45 33 63 33 63',
        address: 'Esplanaden 50, 1098 Copenhagen K, Denmark'
      },
      establishDate: '1904-04-16',
      employees: '95000人',
      verified: true
    },
    {
      id: '6',
      name: 'SINOTRANS LIMITED',
      country: '中国',
      website: 'www.sinotrans.com',
      description: '中国外运股份有限公司，中国领先的综合物流服务提供商',
      tags: ['综合物流', '货运代理', '仓储配送', '供应链管理', '跨境电商'],
      contact: {
        phone: '+86 10 6598 6688',
        address: '北京市西城区复兴门内大街28号'
      },
      establishDate: '1950-10-01',
      employees: '12000人',
      verified: true
    },
    {
      id: '7',
      name: 'KUEHNE + NAGEL',
      country: '瑞士',
      website: 'www.kuehne-nagel.com',
      description: '全球领先的物流服务提供商，专注于海运、空运、陆运和合同物流',
      tags: ['国际物流', '货运代理', '合同物流', '供应链优化', '数字化物流'],
      contact: {
        phone: '+41 44 786 95 11',
        address: 'Dorfstrasse 50, 8834 Schindellegi, Switzerland'
      },
      establishDate: '1890-06-01',
      employees: '78000人',
      verified: true
    },
    {
      id: '8',
      name: 'EVERGREEN MARINE CORP.',
      country: '中国台湾',
      website: 'www.evergreen-marine.com',
      description: '长荣海运股份有限公司，全球知名的集装箱航运公司',
      tags: ['集装箱运输', '海运服务', '全球航线', '绿色航运', '智能物流'],
      contact: {
        phone: '+886 2 2505 6633',
        address: '台北市中市区民东路三段2号'
      },
      establishDate: '1968-09-01',
      employees: '8500人',
      verified: true
    },
    {
      id: '9',
      name: 'EXPEDITORS INTERNATIONAL',
      country: '美国',
      website: 'www.expeditors.com',
      description: '康捷空国际物流公司，专业的全球物流和供应链管理服务提供商',
      tags: ['货运代理', '供应链管理', '报关服务', '分拨配送', '电商物流'],
      contact: {
        phone: '+1 206 674 3400',
        address: '1015 3rd Avenue, Seattle, WA 98104, USA'
      },
      establishDate: '1979-11-01',
      employees: '19000人',
      verified: true
    },
    {
      id: '10',
      name: 'CARGILL TRADING PTE LTD',
      country: '新加坡',
      website: 'www.cargill.com.sg',
      description: '嘉吉贸易私人有限公司，全球领先的农产品和大宗商品贸易公司',
      tags: ['大宗贸易', '农产品贸易', '供应链金融', '风险管理', '全球采购'],
      contact: {
        phone: '+65 6861 8888',
        address: '138 Market Street, #31-01 CapitaGreen, Singapore 048946'
      },
      establishDate: '1986-03-15',
      employees: '3200人',
      verified: true
    },
    {
      id: '11',
      name: 'HAPAG-LLOYD AG',
      country: '德国',
      website: 'www.hapag-lloyd.com',
      description: '赫伯罗特股份公司，全球领先的集装箱班轮运输公司',
      tags: ['集装箱运输', '班轮服务', '全球航线', '数字化服务', '可持续发展'],
      contact: {
        phone: '+49 40 3001 0',
        address: 'Ballindamm 25, 20095 Hamburg, Germany'
      },
      establishDate: '1970-09-01',
      employees: '14000人',
      verified: true
    },
    {
      id: '12',
      name: 'PANALPINA WORLD TRANSPORT',
      country: '瑞士',
      website: 'www.panalpina.com',
      description: '泛亚班拿集团，专业的国际货运代理和物流服务提供商',
      tags: ['货运代理', '项目物流', '能源物流', '汽车物流', '高科技物流'],
      contact: {
        phone: '+41 61 226 11 11',
        address: 'Viaduktstrasse 42, 4051 Basel, Switzerland'
      },
      establishDate: '1935-01-01',
      employees: '14500人',
      verified: true
    }
  ]);



  // 处理搜索
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 处理选择项变化
  const handleSelectChange = (value: string, id: string) => {
    if (value) {
      setSelectedItems([...selectedItems.filter(item => item !== id), id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(searchResults.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // 添加上传相关处理函数
  const handleUploadChange = (fileList: any[]) => {
    // 文件去重处理
    const processedFileList = fileList.map(file => {
      // 如果是新添加的文件，检查是否已存在同名文件
      if (!file.uid || !fileList.some(f => f.uid === file.uid && f !== file)) {
        const fileName = file.name;
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExt = fileName.substring(fileName.lastIndexOf('.'));
        
        // 检查是否已存在同名文件
        let counter = 1;
        let newName = fileName;
        const existingNames = fileList.filter(f => f !== file).map(f => f.name);
        
        while (existingNames.includes(newName)) {
          newName = `${fileNameWithoutExt}(${counter})${fileExt}`;
          counter++;
        }
        
        // 如果文件名被修改，更新文件名
        if (newName !== fileName) {
          return {
            ...file,
            name: newName
          };
        }
      }
      return file;
    });
    
    setFileList(processedFileList);
  };

  // 文件上传处理函数
  const handleFileUpload = (file: any) => {
    try {
      // 文件类型验证 - 只允许xls、xlsx和csv格式
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        // 在上传框顶部显示2秒后消失的错误提示
        Message.error({ content: '不支持的文件类型，请重新上传', duration: 2000 });
        return false;
      }
      
      // 设置文件初始状态
      file.status = 'init';
      return true;
    } catch (error: any) {
      Message.error({ content: '文件验证失败，请重试', duration: 2000 });
      return false;
    }
  };

  // 模拟文件上传过程

  // 添加新收件人
  const handleAddRecipient = () => {
    if (!newRecipientEmail) {
      Message.error({ content: '请输入邮箱地址', duration: 2000 });
      return;
    }
    
    // 邮箱格式验证正则表达式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipientEmail)) {
      Message.error({ content: '邮箱格式不正确', duration: 2000 });
      return;
    }
    
    // 检查邮箱是否已存在
    if (recipientEmails.includes(newRecipientEmail)) {
      Message.error({ content: '邮箱已存在', duration: 2000 });
      return;
    }
    
    // 添加新邮箱
    setRecipientEmails([...recipientEmails, newRecipientEmail]);
    setNewRecipientEmail('');
  };

  // 删除收件人
  const handleDeleteRecipient = (index: number) => {
    const newEmails = [...recipientEmails];
    newEmails.splice(index, 1);
    setRecipientEmails(newEmails);
  };

  // 开始编辑收件人
  const handleStartEditRecipient = (index: number) => {
    setEditingRecipientIndex(index);
    setEditingRecipientEmail(recipientEmails[index]);
  };

  // 完成编辑收件人
  const handleFinishEditRecipient = () => {
    if (editingRecipientIndex !== null && editingRecipientEmail) {
      const newEmails = [...recipientEmails];
      newEmails[editingRecipientIndex] = editingRecipientEmail;
      setRecipientEmails(newEmails);
      setEditingRecipientIndex(null);
      setEditingRecipientEmail('');
    }
  };

  // 根据邮箱查找客户信息（模拟数据）
  const getCustomerInfoByEmail = (email: string) => {
    // 从邮箱中提取公司域名来匹配客户
    const domain = email.split('@')[1];
    
    // 查找匹配的客户
    const customer = searchResults.find(item => {
      const websiteDomain = item.website.replace('www.', '');
      return websiteDomain === domain;
    });
    
    // 如果没有找到匹配的客户，返回默认信息
    if (!customer) {
      return {
        id: 'default',
        name: '未知客户',
        country: '未知',
        website: 'unknown.com',
        description: '暂无详细信息',
        tags: ['暂无标签'],
        contact: {
          phone: '暂无',
          address: '暂无'
        },
        establishDate: '未知',
        employees: '未知',
        verified: false
      };
    }
    
    return customer;
  };

  // 过滤收件人列表
  const filteredRecipients = recipientEmails.filter(email => 
    email.toLowerCase().includes(searchRecipient.toLowerCase())
  );
  const simulateFileUpload = (file: any) => {
    return new Promise((resolve) => {
      // 模拟上传进度
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        // 更新文件进度
        setFileList(prev => prev.map(f => {
          if (f.uid === file.uid) {
            return {
              ...f,
              percent: progress,
              status: progress < 100 ? 'uploading' : 'done'
            };
          }
          return f;
        }));
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve(true);
        }
      }, 200);
    });
  };

  // 处理文件上传确认
  const handleUploadConfirm = async () => {
    try {
      if (fileList.length === 0) {
        Message.warning('请先选择文件');
        return;
      }
      
      // 检查是否有文件正在上传或还未上传
      const uploadingFiles = fileList.filter(file => 
        file.status === 'uploading' || file.status === 'init'
      );
      
      if (uploadingFiles.length > 0) {
        Message.warning('请等待文件上传完成');
        return;
      }
      
      setUploadStatus('uploading');
      
      // 模拟上传过程
      setTimeout(() => {
        try {
          setUploadStatus('success');
          Message.success('文件上传成功！正在处理客户数据...');
          
          // 1秒后关闭模态框
          setTimeout(() => {
            setUploadStatus('idle');
            setUploadModalVisible(false);
            setFileList([]);
          }, 1000);
        } catch (error: any) {
          setUploadStatus('idle');
          Message.error(error.message || '上传过程中发生错误，请重试');
        }
      }, 1000);
    } catch (error: any) {
      setUploadStatus('idle');
      Message.error(error.message || '上传失败，请重试');
    }
  };

  // 处理文件暂停
  const handlePauseUpload = (file: any) => {
    // 更新文件状态为暂停
    flushSync(() => {
      setFileList(prev => prev.map(f => {
        if (f.uid === file.uid) {
          return {
            ...f,
            status: 'paused'
          };
        }
        return f;
      }));
    });
  };

  // 处理文件继续上传
  const handleResumeUpload = (file: any) => {
    // 更新文件状态为上传中 
    setFileList(prev => prev.map(f => {
      if (f.uid === file.uid) {
        return {
          ...f,
          status: 'uploading'
        };
      }
      return f;
    }));
    
    // 继续上传逻辑
    simulateFileUpload(file);
  };

  const handleDownloadTemplate = () => {
    // 创建一个虚拟的Excel模板文件
    const templateContent = `公司名称,联系人,电话,邮箱,国家/地区,行业,主营产品
ABC物流公司,张三,13800138000,zhangsan@abc.com,中国,物流运输,国际货运代理
XYZ贸易公司,李四,13900139000,lisi@xyz.com,美国,进出口贸易,电子产品贸易`;
    
    const blob = new Blob(['\ufeff' + templateContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '客户上传模板.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    Message.success('模板下载成功');
  };

  // 渲染搜索结果项
  const renderSearchResultItem = (item: any) => {
    const isSelected = selectedItems.includes(item.id);
    
    // 获取国旗emoji
    const getCountryFlag = (country: string) => {
      const flagMap: { [key: string]: string } = {
        '阿联酋': '🇦🇪',
        '美国': '🇺🇸',
        '英国': '🇬🇧',
        '德国': '🇩🇪',
        '法国': '🇫🇷',
        '意大利': '🇮🇹',
        '加拿大': '🇨🇦',
        '澳大利亚': '🇦🇺',
        '中国': '🇨🇳'
      };
      return flagMap[country] || '🌍';
    };
    
    return (
      <div key={item.id} className="border-b border-gray-100 py-4">
        <div className="flex items-start space-x-3">
          {/* 左侧复选框 */}
          <Checkbox 
            checked={isSelected}
            onChange={(checked) => handleSelectChange(checked ? item.id : '', item.id)}
          />
          
          {/* 头像 */}
          <Avatar className="bg-blue-500 text-white font-bold" size={40}>
            {item.name.charAt(0)}
          </Avatar>
          
          {/* 主要内容区域 */}
          <div className="flex-1">
            {/* 第一行：公司名称和网址 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                  {item.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{getCountryFlag(item.country)}</span>
                  <Tag color="blue" size="small">{item.country}</Tag>
                </div>
                <span className="text-blue-600 text-sm">{item.website}</span>
                
                {/* 图标和数字 - 紧跟网址后面 */}
                <div className="flex items-center space-x-4 ml-4">
                  <div className="flex items-center space-x-1">
                    <IconEmail className="text-blue-500" style={{ fontSize: '16px' }} />
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IconPhone className="text-blue-500" style={{ fontSize: '16px' }} />
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-blue-600 font-semibold">{item.employees}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                </div>
              </div>
              
              {/* 右侧区域：AI评分 */}
              <div className="flex items-center space-x-6">
                {/* AI评分 */}
                 <div className="flex items-center space-x-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
                   <span className="text-xs text-gray-600 font-medium">AI评分</span>
                   <span className="text-xl font-bold text-orange-600">92</span>
                 </div>
              </div>
            </div>
            
            {/* 第二行：联系方式和地址信息 */}
            <div className="text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <IconPhone className="mr-1" style={{ fontSize: '14px' }} />
                  {item.contact.phone}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {item.contact.address}
                </span>
                <span>成立时间: {item.establishDate}</span>
              </div>
            </div>
            
            {/* 第三行：主营产品描述 */}
            <p className="text-sm text-gray-700 mb-3">
              主营产品: {item.description}
            </p>
            
            {/* 第四行：发现机会和匹配点 */}
            <div className="flex items-start space-x-8 mb-3">
              {/* 发现机会 */}
              <div className="flex items-start space-x-2 flex-1">
                <span className="text-xs text-green-600 font-semibold whitespace-nowrap">发现机会:</span>
                <span className="text-xs text-gray-700 leading-relaxed">近期获得迪拜港口管理局新合同，预计年增长30%</span>
              </div>
              
              {/* 匹配点 */}
              <div className="flex items-start space-x-2">
                <span className="text-xs text-blue-600 font-semibold whitespace-nowrap">匹配点:</span>
                <div className="flex flex-wrap gap-1">
                  <Tag color="blue" size="small">产品描述匹配</Tag>
                  <Tag color="green" size="small">联系人信息匹配</Tag>
                </div>
              </div>
            </div>
            
            {/* 第五行：标签和操作按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag: string, index: number) => (
                  <Tag key={index} color="blue" size="small">{tag}</Tag>
                ))}
              </div>
              
              {/* 操作按钮 */}
              <div className="flex space-x-4">
                <Button type="primary" size="small" onClick={() => handleAiMarketingClick(item.id)}>AI营销</Button>
                <Button size="small">深挖联系人</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索区域 - 带背景图 */}
      <div 
         className="relative bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: 'url(/assets/banner33.jpg)',
           minHeight: '400px'
         }}
      >
        {/* 背景遮罩 */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        ></div>
        
        {/* 内容区域 */}
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-white mb-4" style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>AI获客</h1>
              <div className="flex justify-center space-x-8 text-white text-base mb-6">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                  覆盖全球各地区数据
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                  聚合各大平台和数据库资源
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
                  深度挖掘联系人信息
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-purple-400 rounded-full mr-3"></span>
                  海量数据精准匹配
                </span>
              </div>
              <div className="text-right text-white text-lg">
                累计全球企业数据: <span className="text-yellow-300 font-bold text-xl">3,483</span>
              </div>
            </div>

            {/* 搜索区域 */}
            <Card className="max-w-7xl mx-auto shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Tabs 
                    activeTab={searchType}
                    onChange={setSearchType}
                    type="line"
                    size="large"
                    className="flex-1"
                  >
                    <Tabs.TabPane key="按关键词" title="按关键词" />
                    <Tabs.TabPane key="按公司" title="按公司" />
                    <Tabs.TabPane key="按域名" title="按域名" />
                  </Tabs>
                  
                  <Button 
                    type="primary" 
                    size="default" 
                    onClick={() => setUploadModalVisible(true)}
                    icon={<IconUpload />}
                    className="ml-4"
                  >
                    上传我的客户
                  </Button>
                </div>
                
                <div className="flex space-x-4 items-center">
                   <Input
                     placeholder="可输入产品或服务的关键词进行搜索"
                     value={searchText}
                     onChange={setSearchText}
                     prefix={<IconSearch />}
                     className="flex-1"
                     size="large"
                     style={{ height: '48px' }}
                   />
                   <Button 
                     type="primary" 
                     size="large"
                     loading={loading}
                     onClick={handleSearch}
                     icon={<IconSearch />}
                     style={{ height: '48px', padding: '0 32px' }}
                   >
                     搜索
                   </Button>
                 </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* AI扩展搜索词区域 */}
      <div className="bg-white">
        <div className={`w-full max-w-none mx-auto px-6 ${isExpanded ? 'py-6' : 'py-3'}`}>
          <Card className="shadow-sm">
            <div className={`${isExpanded ? 'p-4' : 'p-3'}`}>
              <div className={`flex items-center justify-between ${isExpanded ? 'mb-4' : 'mb-0'}`}>
                <div className="flex items-center">
                  <IconBulb className="mr-2 text-blue-500" />
                  <span className="text-lg font-medium text-gray-800 mr-4">AI扩展搜索词</span>
                </div>
                <Button 
                  type="text" 
                  size="small"
                  icon={isExpanded ? <IconUp /> : <IconDown />}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? '收起' : '展开'}
                </Button>
              </div>
               
              {isExpanded && (
                <div className="mb-4">
                  <div className="mb-3">
                    <div className="text-gray-600 mb-2">
                      基于主搜索词，AI为您用
                      <Select 
                        value={selectedLanguage}
                        onChange={setSelectedLanguage}
                        className="mx-2"
                        style={{ width: 80 }}
                        size="small"
                      >
                        <Select.Option value="英语">英语</Select.Option>
                        <Select.Option value="法语">法语</Select.Option>
                        <Select.Option value="越南语">越南语</Select.Option>
                        <Select.Option value="日语">日语</Select.Option>
                      </Select>
                      扩展了以下相关词汇，已选择{selectedTags.length}个扩词
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <Checkbox 
                      checked={selectedTags.length === expandedWords.length}
                      indeterminate={selectedTags.length > 0 && selectedTags.length < expandedWords.length}
                      onChange={(checked) => handleSelectAllTagsCheckbox(checked)}
                      className="mr-2"
                    />
                    <span className="text-gray-600 mr-3">扩展词</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {expandedWords.map((tag) => (
                      <Tag 
                        key={tag}
                        color={selectedTags.includes(tag) ? 'blue' : 'default'}
                        className="cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter(t => t !== tag));
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 搜索结果区域 - 白色背景 */}
      <div className="bg-white">
        <div className="w-full max-w-none mx-auto px-6 py-4">
          <Card className="shadow-sm">
          {/* 筛选条件 */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className={`flex items-center justify-between ${isFilterExpanded ? 'mb-3' : 'mb-0'}`}>
              <div className="text-gray-700 font-medium">筛选条件</div>
              <Button 
                type="text" 
                size="small"
                icon={isFilterExpanded ? <IconUp /> : <IconDown />}
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                {isFilterExpanded ? '收起' : '展开'}
              </Button>
            </div>
            
            {isFilterExpanded && (
              <>
                {/* 第一行：国家/地区 */}
                 <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 whitespace-nowrap">国家/地区</span>
                    <Select 
                      placeholder="请选择国家或地区"
                      style={{ width: 200 }}
                      allowClear
                    >
                      <Select.Option value="阿联酋">阿联酋</Select.Option>
                      <Select.Option value="美国">美国</Select.Option>
                      <Select.Option value="英国">英国</Select.Option>
                      <Select.Option value="德国">德国</Select.Option>
                      <Select.Option value="法国">法国</Select.Option>
                      <Select.Option value="意大利">意大利</Select.Option>
                      <Select.Option value="加拿大">加拿大</Select.Option>
                      <Select.Option value="澳大利亚">澳大利亚</Select.Option>
                    </Select>
                  </div>
                </div>
                
                {/* 第二行：筛选选项和应用筛选按钮 */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-6">
                     <Checkbox>未浏览</Checkbox>
                     <Checkbox>有邮箱</Checkbox>
                     <Checkbox>非物流公司</Checkbox>
                     <Checkbox>有海关数据</Checkbox>
                     <Checkbox>有官网</Checkbox>
                     <Checkbox>未发送过营销邮件</Checkbox>
                     <Checkbox>未录入线索/客户</Checkbox>
                     <Checkbox>30人以下公司</Checkbox>
                   </div>
                   
                   {/* 应用筛选按钮 */}
                   <div className="flex space-x-2">
                     <Button type="primary" size="default" style={{ padding: '0 32px', height: '32px' }}>
                       应用筛选
                     </Button>
                   </div>
                 </div>
              </>
            )}
          </div>

          {/* 结果统计和操作 */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">为您找到 <span className="text-blue-600 font-bold">1000+</span> 个结果</span>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedItems.length === searchResults.length}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < searchResults.length}
                  onChange={handleSelectAll}
                >
                  全选
                </Checkbox>
                {selectedItems.length > 0 && (
                  <Button type="primary" size="small" onClick={handleBatchMarketingClick}>
                    一键营销
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="small">综合排序 <IconDown /></Button>
            </div>
          </div>

            {/* 搜索结果列表 */}
            <div className="space-y-0">
              {searchResults.map(item => renderSearchResultItem(item))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* 上传客户模态框 */}
      <Modal
        title="上传客户"
        visible={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          setFileList([]);
          setUploadStatus('idle');
        }}
        footer={
          <div className="flex justify-end space-x-4">
            <Button 
              onClick={handleDownloadTemplate}
              icon={<IconDownload />}
            >
              下载模板
            </Button>
            <Button 
              onClick={() => {
                setUploadModalVisible(false);
                setFileList([]);
                setUploadStatus('idle');
              }}
            >
              取消
            </Button>
            <Button 
              type="primary" 
              onClick={handleUploadConfirm}
              disabled={fileList.length === 0 || uploadStatus === 'uploading'}
              icon={uploadStatus === 'uploading' ? <IconLoading spin /> : null}
            >
              {uploadStatus === 'uploading' ? '上传中...' : '确认上传'}
            </Button>
          </div>
        }
        style={{ width: '500px' }}
      >
        <Alert 
          type="info" 
          content="请按照模板格式上传文件，支持.xls、.xlsx和.csv格式" 
          className="mb-4"
        />
        
        <div className="mb-4">
          <Upload
            drag
            multiple={true}
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={handleFileUpload}
            accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            itemRender={(originNode, file, fileList, actions) => {
              return (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-800 mr-2">{file.name}</span>
                    {file.status === 'done' && (
                      <IconCheck style={{ color: '#00B42A' }} />
                    )}
                    {file.status === 'error' && (
                      <span className="text-red-500">上传失败</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {file.status === 'uploading' && (
                      <>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<IconPause />}
                          onClick={() => {
                            handlePauseUpload(file);
                          }}
                        />
                        <span className="text-gray-500 text-sm ml-2">
                          {file.percent ? `${Math.round(file.percent)}%` : ''}
                        </span>
                      </>
                    )}
                    {file.status === 'init' && (
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<IconPlayArrow />}
                        onClick={() => {
                          handleResumeUpload(file);
                        }}
                      />
                    )}
                    {file.status === 'paused' && (
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<IconPlayArrow />}
                        onClick={() => {
                          handleResumeUpload(file);
                        }}
                      />
                    )}
                    {file.status === 'error' && (
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<IconPlayArrow />}
                        onClick={() => {
                          handleResumeUpload(file);
                        }}
                      />
                    )}
                    {file.status !== 'done' && (
                      <Button 
                        type="text" 
                        size="small" 
                        onClick={actions.remove}
                        className="ml-2"
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </div>
              );
            }}
          >
            <div className="flex flex-col items-center justify-center p-6">
              <IconUpload className="text-3xl text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">点击或拖拽文件到此区域上传</p>
              <p className="text-gray-400 text-sm">支持Excel格式文件</p>
            </div>
          </Upload>
        </div>
        
        {uploadStatus === 'success' && (
          <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg text-green-600">
            <IconCheck className="mr-2" />
            <span>文件上传成功！</span>
          </div>
        )}
      </Modal>
      
      {/* AI营销文案生成抽屉 */}
      <Drawer
        width="50%"
        className="ai-marketing-drawer"
        title={
          currentPage === 'generate' ? 'AI营销文案生成' : 
          currentPage === 'fineTuning' ? '营销文案人工微调' : 
          ''
        }
        visible={drawerVisible}
        onCancel={() => {
          setDrawerVisible(false);
          setCurrentPage('generate'); // 关闭时重置到生成页面
        }}
        footer={
          <div className="flex justify-between items-center">
            <div>
              {currentPage === 'generate' && generatedContent && (
                <Button onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  Message.success('内容已复制到剪贴板');
                }}>
                  一键复制
                </Button>
              )}
            </div>
            <div className="space-x-4">
              {currentPage === 'generate' && generatedContent && (
                <Button 
                  type="primary" 
                  ghost
                  onClick={() => setCurrentPage('fineTuning')}
                >
                  人工微调
                </Button>
              )}
              {currentPage === 'generate' && (
                <Button type="primary" onClick={handleGenerateContent} loading={isGenerating}>
                  开始生成
                </Button>
              )}
              {currentPage === 'fineTuning' && (
                <>
                  <Button onClick={() => setCurrentPage('generate')}>
                    返回
                  </Button>
                  <Button type="primary" onClick={() => {
                    // 显示启动邮件发送界面
                    setCurrentPage('emailSending');
                  }}>
                    确认并发送
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <div className="relative h-full">
          {/* 生成页面 */}
          <div 
            className={`transition-all duration-300 absolute inset-0 ${
              currentPage === 'generate' 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
          >
            <Form form={form} layout="vertical">
          {/* 收件人列表 - 移动到所有字段的第一个 */}
          <Form.Item label="收件人" field="recipientEmails">
            <div 
              className="border rounded-lg p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors relative"
              onClick={() => setRecipientDetailVisible(true)}
            >
              <div className="flex flex-wrap gap-2 min-h-10">
                {recipientEmails.slice(0, 5).map((email, index) => {
                  const customerInfo = getCustomerInfoByEmail(email);
                  return (
                    <div 
                      key={index} 
                      className="bg-white px-2 py-1 rounded text-sm border relative"
                      onMouseEnter={() => editingRecipientIndex === null && setHoveredEmailIndex(index)}
                      onMouseLeave={() => setHoveredEmailIndex(null)}
                    >
                      {email}
                      {/* 客户信息悬浮提示 */}
                      {hoveredEmailIndex === index && editingRecipientIndex === null && (
                        <div className="absolute z-50 left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4" style={{ minWidth: '320px', maxWidth: '400px' }}>
                          <div className="flex items-start space-x-3">
                            <Avatar className="bg-blue-500 text-white font-bold flex-shrink-0" size={48}>
                              {customerInfo.name.charAt(0)}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-blue-600 truncate">{customerInfo.name}</h3>
                                {customerInfo.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded whitespace-nowrap ml-2">已认证</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 mt-1 line-clamp-2">{customerInfo.description}</div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {customerInfo.tags.slice(0, 4).map((tag, tagIndex) => (
                                  <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded truncate max-w-[100px]">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="text-xs text-gray-500 mt-3 space-y-1">
                                <div className="flex items-center">
                                  <span className="w-16 inline-block">成立时间:</span>
                                  <span>{customerInfo.establishDate}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-16 inline-block">员工人数:</span>
                                  <span>{customerInfo.employees}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-16 inline-block">联系电话:</span>
                                  <span className="truncate max-w-[150px]">{customerInfo.contact.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {recipientEmails.length > 5 && (
                  <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm border border-blue-200">
                    +{recipientEmails.length - 5}更多
                  </div>
                )}
                {recipientEmails.length === 0 && (
                  <div className="text-gray-400 text-sm">点击添加收件人</div>
                )}
              </div>
            </div>
          </Form.Item>
          
          {/* 输出长度 */}
          <Form.Item label="输出长度" field="outputLength">
            <Radio.Group defaultValue="自动">
              <Radio value="自动">自动</Radio>
              <Radio value="短">短</Radio>
              <Radio value="中等">中等</Radio>
              <Radio value="长">长</Radio>
            </Radio.Group>
          </Form.Item>
          
          {/* 输出语气 */}
          <Form.Item label="输出语气" field="outputTone">
            <Radio.Group defaultValue="自动">
              <Radio value="自动">自动</Radio>
              <Radio value="友善">友善</Radio>
              <Radio value="正式">正式</Radio>
              <Radio value="友好">友好</Radio>
              <Radio value="专业">专业</Radio>
              <Radio value="有趣">有趣</Radio>
            </Radio.Group>
          </Form.Item>
          
          {/* 输出语言 */}
          <Form.Item label="输出语言" field="outputLanguage">
            <Radio.Group defaultValue="中文">
              <Radio value="中文">中文</Radio>
              <Radio value="英语">英语</Radio>
            </Radio.Group>
          </Form.Item>
          
          {/* 邮件内容 */}
          <Form.Item label="邮件内容" field="emailContent">
            <Select 
              value={emailContent} 
              onChange={(value) => {
                setEmailContent(value);
                setShowRateList(value === '运价推广');
              }}
            >
              <Select.Option value="运价推广">运价推广</Select.Option>
              <Select.Option value="开发信">开发信</Select.Option>
            </Select>
          </Form.Item>
          
          {/* 运价筛选区域 - 仅在选择运价推广时显示 */}
          {showRateList && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Form.Item label="起运港" field="pol">
                  <Select
                    placeholder="请选择起运港"
                    value={selectedPOL}
                    onChange={setSelectedPOL}
                    allowClear
                  >
                    {polOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item label="目的港" field="pod">
                  <Select
                    placeholder="请选择目的港"
                    value={selectedPOD}
                    onChange={setSelectedPOD}
                    allowClear
                  >
                    {podOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item label="船公司" field="carrier">
                  <Select
                    placeholder="请选择船公司"
                    value={selectedCarrier}
                    onChange={setSelectedCarrier}
                    allowClear
                  >
                    {carrierOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <Form.Item label="选择运价" field="selectedRates">
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {mockRateData
                      .filter(rate => {
                        return (!selectedPOL || rate.pol === selectedPOL) &&
                               (!selectedPOD || rate.pod === selectedPOD) &&
                               (!selectedCarrier || rate.carrier === selectedCarrier);
                      })
                      .map((rate, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox />
                              <div>
                                <div className="font-medium text-lg">{rate.pol} → {rate.pod}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                  <span className="mr-4">船公司: {rate.carrier}</span>
                                  <span className="mr-4">预计离港: {rate.etd}</span>
                                  <span>航程: {rate.transitTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 箱型价格展示 */}
                          <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                            {Object.entries(rate.prices).map(([containerType, price]) => (
                              <div key={containerType} className="text-center">
                                <div className="text-sm text-gray-600">{containerType}</div>
                                <div className="font-bold text-blue-600">${price}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  {mockRateData.filter(rate => {
                    return (!selectedPOL || rate.pol === selectedPOL) &&
                           (!selectedPOD || rate.pod === selectedPOD) &&
                           (!selectedCarrier || rate.carrier === selectedCarrier);
                  }).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      暂无符合条件的运价信息
                    </div>
                  )}
                </div>
              </Form.Item>
            </>
          )}
        </Form>
        
        {/* 生成的内容区域 */}
        {generatedContent && (
          <div className="mt-6">
            <div className="mb-2 font-medium">生成的营销文案：</div>
            <div className="border rounded-lg p-4 bg-gray-50 min-h-32">
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </div>
          </div>
        )}
          </div>
          
          {/* 人工微调页面 */}
          <div 
            className={`transition-all duration-300 absolute inset-0 ${
              currentPage === 'fineTuning' 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}
            ref={fineTuningRef}
          >
            <div className="h-full flex flex-col">
              {/* 收件人字段 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">收件人</label>
                <div 
                  className="border rounded-lg p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors relative"
                  onClick={() => setRecipientDetailVisible(true)}
                >
                  <div className="flex flex-wrap gap-2 min-h-10">
                    {recipientEmails.slice(0, 5).map((email, index) => {
                      const customerInfo = getCustomerInfoByEmail(email);
                      return (
                        <div 
                          key={index} 
                          className="bg-white px-2 py-1 rounded text-sm border relative"
                          onMouseEnter={() => editingRecipientIndex === null && setHoveredEmailIndex(index + 2000)} // 使用不同的索引范围避免冲突
                          onMouseLeave={() => setHoveredEmailIndex(null)}
                        >
                          {email}
                          {/* 客户信息悬浮提示 */}
                          {hoveredEmailIndex === index + 2000 && editingRecipientIndex === null && (
                            <div className="absolute z-50 left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4" style={{ minWidth: '320px', maxWidth: '400px' }}>
                              <div className="flex items-start space-x-3">
                                <Avatar className="bg-blue-500 text-white font-bold flex-shrink-0" size={48}>
                                  {customerInfo.name.charAt(0)}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-blue-600 truncate">{customerInfo.name}</h3>
                                    {customerInfo.verified && (
                                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded whitespace-nowrap ml-2">已认证</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">{customerInfo.description}</div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {customerInfo.tags.slice(0, 4).map((tag, tagIndex) => (
                                      <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded truncate max-w-[100px]">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-3 space-y-1">
                                    <div className="flex items-center">
                                      <span className="w-16 inline-block">成立时间:</span>
                                      <span>{customerInfo.establishDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="w-16 inline-block">员工人数:</span>
                                      <span>{customerInfo.employees}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="w-16 inline-block">联系电话:</span>
                                      <span className="truncate max-w-[150px]">{customerInfo.contact.phone}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {recipientEmails.length > 5 && (
                      <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm border border-blue-200">
                        +{recipientEmails.length - 5}更多
                      </div>
                    )}
                    {recipientEmails.length === 0 && (
                      <div className="text-gray-400 text-sm">点击添加收件人</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 主题字段 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">主题</label>
                  <Button 
                    type="primary" 
                    size="mini" 
                    onClick={() => handleGenerateSubject()}
                    className="flex items-center space-x-1"
                  >
                    <IconRobot />
                    <span>AI生成主题</span>
                  </Button>
                </div>
                <Input 
                  placeholder="请输入邮件主题"
                  value={generatedSubject || ''}
                  onChange={(value) => setGeneratedSubject(value)}
                  className="w-full"
                />
              </div>
              
              {/* 富文本编辑框 */}
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
                  <EmailEditor 
                    value={generatedContent || ''}
                    onChange={(value) => setGeneratedContent(value)}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 启动邮件发送页面 */}
          <div 
            className={`transition-all duration-300 absolute inset-0 ${
              currentPage === 'emailSending' 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <div className="h-full flex flex-col">
              {/* 邮件发送成功提示 - 居中醒目显示 */}
              <div className="flex flex-col items-center justify-center mb-8 py-8">
                <div className="text-3xl font-bold text-green-600 mb-4">邮件已成功发送！</div>
                <div className="text-lg text-gray-600">您的营销邮件已成功发送给所有收件人</div>
              </div>
              
              {/* 收件人信息 - 沿用前面窗口的设计 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">收件人</span>
                  <span className="text-xs text-gray-500">
                    {recipientEmails.length} 个收件人
                  </span>
                </div>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {recipientEmails.slice(0, 5).map((email, index) => {
                      const customerInfo = getCustomerInfoByEmail(email);
                      return (
                        <div 
                          key={index} 
                          className="flex items-center space-x-2 bg-white px-3 py-2 rounded border text-sm"
                          onMouseEnter={() => setHoveredEmailIndex(index + 2000)}
                          onMouseLeave={() => setHoveredEmailIndex(null)}
                        >
                          <Avatar className="bg-blue-500 text-white font-bold flex-shrink-0" size={24}>
                            {customerInfo.name.charAt(0)}
                          </Avatar>
                          <span className="text-gray-700">{email}</span>
                          
                          {/* 客户信息悬浮提示 */}
                          {hoveredEmailIndex === index + 2000 && (
                            <div className="absolute z-50 left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4" style={{ minWidth: '320px', maxWidth: '400px' }}>
                              <div className="flex items-start space-x-3">
                                <Avatar className="bg-blue-500 text-white font-bold flex-shrink-0" size={48}>
                                  {customerInfo.name.charAt(0)}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-blue-600 truncate">{customerInfo.name}</h3>
                                    {customerInfo.verified && (
                                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded whitespace-nowrap ml-2">已认证</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">{customerInfo.description}</div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {customerInfo.tags.slice(0, 4).map((tag, tagIndex) => (
                                      <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded truncate max-w-[100px]">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-3 space-y-1">
                                    <div className="flex items-center">
                                      <span className="w-16 inline-block">成立时间:</span>
                                      <span>{customerInfo.establishDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="w-16 inline-block">员工人数:</span>
                                      <span>{customerInfo.employees}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="w-16 inline-block">联系电话:</span>
                                      <span className="truncate max-w-[150px]">{customerInfo.contact.phone}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {recipientEmails.length > 5 && (
                      <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded border text-sm text-blue-600 cursor-pointer">
                        <span>+{recipientEmails.length - 5}更多</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 邮件信息摘要 - 美观设计 */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">邮件信息</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 主题 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-xs">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                        <label className="text-sm font-medium text-gray-600">主题</label>
                      </div>
                      <div className="text-base font-semibold text-gray-800 truncate">{generatedSubject || 'AI营销邮件'}</div>
                    </div>
                    
                    {/* 发送时间 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-xs">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        <label className="text-sm font-medium text-gray-600">发送时间</label>
                      </div>
                      <div className="text-base font-semibold text-gray-800">{new Date().toLocaleString('zh-CN')}</div>
                    </div>
                    
                    {/* 收件人数量 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-xs">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                        </svg>
                        <label className="text-sm font-medium text-gray-600">收件人数量</label>
                      </div>
                      <div className="text-base font-semibold text-gray-800">{recipientEmails.length} 个</div>
                    </div>
                    
                    {/* 邮件类型 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-xs">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                        <label className="text-sm font-medium text-gray-600">邮件类型</label>
                      </div>
                      <div className="text-base font-semibold text-gray-800">{emailContent === '运价推广' ? '运价推广邮件' : emailContent}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-auto pt-6 border-t">
                <Button 
                  onClick={() => {
                    setDrawerVisible(false);
                    setCurrentPage('generate');
                  }}
                >
                  关闭窗口
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => {
                    // 跳转到系统设置-邮件管理（待设计）
                    Message.info({
                      content: '邮件管理功能正在开发中，将跳转至【系统设置】-【邮件管理】页面',
                      duration: 3000
                    });
                    
                    // 模拟跳转逻辑
                    setTimeout(() => {
                      // 这里可以添加实际的路由跳转逻辑
                      // 例如：navigate('/system-settings/email-management');
                      
                      // 关闭当前抽屉
                      setDrawerVisible(false);
                      setCurrentPage('generate');
                      
                      // 显示跳转提示
                      Message.success('即将跳转到邮件管理页面');
                    }, 1000);
                  }}
                >
                  查看邮件
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* 收件人详情窗口 */}
      <Modal
        title="收件人详情"
        visible={recipientDetailVisible}
        onCancel={() => setRecipientDetailVisible(false)}
        footer={null}
        style={{ width: '60%', maxHeight: '70vh' }}
      >
        <div className="flex flex-col h-full">
          {/* 搜索框 */}
          <div className="mb-4">
            <Input.Search
              placeholder="搜索收件人邮箱"
              value={searchRecipient}
              onChange={(value) => setSearchRecipient(value)}
              allowClear
            />
          </div>
          
          {/* 收件人列表 - 滚轮视图 */}
          <div className="border rounded-lg p-4 max-h-60 overflow-y-auto flex-1">
            <div className="space-y-2">
              {filteredRecipients.map((email, index) => {
                const customerInfo = getCustomerInfoByEmail(email);
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative"
                    onMouseEnter={() => editingRecipientIndex === null && setHoveredEmailIndex(index + 1000)} // 使用不同的索引范围避免冲突
                    onMouseLeave={() => setHoveredEmailIndex(null)}
                  >
                    {editingRecipientIndex === index ? (
                      <Input
                        value={editingRecipientEmail}
                        onChange={(value) => setEditingRecipientEmail(value)}
                        onPressEnter={handleFinishEditRecipient}
                        onBlur={handleFinishEditRecipient}
                        autoFocus
                        className="flex-1"
                      />
                    ) : (
                      <span 
                        className="flex-1 cursor-pointer text-sm"
                        onClick={() => handleStartEditRecipient(index)}
                      >
                        {email}
                      </span>
                    )}
                    <Button 
                      type="text" 
                      size="mini" 
                      status="danger"
                      onClick={() => handleDeleteRecipient(index)}
                    >
                      删除
                    </Button>
                    
                    {/* 客户信息悬浮提示 */}
                    {hoveredEmailIndex === index + 1000 && editingRecipientIndex !== index && (
                      <div className="absolute z-50 left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4" style={{ minWidth: '320px', maxWidth: '400px' }}>
                        <div className="flex items-start space-x-3">
                          <Avatar className="bg-blue-500 text-white font-bold flex-shrink-0" size={48}>
                            {customerInfo.name.charAt(0)}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-blue-600 truncate">{customerInfo.name}</h3>
                              {customerInfo.verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded whitespace-nowrap ml-2">已认证</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">{customerInfo.description}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {customerInfo.tags.slice(0, 4).map((tag, tagIndex) => (
                                <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded truncate max-w-[100px]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-3 space-y-1">
                              <div className="flex items-center">
                                <span className="w-16 inline-block">成立时间:</span>
                                <span>{customerInfo.establishDate}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-16 inline-block">员工人数:</span>
                                <span>{customerInfo.employees}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-16 inline-block">联系电话:</span>
                                <span className="truncate max-w-[150px]">{customerInfo.contact.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredRecipients.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {searchRecipient ? '未找到匹配的收件人' : '暂无收件人信息'}
                </div>
              )}
            </div>
          </div>
          
          {/* 添加收件人区域 */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="输入邮箱地址"
                value={newRecipientEmail}
                onChange={(value) => setNewRecipientEmail(value)}
                onPressEnter={handleAddRecipient}
                className="flex-1"
              />
              <Button type="primary" onClick={handleAddRecipient}>
                添加
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* 人工微调模态框 */}
      <EmailFineTuningModal
        visible={fineTuningModalVisible}
        onClose={() => setFineTuningModalVisible(false)}
        onSend={(data) => {
          // 这里处理发送邮件的逻辑
          console.log('发送邮件:', data);
          Message.success('邮件已发送');
          setFineTuningModalVisible(false);
        }}
        initialData={{
          subject: 'AI生成的营销邮件',
          content: generatedContent,
          recipients: recipientEmails.map(email => ({ email }))
        }}
      />
    </div>
  );

};

export default AiCustomerAcquisition;
