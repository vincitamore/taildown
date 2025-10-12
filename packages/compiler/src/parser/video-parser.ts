/**
 * Video Embed Parser for Taildown
 * Transforms :::video blocks by detecting video URLs and generating embed code
 * 
 * Supports:
 * - YouTube URLs (watch?v=ID, youtu.be/ID, youtube.com/embed/ID)
 * - Vimeo URLs (vimeo.com/ID, player.vimeo.com/video/ID)
 * - Self-hosted videos via markdown image syntax
 * - Aspect ratio detection and application
 * - Privacy-friendly embeds (no-cookie YouTube)
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Link, Image } from 'mdast';

interface VideoInfo {
  platform: 'youtube' | 'vimeo' | 'self-hosted' | 'unknown';
  videoId?: string;
  url: string;
  aspectRatio?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  // Handle youtu.be/ID format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  
  // Handle youtube.com/watch?v=ID format
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  
  // Handle youtube.com/embed/ID format
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  
  // Handle youtube-nocookie.com/embed/ID format
  const nocookieMatch = url.match(/youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (nocookieMatch) return nocookieMatch[1];
  
  return null;
}

/**
 * Extract Vimeo video ID from various URL formats
 */
function extractVimeoId(url: string): string | null {
  // Handle vimeo.com/ID format
  const directMatch = url.match(/vimeo\.com\/(\d+)/);
  if (directMatch) return directMatch[1];
  
  // Handle player.vimeo.com/video/ID format
  const playerMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (playerMatch) return playerMatch[1];
  
  return null;
}

/**
 * Detect video platform from URL
 */
function detectPlatform(url: string): 'youtube' | 'vimeo' | 'unknown' {
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'unknown';
}

/**
 * Extract video info from node attributes and content
 */
function extractVideoInfo(node: any): VideoInfo | null {
  const data = node.data as any;
  const classes = data?.hProperties?.className || [];
  const classArray = Array.isArray(classes) ? classes : [classes];
  
  // Check for explicit platform specification
  const hasYouTube = classArray.includes('youtube');
  const hasVimeo = classArray.includes('vimeo');
  
  // Check for aspect ratio
  const aspectRatioMap: Record<string, string> = {
    '16:9': 'aspect-16-9',
    '4:3': 'aspect-4-3',
    '21:9': 'aspect-21-9',
    '1:1': 'aspect-1-1',
  };
  
  let aspectRatio = '16:9'; // Default
  for (const [ratio, className] of Object.entries(aspectRatioMap)) {
    if (classArray.includes(ratio) || classArray.includes(className)) {
      aspectRatio = ratio;
      break;
    }
  }
  
  // Check for video attributes
  const autoplay = classArray.includes('autoplay');
  const muted = classArray.includes('muted');
  const loop = classArray.includes('loop');
  const controls = classArray.includes('controls');
  
  // Look for URL in children
  let videoUrl: string | null = null;
  let isImage = false;
  
  for (const child of node.children) {
    // Check for plain text URL
    if (child.type === 'paragraph') {
      for (const subchild of child.children) {
        if (subchild.type === 'text') {
          const text = subchild.value.trim();
          if (text.startsWith('http')) {
            videoUrl = text;
            break;
          }
        }
        // Check for link
        if (subchild.type === 'link') {
          videoUrl = subchild.url;
          break;
        }
      }
    }
    
    // Check for image (self-hosted video)
    if (child.type === 'paragraph') {
      for (const subchild of child.children) {
        if (subchild.type === 'image') {
          videoUrl = subchild.url;
          isImage = true;
          break;
        }
      }
    }
    
    if (videoUrl) break;
  }
  
  if (!videoUrl) return null;
  
  // Determine platform
  let platform: 'youtube' | 'vimeo' | 'self-hosted' | 'unknown';
  let videoId: string | undefined;
  
  if (isImage) {
    // Self-hosted video
    platform = 'self-hosted';
  } else if (hasYouTube || videoUrl.includes('youtube') || videoUrl.includes('youtu.be')) {
    platform = 'youtube';
    videoId = extractYouTubeId(videoUrl) || undefined;
  } else if (hasVimeo || videoUrl.includes('vimeo')) {
    platform = 'vimeo';
    videoId = extractVimeoId(videoUrl) || undefined;
  } else {
    // Auto-detect from URL
    const detected = detectPlatform(videoUrl);
    if (detected === 'youtube') {
      platform = 'youtube';
      videoId = extractYouTubeId(videoUrl) || undefined;
    } else if (detected === 'vimeo') {
      platform = 'vimeo';
      videoId = extractVimeoId(videoUrl) || undefined;
    } else {
      platform = 'unknown';
    }
  }
  
  return {
    platform,
    videoId,
    url: videoUrl,
    aspectRatio,
    autoplay,
    muted,
    loop,
    controls,
  };
}

