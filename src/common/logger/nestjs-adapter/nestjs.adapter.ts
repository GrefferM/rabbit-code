import { P } from "pino";
import { AsyncLocalStorage } from "async_hooks";
import { LoggerService } from "@nestjs/common";

import {
  isWrongExceptionsHandlerContract,
  stringifyNestedObject,
} from "./nestjs.helper";

export class NestJsLoggerAdapter implements LoggerService {
  private readonly contextName: string = "ctx";

  constructor(
    protected readonly logger: P.Logger,
    protected readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {
  }

  verbose(message: any, ...optionalParams: any[]): void {
    const store = this.asyncStorage.getStore();

    const trace = store?.get("trace") as string;
    const event = store?.get("event") as string;

    this.call("trace", message, { trace, event }, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    const store = this.asyncStorage.getStore();

    const trace = store?.get("trace") as string;
    const event = store?.get("event") as string;

    this.call("debug", message, { trace, event }, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]): void {
    const store = this.asyncStorage.getStore();

    const trace = store?.get("trace") as string;
    const event = store?.get("event") as string;

    this.call("info", message, { trace, event }, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    const store = this.asyncStorage.getStore();

    const trace = store?.get("trace") as string;
    const event = store?.get("event") as string;

    this.call("warn", message, { trace, event }, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    const store = this.asyncStorage.getStore();

    const trace = store?.get("trace") as string;
    const event = store?.get("event") as string;

    this.call("error", message, { trace, event }, ...optionalParams);
  }

  private call(
    level: P.Level,
    message: any,
    debug: Record<string, string>,
    ...optionalParams: any[]
  ): void {
    const objArg: Record<string, any> = { debug };

    let params: any[] = [];
    if (optionalParams.length !== 0) {
      objArg[this.contextName] = optionalParams[optionalParams.length - 1];
      params = optionalParams.slice(0, -1);
    }
    if (typeof message === "object") {
      if (message instanceof Error) {
        objArg.err = message;
        Object.assign(objArg, { data: {} });
        this.logger[level](objArg, message.message, ...params);
      } else {
        const messageLog = params.find((x) => x) || "empty";
        const data = stringifyNestedObject(message);
        Object.assign(objArg, { data });
        this.logger[level](objArg, messageLog, ...params);
      }
    } else if (isWrongExceptionsHandlerContract(level, message, params)) {
      objArg.err = new Error(message);
      const [stack] = params;
      objArg.err.stack = stack;
      this.logger[level](objArg);
    } else {
      Object.assign(objArg, { data: {} });
      this.logger[level](objArg, message, ...params);
    }
  }
}
