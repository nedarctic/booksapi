import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CustomResponseFilter } from './common/filters/custom-response.filter';
import { ResponseInterceptor } from './common/interceptors/response.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  app.useGlobalFilters(new CustomResponseFilter())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
