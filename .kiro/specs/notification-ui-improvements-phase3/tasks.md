# Implementation Plan

- [x] 1. Remove custom toolbar and duplicate functionality




  - Remove the entire editor-toolbar div and all its contents
  - Remove all custom formatting buttons (bold, italic, underline, strikethrough, etc.)
  - Remove font size selector and color pickers (text color, background color)
  - Remove alignment buttons (left, center, right)
  - Remove list buttons (ordered, unordered)
  - Remove custom insert buttons (link, image, table)
  - Remove the variable selector from toolbar (keep only the absolutely positioned one)
  - Remove file upload button from toolbar
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
-

- [x] 2. Remove emoji functionality completely




  - Remove emoji button from toolbar
  - Remove commonEmojis array definition
  - Remove renderEmojiPanel function
  - Remove insertEmoji function
  - Remove all emoji-related imports (IconFaceSmileFill)
  - Remove emoji Popover component
  - Ensure showEmoji prop has no effect on rendering
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_


- [x] 3. Remove custom formatting and insertion functions




  - Remove execCommand function
  - Remove applyFormat function
  - Remove insertLink function and related state (linkModalVisible, linkUrl, linkText)
  - Remove insertImageFromUrl function and related state (imageModalVisible, imageUrl, imageAlt)
  - Remove insertTable function
  - Remove handleInsertLink function
  - Remove handleInsertImage function
  - Remove link insertion modal component
  - Remove image insertion modal component
  - _Requirements: 3.3, 3.4, 3.5, 5.5, 5.6_


- [x] 4. Remove file upload functionality




  - Remove handleUploadClick function
  - Remove handleFileChange function
  - Remove file input ref (fileInputRef)
  - Remove file input element
  - Remove upload progress state (uploading, uploadProgress)
  - Remove upload progress modal component
  - Remove upload-related imports (IconUpload, IconLoading)
  - _Requirements: 4.2, 4.3, 5.3_

-

- [x] 5. Remove auto-height calculation logic


  - Remove editorHeight state
  - Remove setEditorHeight calls
  - Remove useEffect hook for height calculation
  - Remove MutationObserver setup
  - Remove window resize event listener
  - Remove height-related styling from editor container
  - _Requirements: 5.1, 5.6_


- [x] 6. Optimize variable selector positioning




  - Ensure variable selector is positioned absolutely at top: 4px, right: 4px
  - Verify z-index is set to 10
  - Remove minWidth: '200px' from variable selector container (not needed)
  - Ensure variable selector is only rendered when variableList.length > 0
  - Verify blue styling is applied (#165DFF background and border)
  - Test that variable selector stays fixed at top-right when scrolling content
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 7. Simplify component structure and styling




  - Update editor container to use relative positioning
  - Set editor container border to 1px solid #e5e6eb
  - Set editor container border-radius to 4px
  - Set editor container min-height to 200px (or appropriate value)
  - Remove all toolbar-related CSS classes
  - Remove unused state variables (fontSizes, colors arrays)
  - Clean up imports - remove unused icon imports
  - _Requirements: 5.1, 5.2, 5.4, 5.5_




- [ ] 8. Update component to rely on SimpleWysiwyg

  - Ensure SimpleWysiwyg is the only editor component rendered
  - Verify handleChange function works correctly with SimpleWysiwyg
  - Ensure value prop syncs correctly with SimpleWysiwyg
  - Test that all SimpleWysiwyg built-in features work (formatting, links, images, etc.)


  - Verify that SimpleWysiwyg toolbar is visible and functional
  - _Requirements: 5.1, 5.6_

- [x] 9. Verify variable insertion functionality







  - Test that insertVariable function works correctly
  - Verify variable is inserted as {variableName} format
  - Test fuzzy search filtering with getFilteredVariables
  - Verify onInsertVariable callback is fired with correct parameters
  - Test that popover closes after variable insertion
  - Verify "未找到匹配的变量" message shows when no matches
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 10. Update NotificationTemplateSettings to use simplified EmailEditor




- [ ] 10. Update NotificationTemplateSettings to use simplified EmailEditor



  - Update Email Content field to use EmailEditor with showEmoji={false}
  - Update Footer Signature field to use EmailEditor with showEmoji={false} and showAttachment={false}
  - Verify variable selector appears at top-right in both fields
  - Test that emoji functionality is not available in either field
  - Test that attachment upload is only available in content field (if kept)
  - Verify no duplicate toolbars are visible
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 4.2, 4.3, 4.4_

- [ ]* 11. Test simplified EmailEditor component
  - Test variable selector positioning in different screen sizes
  - Test variable insertion in content and footer fields
  - Test fuzzy search with various search terms
  - Test that SimpleWysiwyg formatting features work correctly
  - Test content onChange callback with various edits
  - Verify no console errors or warnings
  - Test accessibility with keyboard navigation
  - _Requirements: All requirements_
