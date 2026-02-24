# Design Document

## Overview

This design document outlines the UI/UX enhancements for the notification management system. The improvements focus on explicit search controls, rich content editing capabilities, enhanced component interactions, and proactive error prevention through visual warnings.

## Architecture

### Component Structure

```
AlertCenter (Main Container)
├── NotificationSubscriptionSettings
│   ├── OperationManagementModal
│   │   ├── FilterSection (with Search Button)
│   │   └── OperationTable (with Delete Button & Warning Icons)
│   └── SubscriptionMatrix
├── NotificationTemplateSettings
│   ├── EmailTemplateTab
│   │   ├── FilterBar (with Search Button)
│   │   ├── TemplateTable (with Toggle Enable/Disable)
│   │   └── EmailTemplateModal
│   │       ├── RichTextEditor (for content)
│   │       ├── RichTextEditor (for footer)
│   │       └── VariableSelector (integrated)
│   └── WeChatTemplateTab
│       ├── FilterBar (with Search Button)
│       ├── TemplateTable (with Toggle Enable/Disable)
│       └── WeChatTemplateModal
│           ├── EnhancedOperationSelector
│           ├── TemplateTypeSelector (with File option)
│           ├── FileUploadArea (conditional)
│           └── ImprovedVariableSelectors
└── EmailConfigTab
```

### State Management

Each component will manage its own local state for:
- Filter criteria (not applied until search button clicked)
- Modal visibility states
- Form data
- File upload status
- Template-operation associations

## Components and Interfaces

### 1. Enhanced Filter Section with Search Button

**Location:** Operation Management Modal, Email Template Tab, WeChat Template Tab

**Design:**
```typescript
interface FilterSectionProps {
  filters: Record<string, string>;
  onFilterChange: (field: string, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}
```

**UI Layout:**
- Filter inputs arranged horizontally
- "Search" button (primary style) next to filter inputs
- "Reset" button (outline style) after search button
- Filters only applied when "Search" is clicked



### 2. Operation Delete Button with Confirmation

**Location:** Operation Management Modal - Operation Table

