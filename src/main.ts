import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const appPort = process.env.PORT || 3000;
  await app.listen(3000);
  logger.log(`Application is running on port ${appPort}`);
}
bootstrap();
