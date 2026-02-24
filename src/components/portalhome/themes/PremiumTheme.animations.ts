/**
 * Premium Theme Animations
 * 
 * Interactive animations for the Premium theme including:
 * - Parallax scrolling (Requirement 4.7)
 * - Staggered fade-in animations (Requirement 4.9)
 * - Custom cursor with magnetic button attraction (Requirement 4.5)
 */

/**
 * Initialize parallax scrolling effect
 * Requirement 4.7: Implement parallax scrolling with differential scroll rates
 */
export function initParallaxScrolling(): () => void {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) {
    return () => {}; // No cleanup needed
  }

  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.getAttribute('data-parallax') || '0.5');
      const yPos = -(scrollY * speed);
      (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
    });
  };

  // Use passive listener for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial call
  handleScroll();

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Initialize staggered fade-in animations
 * Requirement 4.9: Implement staggered fade-in animations for text elements
 */
export function initStaggeredFadeIn(): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('premium-stagger-fade');
          observer.unobserve(element);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  const fadeElements = document.querySelectorAll('[data-fade-in]');
  fadeElements.forEach((element) => observer.observe(element));

  // Return cleanup function
  return () => {
    observer.disconnect();
  };
}

/**
 * Custom cursor with magnetic button attraction
 * Requirement 4.5: Implement custom cursor effects with magnetic button attraction
 */
export function initCustomCursor(): () => void {
  // Check if we're on mobile/tablet
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (isMobile) {
    return () => {}; // Don't initialize on mobile
  }

  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'premium-cursor';
  document.body.appendChild(cursor);

  const cursorDot = document.createElement('div');
  cursorDot.className = 'premium-cursor-dot';
  document.body.appendChild(cursorDot);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;

  // Track mouse position
  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  // Animate cursor with smooth following
  const animateCursor = () => {
    // Smooth cursor following
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Faster dot following
    const dotSpeed = 0.25;
    dotX += (mouseX - dotX) * dotSpeed;
    dotY += (mouseY - dotY) * dotSpeed;
    
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  };

  // Magnetic button attraction
  const handleButtonHover = (e: MouseEvent) => {
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    );
    
    const maxDistance = 100; // Maximum distance for magnetic effect
    
    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      const pullX = (buttonCenterX - mouseX) * strength * 0.3;
      const pullY = (buttonCenterY - mouseY) * strength * 0.3;
      
      cursor.style.transform = `translate(${pullX}px, ${pullY}px)`;
      cursor.classList.add('premium-cursor-hover');
    }
  };

  const handleButtonLeave = () => {
    cursor.style.transform = '';
    cursor.classList.remove('premium-cursor-hover');
  };

  // Add hover effects to interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, [role="button"], .premium-button, .premium-button-magnetic'
  );
  
  interactiveElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('premium-cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('premium-cursor-hover');
    });
    
    // Add magnetic effect to buttons
    if (
      element.classList.contains('premium-button') ||
      element.classList.contains('premium-button-magnetic')
    ) {
      element.addEventListener('mousemove', handleButtonHover as EventListener);
      element.addEventListener('mouseleave', handleButtonLeave);
    }
  });

  // Start animations
  document.addEventListener('mousemove', handleMouseMove);
  animateCursor();

  // Return cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    cursor.remove();
    cursorDot.remove();
    
    interactiveElements.forEach((element) => {
      element.removeEventListener('mousemove', handleButtonHover as EventListener);
      element.removeEventListener('mouseleave', handleButtonLeave);
    });
  };
}

/**
 * Initialize all Premium theme animations
 * Call this when the Premium theme is activated
 */
export function initPremiumAnimations(): () => void {
  const cleanupFunctions: Array<() => void> = [];

  // Initialize all animations
  cleanupFunctions.push(initParallaxScrolling());
  cleanupFunctions.push(initStaggeredFadeIn());
  cleanupFunctions.push(initCustomCursor());

  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Cleanup all Premium theme animations
 * Call this when switching away from the Premium theme
 */
export function cleanupPremiumAnimations(cleanup: () => void): void {
  if (cleanup) {
    cleanup();
  }
}
