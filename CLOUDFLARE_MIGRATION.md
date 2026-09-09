# Migration from Netlify to GitHub Pages

## Overview
This repository contains two applications that have been migrated from Netlify to GitHub Pages:
- **finflow**: Vite + React static site
- **sky**: Next.js static site

## Setup Instructions

### Prerequisites
- GitHub account with push access to this repository
- Node.js 18+ and npm installed

### Deploying finflow (Vite + React)

1. Navigate to the finflow directory:
   ```bash
   cd finflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. The build output in `dist/` is ready for GitHub Pages

### Deploying sky (Next.js)

1. Navigate to the sky directory:
   ```bash
   cd sky
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. The build output in `out/` is ready for GitHub Pages

## GitHub Pages Configuration

### Repository Settings

1. Go to your repository Settings → Pages
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - This enables automatic deployment from CI/CD workflows

### Enable GitHub Pages

1. Go to Settings → Pages
2. Under "Source", select your deployment branch (e.g., `gh-pages`)
3. Choose the root folder as the source
4. Save

### Custom Domain (Optional)

1. Go to Settings → Pages
2. Under "Custom domain", enter your domain
3. Update your domain's DNS settings to point to GitHub Pages

## GitHub Actions CI/CD

Two workflows have been created for automated deployment:

### Deploy finflow
- Triggers on: push to `main` or `develop` branches, or pull requests
- Builds the project and deploys to `gh-pages` branch
- Accessible at: `https://username.github.io/Banking_app/` (for user pages)

### Deploy sky
- Triggers on: push to `main` or `develop` branches, or pull requests
- Builds the project and deploys to `gh-pages` branch
- Accessible at: `https://username.github.io/Banking_app/sky`

## Key Changes from Netlify

### Removed
- `netlify.toml` - Netlify configuration
- `@netlify/blobs` - Netlify storage
- `netlify-cli` - Netlify CLI
- `wrangler.toml` - Cloudflare configuration
- `_worker.js` - Cloudflare Functions
- All Cloudflare-specific files

### Added
- `.github/workflows/deploy-finflow.yml` - GitHub Actions workflow for finflow
- `.github/workflows/deploy-sky.yml` - GitHub Actions workflow for sky

### Build Output Changes

**Finflow**:
- Build output: `dist/` (Vite default)
- GitHub Pages root: `/` (project page root)

**Sky**:
- Build output: `out/` (Next.js static export)
- GitHub Pages root: `/sky/` (within project page)

## Base Path Configuration

For **sky** (Next.js), update `next.config.js` to set the base path:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Banking_app/sky',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

For **finflow** (Vite), update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Banking_app/',
})
```

## Local Development

### finflow
```bash
cd finflow
npm install
npm run dev
```

### sky
```bash
cd sky
npm install
npm run dev
```

## Deployment Workflow

Automatic deployment happens when:
1. Code is pushed to `main` or `develop` branches
2. A pull request is created

The workflows will:
1. Check out the code
2. Install dependencies
3. Build the project
4. Deploy to `gh-pages` branch
5. GitHub Pages automatically serves the content

## Environment Variables

GitHub Pages does not support server-side environment variables. Any sensitive information should be:
- Handled client-side with appropriate security measures
- Stored in GitHub Secrets (only used during build time)
- Accessed via build-time environment variables

For build-time secrets:
1. Go to Settings → Secrets and variables → Actions
2. Add your secrets
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

## Limitations & Considerations

### Static Site Only
- GitHub Pages only hosts static files
- No server-side APIs or functions
- Backend API calls must go to external services

### No API Routes
- Cannot use Next.js API routes (`/api/*`)
- Cannot use serverless functions
- Must use external API endpoints

### Domain Limitations
- Free custom domain: GitHub provides `username.github.io` for user pages
- Organization pages: `organization.github.io`
- Project pages: `username.github.io/repository-name/`

### Performance
- CDN-backed by Fastly
- HTTPS enabled by default
- Automatic redirects for trailing slashes

## Support & Documentation

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
