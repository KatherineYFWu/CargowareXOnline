/**
 * Manual Test for Theme Validation
 * 
 * This file contains manual tests to verify the validateThemeConfig function
 * Run with: npx tsx src/utils/__tests__/themeValidation.manual-test.ts
 */

import { validateThemeConfig, isValidThemeId } from '../themeValidation';
import { businessTheme, premiumTheme, freshTheme, techTheme } from '../../config/themes';

console.log('=== Theme Validation Manual Tests ===\n');

// Test 1: Valid theme configurations
console.log('Test 1: Validating existing theme configurations');
const themes = [
  { name: 'Business', config: businessTheme },
  { name: 'Premium', config: premiumTheme },
  { name: 'Fresh', config: freshTheme },
  { name: 'Tech', config: techTheme }
];

themes.forEach(({ name, config }) => {
  const result = validateThemeConfig(config);
  console.log(`  ${name} Theme: ${result.isValid ? '✓ VALID' : '✗ INVALID'}`);
  if (!result.isValid) {
    console.log(`    Errors: ${result.errors.join(', ')}`);
  }
});

// Test 2: Missing required fields
console.log('\nTest 2: Missing required fields');
const invalidConfig1 = {
  name: 'Test Theme',
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#FF0000',
    background: '#F0F0F0',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666'
  }
  // Missing id and typography
};
const result1 = validateThemeConfig(invalidConfig1);
console.log(`  Missing id and typography: ${result1.isValid ? '✓ VALID' : '✗ INVALID (expected)'}`);
console.log(`    Errors: ${result1.errors.join(', ')}`);

// Test 3: Invalid color format
console.log('\nTest 3: Invalid color format');
const invalidConfig2 = {
  id: 'business',
  name: 'Test Theme',
  colors: {
    primary: 'not-a-color',
    secondary: '#FFFFFF',
    accent: '#FF0000',
    background: '#F0F0F0',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666'
  },
  typography: {
    fontFamily: 'Arial',
    headingWeight: 700,
    bodyWeight: 400,
    mediumWeight: 500
  }
};
const result2 = validateThemeConfig(invalidConfig2);
console.log(`  Invalid primary color: ${result2.isValid ? '✓ VALID' : '✗ INVALID (expected)'}`);
console.log(`    Errors: ${result2.errors.join(', ')}`);

// Test 4: Empty font family
console.log('\nTest 4: Empty font family');
const invalidConfig3 = {
  id: 'business',
  name: 'Test Theme',
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#FF0000',
    background: '#F0F0F0',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666'
  },
  typography: {
    fontFamily: '',  // Empty string
    headingWeight: 700,
    bodyWeight: 400,
    mediumWeight: 500
  }
};
const result3 = validateThemeConfig(invalidConfig3);
console.log(`  Empty fontFamily: ${result3.isValid ? '✓ VALID' : '✗ INVALID (expected)'}`);
console.log(`    Errors: ${result3.errors.join(', ')}`);

// Test 5: Invalid theme ID
console.log('\nTest 5: Invalid theme ID');
const invalidConfig4 = {
  id: 'invalid-theme',
  name: 'Test Theme',
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#FF0000',
    background: '#F0F0F0',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666'
  },
  typography: {
    fontFamily: 'Arial',
    headingWeight: 700,
    bodyWeight: 400,
    mediumWeight: 500
  }
};
const result4 = validateThemeConfig(invalidConfig4);
console.log(`  Invalid theme ID: ${result4.isValid ? '✓ VALID' : '✗ INVALID (expected)'}`);
console.log(`    Errors: ${result4.errors.join(', ')}`);

// Test 6: Null/undefined config
console.log('\nTest 6: Null/undefined config');
const result5 = validateThemeConfig(null);
console.log(`  Null config: ${result5.isValid ? '✓ VALID' : '✗ INVALID (expected)'}`);
console.log(`    Errors: ${result5.errors.join(', ')}`);

// Test 7: isValidThemeId function
console.log('\nTest 7: isValidThemeId function');
console.log(`  'business': ${isValidThemeId('business') ? '✓ VALID' : '✗ INVALID'}`);
console.log(`  'premium': ${isValidThemeId('premium') ? '✓ VALID' : '✗ INVALID'}`);
console.log(`  'fresh': ${isValidThemeId('fresh') ? '✓ VALID' : '✗ INVALID'}`);
console.log(`  'tech': ${isValidThemeId('tech') ? '✓ VALID' : '✗ INVALID'}`);
console.log(`  'invalid': ${isValidThemeId('invalid') ? '✓ VALID' : '✗ INVALID (expected)'}`);
console.log(`  null: ${isValidThemeId(null) ? '✓ VALID' : '✗ INVALID (expected)'}`);
console.log(`  123: ${isValidThemeId(123) ? '✓ VALID' : '✗ INVALID (expected)'}`);

// Test 8: Various hex color formats
console.log('\nTest 8: Various hex color formats');
const colorTests = [
  { color: '#FFF', expected: true },
  { color: '#FFFFFF', expected: true },
  { color: 'FFF', expected: true },
  { color: 'FFFFFF', expected: true },
  { color: '#fff', expected: true },
  { color: '#ffffff', expected: true },
  { color: 'fff', expected: true },
  { color: 'ffffff', expected: true },
  { color: '#GGGGGG', expected: false },
  { color: 'rgb(255,255,255)', expected: false },
  { color: '', expected: false },
  { color: null, expected: false }
];

colorTests.forEach(({ color, expected }) => {
  const testConfig = {
    id: 'business',
    name: 'Test',
    colors: {
      primary: color,
      secondary: '#FFFFFF',
      accent: '#FF0000',
      background: '#F0F0F0',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666'
    },
    typography: {
      fontFamily: 'Arial',
      headingWeight: 700,
      bodyWeight: 400,
      mediumWeight: 500
    }
  };
  const result = validateThemeConfig(testConfig);
  const status = result.isValid === expected ? '✓' : '✗';
  console.log(`  ${status} Color '${color}': ${result.isValid ? 'VALID' : 'INVALID'} (expected: ${expected ? 'VALID' : 'INVALID'})`);
});

console.log('\n=== All Manual Tests Complete ===');
