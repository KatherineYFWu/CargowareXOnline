/**
 * Theme Context Provider
 * 
 * Provides centralized theme state management and distribution throughout the application.
 * Handles theme loading from storage, theme switching, and error handling with fallback.
 * 
 * Requirements: 7.1, 7.2, 7.3, 8.2, 8.3, 8.4
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType, ThemeConfig, ThemeContextValue } from '../types/theme';
import { getThemeConfig } from '../config/themes';
import { themeStorage } from '../services/themeStorage';

/**
 * Default theme to use when no theme is stored or on error
 * Requirement: 8.3 - Fallback to default theme
 */
const DEFAULT_THEME: ThemeType = 'business';

/**
 * Theme Context
 * Provides theme data to all consuming components
 * Requirement: 7.1 - Create theme context provider
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme Provider Props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider Component
 * 
 * Manages theme state and provides theme data to all child components.
 * Loads initial theme from storage on mount and handles theme switching.
 * 
 * Requirements: 7.1, 7.2, 7.3, 8.2, 8.3, 8.4
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // State management for current theme and loading status
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Load initial theme from storage on component mount
   * Requirement: 8.2 - Load theme from storage before rendering
   */
  useEffect(() => {
    const loadInitialTheme = async () => {
      try {
        setIsLoading(true);
        
        // Attempt to load theme from storage
        const storedTheme = await themeStorage.loadTheme();
        
        if (storedTheme) {
          // Validate the stored theme ID at runtime
          // Requirement: 8.3, 8.4, 8.5 - Validate theme ID before applying to Portal
          if (validateThemeId(storedTheme)) {
            // Use stored theme if valid
            setCurrentTheme(storedTheme);
          } else {
            // Log warning for invalid theme ID
            // Requirement: 8.5 - Log warnings for invalid theme IDs
            console.warn(`Invalid theme ID loaded from storage: ${storedTheme}, using default theme`);
            
            // Clear invalid theme data from storage
            // Requirement: 8.5 - Clear invalid theme data from storage
            try {
              await themeStorage.clearTheme();
            } catch (clearError) {
              console.error('Failed to clear invalid theme from storage:', clearError);
            }
            
            // Fall back to default theme
            // Requirement: 8.3, 8.4 - Fall back to default theme
            setCurrentTheme(DEFAULT_THEME);
          }
        } else {
          // Fall back to default theme if no theme is stored
          setCurrentTheme(DEFAULT_THEME);
        }
      } catch (error) {
        // Error handling with fallback to default theme
        // Requirement: 8.3, 8.4 - Handle storage failures with fallback
        console.error('Failed to load initial theme:', error);
        setCurrentTheme(DEFAULT_THEME);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTheme();
  }, []);

  /**
   * Validate theme ID at runtime
   * 
   * @param theme - The theme ID to validate
   * @returns true if valid, false otherwise
   * 
   * Requirement: 8.3, 8.4, 8.5 - Validate theme identifiers at runtime
   */
  const validateThemeId = (theme: string): theme is ThemeType => {
    const validThemes: ThemeType[] = ['business', 'premium', 'fresh', 'tech'];
    return validThemes.includes(theme as ThemeType);
  };

  /**
   * Set theme function for theme switching
   * 
   * @param theme - The theme to switch to
   * @throws Error if theme save fails (logged but not thrown to prevent app crash)
   * 
   * Requirements: 7.2, 7.3, 8.3, 8.4, 8.5 - Provide setTheme function and propagate changes with validation
   */
  const setTheme = async (theme: ThemeType): Promise<void> => {
    try {
      // Validate theme ID before applying
      // Requirement: 8.3, 8.4, 8.5 - Validate theme ID before applying to Portal
      if (!validateThemeId(theme)) {
        console.warn(`Invalid theme ID attempted: ${theme}, falling back to default theme`);
        
        // Clear invalid theme data from storage
        // Requirement: 8.5 - Clear invalid theme data from storage
        try {
          await themeStorage.clearTheme();
        } catch (clearError) {
          console.error('Failed to clear invalid theme from storage:', clearError);
        }
        
        // Fall back to default theme
        // Requirement: 8.3, 8.4 - Fall back to default theme
        setCurrentTheme(DEFAULT_THEME);
        return;
      }

      // Update state immediately for responsive UI
      // Requirement: 7.3 - Propagate changes to all consuming components
      setCurrentTheme(theme);

      // Persist theme to storage
      await themeStorage.saveTheme(theme);
    } catch (error) {
      // Log error but don't throw to prevent app crash
      // Requirement: 8.3, 8.4 - Error handling with fallback
      console.error('Failed to save theme:', error);
      
      // Theme is still applied in memory even if save fails
      // This allows the user to continue using the app with the selected theme
      // The theme just won't persist across sessions
    }
  };

  /**
   * Get theme configuration for current theme
   */
  const themeConfig: ThemeConfig = getThemeConfig(currentTheme);

  /**
   * Context value provided to all consumers
   * Requirement: 7.1, 7.2 - Provide theme data through context
   */
  const contextValue: ThemeContextValue = {
    currentTheme,
    themeConfig,
    setTheme,
    isLoading
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Custom Hook
 * 
 * Provides access to theme context data.
 * Throws error in development if used outside ThemeProvider.
 * Returns default theme in production if context is missing.
 * 
 * Requirement: 7.2 - Provide access to theme data through React hook
 * 
 * @returns Theme context value
 * @throws Error in development mode if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  // Error handling for missing context
  if (!context) {
    // In development mode, throw error to help developers catch mistakes
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'useTheme must be used within a ThemeProvider. ' +
        'Wrap your component tree with <ThemeProvider> to use theme functionality.'
      );
    }

    // In production mode, return default theme to prevent app crash
    // Requirement: 8.3, 8.4 - Fallback to default theme on error
    console.error('ThemeProvider not found, using default theme');
    
    return {
      currentTheme: DEFAULT_THEME,
      themeConfig: getThemeConfig(DEFAULT_THEME),
      setTheme: async () => {
        console.error('Cannot set theme: ThemeProvider not found');
      },
      isLoading: false
    };
  }

  return context;
}
