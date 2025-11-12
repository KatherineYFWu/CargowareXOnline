import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * 自定义Tooltip组件
 * @param content - 提示内容
 * @param children - 子元素
 * @param placement - 显示位置
 * @param className - 自定义样式类
 */
const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  placement = 'top',
  className = '' 
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * 计算Tooltip位置
   */
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top + scrollTop - tooltipRect.height - 8;
        left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollTop + 8;
        left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollLeft + 8;
        break;
    }

    // 边界检测
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 0) left = 8;
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    if (top < scrollTop) top = scrollTop + 8;
    if (top + tooltipRect.height > scrollTop + viewportHeight) {
      top = scrollTop + viewportHeight - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  /**
   * 鼠标进入事件
   */
  const handleMouseEnter = () => {
    setVisible(true);
  };

  /**
   * 鼠标离开事件
   */
  const handleMouseLeave = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      // 延迟计算位置，确保DOM已渲染
      setTimeout(calculatePosition, 0);
      
      // 监听窗口大小变化
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition);
      
      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition);
      };
    }
  }, [visible, placement]);

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      {visible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            top: position.top,
            left: position.left,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          <div className="relative">
            {/* Tooltip内容 */}
            <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg border border-gray-700">
              <div className="whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </div>
            
            {/* 箭头 */}
            <div 
              className="absolute w-2 h-2 bg-gray-800 border border-gray-700"
              style={{
                transform: 'rotate(45deg)',
                ...(placement === 'top' && {
                  bottom: '-5px',
                  left: '50%',
                  marginLeft: '-4px',
                  borderTop: 'none',
                  borderLeft: 'none'
                }),
                ...(placement === 'bottom' && {
                  top: '-5px',
                  left: '50%',
                  marginLeft: '-4px',
                  borderBottom: 'none',
                  borderRight: 'none'
                }),
                ...(placement === 'left' && {
                  right: '-5px',
                  top: '50%',
                  marginTop: '-4px',
                  borderTop: 'none',
                  borderRight: 'none'
                }),
                ...(placement === 'right' && {
                  left: '-5px',
                  top: '50%',
                  marginTop: '-4px',
                  borderBottom: 'none',
                  borderLeft: 'none'
                })
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;