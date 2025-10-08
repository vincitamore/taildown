/**
 * Component Handlers for Custom Rendering
 * 
 * Custom mdast-to-hast handlers for interactive components.
 * These handlers intercept containerDirective nodes and render proper HTML structures
 * with ARIA roles, data attributes, and semantic HTML.
 * 
 * Philosophy: Zero-config, intelligent parsing
 * - Tabs: h2/h3 headings become tab labels, content becomes panels
 * - Accordion: bold text (strong) becomes triggers, following content becomes panels
 * - Carousel: Content split by hr (---) becomes slides
 * - Modal: Wraps content in proper modal structure
 * - Tooltip: Wraps content with trigger and tooltip elements
 * - Attachable: Modal/tooltip can attach to any element via inline attributes
 */

import type { State } from 'mdast-util-to-hast';
import type { Element } from 'hast';
import type { ContainerDirectiveNode } from '../parser/directive-types';
import type { TaildownNodeData } from '@taildown/shared';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { registry, registryInitialized } from '../components/component-registry';

// Ensure registry is initialized (this promise resolves when auto-init completes)
await registryInitialized;

// Global registry of defined modal/tooltip blocks (ID -> content)
const modalRegistry = new Map<string, Element>();
const tooltipRegistry = new Map<string, Element>();

/**
 * Pre-populate modal and tooltip registries before HAST conversion
 * Scans the MDAST tree for :::modal{id="..."} and :::tooltip{id="..."} blocks
 * and stores their content for later reference by ID
 */
export function prepopulateRegistries(ast: Root): void {
  // Clear registries before populating
  modalRegistry.clear();
  tooltipRegistry.clear();
  
  // Visit all containerDirective nodes
  visit(ast, 'containerDirective', (node: any) => {
    const componentName = node.name;
    const idAttr = node.attributes?.id || node.attributes?.['#'];
    
    if (!idAttr) return;
    
    // For modals and tooltips with IDs, convert their content to HAST and store
    if (componentName === 'modal') {
      // Convert children to HAST
      const hastChildren = node.children?.map((child: any) => {
        return toHast(child, { allowDangerousHtml: false });
      }).filter(Boolean) || [];
      
      const modalElement: Element = {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: hastChildren
      };
      modalRegistry.set(idAttr, modalElement);
    } else if (componentName === 'tooltip') {
      // Convert children to HAST
      const hastChildren = node.children?.map((child: any) => {
        return toHast(child, { allowDangerousHtml: false });
      }).filter(Boolean) || [];
      
      const tooltipElement: Element = {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: hastChildren
      };
      tooltipRegistry.set(idAttr, tooltipElement);
    }
  });
}

/**
 * Wrap an element with modal/tooltip attachment if present
 * Handles both inline content and ID references
 */
export function wrapWithAttachments(element: Element, nodeData?: TaildownNodeData): Element {
  // Safety check - if element is invalid, return as-is
  if (!element || typeof element !== 'object') {
    return element;
  }

  // If no attachments, return element as-is
  if (!nodeData || (!nodeData.modal && !nodeData.tooltip)) {
    return element;
  }

  let wrapped = element;

  // Handle tooltip attachment
  if (nodeData.tooltip) {
    wrapped = wrapWithTooltip(wrapped, nodeData.tooltip);
  }

  // Handle modal attachment (wraps outside tooltip if both present)
  if (nodeData.modal) {
    wrapped = wrapWithModal(wrapped, nodeData.modal);
  }

  return wrapped;
}

/**
 * Wrap element with tooltip functionality
 * Supports inline content: tooltip="text" or ID reference: tooltip="#id"
 */
