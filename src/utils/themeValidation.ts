/**
 * Theme Validation Utilities
 * 
 * This file contains validation functions for theme configurations
 * Requirements: 7.4, 8.5
 */

import { ThemeConfig, ThemeType } from '../types/theme';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valid theme IDs
 */
const VALID_THEME_IDS: ThemeType[] = ['business', 'premium', 'fresh', 'tech'];

/**
 * Validates if a string is a valid hex color code
 * Supports both 3-digit and 6-digit hex codes with optional # prefix
 * 
 * @param color - The color string to validate
 * @returns true if valid hex color, false otherwise
 */
function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }
  
  // Match #RGB, #RRGGBB, RGB, or RRGGBB formats
  const hexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}

/**
 * Validates a theme configuration object
 * 
 * Checks:
 * - Required fields (id, name, colors, typography)
 * - Valid theme ID
 * - Color format (valid hex codes)
 * - Font family strings are non-empty
 * 
 * Requirements: 7.4, 8.5
 * 
 * @param config - The theme configuration to validate
 * @returns ValidationResult with isValid flag and array of error messages
 */
export function validateThemeConfig(config: any): ValidationResult {
  const errors: string[] = [];

  // Check if config exists
  if (!config || typeof config !== 'object') {
    return {
      isValid: false,
      errors: ['Theme configuration is null or not an object']
    };
  }

  // Validate required field: id
  if (!config.id) {
    errors.push('Missing required field: id');
  } else if (!VALID_THEME_IDS.includes(config.id)) {
    errors.push(`Invalid theme id: ${config.id}. Must be one of: ${VALID_THEME_IDS.join(', ')}`);
  }

  // Validate required field: name
  if (!config.name) {
    errors.push('Missing required field: name');
  } else if (typeof config.name !== 'string' || config.name.trim() === '') {
    errors.push('Field "name" must be a non-empty string');
  }

  // Validate required field: colors
  if (!config.colors) {
    errors.push('Missing required field: colors');
  } else if (typeof config.colors !== 'object') {
    errors.push('Field "colors" must be an object');
  } else {
    // Validate required color fields
    const requiredColors = ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textSecondary'];
    
    for (const colorField of requiredColors) {
      if (!config.colors[colorField]) {
        errors.push(`Missing required color field: colors.${colorField}`);
      } else if (!isValidHexColor(config.colors[colorField])) {
        errors.push(`Invalid hex color format for colors.${colorField}: ${config.colors[colorField]}`);
      }
    }

    // Validate optional color fields if present
    const optionalColors = ['success', 'warning', 'error'];
    for (const colorField of optionalColors) {
      if (config.colors[colorField] && !isValidHexColor(config.colors[colorField])) {
        errors.push(`Invalid hex color format for colors.${colorField}: ${config.colors[colorField]}`);
      }
    }
  }

  // Validate required field: typography
  if (!config.typography) {
    errors.push('Missing required field: typography');
  } else if (typeof config.typography !== 'object') {
    errors.push('Field "typography" must be an object');
  } else {
    // Validate fontFamily
    if (!config.typography.fontFamily) {
      errors.push('Missing required field: typography.fontFamily');
    } else if (typeof config.typography.fontFamily !== 'string' || config.typography.fontFamily.trim() === '') {
      errors.push('Field "typography.fontFamily" must be a non-empty string');
    }

    // Validate optional headingFontFamily if present
    if (config.typography.headingFontFamily !== undefined) {
      if (typeof config.typography.headingFontFamily !== 'string' || config.typography.headingFontFamily.trim() === '') {
        errors.push('Field "typography.headingFontFamily" must be a non-empty string');
      }
    }

    // Validate weight fields
    const weightFields = ['headingWeight', 'bodyWeight', 'mediumWeight'];
    for (const weightField of weightFields) {
      if (config.typography[weightField] === undefined) {
        errors.push(`Missing required field: typography.${weightField}`);
      } else if (typeof config.typography[weightField] !== 'number') {
        errors.push(`Field "typography.${weightField}" must be a number`);
      }
    }
  }

  // Validate spacing (optional but should be valid if present)
  if (config.spacing && typeof config.spacing !== 'object') {
    errors.push('Field "spacing" must be an object');
  }

  // Validate animations (optional but should be valid if present)
  if (config.animations && typeof config.animations !== 'object') {
    errors.push('Field "animations" must be an object');
  }

  // Validate layout (optional but should be valid if present)
  if (config.layout && typeof config.layout !== 'object') {
    errors.push('Field "layout" must be an object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a theme ID
 * 
 * @param themeId - The theme ID to validate
 * @returns true if valid theme ID, false otherwise
 */
export function isValidThemeId(themeId: any): themeId is ThemeType {
  return typeof themeId === 'string' && VALID_THEME_IDS.includes(themeId as ThemeType);
}
