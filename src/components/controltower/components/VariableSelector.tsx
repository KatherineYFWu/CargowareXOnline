import React, { useState } from 'react';
import { Button, Popover, Input } from '@arco-design/web-react';

interface VariableSelectorProps {
  variableList: string[];
  onInsert: (variable: string) => void;
  buttonText?: string;
  buttonSize?: 'mini' | 'small' | 'default' | 'large';
  buttonStyle?: React.CSSProperties;
  position?: 'absolute' | 'relative';
  positionStyle?: React.CSSProperties;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({
  variableList,
  onInsert,
  buttonText = '插入变量',
  buttonSize = 'mini',
  buttonStyle = {},
  position = 'absolute',
  positionStyle = { top: '4px', right: '4px' }
}) => {
  const [variableSelectorVisible, setVariableSelectorVisible] = useState(false);
  const [variableSearchText, setVariableSearchText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Fuzzy search for variables
  const getFilteredVariables = () => {
    if (!variableSearchText) return variableList;
    
    const searchLower = variableSearchText.toLowerCase();
    return variableList.filter(variable => 
      variable.toLowerCase().includes(searchLower)
    );
  };

  const handleInsertVariable = (variable: string) => {
    onInsert(variable);
    setVariableSelectorVisible(false);
    setVariableSearchText('');
  };

  // Determine if we're using blue styling
  const isBlueStyle = buttonStyle.backgroundColor === '#165DFF';
  
  // Calculate button style with hover and active states
  const getButtonStyle = (): React.CSSProperties => {
    const baseColor = buttonStyle.backgroundColor || '#7466F0';
    const baseBorderColor = buttonStyle.borderColor || '#7466F0';
    
    let backgroundColor = baseColor;
    let borderColor = baseBorderColor;
    
    if (isBlueStyle) {
      if (isActive) {
        backgroundColor = '#0E42D2';
        borderColor = '#0E42D2';
      } else if (isHovered) {
        backgroundColor = '#4080FF';
        borderColor = '#4080FF';
      }
    }
    
    return {
      backgroundColor,
      borderColor,
      transition: 'all 0.2s ease',
      ...buttonStyle
    };
  };

  const containerStyle: React.CSSProperties = position === 'absolute' 
    ? { position: 'absolute', zIndex: 10, ...positionStyle }
    : { display: 'inline-block', ...positionStyle };

  return (
    <div style={containerStyle}>
      <Popover
        trigger="click"
        position="br"
        popupVisible={variableSelectorVisible}
        onVisibleChange={setVariableSelectorVisible}
        content={
          <div style={{ width: '250px', maxHeight: '300px' }}>
            <div style={{ padding: '8px', borderBottom: '1px solid #e5e6eb' }}>
              <Input
                placeholder="搜索变量..."
                value={variableSearchText}
                onChange={setVariableSearchText}
                allowClear
                size="small"
              />
            </div>
            <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '4px' }}>
              {getFilteredVariables().length > 0 ? (
                getFilteredVariables().map(variable => (
                  <div
                    key={variable}
                    onClick={() => handleInsertVariable(variable)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f7f8fa'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {variable}
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: '#86909c' }}>
                  未找到匹配的变量
                </div>
              )}
            </div>
          </div>
        }
      >
        <Button 
          size={buttonSize}
          type="primary"
          style={getButtonStyle()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
        >
          {buttonText}
        </Button>
      </Popover>
    </div>
  );
};

export default VariableSelector;
