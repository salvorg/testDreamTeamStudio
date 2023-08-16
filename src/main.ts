import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

interface ValidationErrors {
  [key: string]: string[];
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors: ValidationErrors = {};

        errors.forEach((error) => {
          const constraints = error.constraints;

          if (constraints) {
            validationErrors[error.property] = Object.keys(constraints).map(
              (key) => constraints[key],
            );
          }
        });

        return new BadRequestException(validationErrors);
      },
    }),
  );

  await app.listen(8000);
}
bootstrap();