function wrapWithTooltip(triggerElement: Element, content: string): Element {
  // Safety check
  if (!triggerElement || triggerElement.type !== 'element') {
    console.warn('[Taildown] Invalid trigger element for tooltip, skipping attachment');
    return triggerElement;
  }

  const isIdReference = content.startsWith('#');
  const tooltipId = isIdReference ? content.substring(1) : `tooltip-${Math.random().toString(36).substring(7)}`;
  
  // Get tooltip content (from registry or inline string)
  const tooltipContent = isIdReference && tooltipRegistry.has(tooltipId)
    ? tooltipRegistry.get(tooltipId)!
    : {
        type: 'element' as const,
        tagName: 'span',
        properties: {},
        children: [{ type: 'text' as const, value: content }]
      };

  // Add aria-describedby to trigger
  const enhancedTrigger: Element = {
    ...triggerElement,
    properties: {
      ...(triggerElement.properties || {}),
      'aria-describedby': tooltipId,
      'data-tooltip-trigger': 'true'
    }
  };

  // Create tooltip content div
  const tooltipEl: Element = {
    type: 'element',
    tagName: 'div',
    properties: {
      id: tooltipId,
      role: 'tooltip',
      'data-component': 'tooltip',
      className: ['tooltip-content', 'absolute', 'px-3', 'py-2', 'bg-gray-900', 'text-white', 'text-sm', 'rounded-lg', 'shadow-xl', 'whitespace-nowrap', 'z-50', 'pointer-events-none', 'opacity-0', 'transition-opacity'],
      style: 'display: none;'
    },
    children: tooltipContent.type === 'element' ? tooltipContent.children : [tooltipContent]
  };

  // Wrap in relative container
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['relative', 'inline-block']
    },
    children: [enhancedTrigger, tooltipEl]
  };
}

// Export registries for testing/debugging
export function clearRegistries() {
  modalRegistry.clear();
  tooltipRegistry.clear();
}

/**
 * Wrap element with modal functionality
 * Supports inline content: modal="text" or ID reference: modal="#id"
 */
function wrapWithModal(triggerElement: Element, content: string): Element {
  // Safety check
  if (!triggerElement || triggerElement.type !== 'element') {
    console.warn('[Taildown] Invalid trigger element for modal, skipping attachment');
    return triggerElement;
  }

  const isIdReference = content.startsWith('#');
  const modalId = isIdReference ? content.substring(1) : `modal-${Math.random().toString(36).substring(7)}`;
  
  // Get modal content (from registry or inline string)
  const modalContent = isIdReference && modalRegistry.has(modalId)
    ? modalRegistry.get(modalId)!
    : {
        type: 'element' as const,
        tagName: 'p',
        properties: {},
        children: [{ type: 'text' as const, value: content }]
      };

  // Add data-modal-trigger to trigger element
  const enhancedTrigger: Element = {
    ...triggerElement,
    properties: {
      ...(triggerElement.properties || {}),
      'data-modal-trigger': modalId,
      'aria-haspopup': 'dialog'
    }
  };

  // Create modal structure
  const modal: Element = {
    type: 'element',
    tagName: 'div',
    properties: {
      id: modalId,
      role: 'dialog',
      'aria-modal': 'true',
      'data-component': 'modal',
      className: ['modal-backdrop', 'fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'p-4'],
      style: 'display: none; background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);'
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['modal-content', 'glass-subtle', 'rounded-2xl', 'shadow-3xl', 'max-w-2xl', 'w-full', 'max-h-[90vh]', 'overflow-y-auto', 'relative', 'p-12', 'border', 'border-white/20']
        },
        children: [
          // Close button
          {
            type: 'element',
            tagName: 'button',
            properties: {
              'data-modal-close': 'true',
              'aria-label': 'Close modal',
              className: ['modal-close', 'absolute', 'top-4', 'right-4', 'p-2', 'rounded-lg', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'transition-colors', 'z-10', 'bg-white/80', 'backdrop-blur-sm']
            },
            children: [
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  className: ['w-6', 'h-6'],
                  fill: 'none',
                  stroke: 'currentColor',
                  viewBox: '0 0 24 24'
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'path',
                    properties: {
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: '2',
                      d: 'M6 18L18 6M6 6l12 12'
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          // Modal content
          ...(modalContent.type === 'element' ? modalContent.children : [modalContent])
        ]
      }
    ]
  };

  // Return fragment with trigger and modal
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['inline-block']
    },
    children: [enhancedTrigger, modal]
  };
}

/**
 * Render tabs component
 * Parses h2/h3 headings as tab labels, content between as panels
 */
