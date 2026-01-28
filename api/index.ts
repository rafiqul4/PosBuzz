import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Initialize Prisma singleton for serverless
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// CORS headers
function setCorsHeaders(res: VercelResponse) {
  const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (allowedOrigins.length === 0) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
}

// Parse request body
async function parseBody(req: VercelRequest): Promise<any> {
  if (req.body) return req.body;
  return {};
}

// Auth middleware
async function authenticate(req: VercelRequest): Promise<{ id: number; email: string } | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded && 'email' in decoded) {
      return { id: decoded.sub as number, email: decoded.email as string };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '/';
  const path = url.split('?')[0];
  const method = req.method || 'GET';

  try {
    // ============ AUTH ROUTES ============
    if (path === '/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password, name } = body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });

      return res.status(201).json({ id: user.id, email: user.email, name: user.name });
    }

    if (path === '/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
      return res.status(200).json({
        access_token: token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    }

    if (path === '/auth/profile' && method === 'GET') {
      const user = await authenticate(req);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ id: dbUser.id, email: dbUser.email, name: dbUser.name });
    }

    // ============ PRODUCTS ROUTES ============
    if (path === '/products' && method === 'GET') {
      const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json(products);
    }

    if (path === '/products' && method === 'POST') {
      const user = await authenticate(req);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      const body = await parseBody(req);
      const { name, sku, price, stock_quantity } = body;

      if (!name || !sku || price === undefined || stock_quantity === undefined) {
        return res.status(400).json({ message: 'Name, SKU, price, and stock_quantity are required' });
      }

      const existingSku = await prisma.product.findUnique({ where: { sku } });
      if (existingSku) {
        return res.status(409).json({ message: 'SKU already exists' });
      }

      const product = await prisma.product.create({
        data: { name, sku, price: parseFloat(price), stock_quantity: parseInt(stock_quantity) },
      });
      return res.status(201).json(product);
    }

    // Product by ID routes
    const productMatch = path.match(/^\/products\/(\d+)$/);
    if (productMatch) {
      const productId = parseInt(productMatch[1]);

      if (method === 'GET') {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json(product);
      }

      if (method === 'PATCH') {
        const user = await authenticate(req);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const body = await parseBody(req);
        const product = await prisma.product.update({
          where: { id: productId },
          data: {
            ...(body.name && { name: body.name }),
            ...(body.sku && { sku: body.sku }),
            ...(body.price !== undefined && { price: parseFloat(body.price) }),
            ...(body.stock_quantity !== undefined && { stock_quantity: parseInt(body.stock_quantity) }),
          },
        });
        return res.status(200).json(product);
      }

      if (method === 'DELETE') {
        const user = await authenticate(req);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        await prisma.product.delete({ where: { id: productId } });
        return res.status(200).json({ message: 'Product deleted' });
      }
    }

    // ============ SALES ROUTES ============
    if (path === '/sales' && method === 'GET') {
      const user = await authenticate(req);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      const sales = await prisma.sale.findMany({
        include: { saleItems: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(sales);
    }

    if (path === '/sales' && method === 'POST') {
      const user = await authenticate(req);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      const body = await parseBody(req);
      const { items } = body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items array is required' });
      }

      // Validate stock and calculate totals
      const itemsWithPrices: Array<{ productId: number; quantity: number; price: number }> = [];
      let totalAmount = 0;

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }
        if (product.stock_quantity < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
        itemsWithPrices.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
        totalAmount += product.price * item.quantity;
      }

      // Create sale with items
      const sale = await prisma.sale.create({
        data: {
          userId: user.id,
          total: totalAmount,
          saleItems: {
            create: itemsWithPrices,
          },
        },
        include: { saleItems: { include: { product: true } } },
      });

      // Deduct stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock_quantity: { decrement: item.quantity } },
        });
      }

      return res.status(201).json(sale);
    }

    // Sale by ID
    const saleMatch = path.match(/^\/sales\/(\d+)$/);
    if (saleMatch && method === 'GET') {
      const user = await authenticate(req);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      const saleId = parseInt(saleMatch[1]);
      const sale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: { saleItems: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } },
      });
      if (!sale) return res.status(404).json({ message: 'Sale not found' });
      return res.status(200).json(sale);
    }

    // ============ ROOT/HEALTH ============
    if (path === '/' || path === '/api' || path === '/health') {
      return res.status(200).json({ 
        message: 'PosBuzz API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    }

    // 404 for unknown routes
    return res.status(404).json({ message: 'Not Found', path });

  } catch (error) {
    console.error('API Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      path: req.url,
      method: req.method,
    });
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.url,
    });
  }
}
