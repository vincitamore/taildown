# Taildown Documentation Site

This directory contains the source files and build scripts for the Taildown documentation website at **taildown.dev**.

## Overview

The documentation site is built entirely with Taildown itself, demonstrating:

- **Dark Mode** - Automatic theme switching with system preference detection
- **Glassmorphism** - Modern frosted glass effects throughout
- **Scroll Animations** - Entrance animations triggered on scroll
- **Interactive Components** - Tabs, accordions, modals, and tooltips
- **Plain English Syntax** - Natural language styling
- **Zero Configuration** - Beautiful by default

## Structure

```
docs-site/
├── index.td                  # Main landing page
├── getting-started.td        # Installation and quick start guide
├── build.mjs                 # Build script (compiles all .td files)
├── README.md                 # This file
├── index.html                # Compiled output (generated)
└── getting-started.html      # Compiled output (generated)
```

## Building

To compile all documentation files to HTML:

```bash
# From the docs-site directory
node build.mjs

# Or from the project root
cd docs-site && node build.mjs
```

This will:
1. Find all `.td` files in the directory
2. Compile each to HTML with embedded CSS and JavaScript
3. Include dark mode support automatically
4. Generate self-contained HTML files

## Development

When editing the documentation:

1. Edit the `.td` source files
2. Run `node build.mjs` to recompile
3. Open the `.html` files in your browser to preview
4. Test dark mode by clicking the toggle button (bottom-right)

## Features Demonstrated

### Dark Mode
- Automatic detection of system preference
- Floating toggle button (moon/sun icon)
- LocalStorage persistence
- Smooth 300ms transitions
- CSS variables for theming

### Components Used
- Cards with glassmorphism (`:::card{light-glass}`)
- Responsive grids (`:::grid{3}`)
- Interactive tabs (`:::tabs`)
- Alert boxes (`:::alert{success}`)
- Icons (`:icon[name]{attributes}`)

### Plain English Styling
- `{huge-bold center primary}` - Large, bold, centered, primary-colored text
- `{light-glass fade-in hover-lift}` - Glass effect with entrance and hover animations
- `{button primary large}` - Primary button, large size

## Deployment to Vercel

The documentation site can be deployed to Vercel in two ways:

### Option 1: Same Repository

Deploy directly from the `/docs-site` directory:

1. Link your Vercel account to this repository
2. Set the root directory to `docs-site`
3. Set build command to `node build.mjs`
4. Set output directory to `.` (current directory)
5. Deploy!

### Option 2: Separate Repository

For a simpler deployment:

1. Create a new repository for the docs site
2. Copy the compiled `.html` files to the new repo
3. Link to Vercel
4. No build step needed - just serve static files

**Recommended:** Option 2 for simplicity, since the HTML files are self-contained.

## Custom Domain

The site is configured for **taildown.dev**:

1. Add `taildown.dev` as a custom domain in Vercel
2. Update DNS records to point to Vercel
3. SSL certificate is automatically provisioned

## Testing Dark Mode

1. Open `index.html` in your browser
2. Click the moon/sun icon in the bottom-right corner
3. Theme should switch smoothly
4. Refresh the page - theme should persist
5. Open browser DevTools and toggle system preference - theme should update

## File Sizes

The compiled HTML files are self-contained and include:
- HTML structure
- Full CSS (including dark mode, animations, glassmorphism)
- JavaScript (dark mode toggle, scroll animations, interactive components)

Typical file sizes:
- `index.html`: ~120KB (fully featured landing page)
- `getting-started.html`: ~110KB (documentation guide)

## Future Pages

Additional documentation pages to be added:

- `syntax-guide.html` - Complete syntax reference
- `plain-english.html` - Plain English styling reference
- `components.html` - Component library with examples
- `configuration.html` - Configuration guide
- `examples/` - Example pages showcasing different use cases

## Notes

- All files are self-contained with embedded CSS and JavaScript
- Dark mode works automatically on every page
- No external dependencies required
- Can be hosted on any static file server
- Vercel is recommended for automatic SSL and CDN

---

**Built with Taildown** - Demonstrating our own capabilities!
