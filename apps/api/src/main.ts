import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global prefix
  const prefix = config.get<string>('API_PREFIX', '/api/v1');
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

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // web
      'http://localhost:3001', // admin
    ],
    credentials: true,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('Learning Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('API_PORT', 4000);
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}${prefix}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
