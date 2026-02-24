# Requirements Document

## Introduction

This specification defines Phase 3 UI/UX improvements for the EmailEditor component, focusing on eliminating duplicate functionality, improving variable selector positioning, and removing unnecessary features from rich text editors.

## Glossary

- **System**: The EmailEditor component within the notification template system
- **User**: Any authenticated user creating or editing email templates
- **Rich Text Editor**: The SimpleWysiwyg component used for email content and footer editing
- **Toolbar**: The button bar above the rich text editor providing formatting options
- **Variable Selector**: A blue button component for inserting dynamic variables into templates
- **Email Content Field**: The main body content editor for email templates
- **Footer Signature Field**: The footer/signature editor for email templates

## Requirements

### Requirement 1: Variable Selector Positioning Optimization

**User Story:** As a user editing email templates, I want the variable insertion button to be positioned at the top-right corner of the rich text editor, so that it is easily accessible and doesn't interfere with content editing.

#### Acceptance Criteria

1. WHEN THE User views the Email Content rich text editor, THE System SHALL display the variable insertion button positioned at the top-right corner inside the editor container
2. WHEN THE User views the Footer Signature rich text editor, THE System SHALL display the variable insertion button positioned at the top-right corner inside the editor container
3. WHEN THE User views the variable insertion button, THE System SHALL display it with absolute positioning at top: 4px, right: 4px
4. WHEN THE User views the variable insertion button, THE System SHALL display it with z-index: 10 to ensure visibility above editor content
5. WHEN THE User scrolls the editor content, THE System SHALL keep the variable insertion button fixed at the top-right corner of the editor container

### Requirement 2: Emoji Functionality Removal

**User Story:** As a user editing email content and footer, I want emoji insertion functionality removed, so that the interface is simplified and focused on professional email content.

#### Acceptance Criteria

1. WHEN THE User views the Email Content editor toolbar, THE System SHALL NOT display the emoji insertion button
2. WHEN THE User views the Footer Signature editor toolbar, THE System SHALL NOT display the emoji insertion button
3. WHEN THE User views the Email Content editor, THE System SHALL NOT provide any emoji selection panel
4. WHEN THE User views the Footer Signature editor, THE System SHALL NOT provide any emoji selection panel
5. WHEN showEmoji prop is false, THE System SHALL completely hide all emoji-related UI elements

### Requirement 3: Duplicate Toolbar Elimination

**User Story:** As a user editing email templates, I want to see only one set of formatting controls, so that the interface is cleaner and less confusing.

#### Acceptance Criteria

1. WHEN THE User views the Email Content editor, THE System SHALL display only the SimpleWysiwyg rich text editor without the custom toolbar
2. WHEN THE User views the Footer Signature editor, THE System SHALL display only the SimpleWysiwyg rich text editor without the custom toolbar
3. WHEN THE User needs formatting options, THE System SHALL provide all formatting through the SimpleWysiwyg built-in toolbar
4. WHEN THE User views the editor, THE System SHALL NOT display duplicate formatting buttons (bold, italic, underline, etc.)
5. WHEN THE User views the editor, THE System SHALL NOT display duplicate insertion buttons (link, image, table, etc.)

### Requirement 4: Attachment Upload Conditional Display

**User Story:** As a user editing email templates, I want attachment upload available only in the content field, so that footer signatures remain clean and focused.

#### Acceptance Criteria

1. WHEN THE User views the Email Content editor AND showAttachment is true, THE System SHALL display the attachment upload button in the SimpleWysiwyg toolbar
2. WHEN THE User views the Footer Signature editor, THE System SHALL NOT display the attachment upload button regardless of showAttachment prop
3. WHEN showAttachment is false, THE System SHALL hide the attachment upload button from all editors
4. WHEN THE User uploads an attachment in the content field, THE System SHALL insert the attachment link into the editor content
5. WHEN THE User views the footer editor, THE System SHALL ensure no attachment upload functionality is accessible

### Requirement 5: Simplified EmailEditor Component Interface

**User Story:** As a developer using the EmailEditor component, I want a simplified interface that relies on the built-in rich text editor capabilities, so that the component is easier to maintain and use.

#### Acceptance Criteria

1. WHEN THE EmailEditor component is rendered, THE System SHALL use SimpleWysiwyg as the primary editing interface
2. WHEN THE EmailEditor component receives showEmoji prop as false, THE System SHALL not render any emoji-related code
3. WHEN THE EmailEditor component receives showAttachment prop, THE System SHALL conditionally configure the SimpleWysiwyg toolbar
4. WHEN THE EmailEditor component renders the variable selector, THE System SHALL position it absolutely within the editor container
5. WHEN THE EmailEditor component is used, THE System SHALL not render the custom toolbar div with formatting buttons
6. WHEN THE User interacts with the editor, THE System SHALL rely on SimpleWysiwyg's native formatting capabilities
