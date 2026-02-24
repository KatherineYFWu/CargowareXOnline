# Design Document

## Overview

This design document outlines Phase 3 UI/UX improvements for the EmailEditor component. The focus is on simplifying the component by removing duplicate toolbars, eliminating emoji functionality, optimizing variable selector positioning, and relying on the SimpleWysiwyg component's built-in capabilities.

## Architecture

### Component Structure - Before

```
EmailEditor
├── Custom Toolbar (DUPLICATE)
│   ├── Formatting Buttons (bold, italic, underline, etc.)
│   ├── Font Controls (size, color, background)
│   ├── Alignment Buttons
│   ├── List Buttons
│   ├── Insert Buttons (link, image, table)
│   ├── Emoji Button (UNNECESSARY)
│   ├── Variable Selector (WRONG POSITION)
│   └── Attachment Upload
├── Editor Container
│   ├── Variable Selector (DUPLICATE, absolute positioned)
│   └── SimpleWysiwyg (has its own toolbar - DUPLICATE)
└── Modals (link, image, upload progress)
```

### Component Structure - After

```
EmailEditor
├── Editor Container (relative positioned)
│   ├── Variable Selector (absolute: top-right, blue styled)
│   └── SimpleWysiwyg (single source of formatting)
│       └── Built-in Toolbar (all formatting capabilities)
└── Modals (link, image, upload progress - if needed by SimpleWysiwyg)
```

## Components and Interfaces

### 1. Simplified EmailEditor Component

**Location:** src/components/controltower/components/EmailEditor.tsx

**Design:**

```typescript
interface EmailEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  variableList?: string[];
  onInsertVariable?: (variable: string, field: string) => void;
  showEmoji?: boolean; // Will be ignored - always false
  showAttachment?: boolean;
  fieldName?: string;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ 
  initialValue = '', 
  value,
  onChange,
  className = '',
  variableList = [],
  onInsertVariable,
  showEmoji = false, // Ignored
  showAttachment = true,
  fieldName = 'content'
}) => {
  const [html, setHtml] = useState(initialValue);
  const [variableSearchText, setVariableSearchText] = useState('');
  const [variableSelectorVisible, setVariableSelectorVisible] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    if (value !== undefined) {
      setHtml(value);
    }
  }, [value]);

  const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newHtml = e.currentTarget.innerHTML;
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

  const getFilteredVariables = () => {
    if (!variableSearchText) return variableList;
    const searchLower = variableSearchText.toLowerCase();
    return variableList.filter(variable => 
      variable.toLowerCase().includes(searchLower)
    );
  };

  return (
    <div className={`email-editor ${className}`} ref={editorRef}>
      {/* Editor container with relative positioning */}
      <div 
        className="editor-container" 
        style={{ 
          position: 'relative',
          border: '1px solid #e5e6eb',
          borderRadius: '4px',
          minHeight: '200px'
        }}
      >
        {/* Variable selector - absolutely positioned at top-right */}
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
                  backgroundColor: '#b9b9b9ff', 
                  borderColor: '#b9b9b9ff',
                  boxShadow: '0 2px 4px rgba(22, 93, 255, 0.2)'
                }}
              >
                插入变量
              </Button>
            </Popover>
          </div>
        )}
        
        {/* SimpleWysiwyg - single source of truth for editing */}
        <SimpleWysiwyg
          value={html}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
```

**Key Changes:**

