import type { ComponentBehavior } from '../index';

/** Native Markdown footnote previews and accessible reference navigation. */
export const footnoteBehavior: ComponentBehavior = {
  name: 'footnote',
  size: 1800,
  code: `// Footnote hover preview
const footnoteRefs = document.querySelectorAll('a[data-footnote-ref]');
let previewTimer = null;
let activePreview = null;
function footnoteTarget(href) {
  if (!href || !href.startsWith('#')) return null;
  const id = href.slice(1);
  const direct = document.getElementById(id);
  if (direct) return direct;
  try { return document.getElementById(decodeURIComponent(id)); } catch { return null; }
}
function dismissFootnotePreview() {
  clearTimeout(previewTimer);
  const preview = activePreview;
  activePreview = null;
  if (!preview) return;
  preview.classList.remove('visible');
  setTimeout(() => preview.remove(), 200);
}
footnoteRefs.forEach(ref => {
  ref.addEventListener('mouseenter', () => {
    dismissFootnotePreview();
    previewTimer = setTimeout(() => {
      const footnoteElement = footnoteTarget(ref.getAttribute('href'));
      if (!footnoteElement) return;
      const preview = document.createElement('div');
      preview.className = 'footnote-preview';
      const content = footnoteElement.cloneNode(true);
      content.querySelectorAll('[data-footnote-backref], .footnote-backlink').forEach(backlink => backlink.remove());
      content.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      preview.innerHTML = content.innerHTML;
      document.body.appendChild(preview);
      preview.style.position = 'fixed';
      const refRect = ref.getBoundingClientRect();
      const previewRect = preview.getBoundingClientRect();
      const gap = 8;
      const above = refRect.top - previewRect.height - gap;
      const top = above >= gap ? above : refRect.bottom + gap;
      const left = refRect.left + refRect.width / 2 - previewRect.width / 2;
      preview.style.left = Math.max(gap, Math.min(left, window.innerWidth - previewRect.width - gap)) + 'px';
      preview.style.top = Math.max(gap, Math.min(top, window.innerHeight - previewRect.height - gap)) + 'px';
      activePreview = preview;
      requestAnimationFrame(() => { if (activePreview === preview) preview.classList.add('visible'); });
    }, 300);
  });
  ref.addEventListener('mouseleave', dismissFootnotePreview);
});
window.addEventListener('scroll', dismissFootnotePreview, {passive: true});
window.addEventListener('resize', dismissFootnotePreview);
document.addEventListener('keydown', event => { if (event.key === 'Escape') dismissFootnotePreview(); });

// Scroll to native footnotes and back without changing the keyboard tab order.
document.querySelectorAll('a[data-footnote-ref], a[data-footnote-backref], a.footnote-backlink').forEach(link => {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = footnoteTarget(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    dismissFootnotePreview();
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block: 'center'});
    if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once: true});
    }
    target.focus({preventScroll: true});
  });
});`
};
