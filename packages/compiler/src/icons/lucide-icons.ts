/**
 * Lucide Icons Integration (Tree-Shaken)
 * Provides SVG element data for Lucide icons
 * 
 * OPTIMIZED: Only imports icons actually used in the codebase
 * Auto-generated from icon audit - 157 icons vs 1000+ in full package
 * Bundle impact: ~471KB vs 18.3 MB (97.5% reduction!)
 * 
 * To update: Run `node scripts/audit-icons.mjs` and regenerate this file
 * 
 * See: https://lucide.dev/
 */

// Import only the icons we actually use (tree-shaking friendly)
import {
  Accessibility,
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BarChart,
  Beaker,
  Bell,
  Bluetooth,
  Book,
  BookOpen,
  Bookmark,
  Box,
  Brackets,
  Briefcase,
  Bug,
  Calendar,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronRight,
  ChevronsRight,
  Circle,
  Clock,
  Cloud,
  Code,
  Code2,
  Compass,
  Copy,
  Cpu,
  CreditCard,
  Crown,
  Database,
  DollarSign,
  Download,
  Droplet,
  Edit,
  ExternalLink,
  Eye,
  Facebook,
  Feather,
  Figma,
  File,
  FileCode,
  FilePlus,
  FileText,
  Flag,
  Flame,
  Folder,
  Gauge,
  Gift,
  GitBranch,
  GitCommit,
  GitFork,
  GitPullRequest,
  Github,
  Globe,
  GraduationCap,
  Grid3x3,
  Hand,
  Hash,
  Headphones,
  Heart,
  HelpCircle,
  Highlighter,
  Home,
  Image,
  Info,
  Key,
  Keyboard,
  Layers,
  Layout,
  LifeBuoy,
  Lightbulb,
  Link,
  Linkedin,
  List,
  Loader,
  Lock,
  Mail,
  Map,
  Maximize,
  Maximize2,
  Menu,
  MessageCircle,
  MessageSquare,
  Minimize,
  Minus,
  MinusSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  MousePointer,
  Move,
  Music,
  Package,
  Palette,
  PanelLeft,
  PartyPopper,
  Play,
  PlayCircle,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Settings,
  Share,
  Share2,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Smile,
  Sparkles,
  Speaker,
  Square,
  SquareStack,
  Star,
  Sun,
  Table,
  Tag,
  Target,
  Terminal,
  TestTube,
  ThumbsDown,
  ThumbsUp,
  Trash,
  TrendingDown,
  TrendingUp,
  Trophy,
  Twitter,
  Type,
  Upload,
  User,
  UserPlus,
  Users,
  Video,
  Wand2,
  Waves,
  Wind,
  Wrench,
  X,
  XCircle,
  Zap,
} from 'lucide';

/**
 * Default icon configuration
 */
export const DEFAULT_ICON_CONFIG = {
  size: 24,
  strokeWidth: 2,
  fill: 'none',
  stroke: 'currentColor',
};

/**
 * SVG element from Lucide: [tagName, attributes]
 */
export type LucideIconElement = [string, Record<string, any>];

/**
 * Icon registry mapping kebab-case names to Lucide components
 * This enables tree-shaking - only imported icons are bundled
 */
