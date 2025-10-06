# Deploy Taildown Documentation to Vercel {huge-bold center primary}

**Step-by-step guide to deploying taildown.dev** {center large muted}

Complete instructions for deploying the Taildown documentation site to Vercel with the custom domain **taildown.dev**. {center muted}

[Back to Home](index.html){button secondary small}

---

## Overview {large-bold primary}

:::card {light-glass padded}
### :icon[zap]{warning} What You'll Deploy {medium-bold}

The documentation site is **100% static HTML** with:
- Self-contained HTML files (CSS and JavaScript embedded)
- Dark mode with auto-toggle button
- Glassmorphism effects
- Scroll animations
- Interactive components

**No build step needed on Vercel** - files are pre-compiled! {center large}
:::

---

## Option 1: Deploy from Main Repository (Recommended) {large-bold primary}

This option keeps everything in one repository and uses Vercel to build the documentation automatically.

:::tabs
## :icon[github]{primary xs} Step 1: Prepare Repository

Ensure your repository is ready:

```bash
# Make sure docs-site is in the main branch
git status

# If needed, commit any changes
git add docs-site/
git commit -m "Add documentation site"
git push origin main
```

Your repository should have this structure:
```
taildown/
├── docs-site/
│   ├── index.td
│   ├── getting-started.td
│   ├── build.mjs
│   └── README.md
├── packages/
├── package.json
└── ... (other files)
```

## :icon[settings]{accent xs} Step 2: Configure Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New" → "Project"

2. **Import Repository**:
   - Select your Taildown repository
   - Click "Import"

3. **Configure Project**:
   ```
   Framework Preset: Other
   Root Directory: docs-site
   Build Command: node build.mjs
   Output Directory: .
   Install Command: (leave default)
   ```

4. **Environment Variables** (Optional):
   - None needed! Everything is self-contained

5. **Deploy Settings**:
   - Branch: main
   - Auto-deploy: Enable (recommended)

## :icon[rocket]{success xs} Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (~30 seconds)
3. Vercel will show your deployment URL: `your-project.vercel.app`

:::alert {success}
:icon[check-circle]{success} **Deployment successful!** Your site is now live at the Vercel URL.
:::

## :icon[globe]{warning xs} Step 4: Add Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add Domain"

2. **Add taildown.dev**:
   - Enter: `taildown.dev`
   - Click "Add"

3. **Configure DNS**:
   
   Vercel will show DNS records to add. Go to your domain registrar and add:
   
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for DNS Propagation** (~10 minutes to 48 hours):
   - Vercel will automatically provision SSL certificate
   - Check status in Vercel dashboard
   - Green checkmark = ready!

:::alert {info}
:icon[info]{info} **SSL Certificate**: Vercel automatically provisions Let's Encrypt SSL certificates for your custom domain. No additional configuration needed!
:::
:::

---

## Option 2: Deploy from Separate Repository (Simpler) {large-bold primary}

This option creates a separate repository with just the compiled HTML files - no build step needed!

:::tabs
## :icon[folder]{primary xs} Step 1: Create New Repository

1. **On GitHub**:
   - Click "New repository"
   - Name: `taildown-docs` (or any name)
   - Visibility: Public
   - Initialize: No README needed
   - Create repository

2. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/taildown-docs.git
   cd taildown-docs
   ```

## :icon[copy]{accent xs} Step 2: Copy Compiled Files

From your main Taildown repository:

```bash
# Copy compiled HTML files
cp ../taildown/docs-site/*.html .

# Copy README for documentation
cp ../taildown/docs-site/README.md .

# Create .gitignore
echo "node_modules/" > .gitignore
```

Your repository structure:
```
taildown-docs/
├── index.html
├── getting-started.html
├── README.md
└── .gitignore
```

## :icon[upload]{success xs} Step 3: Push to GitHub

```bash
git add .
git commit -m "Initial commit - Taildown documentation"
git push origin main
```

## :icon[settings]{warning xs} Step 4: Deploy to Vercel

1. **Vercel Dashboard**:
   - Click "Add New" → "Project"
   - Select `taildown-docs` repository
   - Click "Import"

2. **Project Settings**:
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (leave empty - no build needed!)
   Output Directory: ./
   Install Command: (leave empty)
   ```

3. **Deploy**:
   - Click "Deploy"
   - Wait ~15 seconds
   - Done! Site is live

## :icon[globe]{info xs} Step 5: Add Custom Domain

Same as Option 1, Step 4:
- Go to Settings → Domains
- Add `taildown.dev`
- Configure DNS records
- Wait for SSL provisioning

:::alert {success}
:icon[check-circle]{success} **Simpler deployment!** No build step, just pure static files. Perfect for documentation sites.
:::
:::

---

## Comparison: Which Option to Choose? {large-bold primary center}

:::grid {2}
:::card {elevated}
### :icon[box]{primary} Option 1: Main Repository {large-bold}

**Pros:**
- :icon[check]{success xs} Single repository
- :icon[check]{success xs} Auto-rebuild on changes
- :icon[check]{success xs} Build logs in Vercel
- :icon[check]{success xs} Source and output together

**Cons:**
- :icon[x]{error xs} Requires build step
- :icon[x]{error xs} Slightly slower deploys (~30s)
- :icon[x]{error xs} Need Node.js on Vercel

**Best for:** Active development with frequent updates
:::

:::card {elevated}
### :icon[zap]{accent} Option 2: Separate Repository {large-bold}

**Pros:**
- :icon[check]{success xs} No build step needed
- :icon[check]{success xs} Lightning-fast deploys (~15s)
- :icon[check]{success xs} Pure static files
- :icon[check]{success xs} Simple and clean

**Cons:**
- :icon[x]{error xs} Two repositories to manage
- :icon[x]{error xs} Manual copy of compiled files
- :icon[x]{error xs} Must rebuild locally

**Best for:** Production sites with infrequent updates
:::
:::

---

## Post-Deployment Checklist {large-bold primary}

After deployment, verify everything works:

:::card {subtle-glass padded}
### :icon[check-square]{primary} Testing Checklist {medium-bold}

- :icon[square]{muted xs} Visit `taildown.dev` in browser
- :icon[square]{muted xs} Check SSL certificate (green padlock)
- :icon[square]{muted xs} Test dark mode toggle button
- :icon[square]{muted xs} Verify all navigation links work
- :icon[square]{muted xs} Test on mobile device
- :icon[square]{muted xs} Check scroll animations
- :icon[square]{muted xs} Verify glassmorphism effects
- :icon[square]{muted xs} Test interactive components
- :icon[square]{muted xs} Check page load speed (should be fast!)
- :icon[square]{muted xs} Test dark mode persistence (refresh page)
:::

---

## Updating the Site {large-bold primary}

### Option 1: Automatic Updates

When using the main repository approach:

1. Edit `.td` files in `docs-site/`
2. Commit and push changes:
   ```bash
   git add docs-site/
   git commit -m "Update documentation"
   git push origin main
   ```
3. Vercel automatically rebuilds and deploys!

### Option 2: Manual Updates

When using the separate repository approach:

1. Edit `.td` files in main Taildown repo
2. Rebuild locally:
   ```bash
   cd docs-site
   node build.mjs
   ```
3. Copy compiled files to docs repository:
   ```bash
   cp *.html ../taildown-docs/
   cd ../taildown-docs
   git add .
   git commit -m "Update documentation"
   git push origin main
   ```
4. Vercel automatically redeploys!

---

## Troubleshooting {large-bold primary}

:::accordion
**:icon[alert-circle]{error} Build fails with "Module not found"**

**Solution:**
- Check that `build.mjs` is in the `docs-site/` directory
- Verify Root Directory is set to `docs-site` in Vercel settings
- Ensure packages are built: `pnpm build` in main repo

**:icon[globe]{warning} Domain not working after 48 hours**

**Solution:**
- Check DNS records in domain registrar
- Verify A record: `76.76.21.21`
- Verify CNAME: `cname.vercel-dns.com`
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

**:icon[moon]{info} Dark mode toggle not appearing**

**Solution:**
- Check browser console for JavaScript errors
- Verify JavaScript is embedded in HTML
- Rebuild with `inlineScripts: true` option
- Check that `dark-mode` behavior is included

**:icon[image]{success} Glassmorphism effects not showing**

**Solution:**
- Test in a modern browser (Chrome, Firefox, Safari)
- Check that CSS is embedded properly
- Verify `backdrop-filter` support in browser
- Try different glass variant (subtle, light, heavy)

**:icon[zap]{primary} Site loads slowly**

**Solution:**
- Enable compression in Vercel (automatic)
- Use separate CSS file instead of inline
- Minimize number of large images
- Consider lazy loading images
- Check Vercel analytics for insights
:::

---

## Advanced Configuration {large-bold primary}

### Custom Build Script

Create a custom build script for more control:

```javascript
// docs-site/vercel-build.mjs
import { compile } from '../packages/compiler/dist/index.js';
import { promises as fs } from 'fs';

async function build() {
  // Custom build logic
  const files = ['index', 'getting-started'];
  
  for (const file of files) {
    const source = await fs.readFile(`${file}.td`, 'utf-8');
    const result = await compile(source, {
      inlineStyles: true,
      inlineScripts: true,
      darkMode: true,
      minify: true, // Minify for production
    });
    await fs.writeFile(`${file}.html`, result.html);
  }
}

build();
```

### Environment Variables

Add analytics or tracking:

```bash
# In Vercel dashboard: Settings → Environment Variables
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
PLAUSIBLE_DOMAIN=taildown.dev
```

### Custom Headers

Add security headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Performance Optimization {large-bold primary}

:::grid {3}
:::card {light-glass}
### :icon[zap]{warning} Speed {medium-bold}

**Already Optimized:**
- Self-contained HTML
- Embedded CSS/JS
- No external dependencies
- Static files

**Expected:**
- First load: < 1s
- Subsequent: < 200ms
:::

:::card {light-glass}
### :icon[image]{primary} Images {medium-bold}

**Best Practices:**
- Use WebP format
- Optimize with ImageOptim
- Add width/height attributes
- Consider lazy loading

**For icons:**
- Use Taildown's built-in icon system (already SVG)
:::

:::card {light-glass}
### :icon[activity]{accent} Monitoring {medium-bold}

**Vercel Analytics:**
- Enable in dashboard
- Track page views
- Monitor performance
- See visitor insights

**Free tier includes:**
- Core Web Vitals
- Page load times
- Traffic analytics
:::
:::

---

## Success! {large-bold primary center}

:::card {heavy-glass padded}
:icon[party-popper]{success huge} {center}

**Your documentation site is live!** {huge-bold center primary}

Visit **[taildown.dev](https://taildown.dev)** to see your beautiful, dark-mode-enabled documentation site in action. {large center muted}

[View Live Site](https://taildown.dev){button primary large hover-lift} [Edit Documentation](index.td){button secondary large hover-lift}
:::

---

## Next Steps {large-bold primary center}

:::grid {3}
:::card {elevated zoom-in hover-lift}
### :icon[book-open]{primary huge} {center}

**Add More Pages** {large-bold center}

Create syntax guides, component docs, and examples.

[View To-Do](../todo.txt){button primary}
:::

:::card {elevated zoom-in hover-lift}
### :icon[palette]{accent huge} {center}

**Customize Design** {large-bold center}

Edit `.td` files to match your vision and brand.

[Edit Site](index.td){button secondary}
:::

:::card {elevated zoom-in hover-lift}
### :icon[share-2]{success huge} {center}

**Share & Promote** {large-bold center}

Share your new documentation site with the world!

[Tweet About It](https://twitter.com/intent/tweet?text=Check%20out%20Taildown!){button info}
:::
:::

---

[Back to Home](index.html){button primary large hover-lift}
