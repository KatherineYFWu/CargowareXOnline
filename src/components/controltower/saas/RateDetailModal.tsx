import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Tabs, 
  Grid, 
  Typography, 
  Tag, 
  Descriptions, 
  Table, 
  Divider,
  Empty,
  Switch,
  Slider,
  Tooltip
} from '@arco-design/web-react';
import { IconInfoCircle, IconNav, IconClockCircle, IconLocation, IconFile } from '@arco-design/web-react/icon';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { PortsOfCallPopover, PortOfCall } from './PortsOfCallPopover';

const { Row, Col } = Grid;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface RateDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  data: any; // The rate item data
  initialActiveTab?: string;
}

// 费用明细接口
interface FeeItem {
  id: string;
  category: 'Freight' | 'Origin' | 'Destination' | 'Others';
  name: string;
  remark?: string;
  paymentMode: 'Prepaid' | 'Collect';
  unit: 'Per Container' | 'Per Shipment';
  currency: string;
  price: number;
}

// DND规则接口
interface DndRule {
  id: string;
  destination: string; // 目的港
  destinationCountry: string; // 国家
  direction: 'Import' | 'Export'; // 进出口方向
  dndType: 'Demurrage' | 'Detention'; // D&D类型
  triggerEvent: string; // 触发事件，如 "starts at discharge"
  cargoType: string; // 货物类型
  validityPeriod: string; // 有效期天数范围
  currency: string; // 币种
  costPerDay: string; // 每日费用
}

// 退改费接口
interface PenaltyFee {
  id: string;
  name: string;
  currency: 'CNY' | 'USD' | 'EUR';
  amount: number;
}

