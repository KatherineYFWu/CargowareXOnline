import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  Modal,
  Input,
  Button,
  Typography,
  Checkbox,
  Grid,
  Icon,
  Message,
  Select,
  Tag,
  Divider,
  Notification,
  InputNumber,
  Radio,
  Switch,
  Spin,
  Progress,
  List
} from '@arco-design/web-react';
import { IconSettings, IconRobot, IconCheckCircle, IconExclamationCircle, IconEdit, IconRight, IconDown, IconImage, IconDownload, IconClose, IconNav, IconLeft } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { Row, Col } = Grid;
  const TextArea = Input.TextArea;
  const Option = Select.Option;
  
  interface BatchQuoteModalProps {
    visible: boolean;
    onCancel: () => void;
    selectedItems: any[];
  }
  
  interface SampleData {
    shipCompany: string;
    placeOfLoading: string; // 装货地: CityName UNICODE
    departurePort: string; // 起运港: CityName, CountryName (CountryCode)
    destinationPort: string; // 目的港: CityName, CountryName (CountryCode)
    placeOfDelivery: string; // 目的地: CityName UNICODE
    etdEta: string; // 开航/到港: ETD ~ ETA
    transitTime: string; // 航程
    vesselVoyage: string; // 船名/航次
    routeCode: string; // 航线代码
    directTransit: string;
    containerTypes: string; // 箱型
    oceanFreight: string;
    basePrices: Record<string, number>; // 保存基础价格用于计算
  }
  
  interface AIResultItem {
      original: SampleData;
      newPrices: Record<string, number>;
      status: 'success' | 'warning';
  }
  
  /**
   * 批量报价弹窗组件
   * 用于快速批量报价功能，支持多个运价信息展示和价格设置
   */
  const BatchQuoteModal: React.FC<BatchQuoteModalProps> = ({
    visible,
    onCancel,
    selectedItems
  }) => {
    // 价格状态管理 - 使用数字类型存储
    const [prices, setPrices] = useState<Record<string, number | undefined>>({});
  const [percentageMarkups, setPercentageMarkups] = useState<Record<string, number | undefined>>({});
  const [hasAdditionalFees, setHasAdditionalFees] = useState(false);
  const [additionalFeeTypes, setAdditionalFeeTypes] = useState({
    origin: true,
    destination: true,
    others: true
  });
  
  // 设置弹窗状态
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [customTextEnabled, setCustomTextEnabled] = useState(false);
  const [customText, setCustomText] = useState('');
  const [textPosition, setTextPosition] = useState('bottom'); 
  const [allPrice, setAllPrice] = useState<number | undefined>(undefined);
  const [allPercentageMarkup, setAllPercentageMarkup] = useState<number | undefined>(undefined);
  const [activeMarkupTab, setActiveMarkupTab] = useState<'fixed' | 'percentage' | 'ai'>('ai');

  // AI Markup States
  const [aiStrategy, setAiStrategy] = useState<'balance' | 'acquisition' | 'profit'>('balance');
  const [aiLimits, setAiLimits] = useState({
    minPrice: undefined as number | undefined,
    minPercent: undefined as number | undefined,
    minOperator: 'and' as 'and' | 'or',
    maxPrice: undefined as number | undefined,
    maxPercent: undefined as number | undefined,
    maxOperator: 'and' as 'and' | 'or'
  });
  const [aiProgress, setAiProgress] = useState({
    total: 0,
    current: 0,
    status: 'idle' as 'idle' | 'running' | 'completed'
  });
  const [aiResults, setAiResults] = useState<AIResultItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const [aiTone, setAiTone] = useState<'professional' | 'concise' | 'friendly'>('professional');
  const [aiLanguage, setAiLanguage] = useState<'zh' | 'en'>('zh');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Image Quote State
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentImageTime, setCurrentImageTime] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 箱型列表
  const containerTypes = [
    '20FR', '20GP', '20HC', '20NOR', '20OT', '20TK',
    '40FR', '40GP', '40HC', '40NOR', '40OT', '40TK',
    '45HC'
  ];

  // 模拟选中的运价数据
  const [sampleDataList, setSampleDataList] = useState<SampleData[]>([
    {
      shipCompany: '澳亚航运',
      placeOfLoading: 'Shanghai CNSHA',
      departurePort: 'Shanghai, China (CN)',
      destinationPort: 'Busan, Korea (KR)',
      placeOfDelivery: 'Busan KRPUS',
      etdEta: '2025-02-15 ~ 2025-02-18',
      transitTime: '3 Days',
      vesselVoyage: 'COSCO STAR / 034W',
      routeCode: 'AEU1',
      directTransit: '直达',
      containerTypes: '20GP, 40GP, 40HC, 45HC, 40NOR',
      oceanFreight: '20GP USD 22.00, 40GP USD 333.00, 40HC USD 444.00, 45HC USD 555.00, 40NOR USD 66.00',
      basePrices: {
        '20GP': 22,
        '40GP': 333,
        '40HC': 444,
        '45HC': 555,
        '40NOR': 66
      }
    },
    {
      shipCompany: '测试船公司',
      placeOfLoading: 'Singapore SGSIN',
      departurePort: 'Singapore, Singapore (SG)',
      destinationPort: 'Rotterdam, Netherlands (NL)',
      placeOfDelivery: 'Rotterdam NLRTM',
      etdEta: '2025-03-01 ~ 2025-03-30',
      transitTime: '29 Days',
      vesselVoyage: 'EVER GIVEN / 123E',
      routeCode: 'CEM',
      directTransit: '中转',
      containerTypes: '20GP, 40GP, 40HC, 45HC, 40NOR',
      oceanFreight: '20GP USD 55.00, 40GP USD 77.00, 40HC USD 99.00, 45HC USD 132.00, 40NOR USD 132.00',
      basePrices: {
        '20GP': 55,
        '40GP': 77,
        '40HC': 99,
        '45HC': 132,
        '40NOR': 132
      }
    }
  ]);

  useEffect(() => {
    if (visible && selectedItems && selectedItems.length > 0) {
      const mappedList: SampleData[] = selectedItems.map((item, index) => {
        // Generate mock base prices since they are not provided in selectedItems
        const basePrices = {
            '20GP': 2000 + index * 100,
            '40GP': 3500 + index * 100,
            '40HC': 3600 + index * 100,
            '45HC': 4000 + index * 100,
            '40NOR': 1500 + index * 100
        };
        
        const oceanFreight = Object.entries(basePrices)
            .map(([k, v]) => `${k} USD ${v.toFixed(2)}`)
            .join(', ');

        // Try to parse ports
        const pol = item.origin || 'Shanghai, China (CN)';
        const pod = item.destination || 'Rotterdam, Netherlands (NL)';

        return {
            shipCompany: item.carrier || 'Unknown',
            placeOfLoading: pol.split(',')[0] + ' ' + (pol.includes('(') ? pol.match(/\((.*?)\)/)?.[1] || '' : ''),
            departurePort: pol,
            destinationPort: pod,
            placeOfDelivery: pod.split(',')[0] + ' ' + (pod.includes('(') ? pod.match(/\((.*?)\)/)?.[1] || '' : ''),
            etdEta: item.sailingTime ? `${item.sailingTime} ~ TBD` : 'TBD ~ TBD',
            transitTime: item.transitTime || '30 Days',
            vesselVoyage: 'TBD / TBD',
            routeCode: 'AE1',
            directTransit: '直达',
            containerTypes: '20GP, 40GP, 40HC, 45HC, 40NOR',
            oceanFreight: oceanFreight,
            basePrices: basePrices
        };
      });
      setSampleDataList(mappedList);
    }
  }, [visible, selectedItems]);
  
  // 模拟附加费数据
  const mockAdditionalFees = [
    { category: 'origin', name: 'THC/L', paymentMode: 'Prepaid', unit: 'Per Container', currency: 'CNY', price: 800, categoryName: '起运港费用' },
    { category: 'origin', name: 'Doc Fee', paymentMode: 'Prepaid', unit: 'Per Shipment', currency: 'CNY', price: 450, categoryName: '起运港费用' },
    { category: 'destination', name: 'DTHC', paymentMode: 'Collect', unit: 'Per Container', currency: 'EUR', price: 200, categoryName: '目的港费用' },
    { category: 'destination', name: 'ISPS/D', paymentMode: 'Collect', unit: 'Per Container', currency: 'EUR', price: 15, categoryName: '目的港费用' },
    { category: 'others', name: 'Handling Fee', paymentMode: 'Prepaid', unit: 'Per Shipment', currency: 'USD', price: 50, categoryName: '其他费用' },
  ];

  // 更新所有运价的海运费文本
  const updateOceanFreightText = (
    currentPrices: Record<string, number | undefined>, 
    currentPercentageMarkups: Record<string, number | undefined>,
    mode: 'fixed' | 'percentage'
  ) => {
    setSampleDataList(prevList => prevList.map(item => {
      // 重新构建海运费字符串
      const newFreightParts: string[] = [];
      
      Object.keys(item.basePrices).forEach(boxType => {
        const basePrice = item.basePrices[boxType];
        let newPrice = basePrice;
        
        if (mode === 'fixed') {
            const markup = currentPrices[boxType] || 0;
            newPrice = basePrice + markup;
        } else if (mode === 'percentage') {
            const markupPercent = currentPercentageMarkups[boxType] || 0;
            newPrice = basePrice * (1 + markupPercent / 100);
        }
        
        // Ensure non-negative
        if (newPrice < 0) newPrice = 0;
        
        newFreightParts.push(`${boxType} USD ${newPrice.toFixed(2)}`);
      });
      
      return {
        ...item,
        oceanFreight: newFreightParts.join(', ')
      };
    }));
  };

  // 处理价格输入变化
  const handlePriceChange = (type: string, value: number) => {
    const newPrices = {
      ...prices,
      [type]: value
    };
    setPrices(newPrices);
    updateOceanFreightText(newPrices, percentageMarkups, 'fixed');
  };
  
  // 处理价格输入框失焦
  const handlePriceBlur = (type: string) => {
    const currentValue = prices[type];
    if (currentValue === undefined || currentValue < 0) {
      handlePriceChange(type, 0);
    }
  };
  
  // 处理"全部"输入框应用
  const handleApplyAllPrice = () => {
    if (allPrice === undefined) return;
    
    const newPrices = { ...prices };
    containerTypes.forEach(type => {
      const currentPrice = newPrices[type] || 0;
      newPrices[type] = currentPrice + allPrice;
    });
    
    setPrices(newPrices);
    updateOceanFreightText(newPrices, percentageMarkups, 'fixed');
    setAllPrice(undefined);
  };

  // 处理百分比输入变化
  const handlePercentageChange = (type: string, value: number) => {
    const newPercentages = {
      ...percentageMarkups,
      [type]: value
    };
    setPercentageMarkups(newPercentages);
    updateOceanFreightText(prices, newPercentages, 'percentage');
  };

  // 处理百分比输入框失焦
  const handlePercentageBlur = (type: string) => {
    const currentValue = percentageMarkups[type];
    if (currentValue === undefined || currentValue < 0) {
      handlePercentageChange(type, 0);
    }
  };

  // 处理"全部"百分比输入框应用
  const handleApplyAllPercentage = () => {
    if (allPercentageMarkup === undefined) return;
    
    const newPercentages = { ...percentageMarkups };
    containerTypes.forEach(type => {
      const current = newPercentages[type] || 0;
      let next = current + allPercentageMarkup;
      if (next < 0) next = 0; // Minimum 0%
      newPercentages[type] = next;
    });
    
    setPercentageMarkups(newPercentages);
    updateOceanFreightText(prices, newPercentages, 'percentage');
    setAllPercentageMarkup(undefined);
  };

  // 处理Tab切换
  const handleTabChange = (tab: 'fixed' | 'percentage' | 'ai') => {
    setActiveMarkupTab(tab);
    if (tab === 'fixed') {
        updateOceanFreightText(prices, percentageMarkups, 'fixed');
    } else if (tab === 'percentage') {
        updateOceanFreightText(prices, percentageMarkups, 'percentage');
    }
  };

  // 处理文本编辑
  const handleTextEdit = (index: number, field: keyof SampleData, value: string) => {
    const newList = [...sampleDataList];
    newList[index] = {
      ...newList[index],
      [field]: value
    };
    setSampleDataList(newList);
  };

  // 生成附加费文本
  const getFeesText = () => {
    if (!hasAdditionalFees) return '';
    
    const feesToShow = mockAdditionalFees.filter(fee => {
      if (fee.category === 'origin' && additionalFeeTypes.origin) return true;
      if (fee.category === 'destination' && additionalFeeTypes.destination) return true;
      if (fee.category === 'others' && additionalFeeTypes.others) return true;
      return false;
    });

    if (feesToShow.length === 0) return '';

    let text = `\n[附加费明细]\n`;
    text += `费用大类\t费用名称\t付款方式\t计费单位\t币种\t单价\n`;
    
    let totalUSD = 0;
    
    feesToShow.forEach(fee => {
       text += `${fee.categoryName}\t${fee.name}\t${fee.paymentMode}\t${fee.unit}\t${fee.currency}\t${fee.price}\n`;
       
       let amount = fee.price;
       if (fee.currency === 'CNY') amount = amount / 7.2;
       if (fee.currency === 'EUR') amount = amount * 1.1;
       totalUSD += amount;
    });
    
    text += `--------------------------------------------------\n`;
    text += `总计金额: USD ${totalUSD.toFixed(2)} (估算)`;
    return text;
  };

  // ---------------- AI Logic ----------------
  const startAIMarkup = async () => {
      if (sampleDataList.length > 50) {
          Notification.warning({ title: '限制', content: '最多同时对50条运价进行AI加价' });
          return;
      }
      setAiProgress({ total: sampleDataList.length, current: 0, status: 'running' });
      setAiResults([]);

      // Simulate async processing
      for (let i = 0; i < sampleDataList.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300)); // Delay per item
          const item = sampleDataList[i];
          const result = calculateAIPrice(item);
          setAiResults(prev => [...prev, result]);
          setAiProgress(prev => ({ ...prev, current: i + 1 }));
      }
      setAiProgress(prev => ({ ...prev, status: 'completed' }));
  };

  const calculateAIPrice = (item: SampleData): AIResultItem => {
      // Heuristic Logic
      const newPrices: Record<string, number> = {};
      
      // Strategy Multipliers (Simulated)
      let multiplier = 1.15; // Balance
      if (aiStrategy === 'acquisition') multiplier = 1.08;
      if (aiStrategy === 'profit') multiplier = 1.25;

      Object.keys(item.basePrices).forEach(boxType => {
          const base = item.basePrices[boxType];
          let price = base * multiplier;

          // Factors (Simulated Randomness)
          // 1. Route popularity (random)
          const popularity = 1 + (Math.random() * 0.1 - 0.05);
          price *= popularity;

          // 2. Psychological Pricing (End with 8 or 9)
          // Round to integer first
          let rounded = Math.round(price);
          const lastDigit = rounded % 10;
          if (lastDigit < 8) {
              rounded = rounded - lastDigit + 8; // move to 8 (e.g., 34 -> 38)
              // If too much jump, maybe go down? 
              // Simple logic: always up to 8 or 9
              if (Math.random() > 0.5) rounded += 1; // 50% chance to be 9
          }
          price = rounded;

          // 3. Limits Check
          // Min Check
          let minLimit = -Infinity;
          if (aiLimits.minPrice !== undefined || aiLimits.minPercent !== undefined) {
              const pLimit = aiLimits.minPrice !== undefined ? (base + aiLimits.minPrice) : -Infinity;
              const pctLimit = aiLimits.minPercent !== undefined ? (base * (1 + aiLimits.minPercent / 100)) : -Infinity;
              
              if (aiLimits.minOperator === 'and') {
                  minLimit = Math.max(pLimit, pctLimit);
              } else {
                   // For "OR" in "Not Lower Than": effectively min of the constraints? 
                   // "Price >= A OR Price >= B". If A=100, B=120. Price=110. 110>=100 (True) OR 110>=120 (False) -> True.
                   // So effectively, Price >= min(A, B).
                   // Wait, if undefined, treat as -Infinity.
                   // If both defined: min(A, B). If one defined: that one.
                   if (aiLimits.minPrice !== undefined && aiLimits.minPercent !== undefined) {
                       minLimit = Math.min(pLimit, pctLimit);
                   } else {
                       minLimit = Math.max(pLimit, pctLimit); // one is -Inf
                   }
              }
          }
          if (price < minLimit) price = minLimit;

          // Max Check
          let maxLimit = Infinity;
          if (aiLimits.maxPrice !== undefined || aiLimits.maxPercent !== undefined) {
              const pLimit = aiLimits.maxPrice !== undefined ? (base + aiLimits.maxPrice) : Infinity;
              const pctLimit = aiLimits.maxPercent !== undefined ? (base * (1 + aiLimits.maxPercent / 100)) : Infinity;
              
              if (aiLimits.maxOperator === 'and') {
                  // Not Higher Than A AND Not Higher Than B -> Price <= A AND Price <= B -> Price <= min(A, B)
                  maxLimit = Math.min(pLimit, pctLimit);
              } else {
                  // Not Higher Than A OR Not Higher Than B -> Price <= A OR Price <= B -> Price <= max(A, B)
                  // e.g. Price <= 100 OR Price <= 120. If Price=110. False OR True -> True.
                  if (aiLimits.maxPrice !== undefined && aiLimits.maxPercent !== undefined) {
                      maxLimit = Math.max(pLimit, pctLimit);
                  } else {
                      maxLimit = Math.min(pLimit, pctLimit); // one is Inf
                  }
              }
          }
          if (price > maxLimit) price = maxLimit;

          newPrices[boxType] = Number(price.toFixed(2));
      });

      return {
          original: item,
          newPrices,
          status: 'success'
      };
  };

  const handleApplyAIResults = () => {
      setSampleDataList(prev => prev.map((item, index) => {
          // Find corresponding AI result. Assuming order is preserved.
          // Better to match by some ID, but index is okay for this mock.
          const aiRes = aiResults[index];
          if (!aiRes) return item;

          const newFreightParts: string[] = [];
          Object.keys(item.basePrices).forEach(boxType => {
              const newPrice = aiRes.newPrices[boxType];
              if (newPrice !== undefined) {
                   newFreightParts.push(`${boxType} USD ${newPrice.toFixed(2)}`);
              } else {
                   // Fallback
                   newFreightParts.push(`${boxType} USD ${item.basePrices[boxType].toFixed(2)}`);
              }
          });

          return {
              ...item,
              oceanFreight: newFreightParts.join(', ')
          };
      }));
      Message.success('AI加价已应用');
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 600);
      // Optionally switch back to text view or stay? User might want to verify.
      // Requirement: "点击后将AI加价结果同步至左侧报价文本框"
  };

  const handleAIPriceEdit = (index: number, boxType: string, val: number) => {
      const newResults = [...aiResults];
      newResults[index].newPrices[boxType] = val;
      setAiResults(newResults);
  };

  const handleGenerateCopy = () => {
    setAiGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
        let text = '';
        if (aiLanguage === 'zh') {
            if (aiTone === 'professional') text = "尊敬的客户，感谢您的咨询。这是为您准备的详细报价方案，请查阅。如有疑问，请随时联系我们。";
            if (aiTone === 'concise') text = "报价如下，请查收。有效期至本月底。";
            if (aiTone === 'friendly') text = "Hi~ 这是为您精心挑选的优惠报价，希望能帮到您！有任何问题随时找我哦~";
        } else {
            if (aiTone === 'professional') text = "Dear Customer, thank you for your inquiry. Please find the detailed quotation attached. Feel free to contact us if you have any questions.";
            if (aiTone === 'concise') text = "Here is the quote. Valid until end of this month.";
            if (aiTone === 'friendly') text = "Hi there! Here's a great offer just for you. Let me know if you need anything else!";
        }
        
        setCustomText(text);
        setAiGenerating(false);
    }, 1500);
  };

  // Image Quote Handlers
  const handleOpenImagePreview = () => {
    if (sampleDataList.length === 0) return;
    setCurrentImageTime(new Date().toLocaleString());
    setCurrentImageIndex(0);
    setImagePreviewVisible(true);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
        const canvas = await html2canvas(cardRef.current, {
            useCORS: true,
            scale: 2,
            backgroundColor: null
        });
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `Quote_${sampleDataList[currentImageIndex].shipCompany}_${new Date().getTime()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        Message.success('图片下载成功');
    } catch (error) {
        console.error('Image generation failed', error);
        Message.error('图片生成失败');
    }
  };

  const handleDownloadAllImages = async () => {
    if (sampleDataList.length === 0) return;
    
    Message.loading({ content: '正在生成批量图片...', duration: 0, id: 'downloadAll' });
    
    try {
        const originalIndex = currentImageIndex;
        
        for (let i = 0; i < sampleDataList.length; i++) {
            setCurrentImageIndex(i);
            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (cardRef.current) {
                const canvas = await html2canvas(cardRef.current, {
                    useCORS: true,
                    scale: 2,
                    backgroundColor: null
                });
                const url = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = url;
                a.download = `Quote_${sampleDataList[i].shipCompany}_${i+1}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
        
        setCurrentImageIndex(originalIndex);
        Message.success({ content: '批量图片下载完成', id: 'downloadAll' });
    } catch (e) {
        console.error(e);
        Message.error({ content: '批量下载失败', id: 'downloadAll' });
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < sampleDataList.length - 1 ? prev + 1 : prev));
  };



  /**
   * 处理提交批量报价
   */
  const handleSubmit = () => {
    // 1. 构建复制文本
    let copyText = '';
    
    // 顶部自定义文本
    if (customTextEnabled && textPosition === 'top' && customText) {
      copyText += `${customText}\n\n`;
    }

    // 运价信息
    sampleDataList.forEach((data, index) => {
      copyText += `船公司: ${data.shipCompany}\n`;
      copyText += `装货地: ${data.placeOfLoading}\n`;
      copyText += `起运港: ${data.departurePort}\n`;
      copyText += `目的港: ${data.destinationPort}\n`;
      copyText += `目的地: ${data.placeOfDelivery}\n`;
      copyText += `开航/到港: ${data.etdEta}\n`;
      copyText += `航程: ${data.transitTime}\n`;
      copyText += `船名/航次: ${data.vesselVoyage}\n`;
      copyText += `航线代码: ${data.routeCode}\n`;
      copyText += `直达/中转: ${data.directTransit}\n`;
      copyText += `箱型: ${data.containerTypes}\n`;
      copyText += `海运费: ${data.oceanFreight}\n`;
      
      // 附加费
      const feesText = getFeesText();
      if (feesText) {
        copyText += feesText + '\n';
      }
      
      if (index < sampleDataList.length - 1) {
        copyText += '\n';
      }
    });

    // 底部自定义文本
    if (customTextEnabled && textPosition === 'bottom' && customText) {
      copyText += `\n${customText}`;
    }

    // 2. 写入剪贴板
    navigator.clipboard.writeText(copyText).then(() => {
      Message.success('报价文本已复制到剪贴板');
      
      // 延迟关闭
      setTimeout(() => {
        onCancel();
      }, 1000);
    }).catch(err => {
      console.error('复制失败:', err);
      Message.error('复制失败，请手动复制');
    });
  };

  return (
    <>
      <Modal
        title="快速报价"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        style={{ top: 50, width: 1100 }}
      >
        <Grid.Row gutter={24} style={{ height: '650px' }}>
            {/* Left Column: Text Preview */}
            <Grid.Col span={9} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                 <div style={{ marginBottom: '12px' }}>
                    <Text style={{ color: '#666', fontSize: '14px' }}>
                    您可以修改/复制下面的文本，快速报价
                    </Text>
                 </div>
                 <div style={{ 
                    flex: 1,
                    overflowY: 'auto',
                    backgroundColor: isFlashing ? '#e8f3ff' : '#f7f8fa',
                    borderRadius: '4px',
                    padding: '16px',
                    border: '1px solid #e5e6eb',
                    transition: 'background-color 0.3s ease'
                 }}>
                     {/* 顶部自定义文本 */}
                    {customTextEnabled && textPosition === 'top' && customText && (
                    <div style={{ marginBottom: '16px', color: '#333' }}>
                        {customText}
                    </div>
                    )}

                    {sampleDataList.map((sampleData, index) => (
                    <div key={index} style={{ 
                        marginBottom: index < sampleDataList.length - 1 ? '24px' : '0',
                        borderBottom: index < sampleDataList.length - 1 ? '1px solid #e5e6eb' : 'none',
                        paddingBottom: index < sampleDataList.length - 1 ? '16px' : '0'
                    }}>
                        <div style={{ fontSize: '12px', lineHeight: '22px', color: '#333', fontFamily: 'monospace' }}>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>船公司:</span>
                            <Input size="mini" value={sampleData.shipCompany} onChange={(val) => handleTextEdit(index, 'shipCompany', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>装货地:</span>
                            <Input size="mini" value={sampleData.placeOfLoading} onChange={(val) => handleTextEdit(index, 'placeOfLoading', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>起运港:</span>
                            <Input size="mini" value={sampleData.departurePort} onChange={(val) => handleTextEdit(index, 'departurePort', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>目的港:</span>
                            <Input size="mini" value={sampleData.destinationPort} onChange={(val) => handleTextEdit(index, 'destinationPort', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>目的地:</span>
                            <Input size="mini" value={sampleData.placeOfDelivery} onChange={(val) => handleTextEdit(index, 'placeOfDelivery', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>开航/到港:</span>
                            <Input size="mini" value={sampleData.etdEta} onChange={(val) => handleTextEdit(index, 'etdEta', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>航程:</span>
                            <Input size="mini" value={sampleData.transitTime} onChange={(val) => handleTextEdit(index, 'transitTime', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>船名/航次:</span>
                            <Input size="mini" value={sampleData.vesselVoyage} onChange={(val) => handleTextEdit(index, 'vesselVoyage', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>航线代码:</span>
                            <Input size="mini" value={sampleData.routeCode} onChange={(val) => handleTextEdit(index, 'routeCode', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>直达/中转:</span>
                            <Input size="mini" value={sampleData.directTransit} onChange={(val) => handleTextEdit(index, 'directTransit', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 4 }}>
                            <span style={{ width: 80, flexShrink: 0 }}>箱型:</span>
                            <Input size="mini" value={sampleData.containerTypes} onChange={(val) => handleTextEdit(index, 'containerTypes', val)} style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 22 }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <span style={{ width: 80, flexShrink: 0 }}>海运费:</span>
                            <Input.TextArea 
                            autoSize={{ minRows: 1 }}
                            value={sampleData.oceanFreight} 
                            onChange={(val) => handleTextEdit(index, 'oceanFreight', val)}
                            style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, minHeight: 22, resize: 'none', overflowY: 'hidden' }}
                            />
                        </div>
                        
                        {/* 附加费预览 */}
                        {hasAdditionalFees && (
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <span style={{ width: 80, flexShrink: 0 }}></span>
                                <div style={{ flex: 1, whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#666', fontSize: '12px' }}>
                                    {getFeesText()}
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                    ))}

                    {/* 底部自定义文本 */}
                    {customTextEnabled && textPosition === 'bottom' && customText && (
                    <div style={{ marginTop: '16px', color: '#333' }}>
                        {customText}
                    </div>
                    )}
                 </div>
                 
                 {/* Left Bottom Actions */}
                 <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Button type="text" icon={<IconSettings />} onClick={() => setSettingsVisible(true)} style={{ paddingLeft: 0, color: '#165DFF' }}>自定义文本设置</Button>
                        
                        {/* 费用选项 */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox checked={hasAdditionalFees} onChange={setHasAdditionalFees}>
                                <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>附加费</Text>
                            </Checkbox>
                            
                            {hasAdditionalFees && (
                                <div style={{ display: 'flex', marginLeft: '12px', gap: '8px' }}>
                                <Checkbox checked={additionalFeeTypes.origin} onChange={(checked) => setAdditionalFeeTypes(prev => ({ ...prev, origin: checked }))}>
                                    <Text style={{ fontSize: '12px' }}>起运港</Text>
                                </Checkbox>
                                <Checkbox checked={additionalFeeTypes.destination} onChange={(checked) => setAdditionalFeeTypes(prev => ({ ...prev, destination: checked }))}>
                                    <Text style={{ fontSize: '12px' }}>目的港</Text>
                                </Checkbox>
                                <Checkbox checked={additionalFeeTypes.others} onChange={(checked) => setAdditionalFeeTypes(prev => ({ ...prev, others: checked }))}>
                                    <Text style={{ fontSize: '12px' }}>其他</Text>
                                </Checkbox>
                                </div>
                            )}
                        </div>
                     </div>
                 </div>
            </Grid.Col>

            {/* Right Column: Markups */}
            <Grid.Col span={15} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e6eb', marginBottom: '16px' }}>
                    <div style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: activeMarkupTab === 'ai' ? 'bold' : 'normal', color: activeMarkupTab === 'ai' ? '#165DFF' : '#333', borderBottom: activeMarkupTab === 'ai' ? '2px solid #165DFF' : 'none', marginBottom: '-1px' }} onClick={() => handleTabChange('ai')}>AI加价</div>
                    <div style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: activeMarkupTab === 'fixed' ? 'bold' : 'normal', color: activeMarkupTab === 'fixed' ? '#165DFF' : '#333', borderBottom: activeMarkupTab === 'fixed' ? '2px solid #165DFF' : 'none', marginBottom: '-1px' }} onClick={() => handleTabChange('fixed')}>固定价格加价</div>
                    <div style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: activeMarkupTab === 'percentage' ? 'bold' : 'normal', color: activeMarkupTab === 'percentage' ? '#165DFF' : '#333', borderBottom: activeMarkupTab === 'percentage' ? '2px solid #165DFF' : 'none', marginBottom: '-1px' }} onClick={() => handleTabChange('percentage')}>固定比例加价</div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {activeMarkupTab === 'fixed' && (
                        <Row gutter={[12, 12]}>
                            {containerTypes.map(type => (
                            <Col span={8} key={type}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '50px', fontSize: '12px', color: '#333' }}>{type}</span>
                                <InputNumber placeholder="请输入" mode="embed" precision={2} step={1} min={0} value={prices[type]} onChange={(val) => handlePriceChange(type, val)} onBlur={() => handlePriceBlur(type)} style={{ flex: 1, height: '32px', backgroundColor: '#f2f3f5' }} />
                                </div>
                            </Col>
                            ))}
                            <Col span={16}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '50px', fontSize: '12px', color: '#333' }}>全部</span>
                                <InputNumber placeholder="请输入" mode="embed" precision={2} step={1} value={allPrice} onChange={setAllPrice} style={{ flex: 1, height: '32px', backgroundColor: '#f2f3f5' }} />
                                <Button type="primary" size="small" style={{ marginLeft: '8px', height: '32px' }} onClick={handleApplyAllPrice}>应用</Button>
                            </div>
                            </Col>
                        </Row>
                    )}

                    {activeMarkupTab === 'percentage' && (
                        <Row gutter={[12, 12]}>
                            {containerTypes.map(type => (
                            <Col span={8} key={type}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '50px', fontSize: '12px', color: '#333' }}>{type}</span>
                                <InputNumber placeholder="请输入" mode="embed" precision={3} step={1} min={0} suffix="%" value={percentageMarkups[type]} onChange={(val) => handlePercentageChange(type, val)} onBlur={() => handlePercentageBlur(type)} style={{ flex: 1, height: '32px', backgroundColor: '#f2f3f5' }} />
                                </div>
                            </Col>
                            ))}
                            <Col span={16}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '50px', fontSize: '12px', color: '#333' }}>全部</span>
                                <InputNumber placeholder="请输入" mode="embed" precision={3} step={1} suffix="%" value={allPercentageMarkup} onChange={setAllPercentageMarkup} style={{ flex: 1, height: '32px', backgroundColor: '#f2f3f5' }} />
                                <Button type="primary" size="small" style={{ marginLeft: '8px', height: '32px' }} onClick={handleApplyAllPercentage}>应用</Button>
                            </div>
                            </Col>
                        </Row>
                    )}

                    {activeMarkupTab === 'ai' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Strategy */}
                            <div style={{ marginBottom: '20px' }}>
                                <Text style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>AI加价策略</Text>
                                <Select value={aiStrategy} onChange={setAiStrategy} style={{ width: '100%' }}>
                                    <Option value="balance">智能平衡模式 (智能平衡)</Option>
                                    <Option value="acquisition">获客优先模式 (保守加价，追求客户转化)</Option>
                                    <Option value="profit">利润优先模式 (激进加价，追求少量多利)</Option>
                                </Select>
                            </div>

                            {/* Limits */}
                            <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f7f8fa', borderRadius: '4px' }}>
                                <Text style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>加价限制</Text>
                                
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    {/* Min Price */}
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                        <Text style={{ fontSize: '12px', flexShrink: 0, marginRight: '8px' }}>最低价格:</Text>
                                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                            <InputNumber value={aiLimits.minPrice} onChange={(val) => setAiLimits(prev => ({ ...prev, minPrice: val }))} placeholder="0.00" precision={2} min={0} style={{ width: 80 }} size="small" />
                                            <span style={{ margin: '0 4px', fontSize: '12px' }}>元</span>
                                            <Button size="small" style={{ margin: '0 4px', padding: '0 6px', height: '24px', fontSize: '12px' }} onClick={() => setAiLimits(prev => ({ ...prev, minOperator: prev.minOperator === 'and' ? 'or' : 'and' }))}>
                                                {aiLimits.minOperator === 'and' ? '且' : '或'}
                                            </Button>
                                            <InputNumber value={aiLimits.minPercent} onChange={(val) => setAiLimits(prev => ({ ...prev, minPercent: val }))} placeholder="0.00" precision={2} min={0} style={{ width: 80 }} size="small" />
                                            <span style={{ margin: '0 4px', fontSize: '12px' }}>%</span>
                                        </div>
                                    </div>

                                    {/* Max Price */}
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                        <Text style={{ fontSize: '12px', flexShrink: 0, marginRight: '8px' }}>最高价格:</Text>
                                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                            <InputNumber value={aiLimits.maxPrice} onChange={(val) => setAiLimits(prev => ({ ...prev, maxPrice: val }))} placeholder="0.00" precision={2} min={0} style={{ width: 80 }} size="small" />
                                            <span style={{ margin: '0 4px', fontSize: '12px' }}>元</span>
                                            <Button size="small" style={{ margin: '0 4px', padding: '0 6px', height: '24px', fontSize: '12px' }} onClick={() => setAiLimits(prev => ({ ...prev, maxOperator: prev.maxOperator === 'and' ? 'or' : 'and' }))}>
                                                {aiLimits.maxOperator === 'and' ? '且' : '或'}
                                            </Button>
                                            <InputNumber value={aiLimits.maxPercent} onChange={(val) => setAiLimits(prev => ({ ...prev, maxPercent: val }))} placeholder="0.00" precision={2} min={0} style={{ width: 80 }} size="small" />
                                            <span style={{ margin: '0 4px', fontSize: '12px' }}>%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Start Button */}
                            <div style={{ marginBottom: '20px' }}>
                                <Button type="primary" long onClick={startAIMarkup} disabled={aiProgress.status === 'running'}>
                                    <IconRobot /> 启动AI加价
                                </Button>
                            </div>

                            {/* Progress & Results */}
                            {aiProgress.status !== 'idle' && (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                    <div 
                                        style={{ 
                                            flex: 1, 
                                            overflowY: 'auto', 
                                            border: '1px solid #e5e6eb', 
                                            borderRadius: '4px',
                                            padding: '12px',
                                            backgroundColor: '#f7f8fa',
                                            marginBottom: '12px'
                                        }}
                                        ref={scrollRef}
                                    >
                                        {aiResults.map((res, idx) => (
                                            <div key={idx} style={{ 
                                                marginBottom: '12px', 
                                                padding: '12px', 
                                                backgroundColor: '#fff', 
                                                borderRadius: '4px',
                                                border: '1px solid #e5e6eb',
                                                display: 'flex',
                                                gap: '12px'
                                            }}>
                                                {/* Left: Info (Compact) */}
                                                <div style={{ width: '25%', fontSize: '12px', color: '#666', borderRight: '1px solid #f0f0f0', paddingRight: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '6px', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.original.shipCompany}>{res.original.shipCompany}</div>
                                                    
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ color: '#86909c', transform: 'scale(0.9)', transformOrigin: 'left' }}>起运</span>
                                                            <span style={{ color: '#333', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }} title={res.original.departurePort}>{res.original.departurePort.split(',')[0]}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ color: '#86909c', transform: 'scale(0.9)', transformOrigin: 'left' }}>目的</span>
                                                            <span style={{ color: '#333', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }} title={res.original.destinationPort}>{res.original.destinationPort.split(',')[0]}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ color: '#86909c', transform: 'scale(0.9)', transformOrigin: 'left' }}>船期</span>
                                                            <span style={{ color: '#333' }}>{res.original.etdEta.split('~')[0]}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ color: '#86909c', transform: 'scale(0.9)', transformOrigin: 'left' }}>船名</span>
                                                            <span style={{ color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }} title={res.original.vesselVoyage.split('/')[0]}>{res.original.vesselVoyage.split('/')[0]}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ color: '#86909c', transform: 'scale(0.9)', transformOrigin: 'left' }}>航次</span>
                                                            <span style={{ color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{res.original.vesselVoyage.split('/')[1] || '-'}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ color: '#86909c', transform: 'scale(0.9)', transformOrigin: 'left' }}>代码</span>
                                                            <span style={{ color: '#333' }}>{res.original.routeCode}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Prices */}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '4px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                                            {Object.entries(res.original.basePrices).map(([k, originalPrice], priceIdx) => {
                                                                const newPrice = res.newPrices[k];
                                                                return (
                                                                    <div key={k} style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', paddingLeft: '2px', paddingRight: '2px' }}>
                                                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>{k}</span>
                                                                            <span style={{ fontSize: '12px', color: '#86909c', textDecoration: 'line-through', transform: 'scale(0.9)', transformOrigin: 'right' }}>${originalPrice}</span>
                                                                        </div>
                                                                        <div style={{ 
                                                                            padding: '4px', 
                                                                            backgroundColor: '#fff7e6', 
                                                                            borderRadius: '4px', 
                                                                            border: '1px solid #ffe8c9' 
                                                                        }}>
                                                                            <InputNumber 
                                                                                size="mini" 
                                                                                value={newPrice} 
                                                                                onChange={(val) => handleAIPriceEdit(idx, k, val)} 
                                                                                min={0}
                                                                                precision={2}
                                                                                prefix="$"
                                                                                style={{ 
                                                                                    width: '100%', 
                                                                                    backgroundColor: 'transparent',
                                                                                    border: 'none',
                                                                                    color: '#d46b08',
                                                                                    fontWeight: 'bold'
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {/* Status */}
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {aiProgress.status === 'completed' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', color: '#00B42A' }}>
                                                    <IconCheckCircle style={{ marginRight: 8 }} />
                                                    <span>加价完成</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', color: '#165DFF' }}>
                                                    <Spin size={14} style={{ marginRight: 8 }} />
                                                    <span>加价中，还剩 {aiProgress.total - aiProgress.current} 条，共 {aiProgress.total} 条</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm Button */}
                                        {aiProgress.status === 'completed' && (
                                            <Button type="primary" onClick={handleApplyAIResults}>
                                                确认AI加价
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Bottom Actions */}
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button onClick={onCancel} style={{ height: '32px' }}>取消</Button>
                    <Button onClick={handleOpenImagePreview} style={{ height: '32px' }}>
                        <IconImage /> 图片报价
                    </Button>
                    <Button type="primary" onClick={handleSubmit} style={{ height: '32px' }}>文本报价</Button>
                </div>
            </Grid.Col>
        </Grid.Row>
      </Modal>

      {/* 自定义文本设置弹窗 */}
      <Modal
        title="自定义文本设置"
        visible={settingsVisible}
        onCancel={() => setSettingsVisible(false)}
        footer={null}
        style={{ width: 480 }}
      >
        <div style={{ padding: '20px' }}>
          <div style={{ 
            backgroundColor: '#e8f3ff', 
            border: '1px solid #b7d9ff', 
            borderRadius: '4px', 
            padding: '12px',
            marginBottom: '20px',
            color: '#165DFF',
            fontSize: '13px'
          }}>
            此处设置内容将展示在生成的报价文本中
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <Switch 
              checked={customTextEnabled}
              onChange={setCustomTextEnabled}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontSize: '14px', color: '#333' }}>自定义展示文本</span>
          </div>

          {customTextEnabled && (
            <>
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <TextArea 
                  placeholder="请输入自定义文本" 
                  maxLength={200}
                  value={customText}
                  onChange={setCustomText}
                  showWordLimit
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ backgroundColor: '#f2f3f5', border: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: 500 }}>文本位置:</div>
                <Radio.Group 
                  value={textPosition} 
                  onChange={setTextPosition}
                >
                  <Radio value="top">顶部</Radio>
                  <Radio value="bottom">底部</Radio>
                </Radio.Group>
              </div>

              <Divider style={{ margin: '20px 0' }} />
              
              <div style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: 500 }}>AI文案:</div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <Select value={aiTone} onChange={setAiTone} style={{ flex: 1 }} placeholder="文案语气">
                       <Option value="professional">专业严谨</Option>
                       <Option value="concise">简洁紧凑</Option>
                       <Option value="friendly">亲切友好</Option>
                  </Select>
                  <Select value={aiLanguage} onChange={setAiLanguage} style={{ flex: 1 }} placeholder="语言">
                       <Option value="zh">中文</Option>
                       <Option value="en">English</Option>
                  </Select>
                </div>
                <Button type="primary" long loading={aiGenerating} onClick={handleGenerateCopy}>
                  {aiGenerating ? '生成中...' : '生成文案'}
                </Button>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button onClick={() => setSettingsVisible(false)}>
              取消
            </Button>
            <Button type="primary" onClick={() => setSettingsVisible(false)}>
              保存
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Quote Preview Modal */}
      <Modal
        visible={imagePreviewVisible}
        onCancel={() => setImagePreviewVisible(false)}
        footer={null}
        closeIcon={null}
        style={{ width: 'auto', maxWidth: '100vw', background: 'transparent', boxShadow: 'none' }}
        wrapClassName="image-quote-modal-wrap"
      >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', position: 'relative' }}>
             {/* Pagination Arrows */}
             {sampleDataList.length > 1 && (
                <>
                   <div 
                     onClick={handlePrevImage}
                     style={{
                        position: 'absolute', left: '-60px', top: '50%', transform: 'translateY(-50%)',
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: currentImageIndex > 0 ? 'pointer' : 'not-allowed',
                        opacity: currentImageIndex > 0 ? 1 : 0.3,
                        color: '#fff', fontSize: '20px',
                        zIndex: 100
                     }}
                   >
                     <IconLeft />
                   </div>
                   <div 
                     onClick={handleNextImage}
                     style={{
                        position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)',
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: currentImageIndex < sampleDataList.length - 1 ? 'pointer' : 'not-allowed',
                        opacity: currentImageIndex < sampleDataList.length - 1 ? 1 : 0.3,
                        color: '#fff', fontSize: '20px',
                        zIndex: 100
                     }}
                   >
                     <IconRight />
                   </div>
                   {/* Indicator */}
                   <div style={{ position: 'absolute', top: '-30px', color: '#fff', opacity: 0.8 }}>
                      {currentImageIndex + 1} / {sampleDataList.length}
                   </div>
                </>
             )}

           {/* Card Container */}
           <div style={{ marginBottom: '32px' }}>
             {sampleDataList.length > 0 && (
               <div ref={cardRef} style={{
                 width: '375px',
                 height: '667px',
                 backgroundImage: 'url(/assets/priceCard.jpg)',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 borderRadius: '24px',
                 position: 'relative',
                 fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
                 color: '#fff',
                 overflow: 'hidden',
                 boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                 display: 'flex',
                 flexDirection: 'column',
                 padding: '24px 20px'
               }}>
                  {/* Logo Layer (Top Left) - 高度调整为24px */}
                  <div style={{ 
                      position: 'absolute', top: '24px', left: '-4px',
                      width: '400px', height: '72px', 
                      backgroundImage: 'url(/assets/cargowarexlogolight.png)',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} />

                  {/* Top Right Info Block */}
                  <div style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', 
                      marginLeft: 'auto', marginTop: '4px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)' 
                  }}>
                      {/* Ship Company & Logo */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <img 
                              src="https://ts4.tc.mm.bing.net/th/id/ODF.2amFCOxZyxiK1y-0iilEXA?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" 
                              alt="Carrier"
                              style={{ width: '16px', height: '16px', borderRadius: '2px', marginRight: '6px', backgroundColor: '#fff' }} 
                          />
                          <span style={{ fontSize: '14px', fontWeight: 600 }}>{sampleDataList[currentImageIndex].shipCompany}</span>
                      </div>
                      
                      {/* Vessel / Voyage */}
                      <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '2px' }}>
                          {sampleDataList[currentImageIndex].vesselVoyage}
                      </div>

                      {/* Route Code (Smaller) */}
                      <div style={{ 
                          fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginTop: '2px', // 字号减小
                          background: 'rgba(255,255,255,0.2)', padding: '0 6px', borderRadius: '4px',
                          backdropFilter: 'blur(4px)'
                      }}>
                          {sampleDataList[currentImageIndex].routeCode}
                      </div>
                  </div>

                  {/* Upper Half: Ports & Schedule */}
                  <div style={{ marginTop: '20px', marginBottom: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {/* POL */}
                          <div style={{ textAlign: 'left', flex: 1, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                              <div style={{ fontSize: '16px', color: '#eee', marginBottom: '2px', opacity: 0.8, fontWeight: 500, fontFamily: 'heiti' }}>起运港</div>
                              <div style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1.2, wordBreak: 'break-word', whiteSpace: 'normal' }}> {/* 字号减小 */}
                                  {sampleDataList[currentImageIndex].departurePort.split(',')[0]}
                              </div>
                              <div style={{ fontSize: '12px', fontWeight: 500, marginTop: '6px', opacity: 0.9 }}>
                                  {sampleDataList[currentImageIndex].etdEta.split('~')[0].trim()}
                              </div>
                          </div>

                          {/* Center Info - 移除了箭头 */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px', opacity: 0.9 }}>
                              <div style={{ fontSize: '12px', marginBottom: '4px' }}>{sampleDataList[currentImageIndex].directTransit}</div>
                              <div style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{sampleDataList[currentImageIndex].transitTime}</div>
                          </div>

                          {/* POD */}
                          <div style={{ textAlign: 'right', flex: 1, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                              <div style={{ fontSize: '16px', color: '#eee', marginBottom: '2px', opacity: 0.8, fontWeight: 500 , fontFamily: 'heiti' }}>目的港</div>
                              <div style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1.2, wordBreak: 'break-word', whiteSpace: 'normal' }}> {/* 字号减小 */}
                                  {sampleDataList[currentImageIndex].destinationPort.split(',')[0]}
                              </div>
                              <div style={{ fontSize: '12px', fontWeight: 500, marginTop: '6px', opacity: 0.9 }}>
                                  {sampleDataList[currentImageIndex].etdEta.split('~')[1]?.trim()}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Bottom Section: Prices & Footer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      
                      {/* Minimalist Price Tags - 3 Columns Grid */}
                      <div style={{ 
                          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px'
                      }}>
                          {sampleDataList[currentImageIndex].oceanFreight.split(',').map((price, idx) => {
                              const parts = price.trim().split(' ');
                              if (parts.length >= 3) {
                                  return (
                                      <div key={idx} style={{ 
                                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                          padding: '6px 4px',
                                          borderRadius: '4px',
                                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                          backdropFilter: 'blur(8px)',
                                          border: '1px solid rgba(255, 255, 255, 0.15)',
                                          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                                      }}>
                                          <span style={{ fontSize: '12px', fontWeight: 800, opacity: 0.9, letterSpacing: '0.5px', marginBottom: '2px' }}>{parts[0]}</span>
                                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                                              <span style={{ fontSize: '10px', opacity: 0.7, transform: 'scale(0.9)' }}>{parts[1]}</span>
                                              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{parts[2]}</span>
                                          </div>
                                      </div>
                                  );
                              }
                              return null;
                          })}
                      </div>

                      {/* Footer Info */}
                      <div style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                          paddingTop: '10px',
                          borderTop: '1px solid rgba(255,255,255,0.15)',
                          fontSize: '10px', opacity: 0.7,
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>
                           <div>
                               <div>报价人: CargoWareX User</div>
                               <div style={{ marginTop: '2px' }}>138-0013-8000</div>
                           </div>
                           <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                               {currentImageTime}
                           </div>
                      </div>
                  </div>
               </div>
             )}
           </div>
           
           {/* Actions */}
           <div style={{ display: 'flex', gap: '24px' }}>
             <div 
                onClick={() => setImagePreviewVisible(false)}
                style={{ 
                    cursor: 'pointer',
                    width: '48px', height: '48px', borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', transition: 'all 0.2s',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
             >
                <IconClose style={{ fontSize: '20px' }} />
             </div>
             <div 
                onClick={handleDownloadImage}
                style={{ 
                    cursor: 'pointer',
                    height: '48px', padding: '0 32px', borderRadius: '24px',
                    background: '#165DFF', boxShadow: '0 4px 12px rgba(22, 93, 255, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 'bold', fontSize: '15px', gap: '8px'
                }}
             >
                <IconDownload /> 保存图片
             </div>
             {sampleDataList.length > 1 && (
                <div 
                    onClick={handleDownloadAllImages}
                    style={{ 
                        cursor: 'pointer',
                        height: '48px', padding: '0 32px', borderRadius: '24px',
                        background: '#00B42A', boxShadow: '0 4px 12px rgba(0, 180, 42, 0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 'bold', fontSize: '15px', gap: '8px'
                    }}
                >
                    <IconDownload /> 保存全部
                </div>
             )}
           </div>
        </div>
      </Modal>
    </>
  );
};

export default BatchQuoteModal;