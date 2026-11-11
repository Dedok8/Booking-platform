import { AppModule } from '@/app.module.js';
import { Env } from '@/core/config/validation/env.validation.js';
import { AllExceptionsFilter } from '@/shared/filters/all.exceptions.filter.js';
import { MikroORM } from '@mikro-orm/core';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.get(MikroORM).migrator.up();
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  app.set('trust proxy', config.get('TRUST_PROXY', { infer: true }));
  app.use(helmet());
  app.enableCors({
    origin: config.get('FRONTEND_URL', { infer: true }),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('StoneProductShop API')
      .setDescription('Backend API for natural stone e-commerce')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  if (process.env.STORAGE_DRIVER !== 's3') {
    app.useStaticAssets(path.resolve(process.env.UPLOADS_DIR ?? './uploads'), {
      prefix: '/uploads',
    });
  }

  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
