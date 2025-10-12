/**
 * Enhanced Task List Parser for Taildown
 * Extends GFM task lists with priorities, assignees, and states
 * 
 * Strategy: After GFM runs, find list items starting with [~] or [-]
 * and convert them to task list items with appropriate state
 * 
 * Syntax Extensions:
 * - [ ] Basic task (GFM standard)
 * - [x] Completed task (GFM standard)
 * - [~] In-progress task (Taildown extension)
 * - [-] Blocked task (Taildown extension)
 * 
 * Inline Extensions:
 * - Task content {high} - Priority markers
 * - Task @username - Assignee
 * - Task content {medium} @alice - Combined
 * 
 * Priorities: {high}, {medium}, {low}
 * States: [ ], [x], [~], [-]
 */

import { visit } from 'unist-util-visit';
import type { Root, ListItem, List, Text, Paragraph } from 'mdast';
import type { Plugin } from 'unified';

/**
 * Task state types
 */
type TaskState = 'todo' | 'done' | 'in-progress' | 'blocked';

/**
 * Task priority types
 */
type TaskPriority = 'high' | 'medium' | 'low' | undefined;

/**
 * Enhanced task data
 */
interface TaskData {
  state: TaskState;
  priority?: TaskPriority;
  assignee?: string;
  checked: boolean;
}

/**
 * Parse task state from checkbox marker
 */
function parseTaskState(text: string): { state: TaskState; checked: boolean } | null {
  // Match checkbox at start of text: [ ], [x], [~], [-]
  const match = text.match(/^\s*\[([ x~-])\]/i);
  if (!match) return null;
  
  const marker = match[1].toLowerCase();
  
  switch (marker) {
    case ' ':
      return { state: 'todo', checked: false };
    case 'x':
      return { state: 'done', checked: true };
    case '~':
      return { state: 'in-progress', checked: false };
    case '-':
      return { state: 'blocked', checked: false };
    default:
      return null;
  }
}

/**
 * Extract priority from text content
 * Looks for {high}, {medium}, {low} anywhere in text
 */
function extractPriority(text: string): { priority?: TaskPriority; cleanText: string } {
  const priorityMatch = text.match(/\{(high|medium|low)\}/i);
  
  if (priorityMatch) {
    const priority = priorityMatch[1].toLowerCase() as TaskPriority;
    const cleanText = text.replace(/\{(high|medium|low)\}/gi, '').trim();
    return { priority, cleanText };
  }
  
  return { cleanText: text };
}

/**
 * Extract assignee from text content
 * Looks for @username anywhere in text
 */
function extractAssignee(text: string): { assignee?: string; cleanText: string } {
  const assigneeMatch = text.match(/@([a-zA-Z0-9_-]+)/);
  
  if (assigneeMatch) {
    const assignee = assigneeMatch[1];
    const cleanText = text.replace(/@([a-zA-Z0-9_-]+)/, '').trim();
    return { assignee, cleanText };
  }
  
  return { cleanText: text };
}

/**
 * Get text content from list item and check for custom state markers
 */
function getListItemText(item: ListItem): { text: string; cleanText: string; customState?: 'in-progress' | 'blocked' } {
  let text = '';
  let customState: 'in-progress' | 'blocked' | undefined;
  
  function extractText(node: any): void {
    if (node.type === 'text') {
      text += node.value;
    } else if (node.children) {
      for (const child of node.children) {
        extractText(child);
      }
    }
  }
  
  if (item.children) {
    for (const child of item.children) {
      extractText(child);
    }
  }
  
  // Check if first paragraph/text starts with [~] or [-]
  const firstChild = item.children?.[0];
  if (firstChild?.type === 'paragraph') {
    const firstTextNode = (firstChild as Paragraph).children?.[0];
    if (firstTextNode?.type === 'text') {
      const textValue = (firstTextNode as Text).value;
      if (textValue.startsWith('[~]')) {
        customState = 'in-progress';
        // Remove the marker from the text
        (firstTextNode as Text).value = textValue.substring(3).trim();
        // Mark item as checked so GFM structures it properly
        (item as any).checked = false;
      } else if (textValue.startsWith('[-]')) {
        customState = 'blocked';
        // Remove the marker from the text
        (firstTextNode as Text).value = textValue.substring(3).trim();
        // Mark item as checked so GFM structures it properly
        (item as any).checked = false;
      }
    }
  }
  
  const cleanText = text.replace(/^\[~\]\s*/, '').replace(/^\[-\]\s*/, '');
  
  return { text, cleanText, customState };
}

