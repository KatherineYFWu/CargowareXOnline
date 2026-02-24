# Design Document

## Overview

本设计文档描述了操作管理UI增强功能的技术实现方案。核心目标是通过引入Arco Design的Cascader（级联选择器）和Select（多选选择器）组件，替换现有的简单Input输入框，提升用户体验和数据准确性。

设计遵循以下原则：
- 保持与现有Arco Design组件库的一致性
- 最小化对现有代码结构的影响
- 提供良好的可扩展性以支持未来的数据源变更
- 确保新旧功能的平滑过渡

## Architecture

### Component Structure

```
NotificationSubscriptionSettings (主组件)
├── renderOperationModal (操作管理列表弹窗)
├── renderOperationEditModal (新建/编辑操作弹窗)
│   ├── OperationSourceCascader (操作来源级联选择器 - 新增)
│   ├── VariableMultiSelect (关联变量多选器 - 新增)
│   └── Form Fields (其他表单字段)
└── State Management (状态管理)
```

### Data Flow

1. **操作来源数据流**:
   - 定义三级操作点数据结构 → 转换为Cascader所需格式 → 用户选择 → 更新表单状态
   
2. **关联变量数据流**:
   - 定义可用变量列表 → 转换为Select所需格式 → 用户多选 → 更新表单状态

3. **表单提交流程**:
   - 收集表单数据 → 验证 → 转换为后端所需格式 → 调用创建/更新API



## Components and Interfaces

### 1. 操作来源级联选择器 (OperationSourceCascader)

#### Component Props
```typescript
interface OperationSourceCascaderProps {
  value?: string;  // 当前选中的值，格式: "一级菜单-二级菜单-组件"
  onChange: (value: string) => void;  // 值变更回调
  placeholder?: string;
  disabled?: boolean;
  error?: string;  // 错误信息
}
```

#### Component Implementation
- 使用Arco Design的`Cascader`组件
- 支持`showSearch`属性实现模糊搜索
- 使用`fieldNames`自定义字段映射
- 通过`renderFormat`自定义显示格式

### 2. 关联变量多选器 (VariableMultiSelect)

#### Component Props
```typescript
interface VariableMultiSelectProps {
  value?: string[];  // 当前选中的变量名数组
  onChange: (value: string[]) => void;  // 值变更回调
  placeholder?: string;
  disabled?: boolean;
  error?: string;  // 错误信息
}
```

#### Component Implementation
- 使用Arco Design的`Select`组件，设置`mode="multiple"`
- 支持`showSearch`和`filterOption`实现模糊搜索
- 使用`maxTagCount`控制显示的标签数量
- 通过`renderTag`自定义标签样式

### 3. 操作编辑弹窗 (OperationEditModal)

#### Modal Structure
```typescript
interface OperationEditModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  initialValues?: Partial<OperationManagement>;
  onSubmit: (values: OperationFormValues) => void;
  onCancel: () => void;
}

interface OperationFormValues {
  name: string;
  source: string;  // 级联选择器返回的完整路径
  status: '启用' | '停用';
  variables: string[];  // 多选器返回的变量名数组
  remark?: string;
}
```



## Data Models

### 操作点数据结构 (Operation Points)

```typescript
interface OperationPoint {
  value: string;  // 唯一标识
  label: string;  // 显示名称
  children?: OperationPoint[];  // 子级
}

// 示例数据
const operationPointsData: OperationPoint[] = [
  {
    value: 'super-freight',
    label: '超级运价',
    children: [
      {
        value: 'inquiry-quote',
        label: '询价报价',
        children: [
          { value: 'add-inquiry', label: '新增询价' },
          { value: 'add-quote', label: '新增报价' },
          { value: 'edit-inquiry', label: '编辑询价' },
          { value: 'edit-quote', label: '编辑报价' }
        ]
      },
      {
        value: 'order-management',
        label: '订单管理',
        children: [
          { value: 'create-order', label: '创建订单' },
          { value: 'cancel-order', label: '取消订单' },
          { value: 'confirm-order', label: '确认订单' }
        ]
      }
    ]
  },
  {
    value: 'quote-management',
    label: '报价管理',
    children: [
      {
        value: 'operations',
        label: '操作',
        children: [
          { value: 'submit-quote', label: '提交报价' },
          { value: 'modify-quote', label: '更改报价' },
          { value: 'withdraw-quote', label: '撤回报价' }
        ]
      }
    ]
  },
  {
    value: 'order-system',
    label: '订单管理',
    children: [
      {
        value: 'order-ops',
        label: '订单操作',
        children: [
          { value: 'order-create', label: '创建' },
          { value: 'order-modify', label: '修改' },
          { value: 'order-delete', label: '删除' },
          { value: 'order-confirm', label: '确认' },
          { value: 'order-cancel', label: '取消' }
        ]
      }
    ]
  }
];
```

