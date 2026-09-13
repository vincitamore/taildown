/** Shared event path for non-native modal and tooltip attachment controls. */
export const attachmentKeyboard = `
if (trigger.getAttribute('role') === 'button' && !trigger.matches('button,input,select,textarea,summary,a[href]')) {
  trigger.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.target !== trigger || event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    trigger.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
  });
}
`;
