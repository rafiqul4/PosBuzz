import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
// Import from source files for Vercel build
import { AppModule } from '../backend/src/app.module';
import type { Request, Response } from 'express';
import express from 'express';

// Create Express app instance
const server = express();

// Cache the NestJS application instance
let cachedApp: any;

async function bootstrapServer() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressAdapter = new ExpressAdapter(server);
  
  cachedApp = await NestFactory.create(
    AppModule,
    expressAdapter,
    { 
      logger: ['error', 'warn', 'log'],
      abortOnError: false 
    }
  );

  // Configure allowed CORS origins from environment (comma-separated)
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  // Enable CORS with restricted origins
  cachedApp.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no Origin header (e.g., curl, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      // In development or if no origins configured, allow all
      if (allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Enable validation
  cachedApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await cachedApp.init();
  
  return cachedApp;
}

// Serverless function handler
export default async function handler(req: Request, res: Response) {
  await bootstrapServer();
  server(req, res);
}
