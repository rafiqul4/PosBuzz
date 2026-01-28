import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure allowed CORS origins from environment (comma-separated)
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  
  // Enable CORS with restricted origins
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (e.g., curl, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      // In development, allow all origins if CORS_ORIGINS is not set
      if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'development') {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  
  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
