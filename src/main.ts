import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { LoggerService } from "./common/logger";
import { GlobalLoggingInterceptor } from "./common/interceptors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get<LoggerService>(LoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  app.enableCors();
  app.useGlobalInterceptors(new GlobalLoggingInterceptor(app.get(LoggerService)));
  app.useLogger(logger.getNestjsAdapter());
  app.setGlobalPrefix("api");

  await app.listen(3000);
}

(async () => await bootstrap())();