/**
 * Enhanced task list parser
 * Extends GFM task lists with priorities, assignees, and custom states
 */
export const parseEnhancedTaskList: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'list', (listNode: List) => {
      // Check if this is a task list (has at least one task item OR custom state marker)
      let hasTaskItems = false;
      let hasCustomStateMarkers = false;
      
      for (const item of listNode.children) {
        if (item.type !== 'listItem') continue;
        const listItem = item as ListItem;
        
        // Check for GFM task items
        if (typeof listItem.checked === 'boolean') {
          hasTaskItems = true;
          break;
        }
        
        // Check for custom state markers [~] or [-]
        const firstChild = listItem.children?.[0];
        if (firstChild?.type === 'paragraph') {
          const firstTextNode = (firstChild as Paragraph).children?.[0];
          if (firstTextNode?.type === 'text') {
            const textValue = (firstTextNode as Text).value;
            if (textValue.startsWith('[~]') || textValue.startsWith('[-]')) {
              hasCustomStateMarkers = true;
              break;
            }
          }
        }
      }
      
      if (!hasTaskItems && !hasCustomStateMarkers) return;
      
      // Mark list as enhanced task list
      if (!listNode.data) {
        listNode.data = {};
      }
      if (!listNode.data.hProperties) {
        listNode.data.hProperties = {};
      }
      
      // Add task list classes
      const existingClasses = listNode.data.hProperties.className || [];
      const classes = Array.isArray(existingClasses) ? existingClasses : [existingClasses];
      
      if (!classes.includes('task-list')) {
        classes.push('task-list');
      }
      if (!classes.includes('task-list-enhanced')) {
        classes.push('task-list-enhanced');
      }
      
      listNode.data.hProperties.className = classes;
      listNode.data.hProperties['data-component'] = 'task-list';
      
      // Track task counts for progress
      let total = 0;
      let completed = 0;
      
      // Process each list item
      for (const item of listNode.children) {
        if (item.type !== 'listItem') continue;
        
        const listItem = item as ListItem;
        
        // Get item text and check for custom state markers
        const { text: itemText, cleanText, customState } = getListItemText(listItem);
        
        let state: TaskState;
        let checked: boolean;
        
        if (customState) {
          // Custom state markers [~] or [-] (restored from pre-processing)
          state = customState;
          checked = false;
        } else if (typeof listItem.checked === 'boolean') {
          // GFM standard [x] or [ ]
          state = listItem.checked ? 'done' : 'todo';
          checked = listItem.checked;
        } else {
          // Not a task item
          continue;
        }
        
        // Extract priority and assignee from clean text
        const { priority, cleanText: textAfterPriority } = extractPriority(cleanText);
        const { assignee, cleanText: finalText } = extractAssignee(textAfterPriority);
        
        // Store enhanced data in list item
        if (!listItem.data) {
          listItem.data = {};
        }
        if (!listItem.data.hProperties) {
          listItem.data.hProperties = {};
        }
        
        const itemClasses = ['task-list-item', `task-${state}`];
        if (priority) {
          itemClasses.push(`task-priority-${priority}`);
        }
        
        listItem.data.hProperties.className = itemClasses;
        listItem.data.hProperties['data-task-state'] = state;
        listItem.data.hProperties['data-task-checked'] = checked;
        
        if (priority) {
          listItem.data.hProperties['data-task-priority'] = priority;
        }
        if (assignee) {
          listItem.data.hProperties['data-task-assignee'] = assignee;
        }
        
        // Count for progress
        total++;
        if (state === 'done') {
          completed++;
        }
      }
      
      // Add progress data to list
      if (total > 0) {
        listNode.data.hProperties['data-task-total'] = total;
        listNode.data.hProperties['data-task-completed'] = completed;
        listNode.data.hProperties['data-task-progress'] = Math.round((completed / total) * 100);
      }
    });
  };
};

