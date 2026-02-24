import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Spin, Badge } from '@arco-design/web-react';
import { IconCheckCircleFill, IconClockCircle, IconLoading } from '@arco-design/web-react/icon';
import { motion, AnimatePresence } from 'framer-motion';

const { Text } = Typography;

export interface CarrierProgress {
  carrierCode: string;
  carrierName: string;
  logo: string;
  status: 'waiting' | 'searching' | 'completed';
  count?: number;
}

interface SearchProgressProps {
  visible: boolean;
  progressData: CarrierProgress[];
}

const SearchProgress: React.FC<SearchProgressProps> = ({ visible, progressData }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!visible) return null;

  // Calculate stats
  const completedCount = progressData.filter(p => p.status === 'completed').length;
  const totalCount = progressData.length;
  const totalRates = progressData.reduce((acc, curr) => acc + (curr.count || 0), 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 50 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 320,
        }}
      >
        <Card
          className="search-progress-card"
          title={
            <div className="flex justify-between items-center">
              <Space>
                <Spin size={16} />
                <Text bold>正在查询运价...</Text>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {completedCount}/{totalCount}
              </Text>
            </div>
          }
          extra={
            <div 
              className="cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? '展开' : '收起'}
            </div>
          }
          bordered
          style={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 8
          }}
          bodyStyle={{
            padding: isMinimized ? 0 : '12px 0',
            maxHeight: isMinimized ? 0 : 400,
            overflowY: 'auto',
            transition: 'all 0.3s'
          }}
        >
          {!isMinimized && (
            <div>
              <div className="px-4 mb-2 flex justify-between text-xs text-gray-500">
                <span>已找到 <span className="text-blue-600 font-bold">{totalRates}</span> 条运价</span>
                <span>预计剩余: {Math.max(0, (totalCount - completedCount) * 1.5).toFixed(0)}s</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {progressData.map((item) => (
                  <div key={item.carrierCode} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded p-1">
                        <img 
                          src={item.logo} 
                          alt={item.carrierName} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=' + item.carrierCode;
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Text bold style={{ fontSize: 13 }}>{item.carrierName}</Text>
                        <Text type="secondary" style={{ fontSize: 10 }}>{item.carrierCode}</Text>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {item.status === 'waiting' && (
                        <Badge status="default" text="等待中" />
                      )}
                      {item.status === 'searching' && (
                        <span className="text-blue-600 flex items-center text-xs">
                          <IconLoading className="animate-spin mr-1" /> 查询中
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <div className="text-right">
                          <div className="flex items-center justify-end text-green-600 text-xs mb-0.5">
                            <IconCheckCircleFill className="mr-1" /> 完成
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.count} 条结果
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchProgress;