**Design:**
```typescript
interface DeleteConfirmationProps {
  operationName: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**UI Behavior:**
- Delete button positioned after Enable/Disable button
- Click triggers centered modal dialog
- Modal contains: "是否确定删除该操作？"
- Two buttons: "确定" (primary, danger) and "取消" (outline)
- Success message after deletion

### 3. Rich Text Editor for Email Templates

**Location:** Email Template Modal (Create/Edit)

**Design:**
```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  variableList: string[];
  onInsertVariable?: (variable: string) => void;
  placeholder?: string;
}
```

**Features:**
- Toolbar with formatting options:
  - Text formatting: Bold, Italic, Underline
  - Font size and color
  - Lists (ordered/unordered)
  - Alignment (left, center, right)
- Insert capabilities:
  - Images (upload or URL)
  - Hyperlinks
  - Tables
  - Attachments
- Variable selector dropdown in top-right corner:
  - Fuzzy search input
  - Multi-select capability
  - Inserts at cursor position
- Minimum height: 200px
- Auto-expanding based on content

**Implementation Notes:**
- Use existing EmailEditor component as base
- Enhance with additional toolbar options
- Integrate variable selector into editor header
- Remove separate "Email Attachments" field from form

### 4. Enhanced Operation Selector for WeChat Templates

**Location:** WeChat Template Modal (Create/Edit)

**Design:**
```typescript
interface EnhancedOperationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  operations: Array<{id: string; name: string}>;
}
```

**UI Components:**
- Dropdown with integrated search bar
- Search bar contains:
  - Text input with fuzzy search
  - Magnifying glass icon button (triggers search)
  - Trash can icon button (clears input)
- Dropdown list shows filtered results
- Single selection mode



### 5. Improved Variable Selector

**Location:** WeChat Template Modal (all template types)

**Design:**
```typescript
interface VariableSelectorProps {
  value: string[];
  onChange: (values: string[]) => void;
  variables: Array<{name: string; type: string}>;
  mode?: 'single' | 'multiple';
}
```

**UI Features:**
- Dropdown with search input at top
- Fuzzy search on variable names
- Clear visual hierarchy
- Shows variable type alongside name
- Consistent styling across all instances

### 6. File Upload for WeChat Templates

**Location:** WeChat Template Modal (when Template Type = "File")

**Design:**
```typescript
interface FileUploadAreaProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}
```

**UI Layout:**
```
┌─────────────────────────────────────┐
│  📁 拖拽文件到此处或点击上传           │
│                                     │
│  [已上传: filename.pdf (2.5MB)]     │
│  [×] 删除                           │
└─────────────────────────────────────┘
```

**Behavior:**
- Drag-and-drop zone with visual feedback
- Click to open file browser
- Display uploaded file name and size
- Replace existing file on new upload
- Delete button to remove file
- Validation on form submit

**Validation Rules:**
- Required when template type is "File"
- Maximum file size: 10MB (configurable)
- Error message: "文件未上传" if missing
- Error message: "文件大小超过限制" if too large

### 7. Toggle Enable/Disable Button

**Location:** Email Template Table, WeChat Template Table

**Design:**
```typescript
interface TemplateStatusButtonProps {
  status: 'enabled' | 'disabled';
  onToggle: () => void;
  operationId: string;
}
```

**UI Behavior:**
- When disabled: Show "启用" button (outline style)
- When enabled: Show "停用" button (filled style)
- Click toggles status
- Auto-disable other templates for same operation
- Success message on status change
- Button text changes immediately after click



### 8. Missing Template Warning Indicator

**Location:** Notification Subscription Settings - Operation Name Column

**Design:**
```typescript
interface OperationWithWarningProps {
  operationId: string;
  operationName: string;
  hasEmailTemplate: boolean;
  hasWeChatTemplate: boolean;
}
```

**UI Components:**
- Red exclamation mark icon (⚠️) next to operation name
- Icon only shown when operation has no templates
- Tooltip on hover with message:
  "该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板"

**Visual Design:**
```
操作名称: 提交询价 ⚠️
         ↑
    (red icon, hoverable)
```

**Logic:**
```typescript
const hasTemplate = (operationId: string) => {
  const hasEmail = emailTemplates.some(t => 
    t.operationId === operationId && t.status === '启用'
  );
  const hasWeChat = wechatTemplates.some(t => 
    t.operationId === operationId && t.status === '启用'
  );
  return hasEmail || hasWeChat;
};
```

## Data Models

### Operation
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
}
```

### Email Template
```typescript
interface EmailTemplate {
  id: string;
  templateName: string;
  operationId: string;
  operationName: string;
  description?: string;
  status: '启用' | '停用';
  creator: string;
  lastUpdated: string;
  subject: string;
  content: string; // Rich HTML content
  footer?: string; // Rich HTML content
  redirectLink?: string;
  // attachments removed - now part of rich content
}
```

### WeChat Template
```typescript
interface WeChatTemplate {
  id: string;
  operationId: string;
  operationName: string;
  description?: string;
  status: '启用' | '停用';
  templateType: '纯文本' | '文本卡片' | '图文消息' | '文件';
  creator: string;
  lastUpdated: string;
  content: any; // Type varies by templateType
  file?: {
    name: string;
    size: number;
    url: string;
  };
}
```



## Error Handling

### Validation Rules

1. **Operation Deletion**
   - Cannot delete if it's the last operation of its type
   - Show error: "无法删除最后一个操作"

2. **File Upload (WeChat Template)**
   - Required when template type is "File"
   - Error: "文件未上传"
   - Max size validation: "文件大小超过限制（最大10MB）"
   - File type validation if needed

3. **Rich Text Editor**
   - Content required for email templates
   - Error: "邮件内容未填写"
   - Footer optional but validated if signature enabled

