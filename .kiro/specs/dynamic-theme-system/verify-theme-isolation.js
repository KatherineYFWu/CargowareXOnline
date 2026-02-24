/**
 * Theme CSS Isolation Verification Script
 * 
 * This script verifies that theme CSS files properly implement isolation
 * and don't leak styles between themes.
 * 
 * Requirements: 9.1, 9.3, 9.5
 * 
 * Run with: node .kiro/specs/dynamic-theme-system/verify-theme-isolation.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Navigate from .kiro/specs/dynamic-theme-system to src/components/portalhome/themes
const themesDir = join(__dirname, '../../../src/components/portalhome/themes');

const themeFiles = [
  { file: 'BusinessTheme.css', name: 'business' },
  { file: 'PremiumTheme.css', name: 'premium' },
  { file: 'FreshTheme.css', name: 'fresh' },
  { file: 'TechTheme.css', name: 'tech' },
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✅ PASS: ${description}`);
    return true;
  } catch (error) {
    failedTests++;
    console.log(`❌ FAIL: ${description}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

function expect(actual) {
  return {
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, but got ${JSON.stringify(actual)}`);
      }
    },
    toContain(item) {
      if (!actual.includes(item)) {
        throw new Error(`Expected array to contain ${item}`);
      }
    },
  };
}

console.log('\n🔍 Theme CSS Isolation Verification\n');
console.log('=' .repeat(60));

// Test 1: Data-theme Scoping
console.log('\n📋 Test Suite: Data-theme Scoping\n');

themeFiles.forEach(({ file, name }) => {
  test(`${file} should scope all styles with [data-theme="${name}"]`, () => {
    const cssContent = readFileSync(join(themesDir, file), 'utf-8');
    
    // Remove comments and empty lines
    const lines = cssContent
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return !trimmed.startsWith('/*') && 
               !trimmed.startsWith('*') && 
               trimmed !== '' &&
               !trimmed.startsWith('//');
      });
    
    // Track if we're inside a @keyframes block
    let inKeyframes = false;
    let braceDepth = 0;
    
    // Find all selector lines (lines that contain { but not @keyframes or @media)
    const selectorLines = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check if entering keyframes block
      if (trimmed.startsWith('@keyframes')) {
        inKeyframes = true;
        braceDepth = 0;
      }
      
      // Track brace depth
      if (inKeyframes) {
        braceDepth += (trimmed.match(/{/g) || []).length;
        braceDepth -= (trimmed.match(/}/g) || []).length;
        
        if (braceDepth === 0 && trimmed.includes('}')) {
          inKeyframes = false;
        }
      }
      
      // Only add non-keyframe selectors
      if (!inKeyframes && 
          trimmed.includes('{') && 
          !trimmed.startsWith('@') &&
          !trimmed.startsWith('}') &&
          !trimmed.match(/^\d+%\s*{/)) { // Exclude percentage keyframe steps
        selectorLines.push(trimmed);
      }
    });

    // Check that all selectors include the theme scope
    const unscopedSelectors = [];
    selectorLines.forEach(line => {
      if (!line.includes(`[data-theme="${name}"]`)) {
        unscopedSelectors.push(line);
      }
    });

    expect(unscopedSelectors).toEqual([]);
  });
});

// Test 2: Animation Keyframe Uniqueness
console.log('\n📋 Test Suite: Animation Keyframe Uniqueness\n');

test('All themes should have unique keyframe names', () => {
  const allKeyframes = {};
  
  themeFiles.forEach(({ file }) => {
    const cssContent = readFileSync(join(themesDir, file), 'utf-8');
    
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

  const duplicates = {};
  Object.entries(allKeyframes).forEach(([name, files]) => {
    if (files.length > 1) {
      duplicates[name] = files;
    }
  });

  expect(duplicates).toEqual({});
});

themeFiles.forEach(({ file, name }) => {
  test(`${file} should prefix all keyframe names with "${name}"`, () => {
    const cssContent = readFileSync(join(themesDir, file), 'utf-8');
    
    const keyframeRegex = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
    let match;
    const keyframes = [];
    
    while ((match = keyframeRegex.exec(cssContent)) !== null) {
      keyframes.push(match[1]);
    }

    const unprefixedKeyframes = keyframes.filter(
      keyframeName => !keyframeName.toLowerCase().startsWith(name.toLowerCase())
    );

    expect(unprefixedKeyframes).toEqual([]);
  });
});

// Test 3: Global Style Leak Prevention
console.log('\n📋 Test Suite: Global Style Leak Prevention\n');

themeFiles.forEach(({ file }) => {
  test(`${file} should not have unscoped element selectors`, () => {
    const cssContent = readFileSync(join(themesDir, file), 'utf-8');
    
    const bareElementRegex = /^(?!.*\[data-theme)^\s*(body|html|h[1-6]|p|div|span|a|button|input|form)\s*\{/gm;
    const matches = cssContent.match(bareElementRegex);
    
    expect(matches).toBeNull();
  });
});

// Test 4: CSS Custom Properties Scoping
console.log('\n📋 Test Suite: CSS Custom Properties Scoping\n');

themeFiles.forEach(({ file, name }) => {
  test(`${file} should define CSS variables within [data-theme="${name}"] scope`, () => {
    const cssContent = readFileSync(join(themesDir, file), 'utf-8');
    
    const lines = cssContent.split('\n');
    let inThemeScope = false;
    let braceDepth = 0;
    const unscopedVars = [];
    
    lines.forEach((line, lineNum) => {
      const trimmed = line.trim();
      
      if (trimmed.includes(`[data-theme="${name}"]`) && trimmed.includes('{')) {
        inThemeScope = true;
        braceDepth = 1;
      } else if (inThemeScope) {
        braceDepth += (trimmed.match(/{/g) || []).length;
        braceDepth -= (trimmed.match(/}/g) || []).length;
        
        if (braceDepth === 0) {
          inThemeScope = false;
        }
      }
      
      if (trimmed.match(/--[a-zA-Z0-9-]+\s*:/) && !inThemeScope) {
        unscopedVars.push(`Line ${lineNum + 1}: ${trimmed}`);
      }
    });

    expect(unscopedVars).toEqual([]);
  });
});

// Test 5: Pseudo-element Scoping
console.log('\n📋 Test Suite: Pseudo-element Scoping\n');

themeFiles.forEach(({ file, name }) => {
  test(`${file} should scope all pseudo-elements with [data-theme="${name}"]`, () => {
    const cssContent = readFileSync(join(themesDir, file), 'utf-8');
    
    const lines = cssContent.split('\n');
    const unscopedPseudos = [];
    
    lines.forEach((line, lineNum) => {
      if ((line.includes('::before') || line.includes('::after')) && line.includes('{')) {
        if (!line.includes(`[data-theme="${name}"]`)) {
          unscopedPseudos.push(`Line ${lineNum + 1}: ${line.trim()}`);
        }
      }
    });

    expect(unscopedPseudos).toEqual([]);
  });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Summary\n');
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n🎉 All tests passed! Theme CSS isolation is properly implemented.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
