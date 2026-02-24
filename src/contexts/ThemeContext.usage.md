# ThemeContext Usage Guide

## Overview

The ThemeContext provides centralized theme management for the application. It handles theme loading from storage, theme switching, and provides theme data to all components.

## Setup

### 1. Wrap your application with ThemeProvider

```tsx
import { ThemeProvider } from './contexts/ThemeContext';
import { Portal } from './components/portalhome/Portal';

function App() {
  return (
    <ThemeProvider>
      <Portal />
    </ThemeProvider>
  );
}
```

### 2. Use the theme in any component

```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { currentTheme, themeConfig, setTheme, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  return (
    <div style={{ backgroundColor: themeConfig.colors.background }}>
      <h1>Current Theme: {themeConfig.name}</h1>
      <button onClick={() => setTheme('premium')}>
        Switch to Premium
      </button>
    </div>
  );
}
```

## API Reference

### ThemeProvider

**Props:**
- `children: ReactNode` - Child components to wrap

**Behavior:**
- Loads theme from storage on mount
- Provides theme data to all child components
- Handles errors with fallback to default theme

### useTheme Hook

**Returns:** `ThemeContextValue`
```typescript
{
  currentTheme: ThemeType;        // 'business' | 'premium' | 'fresh' | 'tech'
  themeConfig: ThemeConfig;       // Complete theme configuration
  setTheme: (theme: ThemeType) => Promise<void>;  // Function to change theme
  isLoading: boolean;             // Loading state during initialization
}
```

**Error Handling:**
- Development: Throws error if used outside ThemeProvider
- Production: Returns default theme with console error

## Theme Configuration Access

```tsx
const { themeConfig } = useTheme();

// Access colors
const primaryColor = themeConfig.colors.primary;
const backgroundColor = themeConfig.colors.background;

// Access typography
const fontFamily = themeConfig.typography.fontFamily;
const headingWeight = themeConfig.typography.headingWeight;

// Access spacing
const borderRadius = themeConfig.spacing.borderRadius;
const cardGap = themeConfig.spacing.cardGap;

// Access animations
const hoverEffect = themeConfig.animations.hoverEffect;
const transitionDuration = themeConfig.animations.transitionDuration;

// Access layout
const layoutType = themeConfig.layout.type;
const maxWidth = themeConfig.layout.maxWidth;
```

## Switching Themes

```tsx
const { setTheme } = useTheme();

// Switch to a different theme
await setTheme('premium');  // or 'business', 'fresh', 'tech'
```

**Note:** Theme changes are:
- Applied immediately in memory
- Persisted to localStorage
- Propagated to all consuming components

## Loading State

```tsx
const { isLoading } = useTheme();

if (isLoading) {
  return <LoadingSpinner />;
}

// Render content with theme applied
```

## Error Handling

The ThemeContext handles errors gracefully:

1. **Storage Load Failure**: Falls back to default 'business' theme
2. **Storage Save Failure**: Theme still applied in memory, just not persisted
3. **Invalid Theme ID**: Validates and rejects invalid themes
4. **Missing Context**: Returns default theme in production, throws in development

## Example: Personalization Config Component

```tsx
import { useTheme } from '../../contexts/ThemeContext';

function PersonalizationConfig() {
  const { currentTheme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);

  const handleSave = async (theme: ThemeType) => {
    setSaving(true);
    try {
      await setTheme(theme);
      alert('Theme saved successfully!');
    } catch (error) {
      alert('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Select Theme</h2>
      {['business', 'premium', 'fresh', 'tech'].map(theme => (
        <button
          key={theme}
          onClick={() => handleSave(theme as ThemeType)}
          disabled={saving}
          className={currentTheme === theme ? 'active' : ''}
        >
          {theme}
        </button>
      ))}
    </div>
  );
}
```

## Example: Portal Component with Theme

```tsx
import { useTheme } from '../../contexts/ThemeContext';

function Portal() {
  const { themeConfig, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`portal-${themeConfig.id}`}
      style={{
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text,
        fontFamily: themeConfig.typography.fontFamily
      }}
    >
      <header style={{ backgroundColor: themeConfig.colors.primary }}>
        <h1>Welcome to CargoWareX</h1>
      </header>
      {/* Rest of portal content */}
    </div>
  );
}
```

## Best Practices

1. **Always wrap with ThemeProvider**: Ensure ThemeProvider is at the root of your component tree
2. **Check loading state**: Use `isLoading` to prevent rendering before theme is loaded
3. **Handle errors gracefully**: The context handles errors, but you can add additional error UI
4. **Use theme config values**: Access colors, fonts, etc. from `themeConfig` rather than hardcoding
5. **Async theme switching**: Remember that `setTheme` is async, use `await` or `.then()`

## Testing

When testing components that use `useTheme`:

```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from './contexts/ThemeContext';

test('component with theme', () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
  // Your test assertions
});
```
