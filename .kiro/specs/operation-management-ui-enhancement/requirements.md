# Requirements Document

## Introduction

本文档定义了【系统设置】-【预警中心】-【通知订阅设置】-【操作管理】功能的UI增强需求。主要目标是改进【新建操作】和【编辑操作】窗口的用户体验，通过引入多级菜单下拉选择器和多选下拉框来替代现有的简单文本输入方式，提升操作效率和数据准确性。

## Glossary

- **System**: 通知订阅设置系统
- **Operation_Management_Modal**: 操作管理弹窗，包含新建操作和编辑操作功能
- **Source_Selector**: 操作来源选择器，用于选择系统操作点
- **Variable_Selector**: 关联变量选择器，用于选择多个变量
- **User**: 系统管理员用户
- **Operation_Point**: 系统中的操作触发点，按三级结构组织（一级菜单-二级菜单-组件）

## Requirements

### Requirement 1: 操作来源字段改为多级菜单下拉单选

**User Story:** 作为系统管理员，我希望通过多级菜单选择操作来源，以便快速准确地定位系统操作点

#### Acceptance Criteria

1. WHEN User clicks on the "操作来源" field in the Operation_Management_Modal, THEN THE System SHALL display a cascading dropdown selector with three levels
2. THE System SHALL organize operation points in the Source_Selector as: Level 1 (e.g., "超级运价") → Level 2 (e.g., "询价报价") → Level 3 (e.g., "新增询价", "新增报价")
3. THE Source_Selector SHALL include a fuzzy search input field that filters options across all three levels
4. WHEN User types in the search field, THEN THE System SHALL display matching results showing the full path (Level1-Level2-Level3)
5. WHEN User selects an operation point, THEN THE System SHALL populate the "操作来源" field with the complete path string

### Requirement 2: 关联变量字段改为多选下拉框

**User Story:** 作为系统管理员，我希望通过多选下拉框选择关联变量，以便快速选择多个预定义变量

#### Acceptance Criteria

1. WHEN User clicks on the "关联变量" field in the Operation_Management_Modal, THEN THE System SHALL display a multi-select dropdown with available variables
2. THE Variable_Selector SHALL include a fuzzy search input field that filters variable options
3. WHEN User types in the search field, THEN THE System SHALL display matching variable names in real-time
4. THE System SHALL allow User to select multiple variables from the Variable_Selector
5. WHEN User selects variables, THEN THE System SHALL display selected variables as tags with remove buttons
6. THE System SHALL display variable data types (e.g., string, datetime, float) alongside variable names in the dropdown

### Requirement 3: 编辑操作窗口应用相同改进

**User Story:** 作为系统管理员，我希望编辑操作窗口具有与新建操作窗口相同的交互方式，以保持一致的用户体验

#### Acceptance Criteria

1. THE System SHALL apply the Source_Selector component to the "操作来源" field in the edit operation modal
2. THE System SHALL apply the Variable_Selector component to the "关联变量" field in the edit operation modal
3. WHEN User opens the edit operation modal, THEN THE System SHALL pre-populate the Source_Selector with the existing operation source value
4. WHEN User opens the edit operation modal, THEN THE System SHALL pre-populate the Variable_Selector with the existing selected variables
5. THE System SHALL maintain identical interaction patterns between create and edit modals

### Requirement 4: UI设计优化

**User Story:** 作为系统管理员，我希望操作管理窗口具有更合理的布局和交互设计，以提升整体使用体验

#### Acceptance Criteria

1. THE System SHALL display form fields in a logical vertical layout with consistent spacing
2. THE System SHALL display field labels with clear visual hierarchy and appropriate font weights
3. THE System SHALL display validation error messages inline below the corresponding field
4. THE System SHALL display required field indicators (asterisk) next to mandatory field labels
5. WHEN User interacts with dropdown selectors, THEN THE System SHALL display loading states if data fetching is required
6. THE System SHALL display helpful placeholder text in all input fields
7. THE System SHALL maintain a minimum modal width of 600px to accommodate multi-level selectors
8. THE System SHALL position action buttons (确定/取消) consistently at the bottom right of the modal
9. WHEN User hovers over dropdown options, THEN THE System SHALL provide visual feedback with background color change
10. THE System SHALL display tooltips for truncated text in dropdown options
