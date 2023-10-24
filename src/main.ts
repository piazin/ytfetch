import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });
  app.enableCors({
    origin: '*',
  });
  await app.listen(3000);
}
bootstrap();