4. **Template Status Toggle**
   - Only one template per operation can be enabled
   - Auto-disable others when enabling one
   - Success message: "模板已启用，其他同操作模板已停用"

### User Feedback

**Success Messages:**
- "操作删除成功"
- "筛选已应用"
- "模板已启用"
- "模板已停用"
- "邮件模板保存成功"
- "企微模板保存成功"

**Error Messages:**
- "文件未上传"
- "文件大小超过限制（最大10MB）"
- "邮件内容未填写"
- "无法删除最后一个操作"
- "该操作名称已存在"

**Warning Messages:**
- Tooltip: "该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板"

## Testing Strategy

### Unit Tests

1. **Filter Search Button**
   - Test that filters don't apply on input change
   - Test that filters apply on search button click
   - Test reset button clears all filters

2. **Delete Confirmation**
   - Test modal appears on delete click
   - Test operation removed on confirm
   - Test modal closes on cancel without deletion

3. **Rich Text Editor**
   - Test variable insertion at cursor position
   - Test image upload functionality
   - Test link insertion
   - Test table creation
   - Test content persistence

4. **File Upload**
   - Test drag-and-drop functionality
   - Test click-to-upload
   - Test file replacement
   - Test size validation
   - Test required validation

5. **Template Status Toggle**
   - Test button text changes on click
   - Test other templates disabled when one enabled
   - Test status persists after page refresh

6. **Missing Template Warning**
   - Test icon appears for operations without templates
   - Test icon disappears when template created
   - Test tooltip displays correct message



### Integration Tests

1. **End-to-End Filter Flow**
   - Enter filter criteria
   - Click search
   - Verify filtered results
   - Click reset
   - Verify all results shown

2. **Template Creation with Rich Content**
   - Create email template with formatted content
   - Insert variables
   - Add images and links
   - Save and verify content preserved

3. **WeChat File Template Flow**
   - Select "File" template type
   - Upload file
   - Save template
   - Verify file associated with template

4. **Template Status Management**
   - Enable template A for operation X
   - Verify template B for operation X disabled
   - Switch to template B
   - Verify template A disabled

5. **Warning Indicator Flow**
   - Create operation without template
   - Verify warning icon appears
   - Create template for operation
   - Verify warning icon disappears

## UI/UX Considerations

### Accessibility
- All buttons have clear labels
- Icons have tooltips
- Form fields have proper labels
- Error messages are clearly visible
- Keyboard navigation supported

### Responsive Design
- Filter sections wrap on smaller screens
- Modals are scrollable on small screens
- Rich text editor toolbar adapts to width
- File upload area maintains usability on mobile

### Performance
- Fuzzy search debounced (300ms)
- Large file uploads show progress
- Rich text editor optimized for large content
- Filter operations optimized for large datasets

### Consistency
- All search buttons use same styling
- All variable selectors use same pattern
- All confirmation dialogs use same format
- All success/error messages use same toast style

## Migration Notes

### Breaking Changes
- Email template `attachments` field removed (now part of rich content)
- WeChat template `templateType` enum expanded to include '文件'

### Backward Compatibility
- Existing templates will continue to work
- Old attachment data can be migrated to rich content format
- Filter behavior change is non-breaking (just requires explicit search)

### Data Migration
```typescript
// Migrate old email templates with separate attachments
const migrateEmailTemplate = (oldTemplate: OldEmailTemplate): EmailTemplate => {
  let content = oldTemplate.content;
  
  // Append attachment references to content if they exist
  if (oldTemplate.attachments && oldTemplate.attachments.length > 0) {
    content += '\n<div class="attachments">';
    oldTemplate.attachments.forEach(att => {
      content += `<a href="${att.url}">${att.name}</a>`;
    });
    content += '</div>';
  }
  
  return {
    ...oldTemplate,
    content,
    // attachments field removed
  };
};
```

