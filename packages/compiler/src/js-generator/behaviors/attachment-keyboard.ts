/** Shared event path for non-native modal and tooltip attachment controls. */
export const attachmentKeyboard = `
if (['button', 'group'].includes(trigger.getAttribute('role')) && !trigger.matches('button,input,select,textarea,summary,a[href]')) {
  trigger.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.target !== trigger || event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    trigger.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
  });
}
`;

/** Descendant controls keep their own navigation and activation behavior. */
export const attachmentDescendant = `
const control = event.target instanceof Element ? event.target.closest('a[href],button,input,select,textarea,summary,[role="button"],[tabindex],[contenteditable="true"]') : null;
if (control && control !== trigger && trigger.contains(control)) return;
`;
