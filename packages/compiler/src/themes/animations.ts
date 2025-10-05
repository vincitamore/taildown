/**
 * Animation System for Taildown
 * Provides subtle, fast, professional animations for components
 * 
 * Design Principles:
 * - Performance-first: GPU-accelerated transforms
 * - Subtle and fast: Sub-300ms durations for most effects
 * - Respectful: Honor prefers-reduced-motion
 * - Modern: Smooth easing curves (cubic-bezier)
 * 
 * Animation Categories:
 * 1. Entrance: Fade-in, slide-in, scale-in
 * 2. Hover: Lift, glow, scale
 * 3. Interactive: Click, focus, active states
 * 4. Loading: Pulse, spin, shimmer
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §4 for animation spec
 */

/**
 * Animation timing functions (easing curves)
 */
export const EASING = {
  // Standard easing
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Custom cubic-bezier curves
  smooth: 'cubic-bezier(0.16, 1, 0.3, 1)', // Ultra smooth ease-out, organic feel
  snappy: 'cubic-bezier(0.4, 0, 0.6, 1)', // Quick and responsive
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Gentle bounce
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)', // More pronounced bounce
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const DURATION = {
  instant: 75,
  fast: 150,
  normal: 200,
  slow: 4500,  // DEBUG: Even slower - 50% more (3000 * 1.5)
  slower: 1000,
} as const;

/**
 * Entrance animation types
 */
export enum EntranceAnimation {
  FADE_IN = 'fade-in',
  SLIDE_UP = 'slide-up',
  SLIDE_DOWN = 'slide-down',
  SLIDE_LEFT = 'slide-left',
  SLIDE_RIGHT = 'slide-right',
  SCALE_IN = 'scale-in',
  ZOOM_IN = 'zoom-in',
}

/**
 * Hover animation types
 */
export enum HoverAnimation {
  LIFT = 'lift',           // Subtle upward movement
  GLOW = 'glow',           // Shadow glow effect
  SCALE = 'scale',         // Slight scale increase
  BRIGHTEN = 'brighten',   // Brightness increase
  TILT = 'tilt',           // 3D tilt effect
}

/**
 * Generate CSS for entrance animations
 * 
 * @returns CSS string with keyframes and animation classes
 */
export function generateEntranceAnimationsCSS(): string {
  return `
/* Entrance Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5); // Twice as far away (0.7 -> 0.5)
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Entrance animation classes - slower, more elegant */
/* Set initial state to prevent flash before animation starts */
/* GPU acceleration for smooth rendering */
.animate-fade-in {
  opacity: 0;
  will-change: opacity;
  backface-visibility: hidden;
  animation: fadeIn ${DURATION.slow}ms ${EASING.smooth} forwards;
}

.animate-slide-up {
  opacity: 0;
  transform: translateY(40px);
  will-change: transform, opacity;
  backface-visibility: hidden;
  animation: slideUp ${DURATION.slow}ms ${EASING.smooth} forwards;
}

.animate-slide-down {
  opacity: 0;
  transform: translateY(-40px);
  will-change: transform, opacity;
  backface-visibility: hidden;
  animation: slideDown ${DURATION.slow}ms ${EASING.smooth} forwards;
}

.animate-slide-left {
  opacity: 0;
  transform: translateX(16px);
  will-change: transform, opacity;
  backface-visibility: hidden;
  animation: slideLeft ${DURATION.slow}ms ${EASING.smooth} forwards;
}

.animate-slide-right {
  opacity: 0;
  transform: translateX(-16px);
  will-change: transform, opacity;
  backface-visibility: hidden;
  animation: slideRight ${DURATION.slow}ms ${EASING.smooth} forwards;
}

.animate-scale-in {
  opacity: 0;
  transform: scale(0.8);
  will-change: transform, opacity;
  backface-visibility: hidden;
  animation: scaleIn ${DURATION.slow}ms ${EASING.smooth} forwards;
}

.animate-zoom-in {
  opacity: 0;
  transform: scale(0.5); // Twice as far away (0.7 -> 0.5)
  will-change: transform, opacity;
  backface-visibility: hidden;
  animation: zoomIn ${DURATION.slow}ms ${EASING.smooth} forwards;
}

/* Animation delays for staggered effects */
.animation-delay-75 {
  animation-delay: 75ms;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-500 {
  animation-delay: 500ms;
}
`.trim();
}

/**
 * Generate CSS for hover animations
 * 
 * @returns CSS string with hover effect classes
 */
