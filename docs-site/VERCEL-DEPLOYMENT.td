# Deploying Taildown Docs to Vercel {huge-bold center primary}

**Complete guide to deploying taildown.dev** {center large muted}

Step-by-step instructions for deploying the Taildown documentation site to Vercel with the custom domain `taildown.dev`. {center muted}

---

## Prerequisites {large-bold primary}

:::card {elevated padded}
### :icon[check-square]{primary} What You Need {medium-bold}

- :icon[check]{success xs} **GitHub Account** - To host the repository
- :icon[check]{success xs} **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
- :icon[check]{success xs} **Domain Purchased** - `taildown.dev` already purchased on Vercel
- :icon[check]{success xs} **Compiled Files** - Run `node build.mjs` in `docs-site/` directory

:::alert {info}
:icon[info]{info} **Already have a Vercel account?** You can link it to your GitHub account to enable automatic deployments from your repository.
:::
:::

---

## Deployment Options {large-bold primary}

Choose the deployment method that works best for you: {center muted}

:::tabs
## :icon[git-branch]{primary xs} Option 1: Same Repository

**Deploy from the existing Taildown repository**

This is the simplest option if you want documentation updates to deploy automatically when you push to GitHub.

**Pros:**
- :icon[check]{success xs} Single repository to maintain
- :icon[check]{success xs} Documentation updates with code changes
- :icon[check]{success xs} Automatic deployments on push

**Cons:**
- :icon[x]{error xs} Requires build step on Vercel
- :icon[x]{error xs} Longer deployment time
- :icon[x]{error xs} More complex setup

**Best for:** Active development, frequent doc updates

## :icon[file]{accent xs} Option 2: Separate Repository

**Create a new repo with just the compiled HTML files**

This is the recommended option for production - it's faster, simpler, and more reliable.

**Pros:**
- :icon[check]{success xs} No build step needed
- :icon[check]{success xs} Instant deployments (just HTML)
- :icon[check]{success xs} Simpler configuration
- :icon[check]{success xs} Smaller repository size

**Cons:**
- :icon[x]{error xs} Manual updates (copy compiled files)
- :icon[x]{error xs} Two repositories to manage

**Best for:** Production deployments, stable documentation

## :icon[upload]{success xs} Option 3: Manual Upload

**Upload files directly through Vercel dashboard**

Quick and easy for testing, but not recommended for production.

**Pros:**
- :icon[check]{success xs} No GitHub needed
- :icon[check]{success xs} Immediate deployment
- :icon[check]{success xs} Good for testing

**Cons:**
- :icon[x]{error xs} Manual process every time
- :icon[x]{error xs} No version control
- :icon[x]{error xs} No automatic updates

**Best for:** Quick testing, one-off deployments
:::

---

## :icon[rocket]{primary huge} Option 1: Deploy from Same Repository {large-bold center}

**Deploy the docs-site directory from the main Taildown repository** {center muted}

### Step 1: Prepare the Repository {medium-bold}

:::card {light-glass}
```bash
# Make sure you're on the correct branch
git checkout cursor/build-taildown-dev-documentation-site-with-dark-mode-592c

# Ensure the docs-site is built
cd docs-site
node build.mjs

# Verify the HTML files exist
ls -lh *.html

# Commit the compiled files
git add index.html getting-started.html
git commit -m "Add compiled documentation site"
git push
```

:::alert {warning}
:icon[alert-triangle]{warning} **Important:** Make sure to commit the compiled `.html` files to the repository. Vercel will serve these files directly.
:::
:::

### Step 2: Connect to Vercel {medium-bold}

:::card {subtle-glass}
**2.1 Log in to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

**2.2 Import Project**

1. Click **"Add New..."** → **"Project"**
2. Find your Taildown repository in the list
3. Click **"Import"**

**2.3 Configure Project**