const iconRegistry: Record<string, any> = {
  'accessibility': Accessibility,
  'activity': Activity,
  'alert-circle': AlertCircle,
  'alert-octagon': AlertOctagon,
  'alert-triangle': AlertTriangle,
  'align-center': AlignCenter,
  'align-left': AlignLeft,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'award': Award,
  'bar-chart': BarChart,
  'beaker': Beaker,
  'bell': Bell,
  'bluetooth': Bluetooth,
  'book': Book,
  'book-open': BookOpen,
  'bookmark': Bookmark,
  'box': Box,
  'brackets': Brackets,
  'briefcase': Briefcase,
  'bug': Bug,
  'calendar': Calendar,
  'check': Check,
  'check-circle': CheckCircle,
  'check-square': CheckSquare,
  'chevron-right': ChevronRight,
  'chevrons-right': ChevronsRight,
  'circle': Circle,
  'clock': Clock,
  'cloud': Cloud,
  'code': Code,
  'code-2': Code2,
  'compass': Compass,
  'copy': Copy,
  'cpu': Cpu,
  'credit-card': CreditCard,
  'crown': Crown,
  'database': Database,
  'dollar-sign': DollarSign,
  'download': Download,
  'droplet': Droplet,
  'edit': Edit,
  'external-link': ExternalLink,
  'eye': Eye,
  'facebook': Facebook,
  'feather': Feather,
  'figma': Figma,
  'file': File,
  'file-code': FileCode,
  'file-plus': FilePlus,
  'file-text': FileText,
  'flag': Flag,
  'flame': Flame,
  'folder': Folder,
  'gauge': Gauge,
  'gift': Gift,
  'git-branch': GitBranch,
  'git-commit': GitCommit,
  'git-fork': GitFork,
  'git-pull-request': GitPullRequest,
  'github': Github,
  'globe': Globe,
  'graduation-cap': GraduationCap,
  'grid-3x3': Grid3x3,
  'hand': Hand,
  'hash': Hash,
  'headphones': Headphones,
  'heart': Heart,
  'help-circle': HelpCircle,
  'highlighter': Highlighter,
  'home': Home,
  'image': Image,
  'info': Info,
  'key': Key,
  'keyboard': Keyboard,
  'layers': Layers,
  'layout': Layout,
  'life-buoy': LifeBuoy,
  'lightbulb': Lightbulb,
  'link': Link,
  'linkedin': Linkedin,
  'list': List,
  'loader': Loader,
  'lock': Lock,
  'mail': Mail,
  'map': Map,
  'maximize': Maximize,
  'maximize-2': Maximize2,
  'menu': Menu,
  'message-circle': MessageCircle,
  'message-square': MessageSquare,
  'minimize': Minimize,
  'minus': Minus,
  'minus-square': MinusSquare,
  'monitor': Monitor,
  'moon': Moon,
  'more-horizontal': MoreHorizontal,
  'mouse-pointer': MousePointer,
  'move': Move,
  'music': Music,
  'package': Package,
  'palette': Palette,
  'panel-left': PanelLeft,
  'party-popper': PartyPopper,
  'play': Play,
  'play-circle': PlayCircle,
  'plus': Plus,
  'refresh-cw': RefreshCw,
  'rocket': Rocket,
  'search': Search,
  'server': Server,
  'settings': Settings,
  'share': Share,
  'share-2': Share2,
  'shield': Shield,
  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,
  'smartphone': Smartphone,
  'smile': Smile,
  'sparkles': Sparkles,
  'speaker': Speaker,
  'square': Square,
  'square-stack': SquareStack,
  'star': Star,
  'sun': Sun,
  'table': Table,
  'tag': Tag,
  'target': Target,
  'terminal': Terminal,
  'test-tube': TestTube,
  'thumbs-down': ThumbsDown,
  'thumbs-up': ThumbsUp,
  'trash': Trash,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  'trophy': Trophy,
  'twitter': Twitter,
  'type': Type,
  'upload': Upload,
  'user': User,
  'user-plus': UserPlus,
  'users': Users,
  'video': Video,
  'wand-2': Wand2,
  'wave': Waves,
  'wind': Wind,
  'wrench': Wrench,
  'x': X,
  'x-circle': XCircle,
  'zap': Zap,
};

/**
 * Get Lucide icon SVG element data
 * 
 * @param iconName - Name of the icon (e.g., 'home', 'search', 'menu')
 * @returns Array of SVG elements as [tagName, attributes] tuples, or null if not found
 */
export function getLucideIconElements(iconName: string): LucideIconElement[] | null {
  // Normalize icon name to lowercase kebab-case
  const normalizedName = iconName.toLowerCase();
  
  // Get the icon from registry
  const iconData = iconRegistry[normalizedName];

  if (!iconData) {
    console.warn(`[Taildown] Icon not found in registry: ${iconName}`);
    return null;
  }

  // Lucide icons are arrays of [tagName, attributes] tuples
  if (Array.isArray(iconData)) {
    return iconData as LucideIconElement[];
  }

  console.warn(`[Taildown] Invalid icon format for: ${iconName}`);
  return null;
}

/**
 * Check if an icon exists in the registry
 * 
 * @param iconName - Name of the icon
 * @returns True if icon exists
 */
export function hasLucideIcon(iconName: string): boolean {
  const normalizedName = iconName.toLowerCase();
  return normalizedName in iconRegistry;
}

/**
 * Get list of all available icon names in the registry
 * 
 * @returns Array of icon names in kebab-case
 */
export function getAllLucideIconNames(): string[] {
  return Object.keys(iconRegistry).sort();
}
