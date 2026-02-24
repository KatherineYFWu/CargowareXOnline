/**
 * Theme Error Boundary Component
 * 
 * Catches theme loading and application errors and displays fallback UI with default theme.
 * Prevents theme-related errors from crashing the entire application.
 * 
 * Requirements: 8.3, 8.4
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { ThemeType } from '../../types/theme';
import { getThemeConfig } from '../../config/themes';

/**
 * Props for ThemeErrorBoundary
 */
interface ThemeErrorBoundaryProps {
  children: ReactNode;
  fallbackTheme?: ThemeType;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State for ThemeErrorBoundary
 */
interface ThemeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Default theme to use when errors occur
 * Requirement: 8.3 - Fallback to default theme
 */
const DEFAULT_FALLBACK_THEME: ThemeType = 'business';

/**
 * Theme Error Boundary Component
 * 
 * Catches errors in theme-related components and displays a fallback UI
 * with the default theme applied. Logs errors for debugging purposes.
 * 
 * Requirements: 8.3, 8.4
 */
export class ThemeErrorBoundary extends Component<
  ThemeErrorBoundaryProps,
  ThemeErrorBoundaryState
> {
  constructor(props: ThemeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when an error is caught
   * Requirement: 8.3 - Catch theme loading and application errors
   */
  static getDerivedStateFromError(error: Error): Partial<ThemeErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Log error details for debugging
   * Requirement: 8.4 - Log errors for debugging
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error('Theme Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);

    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call optional error handler prop
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  /**
   * Reset error boundary state
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Render fallback UI when error occurs
   * Requirement: 8.3 - Display fallback UI with default theme
   */
  renderFallbackUI(): ReactNode {
    const { fallbackTheme = DEFAULT_FALLBACK_THEME } = this.props;
    const { error, errorInfo } = this.state;
    const themeConfig = getThemeConfig(fallbackTheme);

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: themeConfig.colors.background,
          color: themeConfig.colors.text,
          fontFamily: themeConfig.typography.fontFamily,
          padding: '20px'
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            background: themeConfig.colors.surface,
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${themeConfig.colors.accent}20, ${themeConfig.colors.accent}40)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}
          >
            ⚠️
          </div>

          {/* Error Title */}
          <h2
            style={{
              fontSize: '24px',
              fontWeight: themeConfig.typography.headingWeight,
              color: themeConfig.colors.text,
              marginBottom: '16px'
            }}
          >
            Theme Loading Error
          </h2>

          {/* Error Message */}
          <p
            style={{
              fontSize: '16px',
              color: themeConfig.colors.textSecondary,
              marginBottom: '24px',
              lineHeight: '1.6'
            }}
          >
            We encountered an issue while loading the theme. The application has
            been switched to the default theme to ensure continued functionality.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details
              style={{
                textAlign: 'left',
                marginBottom: '24px',
                padding: '16px',
                background: themeConfig.colors.background,
                borderRadius: '8px',
                fontSize: '14px',
                color: themeConfig.colors.textSecondary,
                maxHeight: '200px',
                overflow: 'auto'
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: themeConfig.typography.mediumWeight,
                  marginBottom: '12px',
                  color: themeConfig.colors.text
                }}
              >
                Error Details (Development Mode)
              </summary>
              <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Error:</strong> {error.message}
                </div>
                {errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        marginTop: '8px',
                        padding: '8px',
                        background: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '4px'
                      }}
                    >
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: themeConfig.typography.mediumWeight,
                color: '#fff',
                background: themeConfig.colors.accent,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: themeConfig.typography.fontFamily
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: themeConfig.typography.mediumWeight,
                color: themeConfig.colors.text,
                background: themeConfig.colors.background,
                border: `2px solid ${themeConfig.colors.secondary}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: themeConfig.typography.fontFamily
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = themeConfig.colors.secondary + '20';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = themeConfig.colors.background;
              }}
            >
              Reload Page
            </button>
          </div>

          {/* Help Text */}
          <p
            style={{
              fontSize: '14px',
              color: themeConfig.colors.textSecondary,
              marginTop: '24px',
              marginBottom: '0'
            }}
          >
            If the problem persists, please contact support or try clearing your
            browser cache.
          </p>
        </div>
      </div>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

export default ThemeErrorBoundary;
