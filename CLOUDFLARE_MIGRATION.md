# Migration from Netlify to Cloudflare Pages

## Overview
This repository contains two applications that have been migrated from Netlify to Cloudflare Pages:
- **finflow**: Vite + React app with serverless functions
- **sky**: Next.js app

## Setup Instructions

### Prerequisites
- Install [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/):
  ```bash
  npm install -g wrangler
  ```
- Authenticate with Cloudflare:
  ```bash
  wrangler login
  ```

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

4. Deploy to Cloudflare Pages:
   ```bash
   npm run deploy
   ```

   Or manually:
   ```bash
   wrangler pages deploy dist
   ```

5. For local development:
   ```bash
   npm run dev          # Runs Vite dev server
   npm run dev:pages    # Runs with Cloudflare Pages emulation
   ```

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

4. Deploy to Cloudflare Pages:
   ```bash
   npm run deploy
   ```

   Or manually:
   ```bash
   wrangler pages deploy .next/static
   ```

5. For local development:
   ```bash
   npm run dev   # Runs Next.js dev server
   ```

## Key Changes

### Removed
- `netlify.toml` (Netlify configuration)
- `@netlify/blobs` dependency
- `netlify-cli` dependency

### Added
- `wrangler.toml` (Cloudflare configuration)
- `wrangler` dev dependency
- `_worker.js` (Cloudflare Pages Functions entry point)

### Configuration Differences

#### Redirects & Rewrites
**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Cloudflare** (`_routes.json` in root of deployment):
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*", "/_next/*", "/static/*"]
}
```

#### Environment Variables
Store secrets in Cloudflare dashboard:
1. Go to Pages > Your Project > Settings > Environment variables
2. Add variables for production and preview environments

### API Routes Migration

**Netlify Functions** → **Cloudflare Pages Functions**

Old structure:
```
netlify/functions/api.js
```

New structure:
```
functions/api.js
```

Update function exports:
```javascript
// Netlify
exports.handler = async (event, context) => {
  return { statusCode: 200, body: JSON.stringify(data) };
};

// Cloudflare Pages Functions
export async function onRequest(context) {
  return new Response(JSON.stringify(data));
}
```

## Database & KV Store

### Replacing @netlify/blobs
If using Netlify Blobs for storage, migrate to Cloudflare KV:

```javascript
// In your worker/function
export async function onRequest(context) {
  const { BUCKET } = context.env; // KV namespace binding from wrangler.toml
  
  // Store data
  await BUCKET.put(key, value);
  
  // Retrieve data
  const data = await BUCKET.get(key);
  
  return new Response(data);
}
```

Add to `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "BUCKET"
id = "your-kv-namespace-id"
```

## Custom Domain

1. In Cloudflare dashboard, add your custom domain to your Pages project
2. Update DNS records as shown in the dashboard
3. Enable automatic HTTPS

## GitHub Actions / CI/CD

Update your workflow to use Wrangler for deployment:

```yaml
- name: Deploy to Cloudflare Pages
  run: |
    npm install -g wrangler
    wrangler pages deploy dist
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Support & Documentation

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
