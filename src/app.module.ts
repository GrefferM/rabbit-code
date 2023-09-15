import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule } from "./common/config";
import { rootDbConfig } from "./common/database";
import { ApplicationExceptionFilter } from "./common/exceptions";
import { LoggerModule, LoggerMiddleware } from "./common/logger";

import { AppController } from "./app.controller";

import { UserModule } from "./modules/user";

@Module({
  imports: [LoggerModule, ConfigModule, TypeOrmModule.forRootAsync(rootDbConfig), UserModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApplicationExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
