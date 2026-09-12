/** Modal dialogs: one controller per dialog, with focus and scroll restoration. */
import type { ComponentBehavior } from '../index';

export const modalBehavior: ComponentBehavior = {
  name: 'modal',
  size: 3600,
  code: `// Modal Component
const modalStack = [];
const modalControllers = new Map();
const modalInertState = new Map();
let modalOverflow = '';
const modalFocusable = 'button, [href], input, select, textarea, [tabindex], [contenteditable="true"]';
function modalFocusables(modal, backwards = false) {
  const elements = Array.from(modal.querySelectorAll(modalFocusable)).filter(element =>
    element.tabIndex >= 0 && !element.matches(':disabled') &&
    !element.closest('[hidden], [inert]') && element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility === 'visible')
    .sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity));
  // Native Tab navigation visits the selected radio, not every group member.
  // Without a selection, entry follows the direction of keyboard traversal.
  return elements.filter(element => {
    if (!element.matches('input[type="radio"]') || !element.name) return true;
    const group = elements.filter(other => other.matches('input[type="radio"]') &&
      other.name === element.name && other.form === element.form &&
      other.getRootNode() === element.getRootNode());
    const target = group.find(radio => radio.checked) ||
      group.find(radio => radio === document.activeElement) ||
      group[backwards ? group.length - 1 : 0];
    return element === target;
  });
}
function topModal() { return modalStack[modalStack.length - 1]; }
function updateModalInert() {
  for (const [element, inert] of modalInertState) element.inert = inert;
  modalInertState.clear();
  // Dialogs may live inside a component wrapper. Disable siblings along the
  // ancestor path, never an ancestor containing the active dialog itself.
  let branch = topModal();
  while (branch && branch !== document.body) {
    const parent = branch.parentElement;
    if (!parent) break;
    for (const sibling of parent.children) {
      if (sibling !== branch && sibling instanceof HTMLElement) {
        modalInertState.set(sibling, sibling.inert);
        sibling.inert = true;
      }
    }
    branch = parent;
  }
}
function focusModal(modal) {
  (modalFocusables(modal)[0] || modal).focus({ preventScroll: true });
}
document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
  const modal = document.getElementById(trigger.getAttribute('data-modal-trigger'));
  if (!modal) return;
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', modal.id);
  if (!modalControllers.has(modal)) {
    let previousFocus;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('tabindex', '-1');
    if (!modal.hasAttribute('aria-label') && !modal.hasAttribute('aria-labelledby')) {
      const heading = modal.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        if (!heading.id) heading.id = modal.id + '-title';
        modal.setAttribute('aria-labelledby', heading.id);
      } else {
        modal.setAttribute('aria-label', 'Dialog');
      }
    }
    function open() {
      if (modalStack.includes(modal)) { focusModal(modal); return; }
      previousFocus = document.activeElement;
      if (modalStack.length === 0) {
        modalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      modalStack.push(modal);
      updateModalInert();
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.setProperty('z-index', String(10000 + modalStack.length), 'important');
      focusModal(modal);
    }
    function close() {
      if (topModal() !== modal) return;
      modalStack.pop();
      updateModalInert();
      // Close synchronously so rapid reopening cannot race a delayed hide.
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      if (modalStack.length === 0) document.body.style.overflow = modalOverflow;
      if (previousFocus && previousFocus.isConnected && !previousFocus.matches(':disabled') &&
          !previousFocus.closest('[hidden], [inert]') && previousFocus.getClientRects().length > 0 &&
          getComputedStyle(previousFocus).visibility === 'visible') previousFocus.focus({ preventScroll: true });
      else if (topModal()) focusModal(topModal());
      else {
        const previousTabIndex = document.body.getAttribute('tabindex');
        document.body.setAttribute('tabindex', '-1');
        document.body.focus({preventScroll: true});
        if (previousTabIndex === null) document.body.removeAttribute('tabindex');
        else document.body.setAttribute('tabindex', previousTabIndex);
      }
    }
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('[data-modal-close]')) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    });
    modalControllers.set(modal, { open, close });
  }
  trigger.addEventListener('click', event => {
    event.preventDefault();
    modalControllers.get(modal).open();
  });
});
document.addEventListener('keydown', event => {
  const modal = topModal();
  if (!modal) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    modalControllers.get(modal).close();
  } else if (event.key === 'Tab') {
    const elements = modalFocusables(modal, event.shiftKey);
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (!first) { event.preventDefault(); modal.focus(); }
    else if (event.shiftKey && (document.activeElement === first || !elements.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !elements.includes(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }
});
document.addEventListener('focusin', event => {
  const modal = topModal();
  if (modal && !modal.contains(event.target)) focusModal(modal);
});`,
};
