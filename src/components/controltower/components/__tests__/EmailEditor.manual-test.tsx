/**
 * Manual Test Component for EmailEditor Variable Insertion
 * 
 * This component can be temporarily added to your app to manually test
 * the EmailEditor variable insertion functionality.
 * 
 * Usage:
 * 1. Import this component in your App.tsx or any route
 * 2. Render it: <EmailEditorManualTest />
 * 3. Test the functionality according to the checklist below
 * 
 * Test Checklist:
 * ✓ Variable selector button appears at top-right
 * ✓ Click button opens popover
 * ✓ Search input filters variables (fuzzy search)
 * ✓ Click variable inserts it as {variableName}
 * ✓ Popover closes after insertion
 * ✓ onInsertVariable callback fires with correct params
 * ✓ "未找到匹配的变量" shows when no matches
 * ✓ Button hidden when variableList is empty
 */

import React, { useState } from 'react';
import { Card, Space, Typography, Divider } from '@arco-design/web-react';
import EmailEditor from '../EmailEditor';

const { Title, Text } = Typography;

const EmailEditorManualTest: React.FC = () => {
  const [contentValue, setContentValue] = useState('<p>Email content here...</p>');
  const [footerValue, setFooterValue] = useState('<p>Footer signature here...</p>');
  const [emptyListValue, setEmptyListValue] = useState('<p>Test with empty variable list...</p>');
  const [insertLog, setInsertLog] = useState<Array<{ variable: string; field: string; timestamp: string }>>([]);

  // Test variable list
  const testVariables = [
    '订单号',
    '客户名称',
    '客户电话',
    '客户邮箱',
    '发货日期',
    '收货地址',
    '订单金额',
    '订单状态',
    '物流单号',
    '预计送达时间'
  ];

  const handleInsertVariable = (variable: string, field: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setInsertLog(prev => [...prev, { variable, field, timestamp }]);
    console.log('Variable inserted:', { variable, field, timestamp });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title heading={3}>EmailEditor Variable Insertion - Manual Test</Title>
      <Text type="secondary">
        Test the variable insertion functionality according to the requirements
      </Text>

      <Divider />

      {/* Test Case 1: Content field with variables */}
      <Card 
        title="Test Case 1: Email Content (with variables)" 
        style={{ marginBottom: '24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <strong>Test:</strong> Variable selector should appear at top-right. 
            Click to open, search for variables, and insert.
          </Text>
          <EmailEditor
            value={contentValue}
            onChange={setContentValue}
            variableList={testVariables}
            onInsertVariable={handleInsertVariable}
            fieldName="content"
          />
          <div style={{ marginTop: '12px', padding: '12px', background: '#f7f8fa', borderRadius: '4px' }}>
            <Text type="secondary">Current HTML:</Text>
            <pre style={{ fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
              {contentValue}
            </pre>
          </div>
        </Space>
      </Card>

      {/* Test Case 2: Footer field with variables */}
      <Card 
        title="Test Case 2: Footer Signature (with variables)" 
        style={{ marginBottom: '24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <strong>Test:</strong> Variable selector should appear at top-right. 
            Test with different field name.
          </Text>
          <EmailEditor
            value={footerValue}
            onChange={setFooterValue}
            variableList={testVariables}
            onInsertVariable={handleInsertVariable}
            fieldName="footer"
          />
          <div style={{ marginTop: '12px', padding: '12px', background: '#f7f8fa', borderRadius: '4px' }}>
            <Text type="secondary">Current HTML:</Text>
            <pre style={{ fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
              {footerValue}
            </pre>
          </div>
        </Space>
      </Card>

      {/* Test Case 3: Empty variable list */}
      <Card 
        title="Test Case 3: Empty Variable List" 
        style={{ marginBottom: '24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <strong>Test:</strong> Variable selector button should NOT appear when variableList is empty.
          </Text>
          <EmailEditor
            value={emptyListValue}
            onChange={setEmptyListValue}
            variableList={[]}
            onInsertVariable={handleInsertVariable}
            fieldName="test-empty"
          />
        </Space>
      </Card>

      {/* Test Case 4: Fuzzy Search Test */}
      <Card 
        title="Test Case 4: Fuzzy Search" 
        style={{ marginBottom: '24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <strong>Test Instructions:</strong>
          </Text>
          <ul style={{ marginLeft: '20px' }}>
            <li>Click "插入变量" button</li>
            <li>Type "订单" in search box → Should show: 订单号, 订单金额, 订单状态</li>
            <li>Type "客户" in search box → Should show: 客户名称, 客户电话, 客户邮箱</li>
            <li>Type "xyz" in search box → Should show: "未找到匹配的变量"</li>
            <li>Clear search → Should show all variables</li>
          </ul>
        </Space>
      </Card>

      {/* Test Case 5: Callback Verification */}
      <Card 
        title="Test Case 5: onInsertVariable Callback Log" 
        style={{ marginBottom: '24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <strong>Test:</strong> Verify callback is fired with correct parameters.
            Insert variables in any editor above and check the log below.
          </Text>
          <div style={{ 
            padding: '12px', 
            background: '#f7f8fa', 
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <Text type="secondary">Callback Log:</Text>
            {insertLog.length === 0 ? (
              <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                No variables inserted yet. Insert a variable to see the callback log.
              </Text>
            ) : (
              <div style={{ marginTop: '8px' }}>
                {insertLog.map((log, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: '8px', 
                      marginBottom: '4px',
                      background: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  >
                    <Text>
                      [{log.timestamp}] variable: "{log.variable}", field: "{log.field}"
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Space>
      </Card>

      {/* Test Checklist */}
      <Card title="Test Checklist" style={{ marginBottom: '24px' }}>
        <Space direction="vertical">
          <Text><strong>Manual Testing Checklist:</strong></Text>
          <div style={{ marginLeft: '20px' }}>
            <div>☐ Variable selector button appears at top-right (4px from top, 4px from right)</div>
            <div>☐ Button has blue styling (#165DFF)</div>
            <div>☐ Button has z-index: 10 (appears above editor content)</div>
            <div>☐ Click button opens popover</div>
            <div>☐ Popover contains search input with placeholder "搜索变量..."</div>
            <div>☐ Search input filters variables (case-insensitive)</div>
            <div>☐ Typing "订单" shows only variables containing "订单"</div>
            <div>☐ Typing "xyz" shows "未找到匹配的变量" message</div>
            <div>☐ Click variable inserts it as {'{variableName}'}</div>
            <div>☐ Variable is appended to existing content</div>
            <div>☐ Popover closes after insertion</div>
            <div>☐ Search text is cleared after insertion</div>
            <div>☐ onInsertVariable callback fires (check log above)</div>
            <div>☐ Callback receives correct variable name</div>
            <div>☐ Callback receives correct field name</div>
            <div>☐ Button is hidden when variableList is empty (Test Case 3)</div>
            <div>☐ Variable items have hover effect (background changes)</div>
            <div>☐ Clear button in search input works</div>
          </div>
        </Space>
      </Card>

      {/* Requirements Coverage */}
      <Card title="Requirements Coverage">
        <Space direction="vertical">
          <Text><strong>Requirements Tested:</strong></Text>
          <div style={{ marginLeft: '20px' }}>
            <div>✓ Requirement 1.1: Variable selector positioned at top-right corner</div>
            <div>✓ Requirement 1.2: Variable selector displays with absolute positioning</div>
            <div>✓ Requirement 1.3: Variable selector has z-index: 10</div>
            <div>✓ Requirement 1.4: Variable selector stays fixed when scrolling</div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default EmailEditorManualTest;
