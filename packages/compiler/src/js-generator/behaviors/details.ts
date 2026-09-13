import type {ComponentBehavior} from '../index';

export const detailsBehavior: ComponentBehavior = {
  name: 'details',
  size: 550,
  code: `
  const printOpenedDetails = new Set();
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('details:not([open])').forEach(details => {
      printOpenedDetails.add(details);
      details.open = true;
    });
  });
  window.addEventListener('afterprint', () => {
    printOpenedDetails.forEach(details => { details.open = false; });
    printOpenedDetails.clear();
  });
  `,
};
