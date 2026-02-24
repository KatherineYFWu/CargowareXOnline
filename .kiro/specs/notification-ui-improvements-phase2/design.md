# Design Document

## Overview

This design document outlines Phase 2 UI/UX improvements for the notification management system. The enhancements focus on visual consistency using Arco Design components, improved button styling and spacing, role association functionality, and streamlined variable insertion across email and WeChat templates.

## Architecture

### Component Structure

```
NotificationSubscriptionSettings
├── SubscriptionMatrix
│   └── OperationRow
│       ├── OperationName
│       │   └── WarningIcon (Arco IconExclamationCircleFill, conditional)
│       └── SwitchControls (hide warning when off)
└── OperationManagementModal
    ├── OperationForm
    │   ├── AssociatedRolesField (new multi-select with search)
    │   └── EnableDisableButton (improved width)
    └── OperationTable
        └── ActionButtons (improved spacing)

NotificationTemplateSettings
├── EmailTemplateModal
│   ├── SubjectField
│   │   └── BlueVariableSelector (new styling)
│   ├── ContentEditor
│   │   └── BlueVariableSelector (top-right, no emoji)
│   └── FooterEditor
│       └── BlueVariableSelector (top-right, no attachments)
└── WeChatTemplateModal
    ├── TextContentField
    │   └── BlueVariableSelector (updated styling)
    ├── CardDescriptionField
    │   └── BlueVariableSelector (updated styling)
    └── TitleField
        └── BlueVariableSelector (updated styling)
```

### State Management

Additional state requirements:
- Associated roles for each operation (string array)
- Switch state for each operation row (to control warning icon visibility)
- Variable selector styling configuration (blue theme)


## Components and Interfaces

### 1. Warning Icon Component (Arco Design)

**Location:** NotificationSubscriptionSettings - Operation Name Column

**Design:**
```typescript
import { IconExclamationCircleFill } from '@arco-design/web-react/icon';
import { Tooltip } from '@arco-design/web-react';

interface OperationWarningProps {
  operationId: string;
  operationName: string;
  hasTemplate: boolean;
  switchEnabled: boolean;
}

const OperationWarning: React.FC<OperationWarningProps> = ({
  operationId,
  operationName,
  hasTemplate,
  switchEnabled
}) => {
  const showWarning = !hasTemplate && switchEnabled;
  
  return (
    <Space size="small">
      <Text>{operationName}</Text>
      {showWarning && (
        <Tooltip content="该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板">
          <IconExclamationCircleFill style={{ color: '#f53f3f', fontSize: '16px' }} />
        </Tooltip>
      )}
    </Space>
  );
};
```

**Visual Design:**
- Icon color: #f53f3f (Arco Design danger red)
- Icon size: 16px
- Spacing: 8px gap between name and icon
- Only visible when switch is ON and template is missing

### 2. Enhanced Enable/Disable Button

**Location:** Operation Management Modal - Action Column

**Design:**
```typescript
interface EnableDisableButtonProps {
  status: '启用' | '停用';
  onToggle: () => void;
}

const EnableDisableButton: React.FC<EnableDisableButtonProps> = ({ status, onToggle }) => {
  return (
    <div style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 12px',
      height: '28px',
      minWidth: '80px',
      borderRadius: '4px',
      backgroundColor: status === '启用' ? '#fff7e8' : '#f6ffed',
      border: `1px solid ${status === '启用' ? '#ffd588' : '#b7eb8f'}`,
      color: status === '启用' ? '#ff7d00' : '#00b42a',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onClick={onToggle}
    >
      {status === '启用' ? '停用' : '启用'}
    </div>
  );
};
```

