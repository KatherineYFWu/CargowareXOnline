/**
 * Fresh Theme Animations
 * 
 * Interactive animations for the Fresh theme including:
 * - Bouncy scale animation for button clicks (Requirement 5.5)
 * - Confetti celebration animation (Requirement 5.6)
 * - Smooth drag-and-drop with tilt effects (Requirement 5.7)
 */

/**
 * Initialize bouncy button animations
 * Requirement 5.5: Create bouncy scale animation for button clicks
 */
export function initBouncyButtons(): () => void {
  const buttons = document.querySelectorAll('.fresh-button');
  
  const handleClick = (e: Event) => {
    const button = e.currentTarget as HTMLElement;
    
    // Remove animation class if it exists
    button.classList.remove('fresh-button-bounce');
    
    // Trigger reflow to restart animation
    void button.offsetWidth;
    
    // Add animation class
    button.classList.add('fresh-button-bounce');
    
    // Remove class after animation completes
    setTimeout(() => {
      button.classList.remove('fresh-button-bounce');
    }, 400);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', handleClick);
  });

  // Return cleanup function
  return () => {
    buttons.forEach((button) => {
      button.removeEventListener('click', handleClick);
    });
  };
}

/**
 * Confetti piece interface
 */
interface ConfettiPiece {
  element: HTMLDivElement;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

/**
 * Trigger confetti celebration animation
 * Requirement 5.6: Implement confetti celebration animation
 */
export function triggerConfetti(options?: {
  duration?: number;
  particleCount?: number;
  origin?: { x: number; y: number };
}): void {
  const {
    duration = 3000,
    particleCount = 50,
    origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  } = options || {};

  // Create confetti container if it doesn't exist
  let container = document.querySelector('.fresh-confetti-container') as HTMLDivElement;
  if (!container) {
    container = document.createElement('div');
    container.className = 'fresh-confetti-container';
    document.body.appendChild(container);
  }

  const colors = [
    '#6EE7B7', // Mint green
    '#FDA4AF', // Coral pink
    '#A78BFA', // Purple
    '#60A5FA', // Blue
    '#FBBF24', // Yellow
    '#F87171', // Red
  ];

  const pieces: ConfettiPiece[] = [];

  // Create confetti pieces
  for (let i = 0; i < particleCount; i++) {
    const piece = document.createElement('div');
    piece.className = 'fresh-confetti-piece';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.backgroundColor = color;
    
    // Random size
    const size = Math.random() * 8 + 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    
    // Random shape (square or circle)
    if (Math.random() > 0.5) {
      piece.style.borderRadius = '50%';
    }
    
    // Starting position
    piece.style.left = `${origin.x}px`;
    piece.style.top = `${origin.y}px`;
    
    // Random trajectory
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const velocity = Math.random() * 200 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 200; // Upward bias
    
    // Random rotation
    const rotation = Math.random() * 720 - 360;
    
    // Random animation delay
    const delay = Math.random() * 200;
    piece.style.animationDelay = `${delay}ms`;
    piece.style.animationDuration = `${duration}ms`;
    
    // Apply transform for trajectory
    const translateX = vx;
    const translateY = vy + window.innerHeight;
    piece.style.setProperty('--translate-x', `${translateX}px`);
    piece.style.setProperty('--translate-y', `${translateY}px`);
    piece.style.setProperty('--rotation', `${rotation}deg`);
    
    container.appendChild(piece);
    
    pieces.push({
      element: piece,
      x: origin.x,
      y: origin.y,
      rotation,
      color,
    });
  }

  // Clean up after animation
  setTimeout(() => {
    pieces.forEach((piece) => {
      piece.element.remove();
    });
  }, duration + 500);
}

/**
 * Initialize confetti triggers
 * Automatically trigger confetti on specific events
 */
export function initConfettiTriggers(): () => void {
  const triggers = document.querySelectorAll('[data-confetti-trigger]');
  
  const handleTrigger = (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    triggerConfetti({
      origin: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    });
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', handleTrigger);
  });

  // Return cleanup function
  return () => {
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', handleTrigger);
    });
  };
}

/**
 * Drag state interface
 */
interface DragState {
  element: HTMLElement | null;
  offsetX: number;
  offsetY: number;
  initialX: number;
  initialY: number;
}

/**
 * Initialize drag and drop with tilt effects
 * Requirement 5.7: Add smooth drag-and-drop with tilt effects
 */
