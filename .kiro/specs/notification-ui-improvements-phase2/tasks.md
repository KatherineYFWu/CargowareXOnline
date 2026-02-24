# Implementation Plan

- [x] 1. Update warning icon to use Arco Design component



  - Import IconExclamationCircleFill from @arco-design/web-react/icon
  - Replace emoji warning (⚠️) with IconExclamationCircleFill component
  - Apply red color styling (#f53f3f) and 16px font size
  - Add conditional rendering based on switch state (hide when switch is OFF)
  - Ensure tooltip functionality is preserved
  - Test icon visibility with different switch states
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Improve enable/disable button styling and width





  - Update button minimum width to 80px
  - Adjust padding to 0 12px for better spacing
  - Set height to 28px for consistency
  - Add 12px gap between enable/disable and delete buttons
  - Apply green styling for enable state (#f6ffed background, #b7eb8f border, #00b42a text)
  - Apply orange styling for disable state (#fff7e8 background, #ffd588 border, #ff7d00 text)
  - Add smooth transition effects (0.2s ease)
  - Test button appearance in operation management table
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_


- [x] 3. Add associated roles field to operation form




  - Add associatedRoles field to Operation interface (string array)
  - Create role options array with sales, business, marketing, operations, customer-service
  - Add "关联角色" Form.Item to operation create/edit modal
  - Implement multi-select Select component with mode="multiple"
  - Add search functionality with filterOption for fuzzy matching
  - Configure maxTagCount={3} for tag display
  - Add validation rule requiring at least one role selection
  - Update form submission to include associatedRoles data
  - Update mock data to include associatedRoles field
  - Test role selection, search, and persistence
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

-

- [x] 4. Optimize email template modal UI and variable selectors




- [x] 4.1 Update email subject variable selector to blue styling


  - Modify subject field to use new blue VariableSelector component
  - Set button background color to #165DFF
  - Set button border color to #165DFF
  - Configure button size to "mini" for inline placement
  - Test variable insertion in subject field
  - _Requirements: 4.2, 4.8, 4.9_


- [x] 4.2 Update email content rich text editor

  - Position blue VariableSelector at top-right corner of content editor
  - Set position to absolute with top: 4px, right: 4px, zIndex: 10
  - Remove emoji insertion functionality from editor
  - Ensure attachment upload remains available for content field
  - Test variable insertion at cursor position
  - _Requirements: 4.3, 4.5, 4.9_


- [x] 4.3 Update footer signature rich text editor

  - Position blue VariableSelector at top-right corner of footer editor
  - Set position to absolute with top: 4px, right: 4px, zIndex: 10
  - Remove emoji insertion functionality from editor
  - Remove attachment upload functionality from footer editor
  - Test variable insertion at cursor position
  - _Requirements: 4.4, 4.6, 4.9_


- [x] 4.4 Simplify rich text editor implementation

  - Evaluate current implementation (toolbar + editor duplication)
  - Choose between: toolbar with textarea OR comprehensive rich text editor
  - Remove duplicate functionality (keep only one approach)
  - Ensure all required features remain: formatting, images, links, tables
  - Update EmailEditor component configuration if needed
  - Test all formatting features work correctly
  - _Requirements: 4.7_


- [x] 4.5 Improve overall email modal layout

  - Optimize spacing between form fields
  - Ensure consistent padding and margins
  - Improve visual hierarchy with better typography
  - Test modal appearance and usability
  - _Requirements: 4.1_


- [x] 5. Update WeChat template variable selectors to blue styling




  - Update VariableSelector component to accept styling props
  - Apply blue background color (#165DFF) to all WeChat variable selector buttons
  - Apply blue border color (#165DFF) to all WeChat variable selector buttons
  - Update hover state to darker blue (#4080FF)
  - Update active state to darker blue (#0E42D2)
  - Apply blue styling to text content field variable selector
  - Apply blue styling to card description field variable selector
  - Apply blue styling to news description field variable selector
  - Apply blue styling to title field variable selector
  - Test all variable selectors in WeChat template modal
  - Verify consistent blue styling across all instances
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

