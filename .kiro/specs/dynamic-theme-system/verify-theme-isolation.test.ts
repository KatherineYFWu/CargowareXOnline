/**
 * Theme CSS Isolation Verification Tests
 * 
 * This test suite verifies that theme CSS files properly implement isolation
 * and don't leak styles between themes.
 * 
 * Requirements: 9.1, 9.3, 9.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Theme CSS Isolation Verification', () => {
  const themesDir = join(__dirname, '../../../src/components/portalhome/themes');
  
  const themeFiles = [
    'BusinessTheme.css',
    'PremiumTheme.css',
    'FreshTheme.css',
    'TechTheme.css',
  ];

  const themeNames = ['business', 'premium', 'fresh', 'tech'];

  describe('Data-theme Scoping', () => {
    themeFiles.forEach((file, index) => {
      const themeName = themeNames[index];
      
      it(`${file} should scope all styles with [data-theme="${themeName}"]`, () => {
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Remove comments and empty lines
        const lines = cssContent
          .split('\n')
          .filter(line => !line.trim().startsWith('/*') && !line.trim().startsWith('*') && line.trim() !== '');
        
        // Find all selector lines (lines that end with { or contain {)
        const selectorLines = lines.filter(line => {
          const trimmed = line.trim();
          return trimmed.includes('{') && 
                 !trimmed.startsWith('@') && // Ignore @keyframes, @media
                 !trimmed.startsWith('}'); // Ignore closing braces
        });

        // Check that all selectors include the theme scope
        const unscopedSelectors: string[] = [];
        selectorLines.forEach(line => {
          const trimmed = line.trim();
          // Skip @keyframes and @media rules
          if (trimmed.startsWith('@')) return;
          
          // Check if line contains the theme scope
          if (!trimmed.includes(`[data-theme="${themeName}"]`)) {
            unscopedSelectors.push(trimmed);
          }
        });

        expect(unscopedSelectors).toEqual([]);
      });
    });
  });

  describe('Animation Keyframe Uniqueness', () => {
    it('should have unique keyframe names across all themes', () => {
      const allKeyframes: { [key: string]: string[] } = {};
      
      themeFiles.forEach((file) => {
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Extract keyframe names using regex
        const keyframeRegex = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
        let match;
        
        while ((match = keyframeRegex.exec(cssContent)) !== null) {
          const keyframeName = match[1];
          
          if (!allKeyframes[keyframeName]) {
            allKeyframes[keyframeName] = [];
          }
          allKeyframes[keyframeName].push(file);
        }
      });

      // Check for duplicates
      const duplicates: { [key: string]: string[] } = {};
      Object.entries(allKeyframes).forEach(([name, files]) => {
        if (files.length > 1) {
          duplicates[name] = files;
        }
      });

      expect(duplicates).toEqual({});
    });

    it('should prefix all keyframe names with theme name', () => {
      themeFiles.forEach((file, index) => {
        const themeName = themeNames[index];
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Extract keyframe names
        const keyframeRegex = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
        let match;
        const keyframes: string[] = [];
        
        while ((match = keyframeRegex.exec(cssContent)) !== null) {
          keyframes.push(match[1]);
        }

        // Check that all keyframes start with theme name
        const unprefixedKeyframes = keyframes.filter(
          name => !name.toLowerCase().startsWith(themeName.toLowerCase())
        );

        expect(unprefixedKeyframes).toEqual([]);
      });
    });
  });

  describe('Global Style Leak Prevention', () => {
    themeFiles.forEach((file) => {
      it(`${file} should not have unscoped element selectors`, () => {
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Check for bare element selectors (body, h1, p, etc.) without theme scope
        const bareElementRegex = /^(?!.*\[data-theme)^\s*(body|html|h[1-6]|p|div|span|a|button|input|form)\s*\{/gm;
        const matches = cssContent.match(bareElementRegex);
        
        expect(matches).toBeNull();
      });

      it(`${file} should not have unscoped class selectors`, () => {
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Check for class selectors without theme scope
        // This is a simplified check - we look for lines starting with . that don't have [data-theme
        const lines = cssContent.split('\n');
        const unscopedClasses: string[] = [];
        
        lines.forEach((line, lineNum) => {
          const trimmed = line.trim();
          // Skip comments and empty lines
          if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed === '') return;
          
          // Check if line starts with a class selector
          if (trimmed.startsWith('.') && trimmed.includes('{')) {
            // Check if it has theme scope
            if (!trimmed.includes('[data-theme')) {
              unscopedClasses.push(`Line ${lineNum + 1}: ${trimmed}`);
            }
          }
        });

        expect(unscopedClasses).toEqual([]);
      });
    });
  });

  describe('CSS Custom Properties Scoping', () => {
    themeFiles.forEach((file, index) => {
      const themeName = themeNames[index];
      
      it(`${file} should define all CSS variables within [data-theme="${themeName}"] scope`, () => {
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Find all CSS variable definitions
        const varRegex = /--[a-zA-Z0-9-]+\s*:/g;
        const matches = cssContent.match(varRegex);
        
        if (!matches) {
          // No variables defined, that's okay
          return;
        }

        // Check that variables are defined within theme scope
        // We'll do this by checking if the variable definition appears after a [data-theme="..."] selector
        const lines = cssContent.split('\n');
        let inThemeScope = false;
        let braceDepth = 0;
        const unscopedVars: string[] = [];
        
        lines.forEach((line, lineNum) => {
          const trimmed = line.trim();
          
          // Track theme scope
          if (trimmed.includes(`[data-theme="${themeName}"]`) && trimmed.includes('{')) {
            inThemeScope = true;
            braceDepth = 1;
          } else if (inThemeScope) {
            // Track brace depth
            braceDepth += (trimmed.match(/{/g) || []).length;
            braceDepth -= (trimmed.match(/}/g) || []).length;
            
            if (braceDepth === 0) {
              inThemeScope = false;
            }
          }
          
          // Check for variable definitions
          if (trimmed.match(/--[a-zA-Z0-9-]+\s*:/) && !inThemeScope) {
            unscopedVars.push(`Line ${lineNum + 1}: ${trimmed}`);
          }
        });

        expect(unscopedVars).toEqual([]);
      });
    });
  });

  describe('Utility Class Naming', () => {
    themeFiles.forEach((file, index) => {
      const themeName = themeNames[index];
      
      it(`${file} should prefix all utility classes with theme name`, () => {
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Extract class names from selectors
        const classRegex = /\[data-theme="[^"]+"\]\s+\.([a-zA-Z0-9_-]+)/g;
        let match;
        const classes: string[] = [];
        
        while ((match = classRegex.exec(cssContent)) !== null) {
          classes.push(match[1]);
        }

        // Check that all classes start with theme name
        const unprefixedClasses = classes.filter(
          className => !className.toLowerCase().startsWith(themeName.toLowerCase())
        );

        // Allow some common utility classes that might not be prefixed
        const allowedUnprefixed = ['container', 'flex', 'grid'];
        const actualUnprefixed = unprefixedClasses.filter(
          className => !allowedUnprefixed.includes(className)
        );

        expect(actualUnprefixed).toEqual([]);
      });
    });
  });

  describe('Pseudo-element Scoping', () => {
    themeFiles.forEach((file, index) => {
      const themeName = themeNames[index];
      
      it(`${file} should scope all pseudo-elements with [data-theme="${themeName}"]`, () => {
        const cssContent = readFileSync(join(themesDir, file), 'utf-8');
        
        // Find all pseudo-element selectors (::before, ::after)
        const pseudoRegex = /::(before|after)/g;
        const matches = cssContent.match(pseudoRegex);
        
        if (!matches) {
          // No pseudo-elements, that's okay
          return;
        }

        // Check that each pseudo-element line includes theme scope
        const lines = cssContent.split('\n');
        const unscopedPseudos: string[] = [];
        
        lines.forEach((line, lineNum) => {
          if (line.includes('::before') || line.includes('::after')) {
            if (!line.includes(`[data-theme="${themeName}"]`)) {
              unscopedPseudos.push(`Line ${lineNum + 1}: ${line.trim()}`);
            }
          }
        });

        expect(unscopedPseudos).toEqual([]);
      });
    });
  });
});

describe('Theme Switching Residual Style Check', () => {
  // This would require a browser environment to test properly
  // For now, we'll document the manual testing procedure
  
  it.skip('should not leave residual styles when switching themes', () => {
    // Manual test procedure:
    // 1. Apply Business theme
    // 2. Check computed styles
    // 3. Switch to Premium theme
    // 4. Verify no Business-specific styles remain
    // 5. Repeat for all theme combinations
    
    // This test is marked as skip because it requires a browser environment
    // and should be tested manually or with E2E tests
  });
});
