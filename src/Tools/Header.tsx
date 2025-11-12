import React from 'react';

/**
 * WallTech页面Header组件
 * @description 从Vue PortalHeader组件转换而来的TSX版本
 * @author AI Assistant
 * @date 2024-01-15
 */
interface HeaderProps {
  /** 自定义类名 */
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  /**
   * 处理回到首页点击事件
   */
  const handleGoHome = () => {
    window.location.href = 'https://zh.etowertech.com/';
  };

  /**
   * 处理登录/注册点击事件
   */
  const handleLogin = () => {
    // 跳转到登录注册页面
    window.location.href = '/walltech-vue3-auth';
  };

  return (
    <header className={`bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/WX20250627-182147@2x.png" 
              alt="WallTech Logo" 
              className="h-8 w-auto"
            />
            <button 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              onClick={handleGoHome}
            >
              回到首页
            </button>
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center space-x-4">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors"
              onClick={handleLogin}
            >
              登录/注册
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;