/**
 * Theme Context Tests
 * 
 * Unit tests for ThemeProvider and useTheme hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { themeStorage } from '../../services/themeStorage';
import { ThemeType } from '../../types/theme';

// Mock the theme storage service
vi.mock('../../services/themeStorage', () => ({
  themeStorage: {
    loadTheme: vi.fn(),
    saveTheme: vi.fn(),
    clearTheme: vi.fn()
  }
}));

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('should load initial theme from storage on mount', async () => {
      const mockTheme: ThemeType = 'premium';
      vi.mocked(themeStorage.loadTheme).mockResolvedValue(mockTheme);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for theme to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentTheme).toBe(mockTheme);
      expect(themeStorage.loadTheme).toHaveBeenCalledTimes(1);
    });

    it('should use default business theme when no theme is stored', async () => {
      vi.mocked(themeStorage.loadTheme).mockResolvedValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentTheme).toBe('business');
    });

    it('should fallback to default theme on storage error', async () => {
      vi.mocked(themeStorage.loadTheme).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentTheme).toBe('business');
    });

    it('should provide theme configuration for current theme', async () => {
      vi.mocked(themeStorage.loadTheme).mockResolvedValue('tech');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.themeConfig).toBeDefined();
      expect(result.current.themeConfig.id).toBe('tech');
      expect(result.current.themeConfig.name).toBe('未来科技');
    });
  });

  describe('setTheme', () => {
    it('should update current theme and save to storage', async () => {
      vi.mocked(themeStorage.loadTheme).mockResolvedValue('business');
      vi.mocked(themeStorage.saveTheme).mockResolvedValue();

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Change theme
      await result.current.setTheme('fresh');

      expect(result.current.currentTheme).toBe('fresh');
      expect(themeStorage.saveTheme).toHaveBeenCalledWith('fresh');
    });

    it('should update theme in memory even if save fails', async () => {
      vi.mocked(themeStorage.loadTheme).mockResolvedValue('business');
      vi.mocked(themeStorage.saveTheme).mockRejectedValue(new Error('Save failed'));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Change theme
      await result.current.setTheme('premium');

      // Theme should still be updated in memory
      expect(result.current.currentTheme).toBe('premium');
    });
  });

  describe('useTheme hook', () => {
    it('should throw error in development when used outside ThemeProvider', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      process.env.NODE_ENV = originalEnv;
    });

    it('should return default theme in production when used outside ThemeProvider', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { result } = renderHook(() => useTheme());

      expect(result.current.currentTheme).toBe('business');
      expect(result.current.themeConfig.id).toBe('business');
      expect(result.current.isLoading).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
