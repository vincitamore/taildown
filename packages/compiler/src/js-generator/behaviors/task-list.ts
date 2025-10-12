import type { ComponentBehavior } from '../index';

/**
 * Enhanced Task List Behavior
 * 
 * Features:
 * - Interactive checkbox toggling
 * - localStorage persistence
 * - Dynamic progress bar updates
 * - State change animations
 * 
 * Storage format: { "page-url": { "task-id": { checked: boolean, state: string } } }
 */
export const taskListBehavior: ComponentBehavior = {
  name: 'task-list',
  size: 1800, // Estimated size in bytes (~1.8KB)
  code: `// Enhanced Task List with localStorage persistence
(function() {
  'use strict';
  
  const STORAGE_KEY = 'taildown-tasks';
  const currentPage = window.location.pathname;
  
  // Load saved state from localStorage
  function loadTaskState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }
  
  // Save task state to localStorage
  function saveTaskState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save task state:', e);
    }
  }
  
  // Generate unique ID for a task based on its text content
  function getTaskId(taskItem) {
    const text = taskItem.textContent.trim();
    // Simple hash function for creating stable IDs
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'task-' + Math.abs(hash).toString(36);
  }
  
  // Update progress bar for a task list
  function updateProgress(list) {
    const total = parseInt(list.getAttribute('data-task-total') || '0', 10);
    const completed = Array.from(list.querySelectorAll('.task-list-item')).filter(item => {
      const state = item.getAttribute('data-task-state');
      return state === 'done';
    }).length;
    
    if (total > 0) {
      const progress = Math.round((completed / total) * 100);
      list.setAttribute('data-task-completed', completed.toString());
      list.setAttribute('data-task-progress', progress.toString());
      
      // Update CSS custom property for progress bar
      list.style.setProperty('--task-progress', progress.toString());
    }
  }
  
  // Toggle task state
  function toggleTask(checkbox, taskItem) {
    const currentState = taskItem.getAttribute('data-task-state');
    let newState = currentState;
    
    // State transitions:
    // todo -> done (checked)
    // done -> todo (unchecked)
    // in-progress -> done (checked)
    // blocked stays blocked (can't check)
    
    if (currentState === 'blocked') {
      // Blocked tasks can't be toggled
      checkbox.checked = false;
      return;
    }
    
    if (checkbox.checked) {
      newState = 'done';
      taskItem.classList.remove('task-todo', 'task-in-progress');
      taskItem.classList.add('task-done');
    } else {
      newState = currentState === 'in-progress' ? 'in-progress' : 'todo';
      taskItem.classList.remove('task-done');
      taskItem.classList.add(newState === 'in-progress' ? 'task-in-progress' : 'task-todo');
    }
    
    taskItem.setAttribute('data-task-state', newState);
    taskItem.setAttribute('data-task-checked', checkbox.checked ? 'true' : 'false');
    
    // Save to localStorage
    const taskId = getTaskId(taskItem);
    const allState = loadTaskState();
    if (!allState[currentPage]) {
      allState[currentPage] = {};
    }
    allState[currentPage][taskId] = {
      checked: checkbox.checked,
      state: newState
    };
    saveTaskState(allState);
    
    // Update progress bar
    const list = taskItem.closest('.task-list');
    if (list) {
      updateProgress(list);
    }
    
    // Add animation
    taskItem.style.transform = 'scale(0.98)';
    setTimeout(() => {
      taskItem.style.transform = '';
    }, 150);
  }
  
  // Restore saved state
  function restoreSavedState() {
    const allState = loadTaskState();
    const pageState = allState[currentPage];
    
    if (!pageState) return;
    
    document.querySelectorAll('.task-list-item').forEach(taskItem => {
      const taskId = getTaskId(taskItem);
      const savedState = pageState[taskId];
      
      if (savedState) {
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        if (checkbox && taskItem.getAttribute('data-task-state') !== 'blocked') {
          checkbox.checked = savedState.checked;
          
          // Update visual state
          taskItem.classList.remove('task-todo', 'task-done', 'task-in-progress');
          taskItem.classList.add('task-' + savedState.state);
          taskItem.setAttribute('data-task-state', savedState.state);
          taskItem.setAttribute('data-task-checked', savedState.checked ? 'true' : 'false');
        }
      }
    });
    
    // Update all progress bars
    document.querySelectorAll('.task-list').forEach(list => {
      updateProgress(list);
    });
  }
  
  // Initialize
  function init() {
    // Make checkboxes interactive (remove disabled attribute)
    document.querySelectorAll('.task-list-item input[type="checkbox"]').forEach(checkbox => {
      const taskItem = checkbox.closest('.task-list-item');
      const state = taskItem.getAttribute('data-task-state');
      
      // Only enable non-blocked tasks
      if (state !== 'blocked') {
        checkbox.removeAttribute('disabled');
        checkbox.addEventListener('change', () => toggleTask(checkbox, taskItem));
      }
    });
    
    // Restore saved state
    restoreSavedState();
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`
};

