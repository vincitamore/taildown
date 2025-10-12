/**
 * Video Embed Component Definition
 * Responsive video embeds for YouTube, Vimeo, and self-hosted videos
 * 
 * Supports aspect ratio preservation, lazy loading, and privacy-friendly embedding.
 * Perfect for documentation, tutorials, and multimedia content.
 * 
 * Platforms:
 * - youtube: YouTube embeds (privacy mode)
 * - vimeo: Vimeo embeds
 * - Self-hosted videos via markdown image syntax
 * 
 * Aspect Ratios:
 * - 16:9: Widescreen (default)
 * - 4:3: Standard
 * - 21:9: Ultrawide
 * - 1:1: Square
 * 
 * Usage:
 * ```taildown
 * :::video {youtube}
 * https://youtube.com/watch?v=VIDEO_ID
 * :::
 * 
 * :::video {vimeo glass}
 * https://vimeo.com/VIDEO_ID
 * :::
 * 
 * :::video {16:9}
 * ![Video](video.mp4)
 * :::
 * 
 * :::video {glass autoplay muted}
 * ![Demo](demo.mp4)
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Video component definition
 * Responsive video embeds with aspect ratio control
 */
export const videoComponent: ComponentDefinition = defineComponent({
  name: 'video',
  htmlElement: 'div',
  
  // Base classes for video wrapper
  defaultClasses: [
    'video-component',
    'relative',
    'w-full',
    'overflow-hidden',
    'rounded-lg',
  ],
  
  // Default aspect ratio
  defaultSize: '16:9',
  
  // Aspect ratio variants (sizes)
  sizes: {
    '16:9': ['aspect-16-9'],
    '4:3': ['aspect-4-3'],
    '21:9': ['aspect-21-9'],
    '1:1': ['aspect-1-1'],
  },
  
  // Platform and style variants
  variants: {
    // Platforms
    youtube: ['video-youtube'],
    vimeo: ['video-vimeo'],
    
    // Glass effect
    glass: ['glass-effect', 'shadow-md'],
    'subtle-glass': ['glass-effect', 'glass-subtle', 'shadow-sm'],
    
    // Video attributes
    autoplay: ['video-autoplay'],
    muted: ['video-muted'],
    loop: ['video-loop'],
    controls: ['video-controls'],
  },
  
  description: 'Responsive video embeds with aspect ratio preservation',
  hasChildren: true,
});

export default videoComponent;

