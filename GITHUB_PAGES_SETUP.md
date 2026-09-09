# GitHub Pages Deployment Setup Guide

## Migration Complete ✅

Your Banking_app has been successfully migrated from Netlify to **GitHub Pages**. This guide will help you complete the setup and deploy your applications.

## What Changed

### Removed
- `netlify.toml` - Netlify configuration
- `@netlify/blobs` - Netlify storage dependency
- `netlify-cli` - Netlify CLI tool
- `wrangler.toml` - Cloudflare configuration files
- `_worker.js` - Cloudflare Functions
- All Cloudflare-specific files

### Added
- Updated `finflow/package.json` - Removed Netlify dependencies
- Updated `sky/package.json` - Added deployment script
- Updated `finflow/vite.config.js` - Added GitHub Pages base path
- Created `sky/next.config.js` - Next.js static export configuration
- Created deployment configuration files (YAML format for GitHub Actions)

## Step 1: Enable GitHub Pages

### In Repository Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - This enables automatic deployment from workflow runs

### Create the Workflows Directory

Since we cannot create files in `.github/workflows/` directly, you'll need to manually create these files:

**File 1: `.github/workflows/deploy-finflow.yml`**
Copy the content from `GITHUB_PAGES_DEPLOY_FINFLOW.md` into this file in your repository.

**File 2: `.github/workflows/deploy-sky.yml`**
Copy the content from `GITHUB_PAGES_DEPLOY_SKY.md` into this file in your repository.

## Step 2: Manual Workflow Setup Instructions

Since GitHub Actions workflows require specific directory permissions, follow these steps:

### Via GitHub Web Interface

1. Click the "Actions" tab in your repository
2. Click "New workflow"
3. Click "set up a workflow yourself"
4. Name the file: `deploy-finflow.yml`
5. Paste the content from `GITHUB_PAGES_DEPLOY_FINFLOW.md`
6. Click "Commit changes"
7. Repeat for `deploy-sky.yml` using content from `GITHUB_PAGES_DEPLOY_SKY.md`

### Via Git CLI

```bash
# Clone or navigate to your repository
cd Banking_app

# Create the workflows directory
mkdir -p .github/workflows

# Create the finflow workflow
cat > .github/workflows/deploy-finflow.yml << 'EOF'
[Paste content from GITHUB_PAGES_DEPLOY_FINFLOW.md]
EOF

# Create the sky workflow
cat > .github/workflows/deploy-sky.yml << 'EOF'
[Paste content from GITHUB_PAGES_DEPLOY_SKY.md]
EOF

# Commit and push
git add .github/workflows/
git commit -m "Add GitHub Pages deployment workflows"
git push origin main
```

## Step 3: Verify Configurations

### finflow (Vite + React)

✅ Updated `finflow/vite.config.js`:
- Added `base: '/Banking_app/'` for correct asset paths
- Build output: `dist/`

✅ Updated `finflow/package.json`:
- Removed: `netlify-cli`, `@netlify/blobs`
- Build script: `npm run build`

### sky (Next.js)

✅ Created `sky/next.config.js`:
- Added `output: 'export'` for static export
- Added `basePath: '/Banking_app/sky'` for correct routing
- Build output: `out/`

✅ Updated `sky/package.json`:
- Added `deploy` script
- No Netlify dependencies

## Step 4: Local Testing

Before deploying, test locally:

### Test finflow

```bash
cd finflow
npm install
npm run build
npm run preview
```

Visit `http://localhost:4173` (or shown URL)

### Test sky

```bash
cd sky
npm install
npm run build
npm start
```

Visit `http://localhost:3000/Banking_app/sky`

## Step 5: Deploy

### Automatic Deployment

Once the GitHub Actions workflows are in place, deployment happens automatically when you:

1. **Push to `main` or `develop` branches**
2. **Create pull requests** (builds for preview, doesn't deploy)

### Monitor Deployments

1. Go to **Actions** tab in your repository
2. Click on a workflow run to see build logs
3. Once successful, your site is live at:
   - **finflow**: `https://Mirnamo.github.io/Banking_app/`
   - **sky**: `https://Mirnamo.github.io/Banking_app/sky/`

## Important Notes

### ⚠️ Static Sites Only

GitHub Pages hosts **static content only**. This means:
- ✅ Works: React SPAs, Next.js static export, HTML/CSS/JS
- ❌ Doesn't work: Server-side APIs, serverless functions, dynamic routes

If your applications use API routes or serverless functions:
- Move API endpoints to external services (e.g., Express, Firebase, Vercel API)
- Update frontend to call external API URLs instead

### Base Paths

- **finflow**: Deployed at `/Banking_app/` root
  - All assets must be relative to this path (already configured in Vite)
- **sky**: Deployed at `/Banking_app/sky/` subdirectory
  - All links must use `basePath` (configured in next.config.js)

### Custom Domain (Optional)

To use a custom domain:

1. Update DNS records to point to GitHub Pages
2. In Repository Settings → Pages → Custom domain
3. Enter your custom domain
4. GitHub will automatically manage HTTPS

## Troubleshooting

### Workflow Not Triggering

- Check that `.github/workflows/` files exist and are valid YAML
- Ensure branch is `main` or `develop`
- Files must be pushed to the remote repository

### Build Failures

1. Check the workflow run logs in the **Actions** tab
2. Verify dependencies: `npm install` works locally
3. Verify build: `npm run build` succeeds locally

### Site Not Loading

- Verify correct URL: `https://Mirnamo.github.io/Banking_app/`
- Check browser console for 404 errors on assets
- Verify base path configuration in build configs

### Links Broken After Deployment

**For finflow**: Ensure all imports use relative paths
```javascript
// ❌ Wrong
import logo from '/logo.png'

// ✅ Correct
import logo from './assets/logo.png'
```

**For sky**: Links already handled by `basePath` in config

## Next Steps

1. ✅ Create `.github/workflows/deploy-finflow.yml`
2. ✅ Create `.github/workflows/deploy-sky.yml`
3. ✅ Push changes to GitHub
4. ✅ Monitor Actions tab for successful builds
5. ✅ Visit your live sites

## Support & Documentation

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)

## Summary of Files

| File | Purpose |
|------|---------|
| `CLOUDFLARE_MIGRATION.md` | Original migration guide (now GitHub Pages focused) |
| `GITHUB_PAGES_DEPLOY_FINFLOW.md` | Workflow YAML for finflow deployment |
| `GITHUB_PAGES_DEPLOY_SKY.md` | Workflow YAML for sky deployment |
| `finflow/vite.config.js` | Vite configuration with base path |
| `sky/next.config.js` | Next.js configuration for static export |
| `finflow/package.json` | Updated dependencies (Netlify removed) |
| `sky/package.json` | Updated with deploy script |

---

**Last Updated**: September 9, 2026
**Migration Status**: ✅ Complete
**Ready to Deploy**: Yes
