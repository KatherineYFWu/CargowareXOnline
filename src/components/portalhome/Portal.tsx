import React, { useEffect, useRef, useState } from 'react';
import PortalHeader from './PortalHeader';
import PortalFooter from './PortalFooter';
import PortalHero from './PortalHero';
import PortalFeatures from './PortalFeatures';
import PortalSolutions from './PortalSolutions';
import NewsCenter from './NewsCenter';
import PortalCTA from './PortalCTA';
import { UserProvider } from './UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import './PortalStyles.css';
import './themes/BusinessTheme.css';
import './themes/PremiumTheme.css';
import './themes/FreshTheme.css';
import './themes/TechTheme.css';
import { initPremiumAnimations } from './themes/PremiumTheme.animations';
import { initFreshAnimations } from './themes/FreshTheme.animations';
import { initTechAnimations } from './themes/TechTheme.animations';

const Portal: React.FC = () => {
  // Use theme from context instead of local state
  // Requirements: 2.1, 2.2, 7.2, 8.2
  const { currentTheme, isLoading } = useTheme();
  
  // Track previous theme for transition detection
  const previousThemeRef = useRef<string>(currentTheme);
  
  // Track if we're currently transitioning
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle theme transitions
  // Requirements: 10.1, 10.2, 10.4, 10.5
  useEffect(() => {
    // Skip if theme hasn't changed or is still loading
    if (isLoading || previousThemeRef.current === currentTheme) {
      return;
    }

    // Theme has changed, start transition
    setIsTransitioning(true);

    // Requirement: 10.2 - Complete transition within 300-500ms
    // Using 400ms to match CSS transition duration
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
      previousThemeRef.current = currentTheme;
    }, 400);

    return () => {
      clearTimeout(transitionTimer);
    };
  }, [currentTheme, isLoading]);

  // Initialize theme-specific animations when theme is active
  // Requirement: 10.3 - Ensure animations initialize after base theme is applied
  useEffect(() => {
    // Don't initialize animations while theme is still loading or transitioning
    if (isLoading || isTransitioning) {
      return;
    }

    let cleanup: (() => void) | undefined;

    if (currentTheme === 'premium') {
      // Initialize Premium theme animations
      cleanup = initPremiumAnimations();
    } else if (currentTheme === 'fresh') {
      // Initialize Fresh theme animations
      cleanup = initFreshAnimations();
    } else if (currentTheme === 'tech') {
      // Initialize Tech theme animations
      // Use binary rain by default, can be configured to use particle network
      cleanup = initTechAnimations({
        useParticleNetwork: false,
        usePerspectiveGrid: true,
      });
    }

    // Cleanup function
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [currentTheme, isLoading, isTransitioning]);

  // Show loading state while theme is being loaded
  // Requirement: 2.3 - Prevent flash of unstyled content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center theme-loading">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Build className for root element
  // Requirement: 10.1, 10.4 - Apply transition class and block interactions during transition
  const rootClassName = `min-h-screen bg-white ${isTransitioning ? 'theme-transitioning' : ''}`;

  return (
    <UserProvider>
      <div className={rootClassName} data-theme={currentTheme}>
        <PortalHeader />
        <main>
          <PortalHero />
          <PortalFeatures />
          <PortalSolutions />
          <NewsCenter />
          <PortalCTA />
        </main>
        <PortalFooter />
      </div>
    </UserProvider>
  );
};

export default Portal; 