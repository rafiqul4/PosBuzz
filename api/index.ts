import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../backend/src/app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';

const server = express();
let app: any;

async function createNestServer() {
  const adapter = new ExpressAdapter(server);
  
  app = await NestFactory.create(AppModule, adapter, {
    logger: console,
  });
  
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  await app.init();
  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    await createNestServer();
  }
  return server(req, res);
}
