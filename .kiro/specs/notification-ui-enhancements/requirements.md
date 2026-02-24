# Requirements Document

## Introduction

This specification defines UI/UX enhancements for the notification system across three main pages: Notification Subscription Settings, Notification Template Settings (Email and WeChat), and Alert Center. The improvements focus on better search functionality, enhanced editing capabilities, and improved user feedback mechanisms.

## Glossary

- **System**: The notification management system within CargoWareX
- **User**: Any authenticated user with access to system settings
- **Operation**: A triggerable action that can send notifications
- **Template**: A predefined message format for notifications
- **Rich Text Editor**: An advanced text input component supporting formatting, images, links, tables, and attachments
- **Variable Selector**: A dropdown component for inserting dynamic variables into templates
- **Search Button**: An explicit button that triggers filtering operations
- **Modal Dialog**: A popup window for user confirmation or data entry

## Requirements

### Requirement 1: Operation Management Search Enhancement

**User Story:** As a system administrator, I want an explicit search button in the operation management filter section, so that I can control when filtering is applied and avoid unnecessary searches while typing.

#### Acceptance Criteria

1. WHEN THE User views the operation management modal, THE System SHALL display a "Search" button in the filter section
2. WHEN THE User enters filter criteria without clicking search, THE System SHALL NOT apply the filters automatically
3. WHEN THE User clicks the "Search" button, THE System SHALL apply all entered filter criteria to the operation list
4. WHEN THE User clicks the "Reset" button, THE System SHALL clear all filters and refresh the operation list

### Requirement 2: Operation Deletion Functionality

**User Story:** As a system administrator, I want to delete operations with a confirmation dialog, so that I can remove unnecessary operations while preventing accidental deletions.

#### Acceptance Criteria

1. WHEN THE User views an operation row, THE System SHALL display a "Delete" button after the "Enable/Disable" button
2. WHEN THE User clicks the "Delete" button, THE System SHALL display a centered modal dialog with the message "是否确定删除该操作？"
3. WHEN THE User clicks "Confirm" in the deletion dialog, THE System SHALL remove the operation from the list
4. WHEN THE User clicks "Cancel" in the deletion dialog, THE System SHALL close the dialog without deleting the operation
5. WHEN THE User deletes an operation, THE System SHALL display a success message


### Requirement 3: Email Template Filter Search Button

**User Story:** As a user managing email templates, I want an explicit search button in the filter bar, so that I can control when filtering is applied.

#### Acceptance Criteria

1. WHEN THE User views the email template list, THE System SHALL display a "Search" button in the filter bar
2. WHEN THE User enters filter criteria without clicking search, THE System SHALL NOT apply the filters automatically
3. WHEN THE User clicks the "Search" button, THE System SHALL apply all entered filter criteria to the template list
4. WHEN THE User clicks the "Reset" button, THE System SHALL clear all filters and refresh the template list

### Requirement 4: Email Template Rich Text Editor

**User Story:** As a user creating email templates, I want a comprehensive rich text editor for email content and footer, so that I can create professional-looking emails with formatting, images, links, tables, and attachments.

#### Acceptance Criteria

1. WHEN THE User creates or edits an email template, THE System SHALL display a rich text editor for the "Email Content" field
2. WHEN THE User creates or edits an email template, THE System SHALL display a rich text editor for the "Footer Signature" field
3. WHEN THE User interacts with the rich text editor, THE System SHALL provide text formatting options including bold, italic, underline, font size, and font color
4. WHEN THE User interacts with the rich text editor, THE System SHALL provide image insertion capability
5. WHEN THE User interacts with the rich text editor, THE System SHALL provide hyperlink insertion capability
6. WHEN THE User interacts with the rich text editor, THE System SHALL provide table insertion capability
7. WHEN THE User interacts with the rich text editor, THE System SHALL provide attachment upload capability
8. WHEN THE User views the rich text editor, THE System SHALL display a variable selector dropdown in the top-right corner with fuzzy search capability
9. WHEN THE User selects a variable from the dropdown, THE System SHALL insert the variable at the cursor position in the editor
10. WHEN THE User creates or edits an email template, THE System SHALL NOT display a separate "Email Attachments" field

### Requirement 5: WeChat Template Filter Search Button

**User Story:** As a user managing WeChat templates, I want an explicit search button in the filter bar, so that I can control when filtering is applied.

#### Acceptance Criteria

1. WHEN THE User views the WeChat template list, THE System SHALL display a "Search" button in the filter bar
2. WHEN THE User enters filter criteria without clicking search, THE System SHALL NOT apply the filters automatically
3. WHEN THE User clicks the "Search" button, THE System SHALL apply all entered filter criteria to the template list
4. WHEN THE User clicks the "Reset" button, THE System SHALL clear all filters and refresh the template list