export function renderTabs(state: State, node: ContainerDirectiveNode): Element {
  const children = state.all(node);
  
  // Parse structure: find headings and content
  const tabs: { label: Element; content: Element[] }[] = [];
  let currentTab: { label: Element; content: Element[] } | null = null;
  
  for (const child of children) {
    if (child.type === 'element' && (child.tagName === 'h2' || child.tagName === 'h3')) {
      // Found a tab label - start new tab
      if (currentTab) {
        tabs.push(currentTab);
      }
      currentTab = { label: child, content: [] };
    } else if (currentTab) {
      // Add to current tab's content
      currentTab.content.push(child);
    } else {
      // Content before first heading - create default tab
      if (tabs.length === 0) {
        currentTab = {
          label: {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: [{ type: 'text', value: 'Tab 1' }]
          },
          content: [child]
        };
      }
    }
  }
  
  // Add last tab
  if (currentTab) {
    tabs.push(currentTab);
  }
  
  // If no tabs found, create single default tab with all content
  if (tabs.length === 0) {
    tabs.push({
      label: {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [{ type: 'text', value: 'Tab 1' }]
      },
      content: children
    });
  }
  
  // Build tab structure with modern glass styling
  const tabButtons: Element[] = tabs.map((tab, index) => ({
    type: 'element',
    tagName: 'button',
    properties: {
      role: 'tab',
      ariaSelected: index === 0 ? 'true' : 'false',
      tabIndex: index === 0 ? 0 : -1,
      className: ['tab-button']
    },
    children: tab.label.children
  }));
  
  const tabPanels: Element[] = tabs.map((tab, index) => ({
    type: 'element',
    tagName: 'div',
    properties: {
      role: 'tabpanel',
      hidden: index !== 0,
      className: ['tab-panel']
    },
    children: tab.content
  }));
  
  // Merge with existing classes from component definition
  const existingClasses = node.data?.hProperties?.className || [];
  const dataComponent = node.data?.hProperties?.['data-component'] || node.name;
  
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: [...existingClasses],
      'data-component': dataComponent
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          role: 'tablist',
          className: ['tabs-list']
        },
        children: tabButtons
      },
      ...tabPanels
    ]
  };
}

/**
 * Render accordion component
 * Parses by hr separators or by strong/bold text as triggers
 */
export function renderAccordion(state: State, node: ContainerDirectiveNode): Element {
  const children = state.all(node);
  
  // Split by hr elements
  const sections: Element[][] = [];
  let currentSection: Element[] = [];
  
  for (const child of children) {
    if (child.type === 'element' && child.tagName === 'hr') {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
    } else {
      currentSection.push(child);
    }
  }
  
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }
  
  // If no sections, treat entire content as one section
  if (sections.length === 0) {
    sections.push(children);
  }
  
  // Build accordion items
  const items: Element[] = sections.map((sectionContent, index) => {
    // First element is trigger, rest is content
    const trigger = sectionContent[0] || {
      type: 'element',
      tagName: 'span',
      properties: {},
      children: [{ type: 'text', value: `Item ${index + 1}` }]
    };
    const content = sectionContent.slice(1);
    
    return {
      type: 'element',
      tagName: 'div',
      properties: {
        'data-accordion-item': '',
        className: ['accordion-item', 'border-b', 'border-border', 'last:border-b-0']
      },
      children: [
        {
          type: 'element',
          tagName: 'button',
          properties: {
            'data-accordion-trigger': '',
            ariaExpanded: index === 0 ? 'true' : 'false',
            className: ['accordion-trigger', 'flex', 'flex-1', 'items-center', 'justify-between', 'py-4', 'font-medium', 'transition-all', 'hover:underline', 'text-left', 'w-full', 'text-sm']
          },
          children: [
            trigger,
            {
              type: 'element',
              tagName: 'svg',
              properties: {
                className: ['accordion-icon', 'h-4', 'w-4', 'shrink-0', 'transition-transform', 'duration-200', 'ml-2'],
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
              children: [
                {
                  type: 'element',
                  tagName: 'path',
                  properties: { d: 'm6 9 6 6 6-6' },
                  children: []
                }
              ]
            }
          ]
        },
        {
          type: 'element',
          tagName: 'div',
          properties: {
            'data-accordion-content': '',
            hidden: index !== 0,
            className: ['accordion-content', 'overflow-hidden', 'text-sm', 'transition-all', 'data-[state=closed]:animate-accordion-up', 'data-[state=open]:animate-accordion-down', 'pb-4', 'pt-0']
          },
          children: content
        }
      ]
    };
  });
  
  const existingClasses = node.data?.hProperties?.className || [];
  const dataComponent = node.data?.hProperties?.['data-component'] || node.name;
  
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: [...existingClasses],
      'data-component': dataComponent
    },
    children: items
  };
}