### 关联变量数据结构 (Variables)

```typescript
interface Variable {
  name: string;  // 变量名称
  type: string;  // 数据类型: string, datetime, float, int, boolean
  description?: string;  // 变量描述
}

// 示例数据
const availableVariables: Variable[] = [
  { name: '操作人姓名', type: 'string', description: '执行操作的用户姓名' },
  { name: '操作人邮箱', type: 'string', description: '执行操作的用户邮箱' },
  { name: '操作时间', type: 'datetime', description: '操作发生的时间戳' },
  { name: '询价单编号', type: 'string', description: '询价单的唯一编号' },
  { name: '询价客户', type: 'string', description: '询价的客户名称' },
  { name: '报价单编号', type: 'string', description: '报价单的唯一编号' },
  { name: '报价金额', type: 'float', description: '报价的金额' },
  { name: '订单编号', type: 'string', description: '订单的唯一编号' },
  { name: '订单金额', type: 'float', description: '订单的总金额' },
  { name: '修改内容', type: 'string', description: '修改的具体内容' },
  { name: '撤回原因', type: 'string', description: '撤回操作的原因' },
  { name: '取消原因', type: 'string', description: '取消操作的原因' },
  { name: '原报价金额', type: 'float', description: '修改前的报价金额' },
  { name: '新报价金额', type: 'float', description: '修改后的报价金额' }
];
```

### 表单数据转换

```typescript
// 级联选择器值转换为显示字符串
function formatCascaderValue(values: string[]): string {
  // values: ['super-freight', 'inquiry-quote', 'add-inquiry']
  // 需要查找对应的label并拼接
  // 返回: "超级运价-询价报价-新增询价"
  return findLabelsFromValues(values, operationPointsData).join('-');
}

// 显示字符串解析为级联选择器值
function parseCascaderValue(displayValue: string): string[] {
  // displayValue: "超级运价-询价报价-新增询价"
  // 返回: ['super-freight', 'inquiry-quote', 'add-inquiry']
  return findValuesFromLabels(displayValue.split('-'), operationPointsData);
}

// 变量数组转换为Record格式（用于后端存储）
function variablesToRecord(variables: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  variables.forEach(varName => {
    const variable = availableVariables.find(v => v.name === varName);
    if (variable) {
      record[varName] = variable.type;
    }
  });
  return record;
}

// Record格式转换为变量数组（用于表单回显）
function recordToVariables(record: Record<string, string>): string[] {
  return Object.keys(record);
}
```



## Error Handling

### 表单验证

```typescript
interface ValidationErrors {
  name?: string;
  source?: string;
  status?: string;
  variables?: string;
  remark?: string;
}

function validateOperationForm(values: OperationFormValues): ValidationErrors {
  const errors: ValidationErrors = {};
  
  // 操作名称验证
  if (!values.name || values.name.trim() === '') {
    errors.name = '操作名称未填写';
  } else if (values.name.length > 50) {
    errors.name = '操作名称过长（最多50个字符）';
  } else if (!/^[\u4e00-\u9fa5a-zA-Z_]+$/.test(values.name)) {
    errors.name = '操作名称只能包含中英文和下划线';
  }
  
  // 操作来源验证
  if (!values.source || values.source.trim() === '') {
    errors.source = '操作来源未选择';
  }
  
  // 操作状态验证
  if (!values.status) {
    errors.status = '操作状态未选择';
  }
  
  // 关联变量验证
  if (!values.variables || values.variables.length === 0) {
    errors.variables = '关联变量未选择';
  }
  
  // 备注验证
  if (values.remark && values.remark.length > 5000) {
    errors.remark = '备注过长（最多5000个字符）';
  }
  
  return errors;
}
```

### 错误提示策略

