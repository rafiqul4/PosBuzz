import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({ 
    message: 'Hello from PosBuzz API!',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
}