/**
 * Render carousel component
 * Content split by hr (---) becomes slides
 */
export function renderCarousel(state: State, node: ContainerDirectiveNode): Element {
  const children = state.all(node);
  
  // Split by hr elements to create slides
  const slides: Element[][] = [];
  let currentSlide: Element[] = [];
  
  for (const child of children) {
    if (child.type === 'element' && child.tagName === 'hr') {
      if (currentSlide.length > 0) {
        slides.push(currentSlide);
        currentSlide = [];
      }
    } else {
      currentSlide.push(child);
    }
  }
  
  if (currentSlide.length > 0) {
    slides.push(currentSlide);
  }
  
  // Default to single slide if no separators
  if (slides.length === 0) {
    slides.push(children);
  }
  
  // Build slide elements with beautiful glassmorphism cards
  const slideElements: Element[] = slides.map((slideContent, index) => ({
    type: 'element',
    tagName: 'div',
    properties: {
      'data-carousel-slide': '',
      hidden: index !== 0,
      className: ['carousel-slide', 'w-full', 'flex-shrink-0']
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['carousel-card', 'glass-light', 'rounded-2xl', 'shadow-2xl', 'p-6', 'md:p-12', 'min-h-[300px]', 'md:min-h-[400px]', 'flex', 'flex-col', 'justify-center', 'items-center', 'text-center', 'transition-all', 'duration-500']
        },
        children: slideContent
      }
    ]
  }));
  
  // Build indicators
  const indicators: Element[] = slides.map((_, index) => ({
    type: 'element',
    tagName: 'button',
    properties: {
      'data-carousel-indicator': '',
      ariaLabel: `Go to slide ${index + 1}`,
      ariaCurrent: index === 0 ? 'true' : 'false',
      className: ['carousel-indicator', 'h-2', 'w-2', 'rounded-full', 'transition-all', 'hover:scale-110']
    },
    children: []
  }));
  
  const existingClasses = node.data?.hProperties?.className || [];
  const dataComponent = node.data?.hProperties?.['data-component'] || node.name;
  
  // Build the carousel structure - no extra wrapper, use existing node
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: existingClasses,
      'data-component': dataComponent
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          'data-carousel-track': '',
          className: ['carousel-track', 'flex', 'transition-all', 'duration-500', 'ease-in-out']
        },
        children: slideElements
      },
      {
        type: 'element',
        tagName: 'button',
        properties: {
          'data-carousel-prev': '',
          ariaLabel: 'Previous slide',
          className: ['carousel-prev', 'absolute', 'left-4', 'top-1/2', '-translate-y-1/2', 'h-10', 'w-10', 'rounded-full', 'border', 'shadow-md', 'hover:shadow-lg', 'transition-all', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'flex', 'items-center', 'justify-center', 'font-bold']
        },
        children: [{ type: 'text', value: '‹' }]
      },
      {
        type: 'element',
        tagName: 'button',
        properties: {
          'data-carousel-next': '',
          ariaLabel: 'Next slide',
          className: ['carousel-next', 'absolute', 'right-4', 'top-1/2', '-translate-y-1/2', 'h-10', 'w-10', 'rounded-full', 'border', 'shadow-md', 'hover:shadow-lg', 'transition-all', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'flex', 'items-center', 'justify-center', 'font-bold']
        },
        children: [{ type: 'text', value: '›' }]
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['carousel-indicators', 'absolute', 'bottom-4', 'left-1/2', '-translate-x-1/2', 'flex', 'gap-2']
        },
        children: indicators
      }
    ]
  };
}

/**
 * Render modal component
 * Auto-generates a trigger button and the modal dialog
 */
