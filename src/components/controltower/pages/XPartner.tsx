import React from 'react';
import { Card } from '@arco-design/web-react';

/**
 * X Partner 页面组件
 * @description 展示 X Partner 相关功能和信息
 * @author 系统
 * @date 2024-01-15
 */
const XPartner: React.FC = () => {
  return (
    <div className="p-6">
      <Card 
        title="X Partner" 
        className="w-full"
        style={{ minHeight: '400px' }}
      >
        <div className="flex flex-col items-center justify-center h-64">
          <img 
            src="/assets/xpartner.png" 
            alt="X Partner" 
            className="w-24 h-24 mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            欢迎来到 X Partner
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            X Partner 是我们的合作伙伴平台，为您提供全面的合作伙伴管理和协作功能。
          </p>
        </div>
      </Card>
    </div>
  );
};

export default XPartner;