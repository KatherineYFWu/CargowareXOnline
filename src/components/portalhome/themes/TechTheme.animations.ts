/**
 * Tech Theme Animations
 * 
 * Interactive animations for the Tech theme including:
 * - Glitch effects for headings (Requirement 6.5)
 * - Typewriter text reveal with cursor blink (Requirement 6.7)
 * - Binary code rain or particle network background (Requirement 6.8)
 * - Dynamic perspective grid responding to mouse movement (Requirement 6.9)
 */

/**
 * Initialize glitch effect for important headings
 * Requirement 6.5: Create glitch effect for important headings
 */
export function initGlitchEffect(): () => void {
  const glitchElements = document.querySelectorAll('[data-glitch]');
  
  glitchElements.forEach((element) => {
    const text = element.textContent || '';
    element.setAttribute('data-text', text);
    element.classList.add('tech-glitch');
  });

  // Trigger random glitches
  const glitchInterval = setInterval(() => {
    glitchElements.forEach((element) => {
      if (Math.random() > 0.7) {
        element.classList.add('tech-glitch-active');
        setTimeout(() => {
          element.classList.remove('tech-glitch-active');
        }, 300);
      }
    });
  }, 3000);

  // Return cleanup function
  return () => {
    clearInterval(glitchInterval);
    glitchElements.forEach((element) => {
      element.classList.remove('tech-glitch', 'tech-glitch-active');
      element.removeAttribute('data-text');
    });
  };
}

/**
 * Initialize typewriter text reveal animation
 * Requirement 6.7: Implement typewriter text reveal animations with cursor blink
 */
export function initTypewriterEffect(): () => void {
  const typewriterElements = document.querySelectorAll('[data-typewriter]');
  const cleanupFunctions: Array<() => void> = [];

  typewriterElements.forEach((element) => {
    const text = element.textContent || '';
    const speed = parseInt(element.getAttribute('data-typewriter-speed') || '50', 10);
    element.textContent = '';
    
    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'tech-typewriter-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        element.insertBefore(document.createTextNode(text[index]), cursor);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);

    // Cursor blink animation
    const cursorBlink = setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);

    cleanupFunctions.push(() => {
      clearInterval(typeInterval);
      clearInterval(cursorBlink);
      element.textContent = text;
    });
  });

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Initialize binary code rain background
 * Requirement 6.8: Add animated binary code rain or particle network background
 */
export function initBinaryRain(): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'tech-binary-rain';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.15';
  
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => canvas.remove();
  }

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Binary rain configuration
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops: number[] = Array(columns).fill(1);
  const binaryChars = '01';

  // Animation loop
  let animationId: number;
  const draw = () => {
    // Semi-transparent black to create fade effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text style
    ctx.fillStyle = '#00F0FF';
    ctx.font = `${fontSize}px monospace`;

    // Draw binary characters
    for (let i = 0; i < drops.length; i++) {
      const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      // Reset drop to top randomly
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }

    animationId = requestAnimationFrame(draw);
  };

  draw();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
    canvas.remove();
  };
}

/**
 * Initialize particle network background
 * Requirement 6.8: Add animated particle network background (alternative to binary rain)
 */
export function initParticleNetwork(): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'tech-particle-network';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.2';
  
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => canvas.remove();
  }

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle configuration
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
  }

  const particles: Particle[] = [];
  const particleCount = 50;
  const maxDistance = 150;

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    });
  }

  // Animation loop
  let animationId: number;
  const draw = () => {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - particle.x;
        const dy = particles[j].y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / maxDistance})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(draw);
  };

  draw();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
    canvas.remove();
  };
}

/**
 * Initialize dynamic perspective grid
 * Requirement 6.9: Create dynamic perspective grid that responds to mouse movement
 */
export function initPerspectiveGrid(): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'tech-perspective-grid';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.15';
  
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => canvas.remove();
  }

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse tracking
  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  const handleMouseMove = (e: MouseEvent) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  };

  document.addEventListener('mousemove', handleMouseMove);

  // Grid configuration
  const gridSize = 50;
  const perspective = 500;

  // Animation loop
  let animationId: number;
  const draw = () => {
    // Smooth mouse following
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    // Clear canvas
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate perspective offset based on mouse position
    const offsetX = (mouseX - canvas.width / 2) / 10;
    const offsetY = (mouseY - canvas.height / 2) / 10;

    // Draw grid
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      const startY = y + offsetY;
      const endY = y + offsetY;
      ctx.moveTo(0, startY);
      ctx.lineTo(canvas.width, endY);
      ctx.globalAlpha = 1 - y / canvas.height;
      ctx.stroke();
    }

    // Vertical lines with perspective
    for (let x = -canvas.width; x < canvas.width * 2; x += gridSize) {
      ctx.beginPath();
      const startX = x + offsetX;
      const endX = canvas.width / 2 + (x - canvas.width / 2) * 1.5 + offsetX;
      ctx.moveTo(startX, 0);
      ctx.lineTo(endX, canvas.height);
      ctx.globalAlpha = 0.5;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(draw);
  };

  draw();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', resizeCanvas);
    canvas.remove();
  };
}

/**
 * Initialize all Tech theme animations
 * Call this when the Tech theme is activated
 */
export function initTechAnimations(options: {
  useParticleNetwork?: boolean;
  usePerspectiveGrid?: boolean;
} = {}): () => void {
  const cleanupFunctions: Array<() => void> = [];

  // Initialize all animations
  cleanupFunctions.push(initGlitchEffect());
  cleanupFunctions.push(initTypewriterEffect());
  
  // Choose between binary rain and particle network
  if (options.useParticleNetwork) {
    cleanupFunctions.push(initParticleNetwork());
  } else {
    cleanupFunctions.push(initBinaryRain());
  }
  
  // Optionally add perspective grid
  if (options.usePerspectiveGrid) {
    cleanupFunctions.push(initPerspectiveGrid());
  }

  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Cleanup all Tech theme animations
 * Call this when switching away from the Tech theme
 */
export function cleanupTechAnimations(cleanup: () => void): void {
  if (cleanup) {
    cleanup();
  }
}
