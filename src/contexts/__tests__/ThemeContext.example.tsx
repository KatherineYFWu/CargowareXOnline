/**
 * ThemeContext Integration Example
 * 
 * This file demonstrates how to use the ThemeContext in a real application.
 * It can be used as a reference for implementing theme functionality.
 */

import { useState } from 'react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { ThemeType } from '../../types/theme';

/**
 * Example: Theme Selector Component
 * Shows how to display and switch between themes
 */
function ThemeSelector() {
  const { currentTheme, themeConfig, setTheme, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading themes...</div>;
  }

  const themes: Array<{ id: ThemeType; name: string }> = [
    { id: 'business', name: '简约商务' },
    { id: 'premium', name: '高端尊享' },
    { id: 'fresh', name: '清新现代' },
    { id: 'tech', name: '未来科技' }
  ];

  const handleThemeChange = async (themeId: ThemeType) => {
    try {
      await setTheme(themeId);
      console.log(`Theme changed to: ${themeId}`);
    } catch (error) {
      console.error('Failed to change theme:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Select Theme</h2>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: currentTheme === theme.id 
                ? themeConfig.colors.primary 
                : themeConfig.colors.surface,
              color: currentTheme === theme.id 
                ? '#fff' 
                : themeConfig.colors.text,
              border: `2px solid ${themeConfig.colors.primary}`,
              borderRadius: themeConfig.spacing.borderRadius,
              cursor: 'pointer',
              fontWeight: currentTheme === theme.id ? 'bold' : 'normal'
            }}
          >
            {theme.name}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '30px' }}>
        <h3>Current Theme: {themeConfig.name}</h3>
        <p>Primary Color: {themeConfig.colors.primary}</p>
        <p>Font Family: {themeConfig.typography.fontFamily}</p>
      </div>
    </div>
  );
}

/**
 * Example: Themed Card Component
 * Shows how to use theme configuration in a component
 */
function ThemedCard({ title, content }: { title: string; content: string }) {
  const { themeConfig } = useTheme();

  return (
    <div
      style={{
        backgroundColor: themeConfig.colors.surface,
        color: themeConfig.colors.text,
        padding: '20px',
        borderRadius: themeConfig.spacing.borderRadius,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: themeConfig.typography.fontFamily,
        transition: `all ${themeConfig.animations.transitionDuration}`
      }}
    >
      <h3
        style={{
          color: themeConfig.colors.primary,
          fontWeight: themeConfig.typography.headingWeight,
          marginBottom: '10px'
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: themeConfig.colors.textSecondary,
          fontWeight: themeConfig.typography.bodyWeight
        }}
      >
        {content}
      </p>
    </div>
  );
}

/**
 * Example: Complete Application with ThemeProvider
 * Shows the proper setup of ThemeProvider at the root level
 */
export function ExampleApp() {
  return (
    <ThemeProvider>
      <div style={{ padding: '40px' }}>
        <h1>Theme System Example</h1>
        <ThemeSelector />
        <div style={{ marginTop: '40px', display: 'grid', gap: '20px' }}>
          <ThemedCard
            title="Welcome"
            content="This card adapts to the selected theme automatically."
          />
          <ThemedCard
            title="Dynamic Styling"
            content="Colors, fonts, and spacing all come from the theme configuration."
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

/**
 * Example: Error Handling
 * Shows how the hook handles missing ThemeProvider
 */
export function ComponentWithoutProvider() {
  // In development, this would throw an error
  // In production, it returns default theme
  const { currentTheme, themeConfig } = useTheme();

  return (
    <div>
      <p>Current Theme: {currentTheme}</p>
      <p>Theme Name: {themeConfig.name}</p>
    </div>
  );
}

/**
 * Example: Loading State Handling
 * Shows how to handle the loading state during theme initialization
 */
export function LoadingExample() {
  return (
    <ThemeProvider>
      <LoadingAwareComponent />
    </ThemeProvider>
  );
}

function LoadingAwareComponent() {
  const { isLoading, themeConfig } = useTheme();

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading theme configuration...</div>
        <div style={{ marginTop: '10px' }}>
          <span>⏳</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Theme Loaded Successfully!</h2>
      <p>Current theme: {themeConfig.name}</p>
    </div>
  );
}

/**
 * Example: Async Theme Switching with Feedback
 * Shows how to provide user feedback during theme changes
 */
export function AsyncThemeSwitcher() {
  return (
    <ThemeProvider>
      <ThemeSwitcherWithFeedback />
    </ThemeProvider>
  );
}

function ThemeSwitcherWithFeedback() {
  const { setTheme } = useTheme();
  const [switching, setSwitching] = useState(false);
  const [message, setMessage] = useState('');

  const handleSwitch = async (theme: ThemeType) => {
    setSwitching(true);
    setMessage('Switching theme...');

    try {
      await setTheme(theme);
      setMessage(`Successfully switched to ${theme} theme!`);
    } catch (error) {
      setMessage('Failed to switch theme. Please try again.');
    } finally {
      setSwitching(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleSwitch('premium')}
        disabled={switching}
      >
        Switch to Premium
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

// Note: This file is for demonstration purposes only
// It shows various usage patterns but is not meant to be executed directly