1. **Removed Custom Toolbar**: Eliminated the entire `editor-toolbar` div with all custom formatting buttons
2. **Removed Emoji**: Completely removed emoji-related code (commonEmojis array, renderEmojiPanel function, emoji button)
3. **Removed Duplicate Variable Selector**: Removed the variable selector from the toolbar, kept only the absolutely positioned one
4. **Removed Formatting Functions**: Removed execCommand, applyFormat, and all related formatting logic
5. **Removed Insert Modals**: Removed link modal, image modal, and table insertion functions (rely on SimpleWysiwyg)
6. **Removed Upload Logic**: Removed file upload handling (can be added back if SimpleWysiwyg doesn't support it)
7. **Simplified State**: Removed unnecessary state variables for modals and formatting

### 2. Variable Selector Positioning

**Visual Design:**

```
┌─────────────────────────────────────────────────┐
│ Editor Container (relative)                     │
│                                    ┌──────────┐ │
│                                    │插入变量  │ │ ← 4px from top
│                                    └──────────┘ │ ← 4px from right
│                                                 │
│  SimpleWysiwyg Editor Content                  │
│  User types here...                            │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Positioning Specifications:**
- Position: `absolute`
- Top: `4px`
- Right: `4px`
- Z-index: `10`
- Button color: `#165DFF` (Arco Design primary blue)
- Button size: `small`
- Box shadow: `0 2px 4px rgba(22, 93, 255, 0.2)`

### 3. SimpleWysiwyg Configuration

**Built-in Features to Rely On:**

SimpleWysiwyg provides its own toolbar with:
- Text formatting (bold, italic, underline, strikethrough)
- Headings (H1-H6)
- Lists (ordered, unordered)
- Links
- Images
- Code blocks
- Blockquotes
- Horizontal rules

**Custom Features to Maintain:**
- Variable insertion (via blue button at top-right)
- Variable search/filter functionality
- Variable insertion at cursor position

### 4. Attachment Upload Handling

**Decision:** 

Since SimpleWysiwyg may not have built-in attachment upload, we have two options:

**Option A: Remove Attachment Upload Entirely**
- Simplest approach
- Users can insert links to attachments manually
- Reduces component complexity

**Option B: Add Minimal Attachment Upload**
- Keep file input and upload logic
- Add a small upload button near variable selector
- Only show when `showAttachment={true}`

**Recommendation:** Start with Option A. If attachment upload is critical, implement Option B as a minimal addition.

## Data Flow

### Variable Insertion Flow

```
User clicks "插入变量" button
  ↓
Popover opens with search input
  ↓
User types to filter variables (fuzzy search)
  ↓
User clicks a variable from filtered list
  ↓
Variable inserted as {variableName} into editor
  ↓
onInsertVariable callback fired
  ↓
Popover closes
```

### Content Change Flow

```
User types in SimpleWysiwyg editor
  ↓
SimpleWysiwyg onChange event fires
  ↓
handleChange extracts innerHTML
  ↓
Local state updated (setHtml)
  ↓
Parent onChange callback fired
  ↓
Parent component receives updated HTML
```

## Removed Features

### 1. Custom Toolbar
- **Removed:** Entire toolbar div with formatting buttons
- **Reason:** Duplicate of SimpleWysiwyg's built-in toolbar
- **Impact:** Cleaner UI, less code to maintain

### 2. Emoji Functionality
- **Removed:** Emoji button, emoji panel, commonEmojis array
- **Reason:** Not needed for professional email templates
- **Impact:** Simplified component, reduced bundle size

### 3. Custom Formatting Functions
- **Removed:** execCommand, applyFormat, font size selector, color pickers
- **Reason:** SimpleWysiwyg handles all formatting
- **Impact:** Less code, rely on library's tested implementation

### 4. Custom Insert Modals
- **Removed:** Link modal, image modal, table insertion
- **Reason:** SimpleWysiwyg provides these features
- **Impact:** Simpler component, consistent UX

### 5. Duplicate Variable Selector
- **Removed:** Variable selector in toolbar
- **Reason:** Keep only the absolutely positioned one
- **Impact:** Single source of truth for variable insertion

### 6. Auto-height Logic
- **Removed:** Complex height calculation and MutationObserver
- **Reason:** SimpleWysiwyg handles its own sizing
- **Impact:** Simpler component, better performance

## Usage Examples

### Email Content Field (with attachment)

```tsx
<EmailEditor
  value={emailContent}
  onChange={setEmailContent}
  variableList={['订单号', '客户名称', '发货日期']}
  onInsertVariable={handleVariableInsert}
  showAttachment={true}
  fieldName="content"
/>
```

### Footer Signature Field (no attachment, no emoji)

```tsx
<EmailEditor
  value={footerSignature}
  onChange={setFooterSignature}
  variableList={['公司名称', '联系电话', '公司地址']}
  onInsertVariable={handleVariableInsert}
  showAttachment={false}
  showEmoji={false}
  fieldName="footer"
/>
```

## Error Handling

### Variable Insertion Errors

**Scenario:** Variable list is empty
- **Handling:** Don't render variable selector button
- **User Experience:** Clean interface without unnecessary buttons

**Scenario:** Search returns no results
- **Handling:** Show "未找到匹配的变量" message
- **User Experience:** Clear feedback that search has no matches

### Content Change Errors

**Scenario:** onChange callback fails
- **Handling:** Local state still updates, user can continue editing
- **User Experience:** No interruption to editing flow

## Testing Strategy

### Unit Tests

1. **Variable Selector Positioning**
   - Test button is positioned at top: 4px, right: 4px
   - Test button has z-index: 10
   - Test button is visible when variableList has items
   - Test button is hidden when variableList is empty

2. **Variable Insertion**
   - Test variable insertion adds {variableName} to content
   - Test fuzzy search filters variables correctly
   - Test onInsertVariable callback is fired with correct parameters
   - Test popover closes after variable insertion

3. **Emoji Removal**
   - Test no emoji button is rendered
   - Test no emoji panel is rendered
   - Test showEmoji prop has no effect

4. **Toolbar Removal**
   - Test custom toolbar div is not rendered
   - Test no duplicate formatting buttons exist
   - Test SimpleWysiwyg is the only editor component

5. **Attachment Handling**
   - Test showAttachment prop is respected
   - Test footer field never shows attachment upload

### Integration Tests

1. **Email Content Editing Flow**
   - Open email template modal
   - Type content in editor
   - Insert variable via blue button
   - Verify variable appears in content
   - Verify onChange callback receives updated HTML

2. **Footer Editing Flow**
   - Open email template modal
   - Type footer content
   - Verify no emoji button present
   - Verify no attachment button present
   - Insert variable via blue button
   - Verify variable appears in footer

3. **Variable Search Flow**
   - Click variable selector button
   - Type search term
   - Verify filtered list updates
   - Select variable
   - Verify variable inserted correctly

## Performance Considerations

### Improvements from Simplification

1. **Reduced Bundle Size**
   - Removed custom formatting code
   - Removed emoji data
   - Removed modal components
   - Estimated reduction: ~5-10KB minified

2. **Reduced Re-renders**
   - Removed auto-height calculation
   - Removed MutationObserver
   - Simpler state management
   - Fewer useEffect hooks

3. **Faster Initial Render**
   - No custom toolbar to render
   - No emoji panel to prepare
   - Simpler component tree

### Potential Concerns

1. **SimpleWysiwyg Performance**
   - Monitor performance with large content
   - May need to add debouncing to onChange if needed

2. **Variable Selector Dropdown**
   - Already optimized with fuzzy search
   - Consider virtualization if variable list exceeds 100 items

## Migration Notes

### Breaking Changes

**None** - The component interface remains the same. Only internal implementation changes.

### Behavioral Changes

1. **Formatting Options**
   - Users now use SimpleWysiwyg's built-in toolbar
   - Formatting options may look slightly different
   - All essential formatting still available

2. **Variable Selector Location**
   - Now only at top-right of editor (removed from toolbar)
   - More consistent positioning
   - Better visibility

3. **No Emoji**
   - Emoji button no longer available
   - Users can still paste emoji from other sources
   - Cleaner, more professional interface

### Component Updates Required

**NotificationTemplateSettings.tsx:**
```tsx
// Before: Multiple props, some ignored
<EmailEditor
  value={content}
  onChange={setContent}
  variableList={variables}
  showEmoji={true}  // Was shown, now ignored
  showAttachment={true}
/>

// After: Simplified, showEmoji removed or set to false
<EmailEditor
  value={content}
  onChange={setContent}
  variableList={variables}
  showEmoji={false}  // Explicitly false
  showAttachment={true}
  fieldName="content"
/>

// Footer field
<EmailEditor
  value={footer}
  onChange={setFooter}
  variableList={variables}
  showEmoji={false}
  showAttachment={false}  // No attachment in footer
  fieldName="footer"
/>
```

## UI/UX Considerations

### Visual Consistency
- Variable selector uses consistent blue (#165DFF) across all instances
- Button positioning is consistent (always top-right)
- Editor styling matches Arco Design system

### Accessibility
- Variable selector button has clear label "插入变量"
- Keyboard navigation supported via Popover component
- Search input in variable selector is keyboard accessible
- SimpleWysiwyg provides its own accessibility features

### User Experience
- Cleaner interface without duplicate toolbars
- Variable selector is always visible and accessible
- Formatting options are consolidated in one place
- Professional appearance without emoji clutter

### Responsive Design
- Variable selector adapts to container width
- SimpleWysiwyg handles responsive behavior
- Popover positioning adjusts based on available space