1. **实时验证**: 在用户离开字段时（onBlur）进行验证
2. **提交验证**: 在用户点击确定按钮时进行完整验证
3. **错误显示**: 在字段下方显示红色错误文本
4. **错误清除**: 当用户修改字段值时自动清除该字段的错误

### 异常处理

```typescript
// 数据加载失败
function handleDataLoadError(error: Error) {
  Message.error('数据加载失败，请刷新页面重试');
  console.error('Failed to load operation points:', error);
}

// 表单提交失败
function handleSubmitError(error: Error) {
  Message.error('操作失败，请稍后重试');
  console.error('Failed to submit operation:', error);
}

// 数据格式错误
function handleDataFormatError(error: Error) {
  Message.warning('数据格式不正确，请检查输入');
  console.error('Invalid data format:', error);
}
```



## Testing Strategy

### Unit Tests

1. **数据转换函数测试**
   - 测试`formatCascaderValue`正确转换级联值为显示字符串
   - 测试`parseCascaderValue`正确解析显示字符串为级联值
   - 测试`variablesToRecord`正确转换变量数组为Record
   - 测试`recordToVariables`正确转换Record为变量数组

2. **表单验证测试**
   - 测试必填字段验证
   - 测试字段长度验证
   - 测试字段格式验证
   - 测试边界条件

3. **组件渲染测试**
   - 测试OperationSourceCascader正确渲染
   - 测试VariableMultiSelect正确渲染
   - 测试错误状态正确显示

### Integration Tests

1. **表单交互测试**
   - 测试用户选择操作来源后表单状态更新
   - 测试用户选择关联变量后表单状态更新
   - 测试表单提交流程
   - 测试表单取消流程

2. **模态框测试**
   - 测试新建操作模态框打开/关闭
   - 测试编辑操作模态框打开/关闭并正确回显数据
   - 测试模态框内的表单验证

### Manual Testing Checklist

- [ ] 操作来源级联选择器能正确展开三级菜单
- [ ] 操作来源搜索功能能正确过滤选项
- [ ] 关联变量多选器能正确显示所有可用变量
- [ ] 关联变量搜索功能能正确过滤选项
- [ ] 选中的变量能正确显示为标签
- [ ] 能正确删除已选中的变量标签
- [ ] 新建操作时表单验证正常工作
- [ ] 编辑操作时能正确回显现有数据
- [ ] 编辑操作时表单验证正常工作
- [ ] 提交后数据能正确保存
- [ ] 错误提示能正确显示
- [ ] UI布局在不同屏幕尺寸下正常显示



## UI Design Improvements

### Modal Layout

```
┌─────────────────────────────────────────────────────────┐
│  新建操作 / 编辑操作                                [X]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  操作名称 *                                              │
│  ┌────────────────────────────────────────────────┐    │
│  │ [输入操作名称]                                  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  操作来源 *                                              │
│  ┌────────────────────────────────────────────────┐    │
│  │ [请选择操作来源]                          [▼]  │    │
│  └────────────────────────────────────────────────┘    │
│    └─ 超级运价                                          │
│        └─ 询价报价                                      │
│            ├─ 新增询价                                  │
│            └─ 新增报价                                  │
│                                                          │
│  操作状态 *                                              │
│  ┌────────────────────────────────────────────────┐    │
│  │ [请选择状态]                              [▼]  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  关联变量 *                                              │
│  ┌────────────────────────────────────────────────┐    │
│  │ [操作人姓名 x] [操作时间 x] [搜索...]    [▼]  │    │
│  └────────────────────────────────────────────────┘    │
│    ├─ 操作人姓名 (string)                               │
│    ├─ 操作人邮箱 (string)                               │
│    ├─ 操作时间 (datetime)                               │
│    └─ ...                                               │
│                                                          │
│  备注                                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │ [输入备注信息]                                  │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                      [取消]  [确定]     │
└─────────────────────────────────────────────────────────┘
```

### Style Specifications

