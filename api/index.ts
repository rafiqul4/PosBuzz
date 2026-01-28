import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple test endpoint to verify Vercel deployment
  if (req.method === 'GET' && req.url === '/') {
    return res.status(200).json({ 
      message: 'PosBuzz API is running',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  }

  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // For now, return a simple response for all other routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  return res.status(200).json({
    message: 'PosBuzz API - Route not implemented yet',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