:::grid {2}
**Framework Preset:**
- Select **"Other"** (we're not using a framework)

**Root Directory:**
- Click **"Edit"**
- Enter: `docs-site`
- This tells Vercel to deploy only the docs-site folder
:::

**Build Settings:**

```bash
# Build Command
node build.mjs

# Output Directory
.

# Install Command (leave default)
npm install
```

**2.4 Environment Variables**

No environment variables needed for this static site!
:::

### Step 3: Deploy {medium-bold}

:::card {elevated padded}
1. Click **"Deploy"**
2. Wait for deployment (should take 30-60 seconds)
3. Vercel will provide a temporary URL like `taildown-docs-xyz.vercel.app`
4. Test the site at the temporary URL
5. Check that dark mode toggle works
6. Verify all links and navigation

:::alert {success}
:icon[check-circle]{success} **Deployment successful!** Your site is now live at the temporary Vercel URL. Next step: add your custom domain.
:::
:::

### Step 4: Add Custom Domain {medium-bold}

:::card {heavy-glass padded}
**Since you already own `taildown.dev` on Vercel:**

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `taildown.dev`
4. Click **"Add"**
5. Vercel will automatically configure the domain (since it's purchased through Vercel)
6. Wait 1-2 minutes for DNS propagation
7. Visit [https://taildown.dev](https://taildown.dev)

**That's it!** Your documentation site is now live at `taildown.dev` with automatic HTTPS.

:::alert {info}
:icon[info]{info} **Automatic Deployments:** Every time you push to your branch, Vercel will automatically rebuild and redeploy your site.
:::
:::

---

## :icon[zap]{accent huge} Option 2: Deploy from Separate Repository (Recommended) {large-bold center}

**The simplest and fastest deployment method** {center muted}

### Step 1: Create New Repository {medium-bold}

:::card {light-glass}
**1.1 Create Repository on GitHub**

1. Go to GitHub.com
2. Click **"New repository"**
3. Name it: `taildown-docs` (or `taildown.dev`)
4. Make it **Public** (for open source docs)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

**1.2 Copy Compiled Files**

```bash
# Create a new directory
mkdir ~/taildown-docs
cd ~/taildown-docs

# Initialize git
git init

# Copy the compiled HTML files
cp /path/to/taildown/docs-site/*.html .
cp /path/to/taildown/docs-site/*.md .

# Create a simple README
echo "# Taildown Documentation Site" > README.md
echo "Live at https://taildown.dev" >> README.md

# Add and commit
git add .
git commit -m "Initial documentation site"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/taildown-docs.git
git branch -M main
git push -u origin main
```
:::

### Step 2: Deploy to Vercel {medium-bold}

:::card {subtle-glass}
**2.1 Import Project**

1. Log in to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Find your `taildown-docs` repository
4. Click **"Import"**

**2.2 Configure (Super Simple!)**

:::grid {2}
**Framework Preset:**
- Select **"Other"**

**Root Directory:**
- Leave as **"."** (root)
:::

**Build Settings:**

```bash
# Build Command
(leave empty - no build needed!)

# Output Directory
.

# Install Command
(leave empty - no dependencies!)
```

That's it! No build step, no dependencies, just pure HTML.
:::

### Step 3: Deploy & Add Domain {medium-bold}

:::card {elevated padded}
1. Click **"Deploy"**
2. Deployment completes in ~10 seconds (no build!)
3. Go to **Settings** → **Domains**
4. Add `taildown.dev`
5. Vercel auto-configures (domain purchased through Vercel)
6. Visit [https://taildown.dev](https://taildown.dev)

**Done!** Your site is live with zero build time.

:::alert {success}
:icon[rocket]{success} **Lightning fast!** Static HTML deploys instantly and loads even faster. Perfect for documentation sites.
:::
:::

### Step 4: Future Updates {medium-bold}

:::card {light-glass}
**When you update the documentation:**

```bash
# In the main Taildown repo
cd docs-site
node build.mjs

# Copy updated files to docs repo
cp *.html ~/taildown-docs/

# Commit and push
cd ~/taildown-docs
git add .
git commit -m "Update documentation"
git push

# Vercel automatically redeploys in ~10 seconds
```

**Automation Tip:**

Create a script to automate this:

```bash
#!/bin/bash
# update-docs.sh

cd docs-site
node build.mjs

cp *.html ~/taildown-docs/
cd ~/taildown-docs

git add .
git commit -m "Update docs: $(date +%Y-%m-%d)"
git push

echo "Documentation updated and deployed!"
```
:::

---

## :icon[upload]{success huge} Option 3: Manual Upload {large-bold center}

**Quick deployment for testing** {center muted}

### Steps {medium-bold}

:::card {subtle-glass}
1. Build the site: `cd docs-site && node build.mjs`
2. Go to [vercel.com](https://vercel.com)
3. Click **"Add New..."** → **"Project"**
4. Click **"Deploy without Git"**
5. Name your project: `taildown-docs`
6. Drag and drop the `docs-site` folder
7. Click **"Deploy"**
8. Add domain `taildown.dev` in Settings → Domains

:::alert {warning}
:icon[alert-triangle]{warning} **Not recommended for production:** Manual uploads don't have version control or automatic updates. Use Options 1 or 2 for production sites.
:::
:::

---

## Post-Deployment Checklist {large-bold primary}

:::card {elevated padded}
### :icon[check-square]{primary} Verify Everything Works {medium-bold}

After deployment, test the following:

**Functionality:**
- :icon[square]{muted xs} Dark mode toggle button appears (bottom-right)
- :icon[square]{muted xs} Clicking toggle switches between light/dark themes
- :icon[square]{muted xs} Theme preference persists after page refresh
- :icon[square]{muted xs} All links work correctly
- :icon[square]{muted xs} Navigation buttons function properly

**Visual:**
- :icon[square]{muted xs} Glassmorphism effects render correctly
- :icon[square]{muted xs} Scroll animations trigger on scroll
- :icon[square]{muted xs} Icons display properly
- :icon[square]{muted xs} Cards and grids are responsive
- :icon[square]{muted xs} Typography looks correct

**Mobile:**
- :icon[square]{muted xs} Site is responsive on mobile devices
- :icon[square]{muted xs} Dark mode works on mobile
- :icon[square]{muted xs} Touch interactions work (toggle button, links)
- :icon[square]{muted xs} No horizontal scrolling

**Performance:**
- :icon[square]{muted xs} Page loads quickly (should be < 2 seconds)
- :icon[square]{muted xs} Lighthouse score > 90 for Performance
- :icon[square]{muted xs} No console errors
- :icon[square]{muted xs} HTTPS certificate active

**SEO:**
- :icon[square]{muted xs} Custom domain `taildown.dev` resolves correctly
- :icon[square]{muted xs} Site title and description are appropriate
- :icon[square]{muted xs} Social media preview looks good

:::alert {success}
:icon[check-circle]{success} **All checks passed?** Congratulations! Your documentation site is live and production-ready at [https://taildown.dev](https://taildown.dev)
:::
:::

---

## Troubleshooting {large-bold primary}

:::accordion
**:icon[help-circle]{primary} Deployment fails with build error**

**Solution:**

If using Option 1 (same repo):
- Make sure `node` and `npm` are available in build environment
- Check that `build.mjs` is in the `docs-site` directory
- Verify the build command is exactly: `node build.mjs`
- Check build logs in Vercel dashboard for specific errors

If using Option 2 (separate repo):
- You shouldn't need a build command - leave it empty
- Make sure you copied the `.html` files, not `.td` files

**:icon[alert-circle]{warning} Dark mode toggle doesn't appear**

**Solution:**

- Check browser console for JavaScript errors
- Verify the HTML includes the dark mode script
- Rebuild the site: `cd docs-site && node build.mjs`
- Clear browser cache and hard refresh (Ctrl+Shift+R)

**:icon[link]{error} Custom domain not working**

**Solution:**

- Wait 5-10 minutes for DNS propagation
- In Vercel dashboard, verify domain status is "Valid Configuration"
- Check that domain points to Vercel nameservers
- Try accessing with `www.taildown.dev` as well

**:icon[zap]{info} Site loads slowly**

**Solution:**

- Enable Vercel's Edge Network (automatic with custom domain)
- Check Lighthouse score in Chrome DevTools
- Verify images are optimized (not applicable for this site)
- Consider enabling Vercel Analytics for performance insights

**:icon[x-circle]{error} 404 errors on page navigation**

**Solution:**

- Verify all `.html` files are in the root directory
- Check that links in the HTML use relative paths
- Rebuild and redeploy to ensure all files are included
:::

---

## Next Steps After Deployment {large-bold primary}

:::grid {3}
:::card {light-glass zoom-in hover-lift}
### :icon[bar-chart]{primary huge} {center}

**Add Analytics** {large-bold center}

Track visitors and page views with Vercel Analytics (free).

[Enable Analytics](https://vercel.com/docs/analytics){button primary small}
:::

:::card {light-glass zoom-in hover-lift}
### :icon[share-2]{accent huge} {center}

**SEO Optimization** {large-bold center}

Add meta tags, Open Graph images, and sitemap.

[SEO Guide](https://vercel.com/docs/concepts/analytics){button secondary small}
:::

:::card {light-glass zoom-in hover-lift}
### :icon[zap]{success huge} {center}

**Monitor Performance** {large-bold center}

Use Lighthouse and Web Vitals to track site speed.

[Performance Docs](https://vercel.com/docs/concepts/speed-insights){button info small}
:::
:::

---

## Summary {large-bold primary center}

:::card {heavy-glass padded}
### :icon[check-circle]{success huge} {center}

**You're All Set!** {huge-bold center primary}

Your Taildown documentation site is now live at **taildown.dev** with:

- :icon[check]{success xs} Automatic HTTPS
- :icon[check]{success xs} Global CDN
- :icon[check]{success xs} Dark mode support
- :icon[check]{success xs} Fast static HTML delivery
- :icon[check]{success xs} Automatic deployments (if using Git)

**Recommended:** Use **Option 2** (separate repository) for the fastest and most reliable deployments. {large muted center}

[View Live Site](https://taildown.dev){button primary large hover-lift} [Back to Docs](index.html){button secondary large}
:::
