# Requirements Document

## Introduction

This specification defines Phase 2 UI/UX improvements for the notification system, focusing on icon consistency, button styling, role association, and variable insertion enhancements across Notification Subscription Settings and Notification Template Settings pages.

## Glossary

- **System**: The notification management system within CargoWareX
- **User**: Any authenticated user with access to system settings
- **Operation**: A triggerable action that can send notifications
- **Template**: A predefined message format for notifications
- **Warning Icon**: An Arco Design icon component indicating missing templates
- **Variable Selector**: A button component for inserting dynamic variables into templates
- **Role**: A user role that can be associated with operations (e.g., Sales, Business, Marketing)

## Requirements

### Requirement 1: Warning Icon Standardization

**User Story:** As a user viewing notification subscription settings, I want warning icons to use Arco Design components and hide when switches are off, so that I have a consistent and clear visual experience.

#### Acceptance Criteria

1. WHEN THE User views the operation list in subscription settings, THE System SHALL display warning icons using IconExclamationCircleFill from @arco-design/web-react/icon
2. WHEN an operation has no associated template, THE System SHALL display the warning icon in red color (#f53f3f)
3. WHEN an operation row switch is turned off, THE System SHALL hide the warning icon for that operation
4. WHEN an operation row switch is turned on AND the operation has no template, THE System SHALL display the warning icon
5. WHEN THE User hovers over the warning icon, THE System SHALL display a tooltip with the message "该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板"


### Requirement 2: Enable/Disable Button Width Optimization

**User Story:** As a user managing operations, I want enable/disable buttons to have adequate width, so that the buttons are easy to click and visually comfortable.

#### Acceptance Criteria

1. WHEN THE User views the operation management table, THE System SHALL display enable/disable buttons with a minimum width of 80 pixels
2. WHEN THE User views the operation management table, THE System SHALL ensure adequate spacing between enable/disable and delete buttons
3. WHEN THE User views enable/disable buttons, THE System SHALL display them with consistent padding and border radius
4. WHEN THE User views a disabled operation, THE System SHALL display the enable button with green accent styling
5. WHEN THE User views an enabled operation, THE System SHALL display the disable button with orange accent styling

### Requirement 3: Associated Roles Field for Operations

**User Story:** As a system administrator creating or editing operations, I want to associate roles with operations, so that I can define which roles are relevant to each operation.

#### Acceptance Criteria

1. WHEN THE User creates a new operation, THE System SHALL display an "Associated Roles" field in the operation form
2. WHEN THE User edits an existing operation, THE System SHALL display the "Associated Roles" field with pre-selected roles
3. WHEN THE User views the "Associated Roles" field, THE System SHALL display a multi-select dropdown with search capability
4. WHEN THE User views the role options, THE System SHALL display: Sales (销售), Business (商务), Marketing (营销), Operations (运营), Customer Service (客服)
5. WHEN THE User types in the search bar, THE System SHALL filter role options using fuzzy search
6. WHEN THE User selects multiple roles, THE System SHALL display selected roles as tags within the input field
7. WHEN THE User saves an operation, THE System SHALL persist the associated roles with the operation data


### Requirement 4: Email Template Modal UI Optimization

**User Story:** As a user creating email templates, I want an improved UI with better variable insertion and simplified rich text editing, so that I can create templates more efficiently.

#### Acceptance Criteria

1. WHEN THE User creates or edits an email template, THE System SHALL display a visually optimized modal with improved spacing and layout
2. WHEN THE User views the "Email Subject" field, THE System SHALL display a blue variable insertion button using the new VariableSelector component
3. WHEN THE User views the "Email Content" rich text editor, THE System SHALL display a blue variable insertion button positioned at the top-right corner of the editor
4. WHEN THE User views the "Footer Signature" rich text editor, THE System SHALL display a blue variable insertion button positioned at the top-right corner of the editor
5. WHEN THE User interacts with rich text editors, THE System SHALL NOT display emoji insertion functionality
6. WHEN THE User views the "Footer Signature" editor, THE System SHALL NOT display attachment upload functionality
7. WHEN THE User views the email template form, THE System SHALL display either a toolbar with text input OR a comprehensive rich text editor, but NOT both simultaneously
8. WHEN THE User clicks a variable insertion button, THE System SHALL display a dropdown with fuzzy search capability
9. WHEN THE User selects a variable, THE System SHALL insert it at the cursor position with proper formatting {variableName}

### Requirement 5: WeChat Template Variable Selector Styling

**User Story:** As a user creating WeChat templates, I want variable insertion buttons to have blue styling, so that they are visually consistent with email template variable selectors.

#### Acceptance Criteria

1. WHEN THE User creates or edits a WeChat template, THE System SHALL display all variable insertion buttons with blue background color (#165DFF or Arco Design primary blue)
2. WHEN THE User views variable selectors in text content fields, THE System SHALL display blue-styled insertion buttons
3. WHEN THE User views variable selectors in card description fields, THE System SHALL display blue-styled insertion buttons
4. WHEN THE User views variable selectors in title fields, THE System SHALL display blue-styled insertion buttons
5. WHEN THE User hovers over a variable insertion button, THE System SHALL display a darker blue hover state
6. WHEN THE User clicks a variable insertion button, THE System SHALL maintain consistent blue styling in the active state

