import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Button, 
  Grid, 
  Card, 
  Select, 
  Typography,
  Space,
  Empty,
  List,
  Tooltip,
  Checkbox,
  Radio,
  Drawer,
  Message,
  Modal
} from '@arco-design/web-react';
import { 
  IconLeft, 
  IconInfoCircle, 
  IconSearch, 
  IconPlus, 
  IconApps, 
  IconCopy, 
  IconDelete, 
  IconDragDotVertical 
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import styled, { keyframes, css } from 'styled-components';
import dayjs from 'dayjs';

const { Row, Col } = Grid;
const { Title } = Typography;
const { Option } = Select;

// Breathing animation for the "Day/Week" toggle
const breatheAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(22, 93, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(22, 93, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 93, 255, 0); }
`;

const BreathingButton = styled(Button)<{ isActive?: boolean }>`
  ${props => props.isActive && css`
    animation: ${breatheAnimation} 2s infinite;
  `}
`;

const RankingListContainer = styled.div<{ expanded: boolean }>`
  position: absolute;
  top: 60px;
  right: 16px;
  width: ${props => props.expanded ? '250px' : '60px'};
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s;
  max-height: ${props => props.expanded ? '400px' : '40px'};
  overflow: hidden;
  border: 1px solid #eee;
`;

const RankingHeader = styled.div<{ expanded: boolean }>`
  padding: 8px 12px;
  background: #f7f8fa;
  border-bottom: ${props => props.expanded ? '1px solid #eee' : 'none'};
  display: flex;
  justify-content: ${props => props.expanded ? 'space-between' : 'center'};
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  height: 40px;
  white-space: nowrap;
  
  &:hover {
    color: #1890ff;
  }
`;

const RankingContent = styled.div`
  max-height: 360px;
  overflow-y: auto;
`;

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  font-size: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  
  &:last-child {
    margin-right: 0;
  }
`;

const LegendCircle = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 4px;
`;

const AddCompareButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 100;
  opacity: 0;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ChartCardContainer = styled(Card)`
  &:hover ${AddCompareButton} {
    opacity: 1;
  }
`;

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  background: #fff;
  padding: 8px 8px 40px 8px; // Increase bottom padding to accommodate toolbar
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ChartToolbar = styled.div`
  position: absolute;
  bottom: 8px; // Move to bottom
  right: 8px; // Keep at right
  display: flex;
  gap: 4px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 2px;
`;

const containerOptions = [
  '20FR', '40FR', '20GP', '40GP', '20HC', '40HC', '45HC', 
  '20NOR', '40NOR', '20OT', '40OT', '20TK', '40TK'
];

// Mock data generator for Hot Routes with detailed info
const generateHotRoutesData = (period: 'day' | 'week', containerType: string) => {
  // Mock data logic
  const routes = [
    { 
      origin: 'Shanghai', originCode: 'CNSHA', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Los Angeles', destCode: 'USLAX', destCountry: 'USA', destCountryCode: 'US',
      basePrice: 1500, change: 0.05 
    },
    { 
      origin: 'Ningbo', originCode: 'CNNGB', originCountry: 'China', originCountryCode: 'CN',
      dest: 'New York', destCode: 'USNYC', destCountry: 'USA', destCountryCode: 'US',
      basePrice: 2800, change: -0.02 
    },
    { 
      origin: 'Shenzhen', originCode: 'CNSZX', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Hamburg', destCode: 'DEHAM', destCountry: 'Germany', destCountryCode: 'DE',
      basePrice: 1200, change: 0.00 
    },
    { 
      origin: 'Qingdao', originCode: 'CNQIN', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Rotterdam', destCode: 'NLRTM', destCountry: 'Netherlands', destCountryCode: 'NL',
      basePrice: 1300, change: 0.10 
    },
    { 
      origin: 'Shanghai', originCode: 'CNSHA', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Felixstowe', destCode: 'GBFXT', destCountry: 'UK', destCountryCode: 'GB',
      basePrice: 1600, change: -0.05 
    },
    { 
      origin: 'Ningbo', originCode: 'CNNGB', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Singapore', destCode: 'SGSIN', destCountry: 'Singapore', destCountryCode: 'SG',
      basePrice: 300, change: 0.01 
    },
    { 
      origin: 'Shenzhen', originCode: 'CNYTN', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Oakland', destCode: 'USOAK', destCountry: 'USA', destCountryCode: 'US',
      basePrice: 1450, change: -0.01 
    },
    { 
      origin: 'Shanghai', originCode: 'CNSHA', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Shenzhen', destCode: 'CNSZX', destCountry: 'China', destCountryCode: 'CN',
      basePrice: 100, change: 0.00 
    },
    { 
      origin: 'Qingdao', originCode: 'CNQIN', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Tokyo', destCode: 'JPTYO', destCountry: 'Japan', destCountryCode: 'JP',
      basePrice: 200, change: 0.03 
    },
    { 
      origin: 'Shenzhen', originCode: 'CNYTN', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Melbourne', destCode: 'AUMEL', destCountry: 'Australia', destCountryCode: 'AU',
      basePrice: 900, change: -0.08 
    },
    { 
      origin: 'Shanghai', originCode: 'CNSHA', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Vancouver', destCode: 'CAVAN', destCountry: 'Canada', destCountryCode: 'CA',
      basePrice: 1400, change: 0.02 
    },
    { 
      origin: 'Ningbo', originCode: 'CNNGB', originCountry: 'China', originCountryCode: 'CN',
      dest: 'Long Beach', destCode: 'USLGB', destCountry: 'USA', destCountryCode: 'US',
      basePrice: 1550, change: 0.04 
    },
  ];

  // Randomize frequency for bubble size
  return routes.map((route, index) => ({
    ...route,
    id: `route-${index}`,
    name: `${route.origin} - ${route.dest}`,
    frequency: Math.floor(Math.random() * 100), // 0-100%
    price: Math.max(0, route.basePrice + (containerType === '40HC' ? 0 : Math.random() * 500 - 250)) // Ensure price > 0
  })).sort((a, b) => b.frequency - a.frequency);
};

// Mock data generator for Hot Shipping Lines
const generateHotShippingLinesData = (period: 'day' | 'week', containerType: string) => {
  const lines = [
    { name: 'COSCO', logo: 'COSCO', basePrice: 1400, change: 0.05 },
    { name: 'MAERSK', logo: 'MAERSK', basePrice: 1600, change: -0.03 },
    { name: 'MSC', logo: 'MSC', basePrice: 1550, change: 0.01 },
    { name: 'CMA CGM', logo: 'CMA', basePrice: 1500, change: -0.01 },
    { name: 'EVERGREEN', logo: 'EMC', basePrice: 1300, change: 0.08 },
    { name: 'ONE', logo: 'ONE', basePrice: 1450, change: -0.05 },
    { name: 'HAPAG-LLOYD', logo: 'HPL', basePrice: 1650, change: 0.00 },
    { name: 'HMM', logo: 'HMM', basePrice: 1350, change: 0.02 },
    { name: 'YANG MING', logo: 'YML', basePrice: 1250, change: -0.02 },
    { name: 'ZIM', logo: 'ZIM', basePrice: 1420, change: 0.04 },
    { name: 'PIL', logo: 'PIL', basePrice: 1200, change: 0.00 },
    { name: 'WAN HAI', logo: 'WHL', basePrice: 1150, change: 0.01 },
  ];

  return lines.map((line, index) => {
    // Generate top 3 routes for this line with some randomness based on period
    const multiplier = period === 'week' ? 1.1 : 1.0;
    const topRoutes = [
      { origin: 'Shanghai', dest: 'Los Angeles', price: Math.floor((line.basePrice + 100) * multiplier) },
      { origin: 'Ningbo', dest: 'New York', price: Math.floor((line.basePrice + 300) * multiplier) },
      { origin: 'Shenzhen', dest: 'Hamburg', price: Math.floor((line.basePrice + 200) * multiplier) },
    ];

    return {
      ...line,
      id: `line-${index}`,
      frequency: Math.floor((Math.random() * 80 + 20) * multiplier) > 100 ? 100 : Math.floor((Math.random() * 80 + 20) * multiplier), // 20-100%
      price: Math.max(0, line.basePrice + (containerType === '40HC' ? 0 : Math.random() * 400 - 200)),
      topRoutes
    };
  }).sort((a, b) => b.frequency - a.frequency);
};

// Mock data generator for Freight Index
const generateFreightIndexData = () => {
  const routes = [
    { name: '亚洲线', color: '#7cb5ec' },
    { name: '非洲线', color: '#8085e9' },
    { name: '美加线', color: '#f7a35c' },
    { name: '欧地线', color: '#90ed7d' },
    { name: '拉美线', color: '#f15c80' },
    { name: '澳新线', color: '#2b908f' }
  ];

  // From year before last (2024-01-01) to yesterday (2026-01-22)
  const startDate = dayjs().subtract(2, 'year').startOf('year');
  const endDate = dayjs().subtract(1, 'day');
  const days = endDate.diff(startDate, 'day') + 1;

  const data: any[] = [];
  
  // Initial values
  const currentValues: { [key: string]: number } = {
    '亚洲线': 800,
    '非洲线': 1200,
    '美加线': 1500,
    '欧地线': 1300,
    '拉美线': 1400,
    '澳新线': 1000
  };

  for (let i = 0; i < days; i++) {
    const date = startDate.add(i, 'day').format('YYYY-MM-DD');
    const dayData: any = { date };

    routes.forEach(route => {
      // Random walk
      const change = (Math.random() - 0.5) * 50;
      currentValues[route.name] = Math.max(0, currentValues[route.name] + change);
      
      // Introduce some missing data (1% chance)
      if (Math.random() > 0.01) {
        dayData[route.name] = Math.round(currentValues[route.name]);
      }
    });

    data.push(dayData);
  }

  return { routes, data };
};

// Mock data generator for Route Freight Trend
const generateFreightTrendData = (containerType: string) => {
  const carriers = [
    { name: 'CNC', color: '#1f77b4' },
    { name: 'ZIN', color: '#ff7f0e' },
    { name: 'MAERSK', color: '#2ca02c' },
    { name: 'OOCL', color: '#d62728' },
    { name: 'HPL_SPOT', color: '#9467bd' },
    { name: 'EMC', color: '#8c564b' },
    { name: 'ZIM', color: '#e377c2' },
    { name: 'CMA', color: '#7f7f7f' },
    { name: 'COSCO', color: '#bcbd22' },
    { name: 'HPL_QQ', color: '#17becf' },
    { name: 'MSC', color: '#aec7e8' },
    { name: 'ONE', color: '#ffbb78' },
    { name: 'HMM', color: '#98df8a' }
  ];

  // Current year data
  const currentStart = dayjs().subtract(1, 'year');
  const currentEnd = dayjs().add(14, 'day'); // Future data
  const days = currentEnd.diff(currentStart, 'day') + 1;

  const data: any[] = [];
  
  // Initialize carrier prices
  const carrierPrices: { [key: string]: number } = {};
  carriers.forEach(c => carrierPrices[c.name] = 1000 + Math.random() * 2000);

  // Helper to generate trend data
  const generateSeries = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, suffix: string = '') => {
    const seriesData: any[] = [];
    const seriesDays = endDate.diff(startDate, 'day') + 1;
    
    // Reset prices for new series simulation
    const prices: { [key: string]: number } = {};
    carriers.forEach(c => prices[c.name] = 1000 + Math.random() * 2000);

    for (let i = 0; i < seriesDays; i++) {
      const date = startDate.add(i, 'day').format('YYYY-MM-DD');
      const dayData: any = { date };

      carriers.forEach(c => {
         // Random walk
         const change = (Math.random() - 0.5) * 100;
         prices[c.name] = Math.max(500, prices[c.name] + change);
         
         // Data availability (some days missing)
         if (Math.random() > 0.3) {
           dayData[c.name + suffix] = Math.round(prices[c.name]);
         }
      });
      seriesData.push(dayData);
    }
    return seriesData;
  };

  const currentData = generateSeries(currentStart, currentEnd);

  return { carriers, data: currentData };
};

// --- Sub-Components for Comparison ---

interface ChartProps {
  initialPeriod?: 'day' | 'week';
  initialContainerType?: string;
  initialOrigin?: string;
  initialFilterMode?: 'route' | 'pod';
  initialTarget?: string;
  initialSelectedCarriers?: string[];
  isComparisonView?: boolean;
  onAddToCompare?: (e: React.MouseEvent, state: any) => void;
  style?: React.CSSProperties;
}

const HotRoutesChart: React.FC<ChartProps> = ({ 
  initialPeriod = 'day', 
  initialContainerType = '40HC', 
  isComparisonView = false, 
  onAddToCompare,
  style 
}) => {
  const [period, setPeriod] = useState<'day' | 'week'>(initialPeriod);
  const [containerType, setContainerType] = useState(initialContainerType);
  const [isRankingExpanded, setIsRankingExpanded] = useState(false);
  const chartRef = useRef<any>(null);

  const data = useMemo(() => generateHotRoutesData(period, containerType), [period, containerType]);
  const top10Data = data.slice(0, 10);
  const maxFrequency = useMemo(() => Math.max(...top10Data.map(d => d.frequency), 1), [top10Data]);
  const avgFrequency = useMemo(() => top10Data.length ? top10Data.reduce((acc, curr) => acc + curr.frequency, 0) / top10Data.length : 0, [top10Data]);
  const avgPrice = useMemo(() => top10Data.length ? top10Data.reduce((acc, curr) => acc + curr.price, 0) / top10Data.length : 0, [top10Data]);

  const handleRankingHover = (index: number) => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: index });
      chartInstance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: index });
    }
  };

  const handleRankingLeave = (index: number) => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: index });
      chartInstance.dispatchAction({ type: 'hideTip' });
    }
  };

  const getOption = () => {
    if (top10Data.length === 0) return {};
    return {
      title: { text: '', left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const { data } = params;
          const item = top10Data.find(d => d.name === data[3]);
          if (!item) return '';
          const trendText = item.change > 0.01 ? '上涨' : item.change < -0.01 ? '下跌' : '持平';
          const trendColor = item.change > 0.01 ? 'red' : item.change < -0.01 ? 'green' : 'gray';
          return `
            <div style="text-align: left;">
              <b>航线信息:</b><br/>
              起运港: ${item.origin} (${item.originCode}), ${item.originCountry} (${item.originCountryCode})<br/>
              目的港: ${item.dest} (${item.destCode}), ${item.destCountry} (${item.destCountryCode})<br/>
              <hr style="margin: 5px 0; border: 0; border-top: 1px solid #eee;"/>
              平均价格: $${item.price.toFixed(2)}<br/>
              查询热度: ${item.frequency}%<br/>
              环比变化: <span style="color:${trendColor}">${(item.change * 100).toFixed(1)}% (${trendText})</span>
            </div>
          `;
        }
      },
      grid: { left: '2%', right: '15%', bottom: '5%', top: '15%', containLabel: true },
      xAxis: { type: 'value', name: '查询频率 (%)', min: 0, max: 100, splitLine: { show: false } },
      yAxis: { type: 'value', name: '平均运价 ($)', scale: true, min: 0, splitLine: { show: false } },
      series: [{
        type: 'scatter',
        symbolSize: (data: any) => Math.max((data[0] / maxFrequency) * 60, 20),
        data: top10Data.map(item => [item.frequency, item.price, item.change, item.name]),
        itemStyle: {
          color: (params: any) => {
            const change = params.data[2];
            if (change > 0.01) return 'rgba(255, 99, 71, 0.6)';
            if (change < -0.01) return 'rgba(144, 238, 144, 0.6)';
            return 'rgba(169, 169, 169, 0.6)';
          }
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
        label: {
          show: true,
          formatter: (params: any) => params.data[3],
          position: 'inside',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 4,
          padding: [2, 4],
          color: '#333',
          fontWeight: 'bold'
        },
        markLine: {
          silent: true,
          symbol: ['none', 'none'],
          lineStyle: { type: 'dashed', color: '#999' },
          data: [{ xAxis: avgFrequency, label: { formatter: '平均热度' } }, { yAxis: avgPrice, label: { formatter: '平均价格' } }]
        }
      }]
    };
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    if (onAddToCompare) {
      onAddToCompare(e, { initialPeriod: period, initialContainerType: containerType });
    }
  };

  return (
    <ChartCardContainer 
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>每</span>
            <BreathingButton 
              type="primary" 
              size="small" 
              shape="round"
              isActive={true}
              onClick={() => setPeriod(period === 'day' ? 'week' : 'day')}
              style={{ margin: '0 4px' }}
            >
              {period === 'day' ? '日' : '周'}
            </BreathingButton>
            <span>热门航线</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LegendContainer>
              <LegendItem><LegendCircle color="rgba(255, 99, 71, 0.6)" /><span>上涨</span></LegendItem>
              <LegendItem><LegendCircle color="rgba(144, 238, 144, 0.6)" /><span>下跌</span></LegendItem>
              <LegendItem><LegendCircle color="rgba(169, 169, 169, 0.6)" /><span>持平</span></LegendItem>
            </LegendContainer>
            <Select placeholder="选择箱型" style={{ width: 100 }} value={containerType} onChange={setContainerType} size="small">
              {containerOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
            </Select>
          </div>
        </div>
      }
      style={{ height: '100%', position: 'relative', ...style }}
      bodyStyle={{ height: 'calc(100% - 60px)', padding: 0 }}
    >
      {!isComparisonView && (
        <AddCompareButton onClick={handleAddToCompare}>加入比对</AddCompareButton>
      )}
      {top10Data.length > 0 ? (
        <>
          <ReactECharts ref={chartRef} option={getOption()} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
          <RankingListContainer expanded={isRankingExpanded}>
            <RankingHeader expanded={isRankingExpanded} onClick={() => setIsRankingExpanded(!isRankingExpanded)}>
              {isRankingExpanded ? <><span>TOP 10航线</span><span style={{ fontSize: 12, color: '#1890ff' }}>收起</span></> : <span style={{ fontSize: 12, color: '#1890ff', width: '100%', textAlign: 'center' }}>展开</span>}
            </RankingHeader>
            <RankingContent>
              <List size="small" dataSource={top10Data} render={(item, index) => (
                <List.Item key={index} style={{ cursor: 'pointer', padding: '8px 12px' }} onMouseEnter={() => handleRankingHover(index)} onMouseLeave={() => handleRankingLeave(index)}>
                  <Space>
                    <span style={{ display: 'inline-block', width: 20, height: 20, lineHeight: '20px', textAlign: 'center', backgroundColor: index < 3 ? '#1890ff' : '#f0f0f0', color: index < 3 ? '#fff' : '#666', borderRadius: '50%', fontSize: 12 }}>{index + 1}</span>
                    <span style={{ fontSize: 12 }}>{item.name}</span>
                  </Space>
                </List.Item>
              )} />
            </RankingContent>
          </RankingListContainer>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Empty description="无匹配信息" />
        </div>
      )}
    </ChartCardContainer>
  );
};

const HotCarriersChart: React.FC<ChartProps> = ({ 
  initialPeriod = 'day', 
  initialContainerType = '40HC', 
  isComparisonView = false, 
  onAddToCompare,
  style 
}) => {
  const [period, setPeriod] = useState<'day' | 'week'>(initialPeriod);
  const [containerType, setContainerType] = useState(initialContainerType);
  const [isRankingExpanded, setIsRankingExpanded] = useState(false);
  const chartRef = useRef<any>(null);

  const data = useMemo(() => generateHotShippingLinesData(period, containerType), [period, containerType]);
  const top10Data = data.slice(0, 10);
  const maxFrequency = useMemo(() => Math.max(...top10Data.map(d => d.frequency), 1), [top10Data]);
  const avgFrequency = useMemo(() => top10Data.length ? top10Data.reduce((acc, curr) => acc + curr.frequency, 0) / top10Data.length : 0, [top10Data]);
  const avgPrice = useMemo(() => top10Data.length ? top10Data.reduce((acc, curr) => acc + curr.price, 0) / top10Data.length : 0, [top10Data]);

  const handleRankingHover = (index: number) => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: index });
      chartInstance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: index });
    }
  };

  const handleRankingLeave = (index: number) => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: index });
      chartInstance.dispatchAction({ type: 'hideTip' });
    }
  };

  const getOption = () => {
    if (top10Data.length === 0) return {};
    return {
      title: { text: '', left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const { data } = params;
          const item = top10Data.find(d => d.name === data[3]);
          if (!item) return '';
          const trendText = item.change > 0.01 ? '上涨' : item.change < -0.01 ? '下跌' : '持平';
          const trendColor = item.change > 0.01 ? 'red' : item.change < -0.01 ? 'green' : 'gray';
          const routesHtml = item.topRoutes.map((route: any, i: number) => 
            `<div style="font-size: 12px; margin-top: 2px;">${i+1}. ${route.origin} - ${route.dest}: $${route.price}</div>`
          ).join('');
          return `
            <div style="text-align: left;">
              <b>${item.name}</b><br/>
              <hr style="margin: 5px 0; border: 0; border-top: 1px solid #eee;"/>
              <b>热门航线:</b><br/>${routesHtml}
              <hr style="margin: 5px 0; border: 0; border-top: 1px solid #eee;"/>
              平均价格: $${item.price.toFixed(2)}<br/>
              环比变化: <span style="color:${trendColor}">${(item.change * 100).toFixed(1)}% (${trendText})</span>
            </div>
          `;
        }
      },
      grid: { left: '2%', right: '15%', bottom: '5%', top: '15%', containLabel: true },
      xAxis: { type: 'value', name: '查询频率 (%)', min: 0, max: 100, splitLine: { show: false } },
      yAxis: { type: 'value', name: '平均运价 ($)', scale: true, min: 0, splitLine: { show: false } },
      series: [{
        type: 'scatter',
        symbolSize: (data: any) => Math.max((data[0] / maxFrequency) * 60, 20),
        data: top10Data.map(item => [item.frequency, item.price, item.change, item.name]),
        itemStyle: {
          color: (params: any) => {
            const change = params.data[2];
            if (change > 0.01) return 'rgba(255, 99, 71, 0.6)';
            if (change < -0.01) return 'rgba(144, 238, 144, 0.6)';
            return 'rgba(169, 169, 169, 0.6)';
          }
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
        label: {
          show: true,
          formatter: (params: any) => params.data[3],
          position: 'inside',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: 4,
          padding: [4, 8],
          color: '#333',
          fontWeight: 'bold'
        },
        markLine: {
          silent: true,
          symbol: ['none', 'none'],
          lineStyle: { type: 'dashed', color: '#999' },
          data: [{ xAxis: avgFrequency, label: { formatter: '平均热度' } }, { yAxis: avgPrice, label: { formatter: '平均价格' } }]
        }
      }]
    };
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    if (onAddToCompare) {
      onAddToCompare(e, { initialPeriod: period, initialContainerType: containerType });
    }
  };

  return (
    <ChartCardContainer 
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>每</span>
            <BreathingButton 
              type="primary" 
              size="small" 
              shape="round"
              isActive={true}
              onClick={() => setPeriod(period === 'day' ? 'week' : 'day')}
              style={{ margin: '0 4px' }}
            >
              {period === 'day' ? '日' : '周'}
            </BreathingButton>
            <span>热门船司</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LegendContainer>
              <LegendItem><LegendCircle color="rgba(255, 99, 71, 0.6)" /><span>上涨</span></LegendItem>
              <LegendItem><LegendCircle color="rgba(144, 238, 144, 0.6)" /><span>下跌</span></LegendItem>
              <LegendItem><LegendCircle color="rgba(169, 169, 169, 0.6)" /><span>持平</span></LegendItem>
            </LegendContainer>
            <Select placeholder="选择箱型" style={{ width: 100 }} value={containerType} onChange={setContainerType} size="small">
              {containerOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
            </Select>
          </div>
        </div>
      }
      style={{ height: '100%', position: 'relative', ...style }}
      bodyStyle={{ height: 'calc(100% - 60px)', padding: 0 }}
    >
      {!isComparisonView && (
        <AddCompareButton onClick={handleAddToCompare}>加入比对</AddCompareButton>
      )}
      {top10Data.length > 0 ? (
        <>
          <ReactECharts ref={chartRef} option={getOption()} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
          <RankingListContainer expanded={isRankingExpanded}>
            <RankingHeader expanded={isRankingExpanded} onClick={() => setIsRankingExpanded(!isRankingExpanded)}>
              {isRankingExpanded ? <><span>TOP 10船司</span><span style={{ fontSize: 12, color: '#1890ff' }}>收起</span></> : <span style={{ fontSize: 12, color: '#1890ff', width: '100%', textAlign: 'center' }}>展开</span>}
            </RankingHeader>
            <RankingContent>
              <List size="small" dataSource={top10Data} render={(item, index) => (
                <List.Item key={index} style={{ cursor: 'pointer', padding: '8px 12px' }} onMouseEnter={() => handleRankingHover(index)} onMouseLeave={() => handleRankingLeave(index)}>
                  <Space>
                    <span style={{ display: 'inline-block', width: 20, height: 20, lineHeight: '20px', textAlign: 'center', backgroundColor: index < 3 ? '#1890ff' : '#f0f0f0', color: index < 3 ? '#fff' : '#666', borderRadius: '50%', fontSize: 12 }}>{index + 1}</span>
                    <span style={{ fontSize: 12 }}>{item.name}</span>
                  </Space>
                </List.Item>
              )} />
            </RankingContent>
          </RankingListContainer>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Empty description="无匹配信息" />
        </div>
      )}
    </ChartCardContainer>
  );
};

const FreightIndexChart: React.FC<ChartProps> = ({ isComparisonView = false, onAddToCompare, style }) => {
  const freightIndexData = useMemo(() => generateFreightIndexData(), []);
  
  const getOption = () => {
    const { routes, data } = freightIndexData;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
        formatter: (params: any[]) => {
          if (!params.length) return '';
          const date = params[0].axisValue;
          const sortedParams = [...params].sort((a, b) => (b.value[1] || 0) - (a.value[1] || 0));
          let tooltipContent = `<div style="text-align: left; font-size: 12px;"><b>${date}</b><br/>`;
          sortedParams.forEach(param => {
            if (param.value[1] !== undefined && param.value[1] !== null) {
              tooltipContent += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                  <div style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 6px;"></span>
                    <span>${param.seriesName}</span>
                  </div>
                  <span style="font-weight: bold; margin-left: 12px;">${param.value[1]}</span>
                </div>
              `;
            }
          });
          tooltipContent += '</div>';
          return tooltipContent;
        }
      },
      legend: { data: routes.map(r => r.name), right: 10, top: 0, type: 'scroll' },
      grid: { left: '3%', right: '2%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: data.map(item => item.date) },
      yAxis: { type: 'value', name: '运价指数', nameLocation: 'end', nameTextStyle: { align: 'left', padding: [0, 0, 0, -20] }, min: 0 },
      dataZoom: [{ type: 'slider', show: true, xAxisIndex: [0], start: 90, end: 100, bottom: 10 }, { type: 'inside', xAxisIndex: [0], start: 90, end: 100 }],
      series: routes.map(route => ({
        name: route.name,
        type: 'line',
        symbol: 'none',
        connectNulls: true,
        lineStyle: { width: 2 },
        itemStyle: { color: route.color },
        data: data.map(item => [item.date, item[route.name]])
      }))
    };
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    if (onAddToCompare) {
      onAddToCompare(e, {});
    }
  };

  return (
    <ChartCardContainer 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>运价指数</span>
          <Tooltip content="只统计从中国出发的运价数据">
            <IconInfoCircle style={{ marginLeft: 8, color: '#86909c', cursor: 'pointer' }} />
          </Tooltip>
        </div>
      }
      style={{ height: '100%', position: 'relative', ...style }}
      bodyStyle={{ height: 'calc(100% - 60px)', padding: 10 }}
    >
      {!isComparisonView && (
        <AddCompareButton onClick={handleAddToCompare}>加入比对</AddCompareButton>
      )}
      <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
    </ChartCardContainer>
  );
};

