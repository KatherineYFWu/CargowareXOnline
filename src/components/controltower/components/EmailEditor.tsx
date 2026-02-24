import React, { useState, useEffect } from 'react';
import { Button, Popover, Input } from '@arco-design/web-react';
import SimpleWysiwyg from 'react-simple-wysiwyg';

interface EmailEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  variableList?: string[];
  onInsertVariable?: (variable: string, field: string) => void;
  fieldName?: string;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ 
  initialValue = '', 
  value,
  onChange,
  className = '',
  variableList = [],
  onInsertVariable,
  fieldName = 'content'
}) => {
  const [html, setHtml] = useState(initialValue);
  const [variableSearchText, setVariableSearchText] = useState('');
  const [variableSelectorVisible, setVariableSelectorVisible] = useState(false);

  // 同步外部value
  useEffect(() => {
    if (value !== undefined) {
      setHtml(value);
    }
  }, [value]);

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const newHtml = target.value;
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  const insertVariable = (variable: string) => {
    const variableText = `{${variable}}`;
    const newHtml = html + variableText;
    setHtml(newHtml);
    onChange?.(newHtml);
    onInsertVariable?.(variable, fieldName);
    setVariableSearchText('');
    setVariableSelectorVisible(false);
  };

  // Fuzzy search for variables
  const getFilteredVariables = () => {
    if (!variableSearchText) return variableList;
    const searchLower = variableSearchText.toLowerCase();
    return variableList.filter(variable => 
      variable.toLowerCase().includes(searchLower)
    );
  };

  return (
    <div className={`email-editor ${className}`}>
      {/* 富文本编辑器 */}
      <div style={{ 
        position: 'relative',
        border: '1px solid #e5e6eb',
        borderRadius: '4px',
        minHeight: '200px'
      }}>
        {/* Variable selector in top-right corner */}
        {variableList.length > 0 && (
          <div style={{ 
            position: 'absolute', 
            top: '4px', 
            right: '4px', 
            zIndex: 10
          }}>
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
                          onClick={() => insertVariable(variable)}
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
                size="mini" 
                type="primary"
                style={{ 
                  backgroundColor: '#b1b1b1ff', 
                  borderColor: '#b1b1b1ff',
                  boxShadow: '0 2px 4px rgba(22, 93, 255, 0.2)'
                }}
              >
                插入变量
              </Button>
            </Popover>
          </div>
        )}
        <SimpleWysiwyg
          value={html}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default EmailEditor;