### Requirement 6: WeChat Template Operation Selector Enhancement

**User Story:** As a user creating WeChat templates, I want an enhanced operation selector with search functionality, so that I can quickly find and select the appropriate operation.

#### Acceptance Criteria

1. WHEN THE User creates or edits a WeChat template, THE System SHALL display a dropdown selector for the "Trigger Operation" field with an integrated search bar
2. WHEN THE User views the operation selector search bar, THE System SHALL display a magnifying glass icon button and a trash can icon button
3. WHEN THE User clicks the magnifying glass button, THE System SHALL filter the operation list based on the search input
4. WHEN THE User clicks the trash can button, THE System SHALL clear the search input and reset the operation list
5. WHEN THE User types in the search bar, THE System SHALL perform fuzzy search on operation names

### Requirement 7: WeChat Template Variable Selector Update

**User Story:** As a user creating WeChat templates, I want an improved variable insertion interface, so that I can easily add dynamic variables to my templates.

#### Acceptance Criteria

1. WHEN THE User creates or edits a WeChat template, THE System SHALL display variable selector dropdowns matching the previously designed pattern
2. WHEN THE User interacts with a variable selector, THE System SHALL provide fuzzy search capability
3. WHEN THE User selects a variable, THE System SHALL insert it at the appropriate position in the template field

### Requirement 8: WeChat Template File Type Support

**User Story:** As a user creating WeChat templates, I want to send file attachments via WeChat notifications, so that I can share documents with recipients.

#### Acceptance Criteria

1. WHEN THE User creates or edits a WeChat template, THE System SHALL display "File" as an option in the "Template Type" field
2. WHEN THE User selects "File" as the template type, THE System SHALL display a file upload area
3. WHEN THE User views the file upload area, THE System SHALL support drag-and-drop file upload
4. WHEN THE User views the file upload area, THE System SHALL support click-to-browse file upload
5. WHEN THE User uploads a new file, THE System SHALL replace any previously uploaded file
6. WHEN THE User uploads a file, THE System SHALL display the file name and size
7. WHEN THE User clicks "Confirm" without uploading a file for a File-type template, THE System SHALL display an error message "文件未上传"
8. IF THE User uploads a file exceeding size limits, THEN THE System SHALL display an error message with the maximum allowed file size


### Requirement 9: WeChat Template Enable/Disable Toggle

**User Story:** As a user managing WeChat templates, I want the enable button to toggle to a disable button after activation, so that I can easily switch template status without confusion.

#### Acceptance Criteria

1. WHEN THE User views a disabled WeChat template, THE System SHALL display an "Enable" button
2. WHEN THE User clicks the "Enable" button, THE System SHALL activate the template and change the button to "Disable"
3. WHEN THE User views an enabled WeChat template, THE System SHALL display a "Disable" button
4. WHEN THE User clicks the "Disable" button, THE System SHALL deactivate the template and change the button to "Enable"
5. WHEN THE User enables a template, THE System SHALL disable other templates for the same operation
6. WHEN THE User changes template status, THE System SHALL display a success message

### Requirement 10: Email Template Enable/Disable Toggle

**User Story:** As a user managing email templates, I want the enable button to toggle to a disable button after activation, so that I can easily switch template status without confusion.

#### Acceptance Criteria

1. WHEN THE User views a disabled email template, THE System SHALL display an "Enable" button
2. WHEN THE User clicks the "Enable" button, THE System SHALL activate the template and change the button to "Disable"
3. WHEN THE User views an enabled email template, THE System SHALL display a "Disable" button
4. WHEN THE User clicks the "Disable" button, THE System SHALL deactivate the template and change the button to "Enable"
5. WHEN THE User enables a template, THE System SHALL disable other templates for the same operation
6. WHEN THE User changes template status, THE System SHALL display a success message

### Requirement 11: Missing Template Warning Indicator

**User Story:** As a system administrator, I want to see visual warnings for operations without templates, so that I can identify and fix potential notification failures.

#### Acceptance Criteria

1. WHEN THE User views the notification subscription settings operation list, THE System SHALL check if each operation has an associated template
2. IF an operation has no associated email or WeChat template, THEN THE System SHALL display a red exclamation mark icon next to the operation name
3. WHEN THE User hovers over the red exclamation mark icon, THE System SHALL display a tooltip with the message "该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板"
4. WHEN THE User views an operation with templates, THE System SHALL NOT display the warning icon
5. WHEN THE User creates a template for an operation, THE System SHALL remove the warning icon from that operation in the subscription settings

