import type {ComponentBehavior} from '../index';

/** One-time entrances that always leave content reachable. */
export const scrollAnimationsBehavior: ComponentBehavior = {
  name: 'scroll-animations',
  size: 1400,
  code: `// Scroll-triggered entrances
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const animatedElements = document.querySelectorAll([
  '.animate-fade-in', '.animate-slide-up', '.animate-slide-down',
  '.animate-slide-left', '.animate-slide-right', '.animate-scale-in', '.animate-zoom-in'
].join(', '));
const pending = new Map();
let observer;
function reveal(element, animate) {
  clearTimeout(pending.get(element));
  pending.delete(element);
  observer?.unobserve(element);
  element.classList.remove('animation-paused');
  element.classList.toggle('animation-playing', animate && !motion.matches);
}
function revealAll() {
  observer?.disconnect();
  animatedElements.forEach(element => reveal(element, false));
}
if (animatedElements.length && !motion.matches && typeof IntersectionObserver !== 'undefined') {
  observer = new IntersectionObserver(entries => {
    let stagger = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      if (!element.classList.contains('animation-paused')) return;
      observer.unobserve(element);
      // Bound the wait even when a large batch enters at once.
      pending.set(element, setTimeout(() => reveal(element, true), Math.min(stagger++ * 75, 225)));
    });
  }, {rootMargin: '0px 0px -10% 0px', threshold: 0});
  animatedElements.forEach(element => {
    element.classList.add('animation-paused');
    // Keyboard navigation must never land in invisible content.
    element.addEventListener('focusin', () => reveal(element, false));
    observer.observe(element);
  });
  motion.addEventListener('change', () => {
    if (motion.matches) revealAll();
  });
}`,
};
