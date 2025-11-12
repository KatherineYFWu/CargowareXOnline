import React from 'react';

/**
 * 阿联酋国旗图标组件
 * @description 阿联酋国旗的SVG图标，包含红、绿、白、黑四色
 */
const UAEFlag: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 红色竖条 */}
      <rect x="0" y="0" width="6" height="16" fill="#FF0000" />
      
      {/* 绿色横条 */}
      <rect x="6" y="0" width="18" height="5.33" fill="#00732F" />
      
      {/* 白色横条 */}
      <rect x="6" y="5.33" width="18" height="5.33" fill="#FFFFFF" />
      
      {/* 黑色横条 */}
      <rect x="6" y="10.67" width="18" height="5.33" fill="#000000" />
    </svg>
  );
};

export default UAEFlag;