const RateDetailModal: React.FC<RateDetailModalProps> = ({ visible, onCancel, data, initialActiveTab = 'cost' }) => {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [dndRules, setDndRules] = useState<DndRule[]>([]);
  const [penaltyFees, setPenaltyFees] = useState<PenaltyFee[]>([]);
  const [categoryVisibility, setCategoryVisibility] = useState<Record<string, boolean>>({
    'Freight': true,
    'Origin': true,
    'Destination': true,
    'Others': true
  });
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [activeContainerTab, setActiveContainerTab] = useState<string>('');

  const boxTypes = ['20GP', '40GP', '40HC', '45HC', '20NOR', '40NOR', '20OT', '40OT', '20TK', '40TK', '20FR', '40FR'];

  // 计算可用的箱型
  const availableBoxTypes = React.useMemo(() => {
    if (!data) return [];
    return boxTypes.filter(type => {
        const val = data[type] || data[type.toLowerCase()];
        return val !== undefined && val !== null && val !== '' && val !== 0;
    });
  }, [data]);

  useEffect(() => {
    if (visible) {
      setActiveTab(initialActiveTab);
      // 设置默认选中的箱型
      if (availableBoxTypes.length > 0) {
        if (!activeContainerTab || !availableBoxTypes.includes(activeContainerTab)) {
            setActiveContainerTab(availableBoxTypes[0]);
        }
      }
    }
  }, [visible, initialActiveTab, availableBoxTypes]);

  // 模拟生成费用明细和DND数据
  useEffect(() => {
    if (visible && data && activeContainerTab) {
      // 获取当前箱型的价格
      const currentPrice = data[activeContainerTab.toLowerCase()] || data[activeContainerTab] || 0;
      
      // Generate Fees (Translated & Comprehensive)
      const mockFees: FeeItem[] = [
        // Freight
        { id: '1', category: 'Freight', name: '环保合规费 (ECC)', remark: '该费用为船公司按规定收取的环保合规附加费，具体金额以船公司最终账单为准。', paymentMode: 'Prepaid', unit: 'Per Container', currency: 'USD', price: 128 },
        { id: '2', category: 'Freight', name: '海运费 (Ocean Freight)', paymentMode: 'Prepaid', unit: 'Per Container', currency: data.baseCurrency || 'USD', price: currentPrice },
        
        // Origin
        { id: '3', category: 'Origin', name: '码头操作费 (THC)', remark: '码头操作费由码头收取，包含装卸、堆存等操作费用，不同码头可能存在差异。', paymentMode: 'Prepaid', unit: 'Per Container', currency: 'CNY', price: 918 },
        
        // Destination
        { id: '4', category: 'Destination', name: '目的港码头操作费 (DTHC)', remark: '目的港码头操作费以目的港实际收取为准，可能因港口政策调整而变化。', paymentMode: 'Collect', unit: 'Per Container', currency: 'EUR', price: 265 },
        
        // Others (Optional examples)
        { id: '5', category: 'Others', name: '操作费 (Handling Fee)', paymentMode: 'Prepaid', unit: 'Per Shipment', currency: 'USD', price: 50 },
      ];
      setFees(mockFees);

      // Generate DND Rules
      const mockDndRules: DndRule[] = [
        { 
          id: '1', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Detention',
          triggerEvent: 'starts at gate-out full',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '1 - 3', 
          currency: 'EUR', 
          costPerDay: 'Free' 
        },
        { 
          id: '2', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Detention',
          triggerEvent: 'starts at gate-out full',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '4 - 10', 
          currency: 'EUR', 
          costPerDay: '55.00' 
        },
        { 
          id: '3', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Detention',
          triggerEvent: 'starts at gate-out full',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '11 - 14', 
          currency: 'EUR', 
          costPerDay: '85.00' 
        },
        { 
          id: '4', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Detention',
          triggerEvent: 'starts at gate-out full',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '15 +', 
          currency: 'EUR', 
          costPerDay: '105.00' 
        },
        { 
          id: '5', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Demurrage',
          triggerEvent: 'starts at discharge',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '1 - 3', 
          currency: 'EUR', 
          costPerDay: 'Free' 
        },
        { 
          id: '6', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Demurrage',
          triggerEvent: 'starts at discharge',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '4 - 7', 
          currency: 'EUR', 
          costPerDay: '85.00' 
        },
        { 
          id: '7', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Demurrage',
          triggerEvent: 'starts at discharge',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '8 - 12', 
          currency: 'EUR', 
          costPerDay: '115.00' 
        },
        { 
          id: '8', 
          destination: 'HAMBURG', 
          destinationCountry: 'GERMANY',
          direction: 'Import',
          dndType: 'Demurrage',
          triggerEvent: 'starts at discharge',
          cargoType: 'GENERAL CARGO',
          validityPeriod: '13 +', 
          currency: 'EUR', 
          costPerDay: '190.00' 
        },
      ];
      setDndRules(mockDndRules);

      // Generate Penalty Fees
      const mockPenaltyFees: PenaltyFee[] = [
        { id: '1', name: 'SPOTON Cancellation Fee', currency: 'USD', amount: 50 },
        { id: '2', name: 'SPOTON Amendment Fee', currency: 'USD', amount: 30 },
        { id: '3', name: 'SPOTON No Show Fee', currency: 'USD', amount: 100 },
      ];
      setPenaltyFees(mockPenaltyFees);
    }
  }, [visible, data, activeContainerTab]);

  // 计算总费用 (简单累加USD部分作为示例，实际应处理汇率)
  const calculateTotal = () => {
    // 简单将所有转换为USD显示 (仅为UI展示)
    // 实际逻辑应更复杂
    const total = fees.reduce((acc, fee) => {
      // Skip if category is hidden
      if (!categoryVisibility[fee.category]) return acc;
      
      let amount = fee.price;
      if (fee.currency === 'CNY') amount = amount / 7.2;
      if (fee.currency === 'EUR') amount = amount * 1.1;
      return acc + amount;
    }, 0);
    return total;
  };

  // 计算各类别占比
  const calculateBreakdown = () => {
    const total = calculateTotal();
    if (total === 0) return { Freight: 0, Origin: 0, Destination: 0, Others: 0 };

    const breakdown: Record<string, number> = { Freight: 0, Origin: 0, Destination: 0, Others: 0 };
    
    fees.forEach(fee => {
      if (!categoryVisibility[fee.category]) return;
      
      let amount = fee.price;
      if (fee.currency === 'CNY') amount = amount / 7.2;
      if (fee.currency === 'EUR') amount = amount * 1.1;
      
      breakdown[fee.category] += amount;
    });

    return {
      Freight: (breakdown.Freight / total) * 100,
      Origin: (breakdown.Origin / total) * 100,
      Destination: (breakdown.Destination / total) * 100,
      Others: (breakdown.Others / total) * 100
    };
  };

  // 从 portsOfCall 中匹配港口获取码头
  const getTerminalForPort = (portKey: string): string => {
    const ports = data?.portsOfCall || [];
    const key = (portKey || '').toUpperCase().replace(/\s/g, '');
    const found = ports.find((p: PortOfCall) => {
      const info = (p.portInfo || '').toUpperCase();
      const firstWord = (info.split(' ')[0] || '').replace(/[^A-Z]/g, '');
      return info.includes(key) || key.includes(firstWord) || firstWord.includes(key);
    });
    return found?.terminal || '-';
  };

  // 格式化日期为 YYYY.MM.DD
  const formatDate = (d: string) => d ? d.replace(/-/g, '.') : '-';

  // 构建时间轴节点数据（起运港、中转港、目的港）
  const buildTimelineNodes = () => {
    const pol = data?.pol || data?.placeOfLoading || '-';
    const pod = data?.pod || data?.placeOfDelivery || '-';
    const transitPorts = Array.isArray(data?.transitPorts) 
      ? data.transitPorts 
      : (typeof data?.transitPorts === 'string' && data.transitPorts ? data.transitPorts.split(',').map((p: string) => p.trim()) : []);
    const vesselLegs = data?.vesselLegs || Array(transitPorts.length + 1).fill(null).map(() => ({
      vesselName: data?.vesselName || '-',
      voyageNo: data?.voyageNo || '-',
      routeCode: data?.routeCode || '-'
    }));
    const etd = data?.etd || '';
    const eta = data?.eta || '';
    const cutoffDate = data?.cutoffDate || '';

    const nodes: { type: 'port'; portName: string; terminal: string; times: { label: string; value: string }[] }[] = [];
    const legs: { vesselName: string; voyageNo: string; routeCode: string }[] = [];

    nodes.push({
      type: 'port',
      portName: pol,
      terminal: getTerminalForPort(pol),
      times: [
        ...(cutoffDate ? [{ label: 'Port Cut-off', value: formatDate(cutoffDate) }] : []),
        { label: '离港', value: formatDate(etd) }
      ]
    });

    transitPorts.forEach((port: string, idx: number) => {
      const leg = vesselLegs[idx] || vesselLegs[0];
      legs.push(leg);
      const portDate = etd ? (() => {
        const d = new Date(etd);
        d.setDate(d.getDate() + Math.floor((data?.transitTime || 0) * (idx + 1) / (transitPorts.length + 1)));
        return d.toISOString().slice(0, 10);
      })() : '';
      nodes.push({
        type: 'port',
        portName: port,
        terminal: getTerminalForPort(port),
        times: [
          { label: '到港', value: formatDate(portDate) },
          { label: '离港', value: formatDate(portDate) }
        ]
      });
    });

    if (transitPorts.length > 0) {
      legs.push(vesselLegs[vesselLegs.length - 1] || vesselLegs[0]);
    } else {
      legs.push(vesselLegs[0] || { vesselName: data?.vesselName || '-', voyageNo: data?.voyageNo || '-', routeCode: data?.routeCode || '-' });
    }

    nodes.push({
      type: 'port',
      portName: pod,
      terminal: getTerminalForPort(pod),
      times: [{ label: '到港', value: formatDate(eta) }]
    });

    return { nodes, legs };
  };

  // 渲染左侧基础信息 - 时间轴+节点+运价卡片
  const renderBasicInfo = () => {
    if (!data) return null;

    const { nodes, legs } = buildTimelineNodes();
    const transitType = data.transitType || (nodes.length > 2 ? '中转' : '直达');
    const transitTime = data.transitTime || 0;

    return (
      <div className="h-full flex flex-col pr-3 border-r border-gray-200">
        {/* 左上角：舱位状态、运输条款两个 tag */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <Tag color={data.spaceStatus === '现舱' ? 'green' : 'red'} size="small" className="m-0">
            {data.spaceStatus || '现舱'}
          </Tag>
          <Tag color="green" variant="outline" size="small" className="m-0">
            {data.transportTerms || 'CY-CY'}
          </Tag>
        </div>

        {/* 船公司 Logo */}
        <div className="flex items-center mb-4 shrink-0">
          <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg mr-3 shadow-sm">
            {data.carrierLogo ? (
              <img src={data.carrierLogo} alt={data.carrierName} className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-base font-bold text-gray-400">{data.carrierName?.[0]}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <Title heading={6} style={{ margin: 0, fontSize: '16px', lineHeight: '1.2' }} className="truncate" title={data.carrierName}>{data.carrierName}</Title>
            <Text type="secondary" className="text-xs truncate block" title={data.lane || '航线信息'}>{data.lane || '航线信息'}</Text>
          </div>
        </div>

        {/* 航线标题：起运港 → 目的港，带航程和直达/中转 */}
        <div className="mb-4 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-gray-800">{data.pol || '-'}</span>
            <div className="flex flex-col items-center flex-1 min-w-0 px-2">
              <span className="text-xs text-gray-500 mb-1">{transitTime}天</span>
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 h-px bg-gray-300"></div>
                <Tag 
                  color={transitType === '直达' ? 'green' : 'orange'} 
                  size="small"
                  className="shrink-0"
                >
                  {transitType}
                </Tag>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-800">{data.pod || '-'}</span>
          </div>
        </div>

        {/* 时间轴（浅蓝色） */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
          <div className="rate-detail-timeline">
            {nodes.map((node, idx) => (
              <React.Fragment key={idx}>
                {/* 港口节点 */}
                <div className="flex">
                  <div className="timeline-track flex flex-col items-center">
                    <div className="timeline-node" />
                    {idx < nodes.length - 1 && <div className="timeline-line" style={{ minHeight: '16px' }} />}
                  </div>
                  <div className="timeline-content flex-1 pl-3 pb-6">
                    <div className="font-bold text-gray-800">{node.portName}</div>
                    <div className="text-sm" style={{ color: '#3b82f6' }}>{node.terminal}</div>
                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                      {node.times.map((t, i) => (
                        <div key={i}>{t.label} {t.value}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 节点间：船名航次 + 航线代码 灰色 card */}
                {idx < nodes.length - 1 && legs[idx] && (
                  <div className="flex" style={{ minHeight: '80px' }}>
                    <div className="timeline-track flex flex-col items-center">
                      <div className="timeline-line" style={{ minHeight: '24px' }} />
                      <div className="timeline-mid-icon">
                        <IconLocation style={{ fontSize: 12 }} />
                      </div>
                      <div className="timeline-line" style={{ minHeight: '24px' }} />
                    </div>
                    <div className="timeline-content flex-1 pl-3 pb-6 flex items-center gap-2">
                      <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex-1">
                        <div className="text-gray-700">船名航次: {legs[idx].vesselName} V.{legs[idx].voyageNo}</div>
                        <div className="text-gray-700 mt-1">
                          航线代码: <PortsOfCallPopover routeCode={legs[idx].routeCode} ports={data.portsOfCall || []} triggerElement={<span className="text-blue-600 font-bold cursor-pointer hover:underline">{legs[idx].routeCode}</span>} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 箱型运价 card（与卡片式查询结果样式一致：基础运价 + 总体运价） */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 mb-2">各箱型运价</div>
            <div className="flex flex-wrap gap-2 items-start">
              <div className="flex flex-col justify-center text-[11px] font-semibold mt-6 min-w-[32px]">
                <span className="text-red-600 leading-7">Base</span>
                <span className="text-[#1e3a8a] leading-7">Total</span>
              </div>
              {availableBoxTypes.map(type => {
                const basePrice = data[type] ?? data[type.toLowerCase()] ?? 0;
                const diff = (data.totalPrice || 0) - (data.basePrice || 0);
                const totalPrice = basePrice + (diff > 0 ? diff : 0);
                const currency = data.baseCurrency || 'USD';

                return (
                  <div key={type} className="flex flex-col items-center justify-center bg-gray-50 rounded-lg px-3 py-2 min-w-[72px]">
                    <span className="text-xs text-gray-500 font-medium mb-1">{type}</span>
                    <div className="flex flex-col items-center space-y-0.5">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{currency === 'USD' ? '$' : currency}</span>
                        <span className="text-base font-bold text-red-600">{basePrice}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{currency === 'USD' ? '$' : currency}</span>
                        <span className="text-base font-bold text-[#1e3a8a]">{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 费用明细统一列定义，确保所有类别表格列宽一致
  const feeColumns = [
    { 
      title: '费用名称', 
      dataIndex: 'name', 
      width: '35%',
      render: (val: string, record: FeeItem) => (
        <div className="flex items-center justify-between">
          <span className="truncate">{val}</span>
          {record.remark && (
            <Tooltip content={record.remark} position="top" mini>
              <IconInfoCircle 
                className="ml-1 flex-shrink-0 cursor-pointer" 
                style={{ color: '#86909c', fontSize: 14 }} 
              />
            </Tooltip>
          )}
        </div>
      )
    },
    { title: '付款方式', dataIndex: 'paymentMode', width: '15%' },
    { title: '计费单位', dataIndex: 'unit', width: '18%' },
    { title: '币种', dataIndex: 'currency', width: '12%' },
    { title: '单价', dataIndex: 'price', width: '20%', render: (val: number, item: FeeItem) => <span className="font-bold">{item.currency} {val}</span> },
  ];

  // 渲染费用明细
  const renderCostDetail = () => {
    const categories = ['Freight', 'Origin', 'Destination', 'Others'];
    const categoryMap: Record<string, string> = {
      'Freight': '海运费',
      'Origin': '起运港费用',
      'Destination': '目的港费用',
      'Others': '其他费用'
    };
    
    return (
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {categories.map(cat => {
          const catFees = fees.filter(f => f.category === cat);
          if (catFees.length === 0) return null;
          
          return (
            <div key={cat} className="mb-6">
              <div className="flex items-center justify-between mb-3 pl-2 border-l-4 border-blue-500">
                <div className="text-sm font-bold text-gray-700">{categoryMap[cat]}</div>
                <Switch 
                  size="small" 
                  checked={categoryVisibility[cat]}
                  onChange={(checked) => setCategoryVisibility(prev => ({ ...prev, [cat]: checked }))}
                />
              </div>
              
              {categoryVisibility[cat] && (
                <div className="transition-all duration-300">
                   <Table
                      columns={feeColumns}
                      data={catFees}
                      pagination={false}
                      size="small"
                      border={{ wrapper: true, cell: true }}
                      rowKey="id"
                      tableLayoutFixed
                    />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染退改费
  const renderPenaltyFees = () => {
    return (
      <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
         <div className="bg-orange-50 p-3 rounded flex items-start mb-4">
             <IconInfoCircle className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
             <div className="text-xs text-orange-700">
                数据仅供参考，请以船公司为准
             </div>
         </div>
         <Table
            columns={[
              { title: '费用名目', dataIndex: 'name' },
              { title: '币种', dataIndex: 'currency' },
              { title: '金额', dataIndex: 'amount', render: (val) => <span className="font-bold">{val}</span> },
            ]}
            data={penaltyFees}
            pagination={false}
            size="small"
            border={{ wrapper: true, cell: true }}
            rowKey="id"
         />
      </div>
    );
  };

  // 渲染底部总计
  const renderTotalFooter = () => {
    const breakdown = calculateBreakdown();
    
    const categoryMap: Record<string, string> = {
      'Freight': '海运费',
      'Origin': '起运港费用',
      'Destination': '目的港费用',
      'Others': '其他费用'
    };

    return (
      <div className="bg-white pt-2 pb-2 border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] shrink-0 z-10">
         <div className="flex justify-between items-end px-2">
            <div>
               <div className="text-xs text-gray-500 mb-1">预估总金额</div>
               <div className="text-xs text-gray-400">包含 {Object.keys(categoryVisibility).filter(k => categoryVisibility[k]).map(k => categoryMap[k]).join(', ')}</div>
            </div>
            <div className="text-right">
               <div className="text-xl font-bold text-blue-600">
                 USD {calculateTotal().toFixed(2)}
               </div>
            </div>
         </div>
         {/* 可视化条 */}
         <div className="w-full h-2 rounded-full overflow-hidden flex mt-2 mx-2" style={{ width: 'calc(100% - 16px)' }}>
            {breakdown.Freight > 0 && <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${breakdown.Freight}%` }} title={`海运费: ${breakdown.Freight.toFixed(1)}%`}></div>}
            {breakdown.Origin > 0 && <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${breakdown.Origin}%` }} title={`起运港费用: ${breakdown.Origin.toFixed(1)}%`}></div>}
            {breakdown.Destination > 0 && <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${breakdown.Destination}%` }} title={`目的港费用: ${breakdown.Destination.toFixed(1)}%`}></div>}
            {breakdown.Others > 0 && <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${breakdown.Others}%` }} title={`其他费用: ${breakdown.Others.toFixed(1)}%`}></div>}
         </div>
         <div className="flex space-x-4 mt-2 px-2 text-xs text-gray-500">
            <div className={`flex items-center ${breakdown.Freight === 0 ? 'opacity-40' : ''}`}><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>海运费</div>
            <div className={`flex items-center ${breakdown.Origin === 0 ? 'opacity-40' : ''}`}><div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>起运港费用</div>
            <div className={`flex items-center ${breakdown.Destination === 0 ? 'opacity-40' : ''}`}><div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1"></div>目的港费用</div>
            <div className={`flex items-center ${breakdown.Others === 0 ? 'opacity-40' : ''}`}><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></div>其他费用</div>
         </div>
      </div>
    );
  };

  // 渲染DND
  const renderDnd = () => {
    // 按 Destination 内容分组计算 rowSpan
    const processedData = dndRules.map((rule, index, array) => {
      const key = `${rule.destination}-${rule.destinationCountry}-${rule.direction}-${rule.dndType}-${rule.triggerEvent}-${rule.cargoType}`;
      
      // 查找与当前记录相同组的所有记录
      let rowSpan = 0;
      if (index === 0 || 
          `${array[index - 1].destination}-${array[index - 1].destinationCountry}-${array[index - 1].direction}-${array[index - 1].dndType}-${array[index - 1].triggerEvent}-${array[index - 1].cargoType}` !== key) {
        // 这是该组的第一条记录，计算 rowSpan
        rowSpan = array.filter((r, i) => 
          i >= index && 
          `${r.destination}-${r.destinationCountry}-${r.direction}-${r.dndType}-${r.triggerEvent}-${r.cargoType}` === key
        ).length;
      }
      
      return {
        ...rule,
        _rowSpan: rowSpan
      };
    });

    const columns = [
      {
        title: 'Destination',
        dataIndex: 'destination',
        render: (_: any, record: any) => {
          if (record._rowSpan === 0) {
            return {
              children: null,
              props: { rowSpan: 0 }
            };
          }
          
          return {
            children: (
              <div>
                <div className="font-bold text-gray-800">{record.destination}, {record.destinationCountry}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {record.direction} {record.dndType} {record.triggerEvent}
                </div>
                <div className="text-xs text-gray-500 italic mt-1">{record.cargoType}</div>
              </div>
            ),
            props: { rowSpan: record._rowSpan }
          };
        }
      },
      {
        title: 'Validity period(day)',
        dataIndex: 'validityPeriod',
        align: 'center' as const
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        align: 'center' as const
      },
      {
        title: 'Cost per day',
        dataIndex: 'costPerDay',
        align: 'right' as const,
        render: (val: string) => (
          <span className={val === 'Free' ? 'text-green-600 font-bold' : 'font-semibold'}>
            {val}
          </span>
        )
      }
    ];

    return (
      <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-orange-50 p-3 rounded flex items-start mb-4">
          <IconInfoCircle className="text-orange-500 mt-1 mr-2 flex-shrink-0" />
          <div className="text-xs text-orange-700">
            数据仅供参考，如有不一致请以船公司为准
          </div>
        </div>

        <Table
          columns={columns}
          data={processedData}
          pagination={false}
          size="small"
          border={{ wrapper: true, cell: true }}
          rowKey="id"
        />
      </div>
    );
  };

  // 渲染船期信息
  const renderSchedule = () => {
    if (!data) return null;
    
    const scheduleData = [];
    
    // 起运港
    scheduleData.push({
      key: 'pol',
      portName: data.pol,
      portCode: 'CN' + (data.pol?.substring(0, 3).toUpperCase() || 'SHA'),
      type: '起运港',
      etd: data.etd,
      eta: '-'
    });
    
    // 中转港
    if (data.transitPorts && Array.isArray(data.transitPorts)) {
       data.transitPorts.forEach((port: string, index: number) => {
         scheduleData.push({
            key: `transit-${index}`,
            portName: port,
            portCode: 'TR' + (port?.substring(0, 3).toUpperCase() || 'SIN'),
            type: '中转港',
            etd: '2025-02-' + (15 + index), // Mock
            eta: '2025-02-' + (14 + index)  // Mock
         });
       });
    } else if (typeof data.transitPorts === 'string' && data.transitPorts) {
        // Handle string case if comma separated
        data.transitPorts.split(',').forEach((port: string, index: number) => {
            const p = port.trim();
            if(p) {
                scheduleData.push({
                    key: `transit-${index}`,
                    portName: p,
                    portCode: 'TR' + (p?.substring(0, 3).toUpperCase() || 'SIN'),
                    type: '中转港',
                    etd: '2025-02-' + (15 + index), // Mock
                    eta: '2025-02-' + (14 + index)  // Mock
                 });
            }
        })
    }
    
    // 目的港
    scheduleData.push({
      key: 'pod',
      portName: data.pod,
      portCode: 'DE' + (data.pod?.substring(0, 3).toUpperCase() || 'HAM'),
      type: '目的港',
      etd: '-',
      eta: data.eta
    });

    const columns = [
      { 
        title: '港口名称', 
        dataIndex: 'portName',
        render: (col: string, record: any) => {
           let className = 'text-gray-700';
           if (record.type === '起运港' || record.type === '目的港') className = 'text-green-600 font-bold';
           if (record.type === '中转港') className = 'text-yellow-600 font-bold';
           return <span className={className}>{col}</span>;
        }
      },
      { title: '港口代码', dataIndex: 'portCode' },
      { 
        title: '港口类型', 
        dataIndex: 'type',
        render: (col: string) => {
           let color = 'gray';
           if (col === '起运港' || col === '目的港') color = 'green';
           if (col === '中转港') color = 'orange'; 
           return <Tag color={color}>{col}</Tag>;
        }
      },
      { title: 'ETD', dataIndex: 'etd' },
      { title: 'ETA', dataIndex: 'eta' },
    ];

    return (
      <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
         <Table
           columns={columns}
           data={scheduleData}
           pagination={false}
           border={{ wrapper: true, cell: true }}
         />
      </div>
    );
  };

  // 渲染运价趋势图
  const renderTrend = () => {
    // 获取当前箱型的价格
    const currentPrice = activeContainerTab ? (data[activeContainerTab.toLowerCase()] || data[activeContainerTab] || 0) : (data?.basePrice || 1000);

    // Mock Trend Data
    const trendData = [];
    const today = new Date();
    // Generate data for past 6 months and future 1 month
    for (let i = -180; i < 30; i+=3) { // every 3 days
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Randomly skip some days
        if (Math.random() > 0.1) {
            trendData.push({
                date: dateStr,
                price: currentPrice + Math.floor(Math.random() * 400 - 200)
            });
        }
    }

    const option = {
      grid: {
        top: 30,
        right: 30,
        bottom: 80,
        left: 50
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
            const p = params[0];
            return `${p.value[0]}<br/>Price: ${p.value[1]} ${data?.baseCurrency || 'USD'}`;
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          margin: 20 // 增加与轴线的距离，确保在下方显示
        }
      },
      yAxis: {
        type: 'value',
        name: 'Price (' + (data?.baseCurrency || 'USD') + ')',
        scale: true
      },
      dataZoom: [
        {
          type: 'slider',
          start: 85, 
          end: 100,
          bottom: 20
        },
        {
          type: 'inside'
        }
      ],
      series: [
        {
          name: 'Price',
          type: 'line',
          data: trendData.map(item => [item.date, item.price]),
          connectNulls: true, 
          smooth: true,
          symbolSize: 8,
          areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24, 144, 255, 0.5)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
              ])
          },
          itemStyle: {
              color: '#1890ff'
          },
          lineStyle: {
              width: 3
          }
        }
      ]
    };

    return (
      <div className="w-full h-full">
         <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />
      </div>
    );
  };

  return (
    <Modal
      title="运价详情"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      style={{ width: '80%', height: '85vh', top: '5vh' }}
      className="rate-detail-modal"
    >
      <div className="h-full flex" style={{ height: 'calc(85vh - 110px)' }}>
        {/* Left Side: Basic Info */}
        <div className="w-[40%] h-full">
           {renderBasicInfo()}
        </div>
        
        {/* Right Side: Detailed Info */}
        <div className="w-[60%] h-full pl-6 flex flex-col overflow-hidden relative">
           {availableBoxTypes.length > 0 ? (
             <Tabs
                activeTab={activeContainerTab}
                onChange={setActiveContainerTab}
                className="flex-1 flex flex-col overflow-hidden container-tabs"
                type="line"
             >
                {availableBoxTypes.map(type => (
                   <TabPane key={type} title={type} className="h-full">
                       <Tabs 
                         activeTab={activeTab} 
                         onChange={setActiveTab}
                         className="flex-1 flex flex-col overflow-hidden h-full mt-2"
                         size="default"
                       >
                         <TabPane key="cost" title="费用明细" className="h-full">
                           <div className="flex flex-col h-full overflow-hidden">
                             {renderCostDetail()}
                             {renderTotalFooter()}
                           </div>
                         </TabPane>
                         <TabPane key="penalty" title="退改费" className="h-full">
                           {renderPenaltyFees()}
                         </TabPane>
                         <TabPane key="dnd" title="DND" className="h-full">
                           {renderDnd()}
                         </TabPane>
                         <TabPane key="schedule" title="船期信息" className="h-full">
                           {renderSchedule()}
                         </TabPane>
                         <TabPane key="trend" title="运价趋势图" className="h-full">
                           {renderTrend()}
                         </TabPane>
                       </Tabs>
                   </TabPane>
                ))}
             </Tabs>
           ) : (
             // Fallback if no specific box types found (though data should have them)
             <Empty description="暂无箱型数据" />
           )}
        </div>
      </div>
      <style>{`
        .rate-detail-modal .arco-tabs-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .rate-detail-modal .arco-tabs-pane {
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        /* Customize container tabs header */
        .container-tabs > .arco-tabs-header .arco-tabs-header-title {
           font-size: 14px; /* Slightly smaller for elegance */
           font-weight: 500;
           padding: 6px 12px; /* Reduce spacing */
           color: #4e5969;
        }
        .container-tabs > .arco-tabs-header .arco-tabs-header-title-active {
            font-weight: 600;
            color: #165DFF;
        }
        .container-tabs > .arco-tabs-header {
           margin-bottom: 0;
           border-bottom: 1px solid #f2f3f5;
        }
        /* Reduce gap for nested tabs */
        .container-tabs .arco-tabs-content {
            padding-top: 4px; 
        }
        .container-tabs .arco-tabs-header-nav {
            margin-bottom: 4px !important; /* Reduce margin below secondary tabs */
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e6eb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: transparent;
        }

        /* 超级运价详情左侧时间轴 - 浅蓝色 */
        .rate-detail-timeline .timeline-track {
          width: 24px;
          flex-shrink: 0;
        }
        .rate-detail-timeline .timeline-node {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3b82f6;
          flex-shrink: 0;
        }
        .rate-detail-timeline .timeline-line {
          flex: 1;
          min-height: 12px;
          width: 2px;
          background: #d1d5db;
          margin: 2px 0;
        }
        .rate-detail-timeline .timeline-mid-icon {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #ffffff;
          border: 2px solid #3b82f6;
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin: 2px 0;
        }
        
        /* Compact Descriptions */
        .compact-descriptions .arco-descriptions-item-label,
        .compact-descriptions .arco-descriptions-item-value {
            padding-bottom: 4px !important;
            padding-top: 4px !important;
        }
        .compact-descriptions .arco-descriptions-row {
            margin-bottom: 0 !important;
        }
      `}</style>
    </Modal>
  );
};

export default RateDetailModal;