/**
 * Create iframe element for YouTube embed
 */
function createYouTubeEmbed(info: VideoInfo): any {
  if (!info.videoId) return null;
  
  // Build YouTube embed URL with privacy mode
  let embedUrl = `https://www.youtube-nocookie.com/embed/${info.videoId}`;
  const params: string[] = [];
  
  if (info.autoplay) params.push('autoplay=1');
  if (info.muted) params.push('mute=1');
  if (info.loop) params.push('loop=1');
  
  if (params.length > 0) {
    embedUrl += '?' + params.join('&');
  }
  
  return {
    type: 'element',
    data: {
      hName: 'iframe',
      hProperties: {
        src: embedUrl,
        className: ['video-iframe'],
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: true,
        loading: 'lazy',
        title: 'YouTube video player',
      },
    },
    children: [],
  };
}

/**
 * Create iframe element for Vimeo embed
 */
function createVimeoEmbed(info: VideoInfo): any {
  if (!info.videoId) return null;
  
  // Build Vimeo embed URL
  let embedUrl = `https://player.vimeo.com/video/${info.videoId}`;
  const params: string[] = [];
  
  if (info.autoplay) params.push('autoplay=1');
  if (info.muted) params.push('muted=1');
  if (info.loop) params.push('loop=1');
  
  if (params.length > 0) {
    embedUrl += '?' + params.join('&');
  }
  
  return {
    type: 'element',
    data: {
      hName: 'iframe',
      hProperties: {
        src: embedUrl,
        className: ['video-iframe'],
        allow: 'autoplay; fullscreen; picture-in-picture',
        allowfullscreen: true,
        loading: 'lazy',
        title: 'Vimeo video player',
      },
    },
    children: [],
  };
}

/**
 * Create video element for self-hosted videos
 */
function createVideoElement(info: VideoInfo): any {
  const videoAttrs: any = {
    src: info.url,
    className: ['video-element'],
  };
  
  if (info.autoplay) videoAttrs.autoplay = true;
  if (info.muted) videoAttrs.muted = true;
  if (info.loop) videoAttrs.loop = true;
  if (info.controls !== false) videoAttrs.controls = true; // Default to showing controls
  
  videoAttrs.loading = 'lazy';
  
  return {
    type: 'element',
    data: {
      hName: 'video',
      hProperties: videoAttrs,
    },
    children: [
      {
        type: 'text',
        value: 'Your browser does not support the video tag.',
      },
    ],
  };
}

/**
 * unified plugin to parse video embed components
 * Transforms :::video blocks to iframe or video elements
 */
export const parseVideoEmbeds: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: any, index, parent) => {
      if (node.name !== 'video') return;
      
      // Extract video info from content
      const videoInfo = extractVideoInfo(node);
      
      if (!videoInfo) {
        // No valid video URL found, leave as-is
        return;
      }
      
      // Create appropriate embed element
      let embedElement: any = null;
      
      if (videoInfo.platform === 'youtube') {
        embedElement = createYouTubeEmbed(videoInfo);
      } else if (videoInfo.platform === 'vimeo') {
        embedElement = createVimeoEmbed(videoInfo);
      } else if (videoInfo.platform === 'self-hosted') {
        embedElement = createVideoElement(videoInfo);
      }
      
      if (!embedElement) {
        // Couldn't create embed, leave as-is
        return;
      }
      
      // Transform node to video wrapper
      node.data = node.data || {};
      node.data.hName = 'div';
      
      // Add aspect ratio class
      const existingClasses = node.data.hProperties?.className || [];
      const classes = Array.isArray(existingClasses) ? [...existingClasses] : [existingClasses];
      
      // Add aspect ratio class if not already present
      const aspectClass = `aspect-${videoInfo.aspectRatio?.replace(':', '-')}`;
      if (!classes.includes(aspectClass)) {
        classes.push(aspectClass);
      }
      
      node.data.hProperties = {
        ...node.data.hProperties,
        className: classes,
        'data-video-platform': videoInfo.platform,
      };
      
      // Replace children with embed element
      node.children = [embedElement];
    });
  };
};

export default parseVideoEmbeds;


