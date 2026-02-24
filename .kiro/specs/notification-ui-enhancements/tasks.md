# Implementation Plan

- [x] 1. Implement search button functionality for filter sections





  - Add search button to operation management filter section
  - Add search button to email template filter bar
  - Add search button to WeChat template filter bar
  - Implement controlled filter state (only apply on search click)
  - Update reset button behavior to clear filters and refresh lists
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3, 5.4_

- [x] 2. Add operation deletion with confirmation dialog





  - Add delete button to operation table rows after enable/disable button
  - Create centered confirmation modal component
  - Implement delete confirmation logic with "确定" and "取消" buttons
  - Add success message after deletion
  - Handle edge cases (prevent deleting last operation)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_



- [x] 3. Enhance email template editor with rich text capabilities



- [x] 3.1 Integrate rich text editor for email content field


  - Replace basic textarea with rich text editor component
  - Add formatting toolbar (bold, italic, underline, font size, color)
  - Implement image insertion functionality
  - Implement hyperlink insertion functionality
  - Implement table insertion functionality
  - Add attachment upload capability within editor
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 3.2 Integrate rich text editor for footer signature field




  - Replace basic textarea with rich text editor component
  - Apply same formatting capabilities as content editor
  - _Requirements: 4.2_


- [x] 3.3 Add variable selector to rich text editors

  - Create variable selector dropdown component with fuzzy search
  - Position selector in top-right corner of editor
  - Implement variable insertion at cursor position
  - Apply to both content and footer editors
  - _Requirements: 4.8, 4.9_

- [x] 3.4 Remove separate email attachments field


  - Remove "Email Attachments" form field from template modal
  - Update form validation accordingly
  - _Requirements: 4.10_




- [x] 4. Enhance WeChat template operation selector



  - Create enhanced operation selector component with integrated search bar
  - Add magnifying glass icon button for search trigger
  - Add trash can icon button for clearing search input
  - Implement fuzzy search on operation names
  - Replace existing operation selector in WeChat template modal
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 5. Update WeChat template variable selectors









  - Update all variable selector instances to match new design pattern
  - Ensure fuzzy search capability across all selectors
  - Maintain consistent styling and behavior
  - _Requirements: 7.1, 7.2, 7.3_





- [x] 6. Add file upload support for WeChat templates





- [x] 6.1 Add "File" option to template type selector

  - Update template type enum to include '文件'
  - Add conditional rendering logic for file upload area
  - _Requirements: 8.1, 8.2_

- [x] 6.2 Create file upload component


  - Implement drag-and-drop file upload area
  - Implement click-to-browse file upload
  - Display uploaded file name and size
  - Add delete button to remove uploaded file
  - Implement file replacement logic (new file replaces old)
  - _Requirements: 8.3, 8.4, 8.5, 8.6_

- [x] 6.3 Add file upload validation


  - Validate file is uploaded when template type is "File"
  - Display error message "文件未上传" if missing on submit
  - Validate file size against maximum limit

  - Display error message for oversized files

  - _Requirements: 8.7, 8.8_

-

- [x] 7. Implement toggle enable/disable buttons for templates





- [x] 7.1 Update email template status button

  - Change button from static "启用" to dynamic toggle
  - Display "启用" when template is disabled
  - Display "停用" when template is enabled
  - Implement toggle logic on button click
  - Auto-disable other templates for same operation when enabling
  - Show success message on status change
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_


- [x] 7.2 Update WeChat template status button

  - Change button from static "启用" to dynamic toggle
  - Display "启用" when template is disabled
  - Display "停用" when template is enabled
  - Implement toggle logic on button click
  - Auto-disable other templates for same operation when enabling
  - Show success message on status change
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_


- [x] 8. Add missing template warning indicators



- [x] 8.1 Create template checking logic and context


  - TemplateContext already implemented with hasTemplates function
  - Context tracks email and WeChat templates by operation ID
  - Updates propagate when templates are created/deleted/toggled
  - _Requirements: 11.1, 11.4, 11.5_

- [x] 8.2 Add warning icon to operation names in subscription settings







  - Import IconExclamationCircleFill from @arco-design/web-react/icon
  - Display red exclamation mark icon next to operations without templates in renderSubscriptionSettings
  - Use hasTemplates function from TemplateContext to check each operation
  - Position icon next to operation name in the table
  - _Requirements: 11.2_

- [x] 8.3 Implement warning tooltip




  - Add Tooltip component wrapping the warning icon
  - Display message: "该操作无通知模板，可能导致通知失败，请前往【通知模板设置】为其创建模板"
  - Ensure tooltip appears on hover
  - _Requirements: 11.3_