**Styling:**
- Minimum width: 80px
- Height: 28px
- Padding: 0 12px
- Border radius: 4px
- Spacing between buttons: 12px gap
- Enable state: Green background (#f6ffed), green border (#b7eb8f), green text (#00b42a)
- Disable state: Orange background (#fff7e8), orange border (#ffd588), orange text (#ff7d00)


### 3. Associated Roles Multi-Select Field

**Location:** Operation Management Modal - Create/Edit Form

**Design:**
```typescript
interface AssociatedRolesFieldProps {
  value: string[];
  onChange: (roles: string[]) => void;
}

const roleOptions = [
  { label: '销售', value: 'sales' },
  { label: '商务', value: 'business' },
  { label: '营销', value: 'marketing' },
  { label: '运营', value: 'operations' },
  { label: '客服', value: 'customer-service' }
];

const AssociatedRolesField: React.FC<AssociatedRolesFieldProps> = ({ value, onChange }) => {
  return (
    <Form.Item 
      label="关联角色" 
      field="associatedRoles"
      rules={[{ type: 'array', minLength: 1, message: '请至少选择一个关联角色' }]}
    >
      <Select
        mode="multiple"
        placeholder="请选择关联角色"
        showSearch
        allowClear
        maxTagCount={3}
        value={value}
        onChange={onChange}
        filterOption={(inputValue, option) => {
          return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
        }}
      >
        {roleOptions.map(role => (
          <Select.Option key={role.value} value={role.value}>
            {role.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
```

**Features:**
- Multi-select mode with tag display
- Integrated search bar with fuzzy matching
- Maximum 3 tags shown, rest collapsed with "+N"
- Clear all button
- Required field validation

**Data Model Update:**
```typescript
interface Operation {
  id: string;
  name: string;
  source: string;
  status: '启用' | '停用';
  creator: string;
  lastUpdated: string;
  remark?: string;
  variables: Record<string, string>;
  associatedRoles: string[]; // NEW FIELD
}
```


### 4. Blue Variable Selector Component

**Location:** Email Template Modal, WeChat Template Modal

**Design:**
```typescript
interface BlueVariableSelectorProps {
  variableList: string[];
  onInsert: (variable: string) => void;
  position?: 'inline' | 'absolute';
  positionStyle?: React.CSSProperties;
  buttonSize?: 'mini' | 'small' | 'default';
}

const BlueVariableSelector: React.FC<BlueVariableSelectorProps> = ({
  variableList,
  onInsert,
  position = 'inline',
  positionStyle = {},
  buttonSize = 'small'
}) => {
  const [searchText, setSearchText] = useState('');
  
  const filteredVariables = variableList.filter(v => 
    v.toLowerCase().includes(searchText.toLowerCase())
  );
  
  return (
    <div style={position === 'absolute' ? { position: 'absolute', ...positionStyle } : {}}>
      <Dropdown
        trigger="click"
        droplist={
          <div style={{ padding: '8px', minWidth: '200px' }}>
            <Input
              size="small"
              placeholder="搜索变量"
              value={searchText}
              onChange={setSearchText}
              style={{ marginBottom: '8px' }}
            />
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredVariables.map(variable => (
                <div
                  key={variable}
                  onClick={() => onInsert(variable)}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f7f8fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {variable}
                </div>
              ))}
            </div>
          </div>
        }
      >
        <Button 
          size={buttonSize}
          type="primary"
          style={{ 
            backgroundColor: '#b1b1b1ff',
            borderColor: '#b1b1b1ff'
          }}
        >
          插入变量
        </Button>
      </Dropdown>
    </div>
  );
};
```

**Styling:**
- Background color: #165DFF (Arco Design primary blue)
- Border color: #165DFF
- Hover state: #4080FF (lighter blue)
- Active state: #0E42D2 (darker blue)
- Button sizes: mini (24px), small (28px), default (32px)
- Consistent across all instances

**Usage Patterns:**

1. **Email Subject Field:**
```tsx
<Input 
  placeholder="请输入邮件主题"
  suffix={
    <BlueVariableSelector
      variableList={variableList}
      onInsert={(v) => handleInsertVariable(v, 'subject')}
      buttonSize="mini"
    />
  }
/>
```

2. **Rich Text Editor (Content/Footer):**
```tsx
<div style={{ position: 'relative' }}>
  <EmailEditor value={content} onChange={setContent} />
  <BlueVariableSelector
    variableList={variableList}
    onInsert={(v) => handleInsertVariable(v, 'content')}
    position="absolute"
    positionStyle={{ top: '4px', right: '4px', zIndex: 10 }}
  />
</div>
```

3. **WeChat Template Fields:**
```tsx
<div style={{ position: 'relative' }}>
  <Input.TextArea placeholder="请输入文本内容" />
  <BlueVariableSelector
    variableList={variableList}
    onInsert={(v) => handleInsertVariable(v, 'text')}
    position="absolute"
    positionStyle={{ top: '4px', right: '4px' }}
    buttonSize="mini"
  />
</div>
```


### 5. Simplified Rich Text Editor

**Location:** Email Template Modal - Content and Footer Fields

**Design Decision:**

Remove duplicate functionality by choosing ONE of these approaches:

**Option A: Toolbar + Plain Text Input (Recommended)**
```tsx
<div>
  <div style={{ 
    display: 'flex', 
    gap: '8px', 
    padding: '8px', 
    borderBottom: '1px solid #e5e6eb',
    backgroundColor: '#fafafa'
  }}>
    <Button size="small" icon={<IconBold />} />
    <Button size="small" icon={<IconItalic />} />
    <Button size="small" icon={<IconUnderline />} />
    <Button size="small" icon={<IconLink />} />
    <Button size="small" icon={<IconImage />} />
    <Button size="small" icon={<IconTable />} />
    {/* Content field only */}
    <Button size="small" icon={<IconAttachment />} />
  </div>
  <Input.TextArea 
    rows={6}
    placeholder="请输入内容"
  />
</div>
```

**Option B: Comprehensive Rich Text Editor (Alternative)**
```tsx
<EmailEditor
  value={content}
  onChange={setContent}
  features={{
    formatting: true,
    images: true,
    links: true,
    tables: true,
    attachments: true, // Only for content field
    emoji: false, // Disabled per requirements
  }}
/>
```

**Recommendation:** Use Option A for better performance and simpler implementation.

**Removed Features:**
- Emoji insertion (both content and footer)
- Attachment upload in footer field
- Duplicate toolbar when using rich text editor

**Retained Features:**
- Text formatting (bold, italic, underline)
- Font size and color
- Image insertion (content only)
- Link insertion
- Table insertion
- Attachment upload (content only)


## Data Models

### Updated Operation Model
```typescript
interface Operation {
  id: string;
  name: string;
  source: string;
  status: '启用' | '停用';
  creator: string;
  lastUpdated: string;
  remark?: string;
  variables: Record<string, string>;
  associatedRoles: string[]; // NEW: Array of role identifiers
}
```

### Role Model
```typescript
interface Role {
  value: string; // 'sales', 'business', 'marketing', 'operations', 'customer-service'
  label: string; // '销售', '商务', '营销', '运营', '客服'
}
```

## Error Handling

### Validation Rules

1. **Associated Roles Field**
   - Required: At least one role must be selected
   - Error message: "请至少选择一个关联角色"
   - Validation trigger: On form submit

2. **Warning Icon Display**
   - Only show when switch is enabled AND template is missing
   - Hide immediately when switch is disabled
   - Update when template is created/deleted

### User Feedback

**Success Messages:**
- "操作已保存，关联角色已更新"
- "模板已创建，警告已清除"

**Info Messages:**
- Tooltip: "该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板"

## Testing Strategy

### Unit Tests

1. **Warning Icon Visibility**
   - Test icon shows when switch ON and no template
   - Test icon hides when switch OFF
   - Test icon hides when template exists
   - Test tooltip displays correct message

2. **Enable/Disable Button**
   - Test button width is at least 80px
   - Test button spacing is adequate
   - Test button colors match design
   - Test button text toggles correctly

3. **Associated Roles Field**
   - Test multi-select functionality
   - Test search/filter capability
   - Test tag display with maxTagCount
   - Test validation for empty selection
   - Test data persistence

4. **Blue Variable Selector**
   - Test button color is #165DFF
   - Test hover state changes color
   - Test dropdown opens on click
   - Test fuzzy search filters variables
   - Test variable insertion at cursor

5. **Rich Text Editor Simplification**
   - Test emoji button is removed
   - Test attachment button removed from footer
   - Test no duplicate toolbars present
   - Test all retained features work correctly


### Integration Tests

1. **Warning Icon Flow**
   - Create operation without template
   - Verify warning icon appears when switch is ON
   - Toggle switch OFF, verify icon disappears
   - Toggle switch ON, verify icon reappears
   - Create template for operation
   - Verify icon disappears permanently

2. **Operation with Roles Flow**
   - Create new operation
   - Select multiple associated roles
   - Save operation
   - Edit operation
   - Verify roles are pre-selected
   - Modify roles
   - Save and verify changes persist

3. **Email Template Variable Insertion**
   - Open email template modal
   - Click blue variable selector in subject
   - Search for variable
   - Insert variable
   - Verify {variableName} appears in subject
   - Repeat for content and footer fields

4. **WeChat Template Variable Insertion**
   - Open WeChat template modal
   - Select each template type
   - Click blue variable selector
   - Insert variables in all applicable fields
   - Verify consistent blue styling across all selectors

## UI/UX Considerations

### Visual Consistency
- All warning icons use Arco Design IconExclamationCircleFill
- All variable selectors use consistent blue (#165DFF)
- All enable/disable buttons have consistent sizing (min 80px width)
- All multi-select fields use same search pattern

### Accessibility
- Warning icons have descriptive tooltips
- Variable selector buttons have clear labels
- Role selection supports keyboard navigation
- Color contrast meets WCAG AA standards

### Performance
- Warning icon visibility calculated efficiently
- Role search debounced (300ms)
- Variable selector dropdown lazy-loaded
- Rich text editor optimized (removed unnecessary features)

### Responsive Design
- Enable/disable buttons maintain minimum width on all screens
- Variable selectors adapt to container width
- Role tags wrap appropriately in narrow containers
- Warning icons scale with font size

## Migration Notes

### Data Migration
```typescript
// Add associatedRoles field to existing operations
const migrateOperations = (operations: Operation[]): Operation[] => {
  return operations.map(op => ({
    ...op,
    associatedRoles: op.associatedRoles || [] // Default to empty array
  }));
};
```

### Component Updates
- Replace emoji text with IconExclamationCircleFill import
- Update VariableSelector component to accept blue styling prop
- Modify EmailEditor to disable emoji and conditional attachment features
- Add associatedRoles field to operation form schema

### Breaking Changes
- None - all changes are additive or visual improvements

