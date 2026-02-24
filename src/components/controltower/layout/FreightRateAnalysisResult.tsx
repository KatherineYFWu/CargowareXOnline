import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Tag, List, Spin, Divider, Button, Modal, Tooltip } from '@arco-design/web-react';
import { IconFullscreen, IconClose, IconInfoCircle } from '@arco-design/web-react/icon';
import ReactECharts from 'echarts-for-react';

const { Title, Paragraph, Text } = Typography;

interface FreightRateAnalysisResultProps {
  context?: any;
}

const FreightRateAnalysisResult: React.FC<FreightRateAnalysisResultProps> = ({ context }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false); // 初始改为false
  const [isWaiting, setIsWaiting] = useState(true); // 新增等待状态
  const [loadingText, setLoadingText] = useState('准备中...');
  const [zoomChart, setZoomChart] = useState<{ option: any, title: string } | null>(null);

  // 模拟开始分析
  const startAnalysis = () => {
    setIsWaiting(false);
    setLoading(true);
    
    // Simulate analysis progress
    const steps = [
      { time: 0, text: '准备中...' },
      { time: 1000, text: '正在收集数据...' },
      { time: 2500, text: '正在分析性价比...' },
      { time: 4000, text: '正在判断价格位势...' },
      { time: 5500, text: '正在预测价格趋势...' },
      { time: 7000, text: '正在对比供需...' },
      { time: 8500, text: '准备输出结论...' }
    ];

    const timers: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setLoadingText(step.text);
        setCurrentStep(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => setLoading(false), 1000);
        }
      }, step.time);
      timers.push(timer);
    });
    
    // Save timers to clear on unmount if needed, but here it's local var.
    // We can use a ref to store timers if we want to clear them on unmount.
  };

  useEffect(() => {
    // 移除原来的自动开始逻辑，改为由用户触发或默认等待
    // 如果需要自动开始，可以在这里判断，但需求说需要显示等待提示
  }, []);

  if (isWaiting) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="flex flex-col items-center justify-center mb-4">
             <Spin dot />
             <div className="mt-4 text-gray-600 font-medium animate-pulse">正在等待全部运价搜索完毕</div>
        </div>
        <Button type="primary" onClick={startAnalysis}>
          立即分析
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <Spin dot />
        <div className="mt-4 text-gray-600 font-medium animate-pulse">{loadingText}</div>
      </div>
    );
  }

  // Determine rate info based on context
  const getRateInfo = () => {
    // Helper to get carrier logo (mock)
    const getLogo = (name: string) => `https://via.placeholder.com/40?text=${name}`;

    if (context?.type === 'row' && context.record) {
      const { record } = context;
      return [{
        id: record.key || '1',
        carrier: record.carrierName || 'COSCO',
        logo: record.carrierLogo || getLogo(record.carrierName || 'COSCO'),
        pol: (record.departurePort || '').split('|')[1] || record.departurePort || 'Shanghai',
        pod: (record.dischargePort || '').split('|')[1] || record.dischargePort || 'Los Angeles',
        routeCode: record.routeCode || 'RT-20240515-001',
        etd: record.etd || '2024-05-20',
        eta: record.eta || '2024-06-05',
        price: record.totalPrice || 2100,
        currency: record.totalCurrency || 'USD',
        transitTime: record.transitTime || 16,
        transitType: record.transitType || '直达',
        recommendationTag: '强烈建议',
        recommendationColor: '#00B42A',
        comment: '性价比之选',
        tags: ['价格低', '直达']
      }];
    }
    
    // Default mock data for filter context or fallback (3-5 recommendations)
    const filters = context?.filters || {};
    const basePol = (filters.departurePort || '').split('|')[1] || filters.departurePort || 'Shanghai';
    const basePod = (filters.dischargePort || '').split('|')[1] || filters.dischargePort || 'Los Angeles';
    
    return [
      {
        id: 'rec1',
        carrier: 'COSCO',
        logo: getLogo('COSCO'),
        pol: basePol,
        pod: basePod,
        routeCode: 'RT-20240520-AI01',
        etd: '2024-05-25',
        eta: '2024-06-10',
        price: 1950,
        currency: 'USD',
        transitTime: 16,
        transitType: '直达',
        recommendationTag: '强烈建议',
        recommendationColor: '#00B42A',
        comment: '综合性价比最高，舱位充足',
        tags: ['高性价比', '船期稳']
      },
      {
        id: 'rec2',
        carrier: 'EMC',
        logo: getLogo('EMC'),
        pol: basePol,
        pod: basePod,
        routeCode: 'RT-20240521-AI02',
        etd: '2024-05-26',
        eta: '2024-06-12',
        price: 1880,
        currency: 'USD',
        transitTime: 17,
        transitType: '直达',
        recommendationTag: '推荐',
        recommendationColor: '#165DFF',
        comment: '市场最低价，适合价格敏感型',
        tags: ['超低价', '直达']
      },
      {
        id: 'rec3',
        carrier: 'MSC',
        logo: getLogo('MSC'),
        pol: basePol,
        pod: basePod,
        routeCode: 'RT-20240523-AI03',
        etd: '2024-05-28',
        eta: '2024-06-15',
        price: 1750,
        currency: 'USD',
        transitTime: 18,
        transitType: '中转',
        recommendationTag: '观望',
        recommendationColor: '#FF7D00',
        comment: '虽然中转但价格极具优势',
        tags: ['中转优惠', '大船司']
      }
    ];
  };

  const rateRecommendations = getRateInfo();
  const primaryRate = rateRecommendations[0];

  // --- Chart Data Preparation ---

  // 1. Cost-effectiveness Data
  // Generate random scatter points
  const generateRandomCEData = () => {
    const data: any[] = [];
    const carriers = ['CMA', 'ONE', 'HMM', 'ZIM', 'HPL', 'YML', 'OOCL', 'WHL', 'PIL', 'KMTC'];
    for (let i = 0; i < 20; i++) {
      const transitTime = 14 + Math.floor(Math.random() * 10); // 14-23 days
      const price = 1500 + Math.floor(Math.random() * 1000); // 1500-2500 USD
      const carrier = carriers[i % carriers.length];
      data.push([
        transitTime, 
        price, 
        carrier,
        // Add extra fields for tooltip
        {
          pol: primaryRate.pol,
          pod: primaryRate.pod,
          type: Math.random() > 0.5 ? '直达' : '中转',
          eta: `2024-06-${10 + Math.floor(Math.random()*15)}`,
          etd: `2024-05-${20 + Math.floor(Math.random()*10)}`
        }
      ]);
    }
    // Add recommendations
    rateRecommendations.forEach(r => {
        // Ensure unique coordinates or just add them
        data.push([
          r.transitTime, 
          r.price, 
          r.carrier,
          {
            pol: r.pol,
            pod: r.pod,
            type: r.transitType,
            eta: r.eta,
            etd: r.etd
          }
        ]);
    });
    return data;
  };
  
  const ceData = generateRandomCEData();
  
  // Calculate ranges for axes
  const durations = ceData.map(d => d[0] as number);
  const prices = ceData.map(d => d[1] as number);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Perpendicular line logic based on linear regression perpendicularity
  // 1. Calculate the center of mass (centroid) of all points
  const n = ceData.length;
  const avgX = ceData.reduce((sum, p) => sum + (p[0] as number), 0) / n;
  const avgY = ceData.reduce((sum, p) => sum + (p[1] as number), 0) / n;

  // 2. Calculate the regression line (ray from origin to points)
   // We want a ray from origin y = k_ray * x that best fits the data in a "ray" sense.
   // Or simply the ray passing through the centroid: k_ray = avgY / avgX.
   // This represents the "average" price-performance ratio.
   const k_ray = avgY / avgX;
 
   // 3. Calculate the perpendicular slope
   // To make the line visually perpendicular in the chart (where axes have different scales),
   // we should normalize the slope based on the visual aspect ratio or data ranges.
   // Using the "Steep" slope (-avgY / avgX) effectively normalizes the trade-off.
   const k = -avgY / avgX;
   const b = avgY - k * avgX; // y = kx + b => b = y - kx
 
   // Calculate graph boundaries
   const xMin = minDuration - 1;
   const xMax = maxDuration + 1;
   const yMin = minPrice - 50;
   const yMax = maxPrice + 50;

   // Calculate intersection points with the 4 boundaries
   const points = [];
   
   // 1. Intersection with Left (x = xMin)
   const y1 = k * xMin + b;
   if (y1 >= yMin && y1 <= yMax) points.push([xMin, y1]);

   // 2. Intersection with Right (x = xMax)
   const y2 = k * xMax + b;
   if (y2 >= yMin && y2 <= yMax) points.push([xMax, y2]);

   // 3. Intersection with Bottom (y = yMin)
   if (k !== 0) {
       const x3 = (yMin - b) / k;
       if (x3 >= xMin && x3 <= xMax) points.push([x3, yMin]);
   }

   // 4. Intersection with Top (y = yMax)
   if (k !== 0) {
       const x4 = (yMax - b) / k;
       if (x4 >= xMin && x4 <= xMax) points.push([x4, yMax]);
   }

   // Sort points by X to get the segment
   points.sort((a, b) => a[0] - b[0]);
   
   // Use the first and last unique points found (should be 2 for a line crossing the box)
   const validPoints = points.length >= 2 ? [points[0], points[points.length - 1]] : [
       [xMin, k * xMin + b],
       [xMax, k * xMax + b]
   ];

   const markLineData = [
     [
       { coord: validPoints[0], symbol: 'none' },
       { coord: validPoints[1], symbol: 'none' }
     ]
   ];

  // 2. Price Position Data

  // 2. Price Position Data
  // Generate 20 scatter points for boxplot
  const ppScatterData = Array.from({ length: 20 }, (_, i) => {
    // Make sure we include our recommended rates in the distribution logic or explicitly
    if (i < rateRecommendations.length) {
        return [0, rateRecommendations[i].price, rateRecommendations[i].carrier, {
            pol: rateRecommendations[i].pol,
            pod: rateRecommendations[i].pod,
            type: rateRecommendations[i].transitType,
            eta: rateRecommendations[i].eta,
            etd: rateRecommendations[i].etd,
            transitTime: rateRecommendations[i].transitTime
        }];
    }
    const price = primaryRate.price + (Math.random() - 0.5) * 800;
    return [0, Math.floor(price), 'Market', {
        pol: primaryRate.pol,
        pod: primaryRate.pod,
        type: Math.random() > 0.5 ? '直达' : '中转',
        eta: `2024-06-${10 + Math.floor(Math.random()*15)}`,
        etd: `2024-05-${20 + Math.floor(Math.random()*10)}`,
        transitTime: 14 + Math.floor(Math.random() * 10)
    }];
  });
  const ppValues = ppScatterData.map(d => d[1] as number).sort((a, b) => a - b);
  const ppMin = Math.min(...ppValues) - 50;
  const ppMax = Math.max(...ppValues) + 50;
  
  // Calculate Percentiles
  const getPercentile = (val: number, data: number[]) => {
      const sorted = [...data].sort((a, b) => a - b);
      const index = sorted.findIndex(v => v >= val);
      return Math.round((index / sorted.length) * 100);
  };

  // 3. Trend Data
  const trendHistoryDates = ['-7天', '-6天', '-5天', '-4天', '-3天', '-2天', '今天'];
  const trendFutureDates = ['今天', '+1天', '+2天', '+3天'];
  const trendXAxis = [...trendHistoryDates, ...trendFutureDates.slice(1)];

  // 4. Supply Demand Data (Multi-series)
  const supplyDemandSeries: any[] = [];
  const supplyDemandLegends = rateRecommendations.map((_, i) => `AI推荐${i + 1}`);
  
  rateRecommendations.forEach((r, index) => {
      // Mock Data
      const tightnessData = Array(7).fill(0).map((_, i) => Math.min(100, Math.floor(40 + i * 5 + Math.random() * 20)));
      const volumeData = Array(7).fill(0).map((_, i) => Math.floor(100 + i * 30 + Math.random() * 50));
      
      // Line Series (Tightness)
      supplyDemandSeries.push({
          name: `AI推荐${index + 1}`,
          type: 'line',
          data: tightnessData,
          yAxisIndex: 0,
          itemStyle: { color: ['#00B42A', '#F7BA1E', '#165DFF'][index % 3] },
          showSymbol: true
      });
      
      // Bar Series (Volume)
      supplyDemandSeries.push({
          name: `AI推荐${index + 1}`,
          type: 'bar',
          data: volumeData,
          yAxisIndex: 1,
          itemStyle: { color: ['#00B42A', '#F7BA1E', '#165DFF'][index % 3], opacity: 0.3 }
      });
  });

  // Charts Options
  const costEffectivenessOption = {
    title: { text: '船司性价比', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { 
      trigger: 'item',
      formatter: (params: any) => {
        if (params.componentType === 'markLine') return '性价比分界线';
        const [x, y, name, details] = params.data;
        if (!details) return '';
        
        return `
          <div style="text-align: left; padding: 4px;">
            <div style="font-weight: bold; border-bottom: 1px solid #f2f3f5; padding-bottom: 4px; margin-bottom: 4px;">${name}</div>
            <div><span style="color: #86909c">起运港:</span> ${details.pol}</div>
            <div><span style="color: #86909c">目的港:</span> ${details.pod}</div>
            <div><span style="color: #86909c">类型:</span> ${details.type}</div>
            <div><span style="color: #86909c">ETA:</span> ${details.eta}</div>
            <div><span style="color: #86909c">ETD:</span> ${details.etd}</div>
            <div style="margin-top: 6px; font-weight: bold; color: #165DFF">航程: ${x} 天</div>
            <div style="font-weight: bold; color: #F53F3F">运价: $${y}</div>
          </div>
        `;
      }
    },
    grid: { top: 40, bottom: 20, left: 50, right: 30, containLabel: true },
    xAxis: { 
      type: 'value', 
      name: '航程(天)', 
      nameLocation: 'middle', 
      nameGap: 25,
      min: minDuration - 1,
      max: maxDuration + 1
    },
    yAxis: { 
      type: 'value', 
      name: '运价($)', 
      nameLocation: 'middle', 
      nameGap: 50,
      min: minPrice - 50,
      max: maxPrice + 50
    },
    series: [{
      type: 'scatter',
      data: ceData,
      itemStyle: { 
        color: (params: any) => {
          const carrier = params.data[2];
          // AI recommended (primary) is Green, others Blue
          // Check if it is in rateRecommendations list
          const isRecommended = rateRecommendations.some(r => r.carrier === carrier);
          return isRecommended ? '#00B42A' : '#165DFF';
        }
      },
      markLine: {
        symbol: 'none',
        lineStyle: { type: 'dashed', color: '#FF7D00' },
        label: { 
            formatter: '性价比分界线', 
            position: 'insideStartBottom', 
            color: '#000',
            padding: [4, 8],
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            rotate: 0, // Ensure horizontal
            borderWidth: 1,
            borderColor: '#FF7D00'
        },
        data: markLineData
      }
    }]
  };

  const pricePositionOption = {
    title: { text: '价格位势', left: 'center', textStyle: { fontSize: 14 } },
    grid: { top: 40, bottom: 20, left: 50, right: 50, containLabel: true },
    xAxis: { type: 'category', data: [''], show: false },
    yAxis: [
        { type: 'value', name: '运价($)', min: Math.floor(ppMin), max: Math.ceil(ppMax) },
        { 
            type: 'value', 
            name: '百分位', 
            min: 0, 
            max: 100, 
            position: 'right',
            axisLabel: { formatter: '{value}%' },
            splitLine: { show: false }
        }
    ],
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e6eb',
      borderWidth: 1,
      textStyle: { color: '#1d2129' },
      formatter: (params: any) => {
        if (params.componentType === 'series' && params.seriesType === 'scatter') {
           const price = params.data.value ? params.data.value[1] : params.data[1];
           const name = (params.data.value ? params.data.value[2] : params.data[2]) || 'Market';
           const details = params.data.value ? params.data.value[3] : params.data[3];
           const percentile = getPercentile(price, ppValues);
           
           if (!details) return '';

           return `
             <div style="text-align: left; padding: 4px;">
               <div style="font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #f2f3f5; padding-bottom: 4px;">${name}</div>
               <div><span style="color: #86909c">起运港:</span> ${details.pol}</div>
               <div><span style="color: #86909c">目的港:</span> ${details.pod}</div>
               <div><span style="color: #86909c">类型:</span> ${details.type}</div>
               <div><span style="color: #86909c">ETA:</span> ${details.eta}</div>
               <div><span style="color: #86909c">ETD:</span> ${details.etd}</div>
               <div style="margin-top: 6px; font-weight: bold; color: #165DFF">航程: ${details.transitTime} 天</div>
               <div style="font-weight: bold; color: #F53F3F">运价: $${price}</div>
               <div style="font-weight: bold; color: #FF7D00">百分位: ${percentile}%</div>
             </div>
           `;
        }
        return '';
      }
    },
    series: [{
      type: 'boxplot',
      data: [ppValues],
      itemStyle: { color: '#E5E6EB', borderColor: '#86909C' },
      tooltip: { show: false }
    }, {
      type: 'scatter',
      data: ppScatterData.map(item => {
        const isRec = rateRecommendations.some(r => r.carrier === item[2]);
        if (isRec) {
            return {
                value: item,
                symbolSize: 12, // More significant
                itemStyle: {
                    color: '#00B42A',
                    borderColor: '#fff',
                    borderWidth: 2,
                    shadowBlur: 5,
                    shadowColor: 'rgba(0, 180, 42, 0.5)'
                }
            };
        }
        return {
            value: item,
            symbolSize: 8,
            itemStyle: { color: '#C9CDD4' }
        };
      }),
      z: 10
    }]
  };

  const trendOption = {
    title: { text: '价格趋势预测', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { 
      trigger: 'axis',
      formatter: (params: any[]) => {
        let res = `<div>${params[0].name}</div>`;
        const isFuture = trendFutureDates.includes(params[0].name) && params[0].name !== '今天';
        
        params.forEach(param => {
          const isPredictionSeries = param.seriesName.includes('预测');
          
          if (isFuture) {
             if (isPredictionSeries && param.value !== undefined) {
               res += `<div style="display: flex; justify-content: space-between; gap: 10px;">
                 <span style="color: ${param.color}">● ${param.seriesName}</span>
                 <span style="font-weight: bold">$${Number(param.value).toFixed(2)}</span>
               </div>`;
             }
          } else {
             if (!isPredictionSeries && param.value !== undefined) {
               res += `<div style="display: flex; justify-content: space-between; gap: 10px;">
                 <span style="color: ${param.color}">● ${param.seriesName}</span>
                 <span style="font-weight: bold">$${Number(param.value).toFixed(2)}</span>
               </div>`;
             }
          }
        });
        return res;
      }
    },
    grid: { top: 40, bottom: 20, left: 40, right: 20, containLabel: true },
    xAxis: { type: 'category', data: trendXAxis },
    yAxis: { 
      type: 'value',
      name: '运价($)', 
      nameLocation: 'middle', 
      nameGap: 50,
      min: minPrice - 50,
      max: maxPrice + 50
    },
    series: rateRecommendations.flatMap((r, i) => {
      const historyData = Array(7).fill(0).map((_, idx) => r.price * (0.9 + idx * 0.01 + (Math.random() * 0.02)));
      historyData[6] = r.price; 
      
      const futureData = [
        r.price, 
        r.price * (1 + 0.01 * (i+1)), 
        r.price * (1 + 0.02 * (i+1)), 
        r.price * (1 + 0.03 * (i+1))
      ];

      return [{
        name: r.carrier,
        type: 'line',
        data: [...historyData, null, null, null],
        itemStyle: { color: ['#165DFF', '#722ED1', '#F53F3F'][i % 3] },
        symbol: 'circle'
      }, {
        name: r.carrier + ' (预测)',
        type: 'line',
        data: [null, null, null, null, null, null, ...futureData],
        itemStyle: { color: ['#165DFF', '#722ED1', '#F53F3F'][i % 3] },
        lineStyle: { type: 'dashed' },
        symbol: 'none'
      }];
    })
  };

  const supplyDemandOption = {
    title: { text: '供需对比', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { 
        trigger: 'item', // Changed to item trigger for specific legend tooltip
        formatter: (params: any) => {
            // If hovering over chart elements
            if (params.componentType === 'series') {
               const type = params.seriesType === 'line' ? '舱位紧张度' : '每日搜索量';
               return `
                 <div style="font-weight:bold">${params.name}</div>
                 <div>
                   <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
                   ${params.seriesName} (${type}): <b>${params.value}</b>
                 </div>
               `;
            }
            return '';
        }
    },
    grid: { top: 50, bottom: 20, left: 40, right: 40, containLabel: true },
    legend: { 
        data: supplyDemandLegends, 
        top: 25,
        selectedMode: 'single', // Only show one carrier at a time
        tooltip: {
            show: true,
            formatter: (params: any) => {
                // Find the index based on the name "AI推荐X"
                const index = parseInt(params.name.replace('AI推荐', '')) - 1;
                const r = rateRecommendations[index];
                if (!r) return params.name;
                
                return `
                  <div style="text-align: left; padding: 4px;">
                    <div style="font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 4px;">${r.carrier}</div>
                    <div>起运港: ${r.pol}</div>
                    <div>目的港: ${r.pod}</div>
                    <div>类型: ${r.transitType}</div>
                    <div>ETA: ${r.eta}</div>
                    <div>ETD: ${r.etd}</div>
                    <div style="margin-top: 4px; font-weight: bold; color: #165DFF">航程: ${r.transitTime} 天</div>
                    <div style="font-weight: bold; color: #F53F3F">运价: $${r.price}</div>
                  </div>
                `;
            }
        }
    },
    xAxis: { type: 'category', data: ['-7天', '-6天', '-5天', '-4天', '-3天', '-2天', '今天'] },
    yAxis: [{ type: 'value', name: '舱位紧张度', min: 0, max: 100 }, { type: 'value', name: '搜索量' }],
    series: supplyDemandSeries
  };

  // Handle actions
  const handleRateAction = (action: string, rate: any) => {
    const event = new CustomEvent('triggerRateAction', {
      detail: { action, rateId: rate.id, rate }
    });
    window.dispatchEvent(event);
  };

  // Rate Info Card Component
  const RateCard = ({ rate }: { rate: any }) => (
    <div className="mb-4">
      {/* Main Card Content */}
      <div className="bg-white border border-blue-100 rounded-t-lg p-3 shadow-sm relative hover:shadow-md transition-shadow z-10">
        <div className="flex justify-between items-start mb-2 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center bg-white p-1">
               <img src={rate.logo} alt={rate.carrier} className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <span className="font-bold text-gray-800">{rate.carrier}</span>
                 {rate.recommendationTag && (
                   <Tag color={rate.recommendationColor} size="small" className="scale-90 origin-left">
                     {rate.recommendationTag}
                   </Tag>
                 )}
              </div>
              <div className="text-gray-500 text-xs">{rate.routeCode}</div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-red-600 font-bold text-lg leading-tight">
               {rate.currency} {rate.price.toLocaleString()}
             </div>
             <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="text-center flex-1">
            <div className="font-bold text-gray-800 truncate px-1" title={rate.pol}>{rate.pol}</div>
            <div className="text-xs text-gray-500">ETD {rate.etd}</div>
          </div>
          <div className="flex flex-col items-center px-2 w-20">
            <div className="text-xs text-gray-400">{rate.transitTime}天</div>
            <div className="w-full h-[1px] bg-gray-300 relative my-1">
               <div className="absolute right-0 -top-1 w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[4px] border-l-gray-300"></div>
            </div>
            <div className="text-xs text-blue-500">{rate.transitType}</div>
          </div>
          <div className="text-center flex-1">
            <div className="font-bold text-gray-800 truncate px-1" title={rate.pod}>{rate.pod}</div>
            <div className="text-xs text-gray-500">ETA {rate.eta}</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button size="mini" type="secondary" onClick={() => handleRateAction('viewDetail', rate)}>详情</Button>
          <Button size="mini" type="primary" onClick={() => handleRateAction('quickQuote', rate)}>快速报价</Button>
        </div>
      </div>

      {/* Tail Section: Comment & Tags */}
      {(rate.comment || rate.tags) && (
        <div className="bg-blue-50 border-x border-b border-blue-100 rounded-b-lg p-3 text-xs shadow-sm -mt-[1px]">
           {rate.comment && (
             <div className="flex items-start gap-2 mb-2">
               <span className="text-blue-600 font-bold shrink-0">核心短评：</span>
               <span className="text-gray-700 font-medium leading-relaxed">{rate.comment}</span>
             </div>
           )}
           {rate.tags && rate.tags.length > 0 && (
             <div className="flex items-center gap-2">
               <span className="text-blue-600 font-bold shrink-0">推荐理由：</span>
               <div className="flex flex-wrap gap-1">
                 {rate.tags.map((tag: string) => (
                   <Tag key={tag} size="small" color="arcoblue" style={{ fontSize: '11px' }}>{tag}</Tag>
                 ))}
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );

  const ChartCard = ({ title, option, desc }: { title: string, option: any, desc: string }) => (
    <Card className="shadow-sm relative group">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          icon={<IconFullscreen />} 
          size="mini" 
          type="text"
          onClick={() => setZoomChart({ option, title })}
        />
      </div>
      <ReactECharts option={option} style={{ height: '220px' }} />
      <Paragraph className="text-xs text-gray-500 mt-2 px-2">
        {desc}
      </Paragraph>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 运价选择建议 */}
      <Card className="border-l-4 border-l-blue-600 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Title heading={5} style={{ margin: 0 }}>运价选择建议</Title>
        </div>
        
        <div className="space-y-2">
           {rateRecommendations.map(rate => <RateCard key={rate.id} rate={rate} />)}
        </div>
      </Card>

      {/* 多维度解析 - 单列布局 */}
      <div className="grid grid-cols-1 gap-4">
        <ChartCard 
          title="船司性价比"
          option={costEffectivenessOption}
          desc={`综合考虑溢价率与航程，${primaryRate.carrier} 与市场主流船司相比，在保持合理航程（${primaryRate.transitTime}天）的同时，价格具有显著优势。`}
        />
        <ChartCard 
          title="价格位势"
          option={pricePositionOption}
          desc={`当前运价 $${primaryRate.price} 位于本月同类运价30%分位，属于好价区间，低于市场平均水平。`}
        />
        <ChartCard 
          title="价格趋势预测"
          option={trendOption}
          desc="受即将生效的GRI影响，预计未来3天运价将呈上涨趋势，涨幅预计在2%-5%之间。"
        />
        <ChartCard 
          title="供需对比"
          option={supplyDemandOption}
          desc="当前舱位状态趋于紧张（接近满舱），且近7日该航线搜索量激增300%，需警惕售罄风险。"
        />
      </div>

      {/* 最终行动指南 */}
      <Card className="bg-blue-50 border border-blue-100" id="final-action-guide">
        <div className="flex justify-between items-center mb-2">
          <Title heading={6} style={{ marginTop: 0, marginBottom: 0 }}>最终行动指南</Title>
          <Button 
            type="text" 
            size="small" 
            onClick={() => {
              const element = document.querySelector('.border-l-4.border-l-blue-600');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            回到顶部
          </Button>
        </div>
        <List
          size="small"
          split={false}
          dataSource={[
            `综合考虑趋势预测和供需情况，建议今日预订 ${primaryRate.carrier} 的 ${primaryRate.routeCode} 航次。`,
            '若追求更短航程，可考虑加价$200选择快船服务，但性价比略低。',
            '警惕：下周生效的GRI可能会导致运价上涨，错当前价格可能增加成本。'
          ]}
          render={(item, index) => (
            <List.Item key={index} style={{ padding: '4px 0' }}>
              <span className="mr-2">💡</span>{item}
            </List.Item>
          )}
        />
      </Card>

      {/* AI Disclaimer */}
      <div className="flex items-center justify-start gap-1.5 text-gray-400 text-xs px-1 mt-2">
        <IconInfoCircle />
        <span>AI可能犯错，请注意检查AI输出</span>
      </div>

      {/* Zoom Modal */}
      <Modal
        title={zoomChart?.title}
        visible={!!zoomChart}
        onCancel={() => setZoomChart(null)}
        footer={null}
        style={{ width: '800px' }}
      >
        {zoomChart && <ReactECharts option={zoomChart.option} style={{ height: '500px' }} />}
      </Modal>
    </div>
  );
};

export default FreightRateAnalysisResult;