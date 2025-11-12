import React, { useState, useEffect } from 'react';
import { Modal, Select, Checkbox } from '@arco-design/web-react';
import * as echarts from 'echarts';

interface RateTrendModalProps {
  visible: boolean;
  onCancel: () => void;
  // rateData: any;
}

const RateTrendModal: React.FC<RateTrendModalProps> = ({
  visible,
  onCancel
}) => {
  // 箱型选项 - 限制为指定的6种类型
  const containerTypes = [
    { label: '20GP', value: '20gp' },
    { label: '40GP', value: '40gp' },
    { label: '40HC', value: '40hc' },
    { label: '45HC', value: '45hc' },
    { label: '20NOR', value: '20nor' },
    { label: '40NOR', value: '40nor' }
  ];

  // 选中的箱型状态，默认全部勾选
  const [selectedContainers, setSelectedContainers] = useState<string[]>(
    containerTypes.map(item => item.value)
  );

  // 图表实例
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  // 模拟运价趋势数据
  const generateTrendData = () => {
    const dates = [];
    const today = new Date();
    
    // 生成过去30天的日期
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const trendData: { [key: string]: number[] } = {};
    
    containerTypes.forEach(container => {
      const basePrice = Math.random() * 2000 + 1000; // 基础价格1000-3000
      const prices = [];
      
      for (let i = 0; i < 30; i++) {
        // 生成有趋势的价格数据
        const trend = Math.sin(i * 0.2) * 200; // 周期性波动
        const noise = (Math.random() - 0.5) * 100; // 随机噪声
        const price = Math.max(0, basePrice + trend + noise);
        prices.push(Math.round(price));
      }
      
      trendData[container.value] = prices;
    });

    return { dates, trendData };
  };

  // 初始化图表
  useEffect(() => {
    if (visible) {
      // 延迟初始化，确保DOM已渲染
      const timer = setTimeout(() => {
        const chartDom = document.getElementById('rate-trend-chart');
        if (chartDom && !chartInstance) {
          const chart = echarts.init(chartDom);
          setChartInstance(chart);
          
          // 窗口大小变化时重新调整图表
          const resizeHandler = () => {
            chart.resize();
          };
          window.addEventListener('resize', resizeHandler);
          
          // 清理函数
          return () => {
            window.removeEventListener('resize', resizeHandler);
          };
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      // Modal关闭时清理图表实例
      if (chartInstance) {
        chartInstance.dispose();
        setChartInstance(null);
      }
    }
  }, [visible]);

  // 更新图表数据
  useEffect(() => {
    if (chartInstance && visible) {
      const { dates, trendData } = generateTrendData();
      
      const series = selectedContainers.map(containerType => {
        const containerLabel = containerTypes.find(item => item.value === containerType)?.label || containerType;
        return {
          name: containerLabel,
          type: 'line',
          smooth: true,
          data: trendData[containerType] || [],
          lineStyle: {
            width: 2
          },
          symbol: 'circle',
          symbolSize: 4
        };
      });

      const option = {
        title: {
          text: '运价趋势图',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params: any) {
            let result = `${params[0].axisValue}<br/>`;
            params.forEach((param: any) => {
              result += `${param.marker}${param.seriesName}: $${param.value}<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: selectedContainers.map(containerType => {
            return containerTypes.find(item => item.value === containerType)?.label || containerType;
          }),
          top: 40,
          type: 'scroll'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLabel: {
            formatter: function(value: string) {
              return value.split('-').slice(1).join('-'); // 显示MM-DD格式
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '价格 (USD)',
          axisLabel: {
            formatter: '${value}'
          }
        },
        series: series,
        color: [
          '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
          '#fa8c16', '#eb2f96', '#13c2c2', '#a0d911', '#2f54eb'
        ]
      };

      chartInstance.setOption(option);
    }
  }, [chartInstance, selectedContainers, visible]);

  // 处理箱型选择变化
  const handleContainerChange = (value: string[]) => {
    setSelectedContainers(value);
  };

  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContainers(containerTypes.map(item => item.value));
    } else {
      setSelectedContainers([]);
    }
  };

  // 组件卸载时清理图表实例
  useEffect(() => {
    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, [chartInstance]);

  return (
    <Modal
      title="运价趋势"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      style={{ top: 50, width: 900 }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>箱型选择：</span>
          <Checkbox
            checked={selectedContainers.length === containerTypes.length}
            indeterminate={selectedContainers.length > 0 && selectedContainers.length < containerTypes.length}
            onChange={handleSelectAll}
          >
            全选
          </Checkbox>
        </div>
        <Select
          mode="multiple"
          placeholder="请选择箱型"
          value={selectedContainers}
          onChange={handleContainerChange}
          style={{ width: '100%' }}
          maxTagCount={5}
        >
          {containerTypes.map(container => (
            <Select.Option key={container.value} value={container.value}>
              {container.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      
      <div
        id="rate-trend-chart"
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #e8e8e8',
          borderRadius: '4px'
        }}
      />
    </Modal>
  );
};

export default RateTrendModal;