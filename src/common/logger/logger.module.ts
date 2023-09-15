import { Global, Module } from "@nestjs/common";
import { asyncStorageProvider } from "./async-storage.provider";

import { ALS_TOKEN } from "./logger.async_hooks-inject-token";
import { LoggerService } from "./logger.service";

@Global()
@Module({
  providers: [LoggerService, asyncStorageProvider],
  exports: [LoggerService, ALS_TOKEN],
})
export class LoggerModule {}
