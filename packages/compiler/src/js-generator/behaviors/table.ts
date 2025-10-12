/**
 * Table Sorting Behavior
 * 
 * Provides client-side sorting for enhanced tables.
 * Supports:
 * - Ascending/descending sort
 * - Multiple data types (string, number, date)
 * - Keyboard navigation
 * - ARIA attributes for accessibility
 */

import type { ComponentBehavior } from '../index';

export const tableBehavior: ComponentBehavior = {
  name: 'table',
  size: 1100, // ~1.1KB
  code: `// Table Sorting Component
const sortableTables = document.querySelectorAll('[data-sortable="true"]');
console.log('[Taildown Table] Found', sortableTables.length, 'sortable tables');

sortableTables.forEach(table => {
  console.log('[Taildown Table] Initializing sortable table', table);
  const headers = table.querySelectorAll('th[data-sortable="true"]');
  console.log('[Taildown Table] Found', headers.length, 'sortable headers');
  
  headers.forEach((header, index) => {
    // Make header focusable for keyboard nav
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-sort', 'none');
    
    // Add click handler
    header.addEventListener('click', () => {
      console.log('[Taildown Table] Header clicked:', index);
      sortTable(table, index, header);
    });
    
    // Add keyboard handler
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        console.log('[Taildown Table] Header activated via keyboard:', index);
        sortTable(table, index, header);
      }
    });
  });
  
  console.log('[Taildown Table] Table initialization complete');
});

// Sort table by column index
function sortTable(table, columnIndex, header) {
  console.log('[Taildown Table] Sorting table by column', columnIndex);
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    console.warn('[Taildown Table] No tbody found, skipping sort');
    return;
  }
  
  const rows = Array.from(tbody.querySelectorAll('tr'));
  console.log('[Taildown Table] Found', rows.length, 'rows to sort');
  const currentSort = header.getAttribute('aria-sort');
  const newSort = currentSort === 'ascending' ? 'descending' : 'ascending';
  console.log('[Taildown Table] Sort direction:', currentSort, '->', newSort);
  
  // Clear other headers
  table.querySelectorAll('th[data-sortable="true"]').forEach(h => {
    h.setAttribute('aria-sort', 'none');
    h.classList.remove('sort-asc', 'sort-desc');
  });
  
  // Set new sort direction
  header.setAttribute('aria-sort', newSort);
  header.classList.add(newSort === 'ascending' ? 'sort-asc' : 'sort-desc');
  
  // Sort rows
  rows.sort((a, b) => {
    const aCell = a.querySelectorAll('td')[columnIndex];
    const bCell = b.querySelectorAll('td')[columnIndex];
    
    if (!aCell || !bCell) return 0;
    
    const aValue = getCellValue(aCell);
    const bValue = getCellValue(bCell);
    
    // Detect data type and compare
    const comparison = compareValues(aValue, bValue);
    
    return newSort === 'ascending' ? comparison : -comparison;
  });
  
  console.log('[Taildown Table] Reordering rows in DOM');
  // Reorder rows in DOM
  rows.forEach(row => tbody.appendChild(row));
  console.log('[Taildown Table] Sort complete');
}

// Extract cell value (handles nested elements)
function getCellValue(cell) {
  return cell.textContent.trim();
}

// Compare values with type detection
function compareValues(a, b) {
  // Try numeric comparison
  const aNum = parseFloat(a.replace(/[^0-9.-]/g, ''));
  const bNum = parseFloat(b.replace(/[^0-9.-]/g, ''));
  
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }
  
  // Try date comparison
  const aDate = Date.parse(a);
  const bDate = Date.parse(b);
  
  if (!isNaN(aDate) && !isNaN(bDate)) {
    return aDate - bDate;
  }
  
  // String comparison (case-insensitive)
  return a.toLowerCase().localeCompare(b.toLowerCase());
}`
};

