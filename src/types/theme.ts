/**
 * Theme System Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the Dynamic Theme System.
 * Requirements: 7.1, 7.2, 8.1
 */

/**
 * Theme type enumeration
 * Defines the four available theme types
 */
export enum Theme {
  BUSINESS = 'business',
  PREMIUM = 'premium',
  FRESH = 'fresh',
  TECH = 'tech'
}

/**
 * Theme type alias for convenience
 */
export type ThemeType = 'business' | 'premium' | 'fresh' | 'tech';

/**
 * Color palette interface
 * Defines all color values used in a theme
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success?: string;
  warning?: string;
  error?: string;
}

/**
 * Typography configuration interface
 * Defines font families and weights for a theme
 */
export interface Typography {
  fontFamily: string;
  headingFontFamily?: string;
  headingWeight: number;
  bodyWeight: number;
  mediumWeight: number;
  letterSpacing?: string;
}

/**
 * Spacing configuration interface
 * Defines layout spacing and grid properties
 */
export interface Spacing {
  gridColumns: number;
  cardGap: string;
  borderRadius: string;
}

/**
 * Animation configuration interface
 * Defines animation behaviors and effects for a theme
 */
export interface AnimationConfig {
  hoverEffect: 'brightness' | 'scale' | 'glow' | 'bounce';
  transitionDuration: string;
  enableParallax?: boolean;
  enableGlitch?: boolean;
  enableConfetti?: boolean;
  enableTypewriter?: boolean;
}

/**
 * Layout configuration interface
 * Defines layout type and structural properties
 */
export interface LayoutConfig {
  type: 'grid' | 'asymmetric' | 'fluid';
  maxWidth: string;
  gridColumns?: number;
  useGoldenRatio?: boolean;
}

/**
 * Complete theme configuration interface
 * Combines all theme properties into a single configuration object
 */
export interface ThemeConfig {
  id: ThemeType;
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  animations: AnimationConfig;
  layout: LayoutConfig;
}

/**
 * Theme storage data interface
 * Defines the structure of theme data persisted to storage
 * Requirement: 8.1
 */
export interface ThemeStorageData {
  themeId: ThemeType;
  timestamp: number;
  version: string;
}

/**
 * Theme context value interface
 * Defines the shape of data provided by the Theme Context
 * Requirements: 7.1, 7.2
 */
export interface ThemeContextValue {
  currentTheme: ThemeType;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeType) => Promise<void>;
  isLoading: boolean;
}