const FreightTrendChart: React.FC<ChartProps> = ({ 
  initialOrigin = '上海 Shanghai (CNSHA)',
  initialFilterMode = 'route',
  initialTarget = '美加线',
  initialContainerType = '40HC',
  initialSelectedCarriers,
  isComparisonView = false,
  onAddToCompare,
  style
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [filterMode, setFilterMode] = useState<'route' | 'pod'>(initialFilterMode);
  const [target, setTarget] = useState(initialTarget);
  const [containerType, setContainerType] = useState(initialContainerType);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(initialSelectedCarriers || []);
  const [isMerged, setIsMerged] = useState(false);
  const chartRef = useRef<any>(null);

  const freightTrendData = useMemo(() => generateFreightTrendData(containerType), [containerType]);

  // Initialize selected carriers if not provided
  useEffect(() => {
    if (!initialSelectedCarriers && freightTrendData?.carriers) {
      setSelectedCarriers(freightTrendData.carriers.map(c => c.name));
    }
  }, [freightTrendData, initialSelectedCarriers]);

  const getOption = () => {
    const { carriers, data } = freightTrendData;
    const series: any[] = [];
    
    // Check if we need to merge
    if (isMerged) {
      // Calculate average series
      const avgData = data.map(item => {
        let sum = 0;
        let count = 0;
        selectedCarriers.forEach(carrierName => {
          const val = item[carrierName];
          if (val !== undefined && val !== null) {
            sum += val;
            count++;
          }
        });
        return [item.date, count > 0 ? Math.round(sum / count) : null];
      });

      series.push({
        name: '平均运价',
        type: 'line',
        symbol: 'none',
        connectNulls: true,
        lineStyle: { width: 3, color: '#165dff' },
        itemStyle: { color: '#165dff' },
        data: avgData
      });
    } else {
      carriers.forEach(carrier => {
        series.push({
          name: carrier.name,
          type: 'line',
          symbol: 'none',
          connectNulls: true,
          lineStyle: { width: 2 },
          itemStyle: { color: carrier.color },
          data: data.map(item => [item.date, item[carrier.name]])
        });
      });
    }

    const legendSelected: {[key: string]: boolean} = {};
    if (!isMerged) {
      carriers.forEach(c => legendSelected[c.name] = selectedCarriers.includes(c.name));
    }

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    series.forEach(s => {
      // If merged, show the single series. If not, check legendSelected
      if (isMerged || legendSelected[s.name]) {
         s.data.forEach((item: any) => {
           const val = item[1];
           if (val !== undefined && val !== null) {
             if (val < minPrice) minPrice = val;
             if (val > maxPrice) maxPrice = val;
           }
         });
      }
    });
    
    if (minPrice === Infinity) { minPrice = 0; maxPrice = 2000; }
    const yMin = Math.max(0, Math.floor(minPrice - 50));
    const yMax = Math.ceil(maxPrice + 50);

    return {
      tooltip: {
        trigger: 'axis',
        position: function (pos: any, params: any, dom: any, rect: any, size: any) {
          let x = pos[0];
          if (x + size.contentSize[0] > size.viewSize[0]) x = size.viewSize[0] - size.contentSize[0];
          return { left: x, bottom: '10%' };
        },
        formatter: (params: any[]) => {
          if (!params.length) return '';
          const date = params[0].axisValue;
          let content = `<div style="text-align: left; font-size: 12px;"><b>ETD: ${date}</b><br/>`;
          const sortedParams = params.filter(p => p.value[1] !== undefined && p.value[1] !== null).sort((a, b) => b.value[1] - a.value[1]);
          sortedParams.forEach(p => {
             content += `<div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between; min-width: 150px;">
                 <div style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: ${p.color}; margin-right: 6px;"></span>
                    <span style="font-weight: bold;">${p.seriesName}</span>
                 </div>
                 <div style="font-weight: bold;">$${p.value[1]}</div>
               </div>`;
          });
          content += '</div>';
          return content;
        }
      },
      legend: {
        show: !isMerged, // Hide legend when merged
        data: carriers.map(c => c.name),
        right: '2%', top: 40, type: 'scroll', orient: 'vertical', height: '70%', left: '88%',
        selected: legendSelected
      },
      grid: { left: '3%', right: isMerged ? '3%' : '15%', bottom: '15%', top: '10%', containLabel: true }, // Adjust grid when merged
      xAxis: { type: 'category', boundaryGap: false, data: data.map(item => item.date) },
      yAxis: { type: 'value', min: yMin, max: yMax, name: '运价 ($)' },
      dataZoom: [{ type: 'slider', show: true, xAxisIndex: [0], start: 80, end: 100, bottom: 10 }, { type: 'inside', xAxisIndex: [0], start: 80, end: 100 }],
      series: series
    };
  };

  const handleToggleAllCarriers = () => {
    if (selectedCarriers.length === freightTrendData.carriers.length) {
      setSelectedCarriers([]);
    } else {
      setSelectedCarriers(freightTrendData.carriers.map(c => c.name));
    }
  };

  const handleLegendSelectChanged = (e: any) => {
    const newSelected = Object.keys(e.selected).filter(name => e.selected[name]);
    setSelectedCarriers(newSelected);
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    if (onAddToCompare) {
      onAddToCompare(e, { 
        initialOrigin: origin,
        initialFilterMode: filterMode,
        initialTarget: target,
        initialContainerType: containerType,
        initialSelectedCarriers: selectedCarriers
      });
    }
  };

  return (
    <ChartCardContainer 
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>航线运价趋势</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select 
               placeholder="起运港" showSearch style={{ width: 180 }} size="small"
               value={origin} onChange={setOrigin}
               triggerProps={{ autoAlignPopupWidth: false, autoAlignPopupMinWidth: true, position: 'bl' }}
            >
              <Option value="上海 Shanghai (CNSHA)">上海 Shanghai (CNSHA)</Option>
              <Option value="宁波 Ningbo (CNNGB)">宁波 Ningbo (CNNGB)</Option>
              <Option value="深圳 Shenzhen (CNSZX)">深圳 Shenzhen (CNSZX)</Option>
            </Select>
            <div style={{ display: 'flex' }}>
              <Button 
                size="small" type="primary" onClick={() => setFilterMode(filterMode === 'route' ? 'pod' : 'route')} style={{ width: 80, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                {filterMode === 'route' ? '航线' : '目的港'}
              </Button>
              <Select 
                 placeholder={filterMode === 'route' ? '选择航线' : '选择目的港'} showSearch style={{ width: 180, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} size="small"
                 value={target} onChange={setTarget}
                 triggerProps={{ autoAlignPopupWidth: false, autoAlignPopupMinWidth: true, position: 'bl' }}
              >
                {filterMode === 'route' ? (
                  ['亚洲线', '非洲线', '美加线', '欧地线', '拉美线', '澳新线'].map(r => <Option key={r} value={r}>{r}</Option>)
                ) : (
                  ['Los Angeles, USA (USLAX)', 'New York, USA (USNYC)', 'Hamburg, Germany (DEHAM)', 'Rotterdam, Netherlands (NLRTM)'].map(p => <Option key={p} value={p}>{p}</Option>)
                )}
              </Select>
            </div>
            <Select placeholder="箱型" style={{ width: 80 }} value={containerType} onChange={setContainerType} size="small">
              {containerOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
            </Select>
          </div>
        </div>
      }
      style={{ height: '100%', position: 'relative', ...style }}
      bodyStyle={{ height: 'calc(100% - 60px)', padding: 10, position: 'relative' }}
    >
      {!isComparisonView && (
        <AddCompareButton onClick={handleAddToCompare}>加入比对</AddCompareButton>
      )}
      <div style={{ position: 'absolute', top: 10, right: '2%', textAlign: 'center', zIndex: 10, display: 'flex', gap: 8 }}>
        <Button size="mini" type="primary" status={isMerged ? 'success' : 'default'} onClick={() => setIsMerged(!isMerged)} style={{ fontSize: 12 }}>
          {isMerged ? '拆分' : '合并'}
        </Button>
        <Button size="mini" type="secondary" onClick={handleToggleAllCarriers} style={{ fontSize: 12 }}>
          {selectedCarriers.length === freightTrendData.carriers.length ? '全不选' : '全选'}
        </Button>
      </div>
      <ReactECharts 
         ref={chartRef}
         option={getOption()} 
         style={{ height: '100%', width: '100%' }} 
         opts={{ renderer: 'svg' }}
         onEvents={{ 'legendselectchanged': handleLegendSelectChanged }}
       />
    </ChartCardContainer>
  );
};

const FreightRateRanking: React.FC = () => {
  const navigate = useNavigate();
  
  // Chart Comparison State
  const [isCompareDrawerVisible, setIsCompareDrawerVisible] = useState(false);
  const [compareCharts, setCompareCharts] = useState<any[]>([]);
  const [draggedChartIndex, setDraggedChartIndex] = useState<number | null>(null);

  // Animation for "Add to Compare"
  const runFlyingAnimation = (e: React.MouseEvent) => {
    const btn = document.getElementById('compare-floating-btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const startX = e.clientX;
    const startY = e.clientY;

    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = '#165dff'; // Primary color
    dot.style.left = `${startX}px`;
    dot.style.top = `${startY}px`;
    dot.style.zIndex = '9999';
    dot.style.pointerEvents = 'none';
    dot.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    
    document.body.appendChild(dot);

    // Force reflow
    dot.getBoundingClientRect();

    requestAnimationFrame(() => {
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
      dot.style.width = '5px';
      dot.style.height = '5px';
      dot.style.opacity = '0.5';
    });

    setTimeout(() => {
      if (document.body.contains(dot)) {
        document.body.removeChild(dot);
      }
    }, 600);
  };

  // Chart Comparison Logic
  const addToCompare = (e: React.MouseEvent, type: string, state: any) => {
    runFlyingAnimation(e);
    if (compareCharts.length >= 6) {
      Message.warning('最多只能比对6张图表');
      return;
    }
    
    setCompareCharts(prev => [...prev, {
      id: `chart-${Date.now()}-${Math.random()}`,
      type,
      state: JSON.parse(JSON.stringify(state)) // Deep copy state
    }]);
    Message.success('已添加到比对栏');
  };

  const removeFromCompare = (id: string) => {
    setCompareCharts(prev => prev.filter(c => c.id !== id));
  };

  const copyCompareChart = (chart: any) => {
    if (compareCharts.length >= 6) {
      Message.warning('最多只能比对6张图表');
      return;
    }
    setCompareCharts(prev => [...prev, {
      ...chart,
      id: `chart-${Date.now()}-${Math.random()}`
    }]);
  };

  const clearCompareCharts = () => {
    setCompareCharts([]);
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedChartIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedChartIndex === null || draggedChartIndex === index) return;
    
    // Reorder
    const newCharts = [...compareCharts];
    const draggedItem = newCharts[draggedChartIndex];
    newCharts.splice(draggedChartIndex, 1);
    newCharts.splice(index, 0, draggedItem);
    
    setCompareCharts(newCharts);
    setDraggedChartIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedChartIndex(null);
  };

  const getGridStyle = () => {
    const count = compareCharts.length;
    let columns = 1;
    if (count <= 2) columns = 1;
    else if (count <= 6) columns = 2;
    else columns = 3;
    
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridAutoRows: 'minmax(300px, 1fr)',
      gap: '16px',
      height: '100%',
      overflowY: 'auto' as any,
      overflowX: 'hidden' as any,
      padding: '10px'
    };
  };

  const renderComparisonChart = (chart: any) => {
    const commonProps = {
      isComparisonView: true,
      style: { height: '100%', width: '100%' }
    };

    switch (chart.type) {
      case 'ranking':
        return <HotRoutesChart {...commonProps} {...chart.state} />;
      case 'shipping':
        return <HotCarriersChart {...commonProps} {...chart.state} />;
      case 'index':
        return <FreightIndexChart {...commonProps} {...chart.state} />;
      case 'trend':
        return <FreightTrendChart {...commonProps} {...chart.state} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20, height: '100vh', overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Button 
          icon={<IconLeft />} 
          onClick={() => navigate(-1)} 
          type="text"
          style={{ fontSize: 16, marginRight: 8 }}
        >
          返回
        </Button>
        <Title heading={4} style={{ margin: 0 }}>运价榜单</Title>
      </div>

      <Row gutter={[16, 16]} style={{ height: 'calc(100vh - 100px)' }}>
        {/* Chart 1: Hot Routes */}
        <Col span={12} style={{ height: '50%' }}>
          <HotRoutesChart onAddToCompare={(e, state) => addToCompare(e, 'ranking', state)} />
        </Col>

        {/* Chart 2: Hot Carriers (Detailed) */}
        <Col span={12} style={{ height: '50%' }}>
          <HotCarriersChart onAddToCompare={(e, state) => addToCompare(e, 'shipping', state)} />
        </Col>

        {/* Chart 3: Freight Index */}
        <Col span={12} style={{ height: '50%' }}>
          <FreightIndexChart onAddToCompare={(e, state) => addToCompare(e, 'index', state)} />
        </Col>

        {/* Chart 4: Route Freight Trend */}
        <Col span={12} style={{ height: '50%' }}>
          <FreightTrendChart onAddToCompare={(e, state) => addToCompare(e, 'trend', state)} />
        </Col>
      </Row>

      {/* Floating Compare Button */}
      {compareCharts.length > 0 && (
        <Button
          id="compare-floating-btn"
          type="primary"
          shape="circle"
          size="large"
          style={{
            position: 'fixed',
            top: 120,
            right: 20,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            zIndex: 999,
            width: 60,
            height: 60,
            fontSize: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => setIsCompareDrawerVisible(true)}
        >
          <div>比对</div>
          <div style={{ fontSize: 12 }}>{compareCharts.length}</div>
        </Button>
      )}

      {/* Compare Drawer */}
      <Drawer
        width="80%"
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>多表比对 ({compareCharts.length}/6)</span>
            <Space>
               <Button onClick={clearCompareCharts} icon={<IconDelete />}>清空</Button>
               <Button type="primary" onClick={() => setIsCompareDrawerVisible(false)}>关闭</Button>
            </Space>
          </div>
        }
        visible={isCompareDrawerVisible}
        onOk={() => setIsCompareDrawerVisible(false)}
        onCancel={() => setIsCompareDrawerVisible(false)}
        footer={null}
      >
        {compareCharts.length === 0 ? (
           <Empty description="暂无图表，请从左侧添加" />
        ) : (
           <div style={getGridStyle()}>
             {compareCharts.map((chart, index) => (
               <ChartContainer
                 key={chart.id}
                 draggable
                 onDragStart={(e) => handleDragStart(e, index)}
                 onDragOver={(e) => handleDragOver(e, index)}
                 onDragEnd={handleDragEnd}
                 style={{ opacity: draggedChartIndex === index ? 0.5 : 1 }}
               >
                 <ChartToolbar>
                   <IconDragDotVertical style={{ cursor: 'move', marginRight: 4 }} />
                   <Button icon={<IconCopy />} size="mini" onClick={() => copyCompareChart(chart)} />
                   <Button icon={<IconDelete />} size="mini" status="danger" onClick={() => removeFromCompare(chart.id)} />
                 </ChartToolbar>
                 {renderComparisonChart(chart)}
               </ChartContainer>
             ))}
           </div>
        )}
      </Drawer>
    </div>
  );
};

export default FreightRateRanking;