export function generateHoverAnimationsCSS(): string {
  return `
/* Hover Animations */
.hover-lift {
  transition: transform ${DURATION.fast}ms ${EASING.smooth}, 
              box-shadow ${DURATION.fast}ms ${EASING.smooth};
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1),
              0 4px 8px -2px rgba(0, 0, 0, 0.05);
}

.hover-lift:active {
  transform: translateY(0);
}

.hover-glow {
  transition: box-shadow ${DURATION.normal}ms ${EASING.smooth};
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4),
              0 0 40px rgba(59, 130, 246, 0.2);
}

.hover-scale {
  transition: transform ${DURATION.fast}ms ${EASING.snappy};
  /* Prevent scale from causing horizontal scroll - critical for good UX */
  overflow: hidden;
  will-change: transform;
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-scale:active {
  transform: scale(0.99);
}

.hover-brighten {
  transition: filter ${DURATION.normal}ms ${EASING.smooth};
}

.hover-brighten:hover {
  filter: brightness(1.1);
}

.hover-tilt {
  transition: transform ${DURATION.normal}ms ${EASING.smooth};
  transform-style: preserve-3d;
}

.hover-tilt:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(2deg);
}
`.trim();
}

/**
 * Generate CSS for loading animations
 * 
 * @returns CSS string with loading effect classes
 */
export function generateLoadingAnimationsCSS(): string {
  return `
/* Loading Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-pulse {
  animation: pulse ${DURATION.slower}ms ${EASING.ease} infinite;
}

.animate-spin {
  animation: spin 1s ${EASING.linear} infinite;
}

.animate-spin-slow {
  animation: spin 2s ${EASING.linear} infinite;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  background-size: 1000px 100%;
  animation: shimmer 2s ${EASING.linear} infinite;
}
`.trim();
}

/**
 * Generate CSS for interactive state animations
 * 
 * @returns CSS string with focus, active, and disabled states
 */
export function generateInteractiveAnimationsCSS(): string {
  return `
/* Interactive State Animations */
.transition-smooth {
  transition: all ${DURATION.normal}ms ${EASING.smooth};
}

.transition-fast {
  transition: all ${DURATION.fast}ms ${EASING.snappy};
}

.transition-colors {
  transition: color ${DURATION.fast}ms ${EASING.smooth},
              background-color ${DURATION.fast}ms ${EASING.smooth},
              border-color ${DURATION.fast}ms ${EASING.smooth};
}

.transition-transform {
  transition: transform ${DURATION.fast}ms ${EASING.smooth};
}

.transition-shadow {
  transition: box-shadow ${DURATION.normal}ms ${EASING.smooth};
}

/* Focus ring with smooth animation */
.focus-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color ${DURATION.fast}ms ${EASING.smooth},
              outline-offset ${DURATION.fast}ms ${EASING.smooth};
}

.focus-ring:focus {
  outline-color: rgb(59, 130, 246);
  outline-offset: 4px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`.trim();
}

/**
 * Generate all animation CSS
 * 
 * @returns Complete CSS string with all animation utilities
 */
export function generateAnimationCSS(): string {
  return `
${generateEntranceAnimationsCSS()}

${generateHoverAnimationsCSS()}

${generateLoadingAnimationsCSS()}

${generateInteractiveAnimationsCSS()}
`.trim();
}

/**
 * Get animation classes for a component
 * 
 * @param entrance - Entrance animation type
 * @param hover - Hover animation type
 * @returns Array of CSS class names
 */
export function getAnimationClasses(
  entrance?: EntranceAnimation,
  hover?: HoverAnimation
): string[] {
  const classes: string[] = [];

  if (entrance) {
    classes.push(`animate-${entrance}`);
  }

  if (hover) {
    classes.push(`hover-${hover}`);
  }

  // Always add smooth transitions
  classes.push('transition-smooth');

  return classes;
}

/**
 * Get plain English shorthands for animations
 * 
 * @returns Mapping of shorthand terms to CSS classes
 */
export function getAnimationShorthands(): Record<string, string[]> {
  return {
    // Entrance animations
    'fade-in': ['animate-fade-in'],
    'slide-up': ['animate-slide-up'],
    'slide-down': ['animate-slide-down'],
    'zoom-in': ['animate-zoom-in'],
    
    // Hover effects
    'hoverlift': ['hover-lift'],
    'hover-glow': ['hover-glow'],
    'hover-scale': ['hover-scale'],
    
    // Combined effects
    'animated': ['animate-fade-in', 'hover-lift', 'transition-smooth'],
    'glass-animated': ['animate-scale-in', 'hover-lift', 'transition-smooth'],
    
    // Loading states
    'loading': ['animate-pulse'],
    'spinning': ['animate-spin'],
    'shimmer': ['animate-shimmer'],
  };
}

