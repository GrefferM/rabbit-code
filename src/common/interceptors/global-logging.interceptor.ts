import { randomUUID } from "crypto";
import { AsyncLocalStorage } from "async_hooks";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";
import { tap } from "rxjs/operators";
import { P } from "pino";

import { LoggerService } from "../logger";
import { ApplicationException } from "../exceptions";

const contextTitle = "app-gateway_interceptor";

@Injectable()
export class GlobalLoggingInterceptor implements NestInterceptor {
  private readonly logger: P.Logger;
  private readonly ALS: AsyncLocalStorage<Map<string, string>>;

  constructor(loggerService: LoggerService) {
    this.logger = loggerService.instance;
    this.ALS = loggerService.ALS;
  }

  /*
   *Global interceptor uses async_hooks for storing context in async storage
   *There are no any possibilities to use .run() method now.
   *The NestJs does not have middlewares for microservices. And interceptor can return only next handler.
   *https://github.com/nestjs/nest/issues/1627
   *Warning with current case: It is not prefer use async context into guards because they are used before interceptors
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const trace = randomUUID();
    const timestamp = Date.now();
    const fnName = context.getHandler().name;

    const store = new Map<string, string>().set("trace", trace).set("event", fnName);
    const debug = { trace, fnName };
    this.logger.info({ debug, ctx: contextTitle }, `START HANDLE IN FUNCTION-> ${fnName}`);

    this.ALS.enterWith(store);

    return next.handle().pipe(
      tap(() =>
        this.logger.info({ ctx: contextTitle, endTimeMs: Date.now() - timestamp }, `FINISH HANDLE IN FUNCTION-> ${fnName}`),
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catchError((err: ApplicationException<unknown>, caught) => {
        const { message, code, stack, category, details } = err;

        this.logger.error(
          {
            ctx: contextTitle,
            endTimeMs: Date.now() - timestamp,
            error: { message, code, stack, category, details },
          },
          `ERROR HANDLE IN FUNCTION-> ${fnName}`,
        );

        return throwError(() => err);
      }),
    );
  }
}