```typescript
const modalStyles = {
  width: 600,
  minWidth: 600,
  maxWidth: 800
};

const formItemStyles = {
  marginBottom: 24,
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const labelStyles = {
  fontWeight: 500,
  fontSize: 14,
  color: '#1d2129',
  marginBottom: 8
};

const inputStyles = {
  height: 36,
  fontSize: 14
};

const errorStyles = {
  color: '#f53f3f',
  fontSize: 12,
  marginTop: 4
};

const cascaderStyles = {
  width: '100%',
  dropdownMenuColumnStyle: {
    maxHeight: 300
  }
};

const selectStyles = {
  width: '100%',
  maxTagCount: 3,
  dropdownStyle: {
    maxHeight: 300
  }
};
```

### Interaction States

1. **默认状态**: 边框颜色 #e5e6eb
2. **悬停状态**: 边框颜色 #4e5969
3. **聚焦状态**: 边框颜色 #165dff，阴影效果
4. **错误状态**: 边框颜色 #f53f3f，显示错误文本
5. **禁用状态**: 背景色 #f7f8fa，文字颜色 #c9cdd4

### Accessibility Considerations

- 所有表单字段都有明确的label
- 必填字段标记清晰（红色星号）
- 错误信息与字段关联明确
- 键盘导航支持（Tab键切换）
- 下拉选项支持键盘选择（上下箭头）
- 足够的颜色对比度（WCAG AA标准）
- 合理的触摸目标大小（最小44x44px）



## Implementation Notes

### Arco Design Components Usage

#### Cascader Component
```typescript
import { Cascader } from '@arco-design/web-react';

<Cascader
  placeholder="请选择操作来源"
  options={operationPointsData}
  showSearch
  allowClear
  onChange={(value, selectedOptions) => {
    // value: ['super-freight', 'inquiry-quote', 'add-inquiry']
    // 转换为显示格式: "超级运价-询价报价-新增询价"
    const displayValue = selectedOptions.map(opt => opt.label).join('-');
    handleSourceChange(displayValue);
  }}
  filterOption={(inputValue, option) => {
    // 自定义搜索逻辑：支持拼音、首字母搜索
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  }}
  style={{ width: '100%' }}
/>
```

#### Select Component (Multi-select)
```typescript
import { Select } from '@arco-design/web-react';

<Select
  mode="multiple"
  placeholder="请选择关联变量"
  showSearch
  allowClear
  maxTagCount={3}
  value={selectedVariables}
  onChange={(value) => {
    handleVariablesChange(value);
  }}
  filterOption={(inputValue, option) => {
    return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
  }}
  style={{ width: '100%' }}
>
  {availableVariables.map(variable => (
    <Select.Option key={variable.name} value={variable.name}>
      {variable.name} ({variable.type})
    </Select.Option>
  ))}
</Select>
```

### State Management

```typescript
// 在NotificationSubscriptionSettings组件中添加状态
const [operationFormValues, setOperationFormValues] = useState<OperationFormValues>({
  name: '',
  source: '',
  status: '启用',
  variables: [],
  remark: ''
});

const [operationFormErrors, setOperationFormErrors] = useState<ValidationErrors>({});

// 处理字段变更
const handleFieldChange = (field: keyof OperationFormValues, value: any) => {
  setOperationFormValues(prev => ({
    ...prev,
    [field]: value
  }));
  
  // 清除该字段的错误
  if (operationFormErrors[field]) {
    setOperationFormErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  }
};

// 处理表单提交
const handleFormSubmit = () => {
  const errors = validateOperationForm(operationFormValues);
  
  if (Object.keys(errors).length > 0) {
    setOperationFormErrors(errors);
    return;
  }
  
  // 转换数据格式
  const submitData = {
    ...operationFormValues,
    variables: variablesToRecord(operationFormValues.variables)
  };
  
  if (editingOperation) {
    handleEditOperation(submitData);
  } else {
    handleCreateOperation(submitData);
  }
};
```

### Performance Considerations

1. **数据缓存**: 操作点数据和变量数据应该在组件加载时获取一次，缓存在state中
2. **搜索优化**: 对于大量选项，考虑使用防抖（debounce）优化搜索性能
3. **虚拟滚动**: 如果选项数量超过100个，考虑使用虚拟滚动优化渲染性能
4. **懒加载**: 级联选择器的子级可以考虑懒加载，减少初始数据量

### Migration Strategy

1. **向后兼容**: 保留对旧数据格式的支持，在读取时进行转换
2. **渐进式迁移**: 新建的操作使用新格式，旧的操作在编辑时自动转换
3. **数据验证**: 在保存前验证数据格式，确保数据一致性

