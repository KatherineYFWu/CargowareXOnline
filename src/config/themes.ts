/**
 * Theme Configuration Objects
 * 
 * This file contains the complete configuration objects for all four themes:
 * Business, Premium, Fresh, and Tech
 * 
 * Requirements: 3.1-3.7, 4.1-4.9, 5.1-5.8, 6.1-6.9
 */

import { ThemeConfig } from '../types/theme';

/**
 * Business Theme Configuration
 * 
 * A clean, professional theme for enterprise clients
 * Requirements: 3.1, 3.2, 3.3, 3.5, 3.6
 */
export const businessTheme: ThemeConfig = {
  id: 'business',
  name: '简约商务',
  colors: {
    primary: '#0F172A',      // Deep navy
    secondary: '#64748B',    // Titanium gray
    accent: '#3B82F6',       // Cyan blue
    background: '#F8FAFC',   // Light background
    surface: '#FFFFFF',      // White surface
    text: '#0F172A',         // Deep navy text
    textSecondary: '#64748B', // Gray secondary text
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  typography: {
    fontFamily: 'Inter, Helvetica Neue, Microsoft YaHei, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    mediumWeight: 500
  },
  spacing: {
    gridColumns: 12,
    cardGap: '24px',
    borderRadius: '4px'      // Micro-rounded corners (4px-6px)
  },
  animations: {
    hoverEffect: 'brightness',
    transitionDuration: '200ms'
  },
  layout: {
    type: 'grid',
    maxWidth: '1200px',
    gridColumns: 12
  }
};

/**
 * Premium Theme Configuration
 * 
 * A luxury theme conveying exclusivity and high-end appeal
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.7
 */
export const premiumTheme: ThemeConfig = {
  id: 'premium',
  name: '高端尊享',
  colors: {
    primary: '#0A0A0A',      // Charcoal black
    secondary: '#D4AF37',    // Champagne gold
    accent: '#4A0404',       // Burgundy red
    background: '#1A1A1A',   // Dark background
    surface: '#2A2A2A',      // Dark surface
    text: '#F5F5F5',         // Light text
    textSecondary: '#D4AF37', // Gold secondary text
    success: '#D4AF37',
    warning: '#D4AF37',
    error: '#8B0000'
  },
  typography: {
    fontFamily: 'Lato, Helvetica Neue, Microsoft YaHei, sans-serif',
    headingFontFamily: 'Playfair Display, Georgia, serif',
    headingWeight: 700,
    bodyWeight: 300,         // Thin sans-serif for body
    mediumWeight: 400,
    letterSpacing: '0.02em'
  },
  spacing: {
    gridColumns: 8,
    cardGap: '32px',
    borderRadius: '2px'
  },
  animations: {
    hoverEffect: 'scale',
    transitionDuration: '400ms',
    enableParallax: true     // Parallax scrolling
  },
  layout: {
    type: 'asymmetric',      // Magazine-style layout
    maxWidth: '1400px',
    useGoldenRatio: true     // Golden ratio proportions (1:1.618)
  }
};

/**
 * Fresh Theme Configuration
 * 
 * A welcoming, approachable theme with playful elements
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */
export const freshTheme: ThemeConfig = {
  id: 'fresh',
  name: '清新现代',
  colors: {
    primary: '#6EE7B7',      // Mint green
    secondary: '#FDA4AF',    // Coral pink
    accent: '#A78BFA',       // Soft purple
    background: '#FAFAF9',   // Warm white
    surface: '#FFFFFF',      // White surface
    text: '#1F2937',         // Dark gray text
    textSecondary: '#6B7280', // Medium gray
    success: '#6EE7B7',
    warning: '#FCD34D',
    error: '#FDA4AF'
  },
  typography: {
    fontFamily: 'Nunito, Quicksand, Microsoft YaHei, sans-serif',
    headingFontFamily: 'Quicksand, Nunito, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    mediumWeight: 600
  },
  spacing: {
    gridColumns: 12,
    cardGap: '20px',
    borderRadius: '24px'     // Large border radius (24px+)
  },
  animations: {
    hoverEffect: 'bounce',   // Bouncy scale animations
    transitionDuration: '300ms',
    enableConfetti: true     // Confetti celebration animations
  },
  layout: {
    type: 'fluid',
    maxWidth: '1280px',
    gridColumns: 12
  }
};

/**
 * Tech Theme Configuration
 * 
 * A futuristic theme showcasing innovation and technical capabilities
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
 */
export const techTheme: ThemeConfig = {
  id: 'tech',
  name: '未来科技',
  colors: {
    primary: '#050505',      // Deep space black
    secondary: '#00F0FF',    // Cyber cyan
    accent: '#BC13FE',       // Neon purple
    background: '#0A0A0A',   // Near black background
    surface: '#1A1A1A',      // Dark surface
    text: '#00F0FF',         // Cyan text
    textSecondary: '#BC13FE', // Purple secondary text
    success: '#00FF41',
    warning: '#FFD700',
    error: '#FF0055'
  },
  typography: {
    fontFamily: 'Roboto Mono, Fira Code, Consolas, monospace',
    headingWeight: 700,
    bodyWeight: 400,
    mediumWeight: 500,
    letterSpacing: '0.05em'
  },
  spacing: {
    gridColumns: 12,
    cardGap: '16px',
    borderRadius: '0px'      // Sharp corners for HUD style
  },
  animations: {
    hoverEffect: 'glow',     // Glowing borders
    transitionDuration: '250ms',
    enableGlitch: true,      // Glitch effects
    enableTypewriter: true   // Typewriter text reveal
  },
  layout: {
    type: 'grid',
    maxWidth: '1600px',
    gridColumns: 12
  }
};

/**
 * Theme registry
 * Maps theme IDs to their configuration objects
 */
export const themes: Record<string, ThemeConfig> = {
  business: businessTheme,
  premium: premiumTheme,
  fresh: freshTheme,
  tech: techTheme
};

/**
 * Get theme configuration by ID
 * @param themeId - The theme identifier
 * @returns The theme configuration object
 */
export function getThemeConfig(themeId: string): ThemeConfig {
  return themes[themeId] || businessTheme;
}

/**
 * Get all available theme configurations
 * @returns Array of all theme configurations
 */
export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes);
}