export function renderModal(state: State, node: ContainerDirectiveNode): Element {
  const children = state.all(node);
  
  const existingClasses = node.data?.hProperties?.className || [];
  const dataComponent = node.data?.hProperties?.['data-component'] || node.name;
  const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`;
  
  // Return a fragment with trigger button AND modal
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['modal-wrapper']
    },
    children: [
      // Trigger button
      {
        type: 'element',
        tagName: 'button',
        properties: {
          'data-modal-trigger': modalId,
          className: ['inline-flex', 'items-center', 'justify-center', 'px-6', 'py-3', 'bg-blue-600', 'text-white', 'text-sm', 'font-medium', 'rounded-lg', 'shadow-md', 'hover:bg-blue-700', 'hover:shadow-lg', 'transition-all', 'cursor-pointer']
        },
        children: [{ type: 'text', value: 'Open Modal' }]
      },
      // Modal dialog (hidden by default)
      {
        type: 'element',
        tagName: 'div',
        properties: {
          id: modalId,
          className: ['modal-backdrop', 'fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'p-4'],
          'data-component': dataComponent,
          'data-modal-backdrop': '',
          hidden: true,
          ariaHidden: 'true',
          role: 'dialog',
          ariaModal: 'true',
          style: 'background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);'
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['modal-content', 'glass-subtle', 'rounded-2xl', 'shadow-3xl', 'max-w-2xl', 'w-full', 'max-h-[90vh]', 'overflow-y-auto', 'relative', 'p-12', 'border', 'border-white/20']
            },
            children: [
              {
                type: 'element',
                tagName: 'button',
                properties: {
                  'data-modal-close': '',
                  ariaLabel: 'Close',
                  className: ['modal-close', 'absolute', 'top-4', 'right-4', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'text-gray-400', 'hover:text-gray-600', 'hover:bg-gray-100', 'rounded-full', 'transition-all', 'text-2xl', 'font-bold', 'leading-none', 'cursor-pointer']
                },
                children: [{ type: 'text', value: '×' }]
              },
              ...children
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Render tooltip component
 * Creates a hoverable icon with tooltip popup
 */
export function renderTooltip(state: State, node: ContainerDirectiveNode): Element {
  const children = state.all(node);
  
  const existingClasses = node.data?.hProperties?.className || [];
  const dataComponent = node.data?.hProperties?.['data-component'] || node.name;
  
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['tooltip-wrapper', 'relative', 'inline-block'],
      'data-component': dataComponent
    },
    children: [
      {
        type: 'element',
        tagName: 'button',
        properties: {
          'data-tooltip-trigger': '',
          type: 'button',
          className: ['tooltip-trigger', 'inline-flex', 'items-center', 'justify-center', 'w-6', 'h-6', 'rounded-full', 'bg-blue-100', 'text-blue-600', 'cursor-help', 'hover:bg-blue-200', 'transition-all', 'text-sm', 'font-bold']
        },
        children: [{ type: 'text', value: 'i' }]
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          'data-tooltip-content': '',
          hidden: true,
          role: 'tooltip',
          className: [...existingClasses, 'tooltip-content', 'absolute', 'bottom-full', 'left-1/2', '-translate-x-1/2', 'mb-2', 'px-3', 'py-2', 'bg-gray-900', 'text-white', 'text-sm', 'rounded-lg', 'shadow-xl', 'whitespace-nowrap', 'z-50', 'pointer-events-none', 'opacity-0', 'transition-opacity']
        },
        children: [
          // Add arrow
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['absolute', 'top-full', 'left-1/2', '-translate-x-1/2', 'w-0', 'h-0', 'border-l-4', 'border-r-4', 'border-t-4', 'border-transparent', 'border-t-gray-900']
            },
            children: []
          },
          ...children
        ]
      }
    ]
  };
}

/**
 * Main handler for all containerDirective nodes
 * Routes to appropriate component handler
 */
export function containerDirectiveHandler(state: State, node: ContainerDirectiveNode): Element | undefined {
  const componentName = node.name;
  
  // Check if this is a modal/tooltip definition with ID
  // Syntax: [Click]{modal="#welcome"} + :::modal{id="welcome"}
  const idAttr = node.attributes?.id || node.attributes?.['#'];
  
  if (componentName === 'modal' && idAttr) {
    // This is a modal definition - store in registry and render hidden
    const content = state.all(node);
    const modalElement: Element = {
      type: 'element',
      tagName: 'div',
      properties: {},
      children: content
    };
    modalRegistry.set(idAttr, modalElement);
    
    // Return empty span (modal will be attached to trigger element)
    return {
      type: 'element',
      tagName: 'span',
      properties: { style: 'display: none;' },
      children: []
    };
  }
  
  if (componentName === 'tooltip' && idAttr) {
    // This is a tooltip definition - store in registry
    const content = state.all(node);
    const tooltipElement: Element = {
      type: 'element',
      tagName: 'span',
      properties: {},
      children: content
    };
    tooltipRegistry.set(idAttr, tooltipElement);
    
    // Return empty span (tooltip will be attached to trigger element)
    return {
      type: 'element',
      tagName: 'span',
      properties: { style: 'display: none;' },
      children: []
    };
  }
  
  switch (componentName) {
    case 'tabs':
      return renderTabs(state, node);
    case 'accordion':
      return renderAccordion(state, node);
    case 'carousel':
      return renderCarousel(state, node);
    case 'modal':
      return renderModal(state, node);
    case 'tooltip':
      return renderTooltip(state, node);
    default:
      // For other components (card, alert, grid, etc.), use generic renderer
      return renderGenericComponent(state, node);
  }
}

/**
 * Generic component renderer for non-interactive components
 * Handles card, alert, grid, container, and other standard components
 */
function renderGenericComponent(state: State, node: ContainerDirectiveNode): Element {
  const componentName = node.name;
  const attributes = node.attributes || {};
  
  // Get component definition from registry
  const component = registry.get(componentName);
  
  // Use classes that were already resolved by the component processor
  // The component processor (parser/components.ts) already ran resolveComponentClasses
  // and stored the fully resolved classes in node.data.hProperties.className
  let classes: string[] = [];
  
  if (node.data?.hProperties?.className) {
    // Use pre-resolved classes from component processor
    const existingClasses = node.data.hProperties.className;
    classes = Array.isArray(existingClasses) ? [...existingClasses] : [existingClasses];
  } else {
    // Fallback: build classes if they weren't pre-resolved (shouldn't happen normally)
    if (component) {
      classes.push(...component.defaultClasses);
      
      // Handle variant attribute
      const variant = attributes.variant || attributes.type;
      if (variant && component.variants[variant]) {
        classes.push(...component.variants[variant]);
      } else if (component.defaultVariant && component.variants[component.defaultVariant]) {
        classes.push(...component.variants[component.defaultVariant]);
      }
      
      // Handle size attribute  
      const size = attributes.size || attributes.cols;
      if (size && component.sizes[size]) {
        classes.push(...component.sizes[size]);
      }
    }
    
    // Add any additional classes from attributes
    if (attributes.class || attributes.className) {
      const additionalClasses = (attributes.class || attributes.className).split(/\s+/);
      classes.push(...additionalClasses);
    }
  }
  
  // Convert children to HAST
  let children = state.all(node);
  
  // INLINE COMPONENTS: For inline components (badge, button when used as component block),
  // unwrap single paragraph to avoid block-level children inside inline elements
  const inlineComponents = ['badge'];
  if (inlineComponents.includes(componentName)) {
    // If there's exactly one child and it's a paragraph, unwrap it
    if (children.length === 1 && children[0].type === 'element' && children[0].tagName === 'p') {
      children = children[0].children || [];
    }
  }
  
  // Determine HTML element (use component definition or default to div)
  // ENHANCEMENT: If href attribute is present, render as <a> tag for clickable components
  let tagName = component?.htmlElement || 'div';
  if (attributes.href && tagName === 'div') {
    tagName = 'a';
  }
  
  // Filter out semantic attributes that shouldn't become HTML attributes
  const htmlAttributes: Record<string, any> = {};
  const semanticAttributes = new Set(['variant', 'type', 'size', 'cols', 'class', 'className']);
  
  for (const [key, value] of Object.entries(attributes)) {
    if (!semanticAttributes.has(key)) {
      htmlAttributes[key] = value;
    }
  }
  
  // Build the element properties
  const properties: Record<string, any> = {
    className: classes.length > 0 ? classes : undefined,
    ...htmlAttributes
  };
  
  // Add data-component attribute for components that have interactive behaviors
  // This allows JavaScript behaviors to be attached (e.g., navbar scroll effect)
  if (component) {
    properties['data-component'] = componentName;
  }
  
  // For clickable components (rendered as <a> tags), ensure proper link styling
  if (tagName === 'a') {
    // Remove default link underline and add cursor-pointer for component links
    if (properties.className) {
      const classArray = Array.isArray(properties.className) ? properties.className : [properties.className];
      if (!classArray.includes('no-underline')) {
        classArray.push('no-underline');
      }
      if (!classArray.includes('cursor-pointer')) {
        classArray.push('cursor-pointer');
      }
      properties.className = classArray;
    }
  }
  
  const element: Element = {
    type: 'element',
    tagName,
    properties,
    children
  };
  
  return element;
}

