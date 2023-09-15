import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import expressBasicAuth = require("express-basic-auth");
import * as session from "express-session";
import * as passport from "passport";

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

  app.use(
    session({
      secret: "1&eTvzRueQ214wum*04POVIhrDE6LSC1",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    "/docs",
    expressBasicAuth({
      challenge: true,
      users: {
        admin: process.env.SWAGGER_PW,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle("rabbit-code")
    .setDescription("The rabbit-code.core API description")
    .setVersion("1.0")
    .addTag("rabbit-code")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" }, "Auth")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}

(async () => await bootstrap())();
