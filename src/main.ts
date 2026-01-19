import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ensureDatabaseExists } from './database-init';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { LoggingInterceptor } from './common/logging.interceptor';
import { TenantConnectionInterceptor } from './tenancy/tenant-connection.interceptor';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    await ensureDatabaseExists();
  } catch (error) {
    logger.error('Failed to ensure database exists', error);
  }

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // For development. You can specify your frontend URL here instead.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);
  const dataSource = app.get(DataSource);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TenantConnectionInterceptor(dataSource));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
