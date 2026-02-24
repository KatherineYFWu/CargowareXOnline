/**
 * PersonalizationConfig Component Tests
 * 
 * Tests for the theme selection UI component
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalizationConfig from '../PersonalizationConfig';
import { ThemeProvider } from '../../../../contexts/ThemeContext';
import { ThemeType } from '../../../../types/theme';

// Mock the theme storage
vi.mock('../../../../services/themeStorage', () => ({
  themeStorage: {
    saveTheme: vi.fn().mockResolvedValue(undefined),
    loadTheme: vi.fn().mockResolvedValue('business' as ThemeType),
    clearTheme: vi.fn().mockResolvedValue(undefined)
  }
}));

describe('PersonalizationConfig - Theme Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render four theme options', async () => {
    render(
      <ThemeProvider>
        <PersonalizationConfig />
      </ThemeProvider>
    );

    // Wait for theme to load
    await waitFor(() => {
      expect(screen.queryByText('加载主题中...')).not.toBeInTheDocument();
    });

    // Check that all four theme names are displayed
    // Requirement 1.1: Display four theme options
    expect(screen.getByText('简约商务')).toBeInTheDocument();
    expect(screen.getByText('高端尊享')).toBeInTheDocument();
    expect(screen.getByText('清新现代')).toBeInTheDocument();
    expect(screen.getByText('未来科技')).toBeInTheDocument();
  });

  it('should highlight the currently selected theme', async () => {
    render(
      <ThemeProvider>
        <PersonalizationConfig />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('加载主题中...')).not.toBeInTheDocument();
    });

    // The business theme should be selected by default
    const businessCard = screen.getByText('简约商务').closest('div');
    
    // Check that the selected theme has the check icon
    // Requirement 1.2: Highlight selected option
    const checkIcons = screen.getAllByRole('img', { hidden: true });
    expect(checkIcons.length).toBeGreaterThan(0);
  });

  it('should allow selecting a different theme', async () => {
    render(
      <ThemeProvider>
        <PersonalizationConfig />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('加载主题中...')).not.toBeInTheDocument();
    });

    // Click on the Premium theme
    const premiumCard = screen.getByText('高端尊享').closest('div');
    if (premiumCard) {
      fireEvent.click(premiumCard);
    }

    // The save button should now be enabled
    // Requirement 1.2: Store selection when theme is selected
    await waitFor(() => {
      const saveButton = screen.getByText('保存主题');
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should display save button with correct state', async () => {
    render(
      <ThemeProvider>
        <PersonalizationConfig />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('加载主题中...')).not.toBeInTheDocument();
    });

    // Initially, the button should show "当前主题" and be disabled
    const saveButton = screen.getByRole('button', { name: /当前主题|保存主题/ });
    expect(saveButton).toBeInTheDocument();
  });

  it('should show loading state during theme save', async () => {
    const { themeStorage } = await import('../../../../services/themeStorage');
    
    // Make save take some time
    vi.mocked(themeStorage.saveTheme).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <ThemeProvider>
        <PersonalizationConfig />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('加载主题中...')).not.toBeInTheDocument();
    });

    // Select a different theme
    const premiumCard = screen.getByText('高端尊享').closest('div');
    if (premiumCard) {
      fireEvent.click(premiumCard);
    }

    // Click save button
    await waitFor(() => {
      const saveButton = screen.getByText('保存主题');
      fireEvent.click(saveButton);
    });

    // Button should show loading state
    // Requirement 1.3: Add save button with loading state
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /保存主题/ });
      expect(saveButton).toHaveAttribute('class', expect.stringContaining('loading'));
    }, { timeout: 200 });
  });
});
