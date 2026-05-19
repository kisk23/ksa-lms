import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  // Cookie parser — required by RtStrategy to read the refresh_token cookie
  app.use(cookieParser());

  // Global exception filter — handles Prisma + HTTP errors uniformly
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response interceptor — wraps non-@Res() endpoints in { success, data, timestamp }
  // Note: endpoints using @Res() directly (login, refresh, logout) bypass this automatically
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global prefix
  const prefix = config.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(prefix);

  // Global validation pipe (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS — credentials required for HttpOnly cookie auth
  const webOrigin = config.get<string>('WEB_ORIGIN', 'http://localhost:3000');
  const adminOrigin = config.get<string>('ADMIN_ORIGIN', 'http://localhost:3001');
  app.enableCors({
    origin: [webOrigin, adminOrigin],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('Learning Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('access_token')
    .addCookieAuth('refresh_token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('API_PORT', 4000);
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/${prefix}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
