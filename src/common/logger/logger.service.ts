import { AsyncLocalStorage } from "async_hooks";
import { Inject, Injectable, LoggerService as NestjsLoggerInterface } from "@nestjs/common";
import { P, pino, TransportSingleOptions } from "pino";

import { NestJsLoggerAdapter } from "./nestjs-adapter";
import { ALS_TOKEN } from "./logger.async_hooks-inject-token";

@Injectable()
export class LoggerService {
  private readonly pino: P.Logger;

  constructor(
    @Inject(ALS_TOKEN)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {
    const pinoPretty: TransportSingleOptions = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: true,
        messageKey: "message",
        singleLine: true,
      },
    };

    this.pino = pino({
      customLevels: { transport: 25 },
      messageKey: "message",
      transport: pinoPretty,
    });
  }

  get instance(): P.Logger {
    return this.pino;
  }

  get ALS(): AsyncLocalStorage<Map<string, string>> {
    return this.asyncStorage;
  }

  public getNestjsAdapter(): NestjsLoggerInterface {
    return new NestJsLoggerAdapter(this.pino, this.asyncStorage);
  }
}