export function initDragAndDrop(): () => void {
  const draggables = document.querySelectorAll('.fresh-draggable');
  const dragState: DragState = {
    element: null,
    offsetX: 0,
    offsetY: 0,
    initialX: 0,
    initialY: 0,
  };

  const handleDragStart = (e: MouseEvent | TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    
    // Get initial position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = target.getBoundingClientRect();
    dragState.element = target;
    dragState.offsetX = clientX - rect.left;
    dragState.offsetY = clientY - rect.top;
    dragState.initialX = rect.left;
    dragState.initialY = rect.top;
    
    target.classList.add('fresh-dragging');
    
    // Prevent default to avoid text selection
    e.preventDefault();
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragState.element) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - dragState.offsetX;
    const y = clientY - dragState.offsetY;
    
    // Calculate tilt based on movement direction
    const deltaX = x - dragState.initialX;
    const deltaY = y - dragState.initialY;
    const tiltX = Math.max(-15, Math.min(15, deltaY / 10));
    const tiltY = Math.max(-15, Math.min(15, deltaX / 10));
    
    dragState.element.style.position = 'fixed';
    dragState.element.style.left = `${x}px`;
    dragState.element.style.top = `${y}px`;
    dragState.element.style.transform = `
      scale(1.05) 
      rotate(${tiltY}deg) 
      rotateX(${tiltX}deg)
    `;
    dragState.element.style.zIndex = '1000';
    
    e.preventDefault();
  };

  const handleDragEnd = () => {
    if (!dragState.element) return;
    
    dragState.element.classList.remove('fresh-dragging');
    
    // Animate back to original position or snap to drop zone
    const dropZones = document.querySelectorAll('.fresh-drop-zone');
    let dropped = false;
    
    dropZones.forEach((zone) => {
      const rect = zone.getBoundingClientRect();
      const elementRect = dragState.element!.getBoundingClientRect();
      
      // Check if element overlaps with drop zone
      if (
        elementRect.left < rect.right &&
        elementRect.right > rect.left &&
        elementRect.top < rect.bottom &&
        elementRect.bottom > rect.top
      ) {
        // Element dropped in zone
        zone.classList.remove('fresh-drag-over');
        dropped = true;
        
        // Dispatch custom event
        const event = new CustomEvent('fresh-drop', {
          detail: {
            element: dragState.element,
            zone: zone,
          },
        });
        zone.dispatchEvent(event);
      }
    });
    
    // Reset styles
    if (dragState.element) {
      dragState.element.style.position = '';
      dragState.element.style.left = '';
      dragState.element.style.top = '';
      dragState.element.style.transform = '';
      dragState.element.style.zIndex = '';
    }
    
    dragState.element = null;
  };

  const handleDragOver = (e: Event) => {
    const zone = e.currentTarget as HTMLElement;
    if (dragState.element) {
      zone.classList.add('fresh-drag-over');
    }
  };

  const handleDragLeave = (e: Event) => {
    const zone = e.currentTarget as HTMLElement;
    zone.classList.remove('fresh-drag-over');
  };

  // Add event listeners to draggable elements
  draggables.forEach((draggable) => {
    draggable.addEventListener('mousedown', handleDragStart as EventListener);
    draggable.addEventListener('touchstart', handleDragStart as EventListener);
  });

  // Add global move and end listeners
  document.addEventListener('mousemove', handleDragMove as EventListener);
  document.addEventListener('touchmove', handleDragMove as EventListener);
  document.addEventListener('mouseup', handleDragEnd);
  document.addEventListener('touchend', handleDragEnd);

  // Add listeners to drop zones
  const dropZones = document.querySelectorAll('.fresh-drop-zone');
  dropZones.forEach((zone) => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragleave', handleDragLeave);
  });

  // Return cleanup function
  return () => {
    draggables.forEach((draggable) => {
      draggable.removeEventListener('mousedown', handleDragStart as EventListener);
      draggable.removeEventListener('touchstart', handleDragStart as EventListener);
    });
    
    document.removeEventListener('mousemove', handleDragMove as EventListener);
    document.removeEventListener('touchmove', handleDragMove as EventListener);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);
    
    dropZones.forEach((zone) => {
      zone.removeEventListener('dragover', handleDragOver);
      zone.removeEventListener('dragleave', handleDragLeave);
    });
  };
}

/**
 * Initialize all Fresh theme animations
 * Call this when the Fresh theme is activated
 */
export function initFreshAnimations(): () => void {
  const cleanupFunctions: Array<() => void> = [];

  // Initialize all animations
  cleanupFunctions.push(initBouncyButtons());
  cleanupFunctions.push(initConfettiTriggers());
  cleanupFunctions.push(initDragAndDrop());

  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Cleanup all Fresh theme animations
 * Call this when switching away from the Fresh theme
 */
export function cleanupFreshAnimations(cleanup: () => void): void {
  if (cleanup) {
    cleanup();
  }
}
