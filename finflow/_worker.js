// Cloudflare Pages Functions router
// This file handles API requests that were previously handled by Netlify functions

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Route API requests to Functions
  if (url.pathname.startsWith('/api/')) {
    const path = url.pathname.replace('/api/', '');
    
    // Import and route to appropriate function
    try {
      const funcPath = `./functions/${path}.js`;
      const handler = await import(funcPath);
      return handler.onRequest?.(context) || new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Function not found:', error);
      return new Response('Not Found', { status: 404 });
    }
  }

  // For non-API routes, return 404 (Pages will serve static files)
  return new Response('Not Found', { status: 404 });
}
