import { NestMiddleware, Logger, HttpStatus } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  public async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { method, originalUrl: url } = request;

    const createdAt = Date.now();

    response.on("finish", () => {
      const { statusCode } = response;

      const duration = Date.now() - createdAt;

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(`[${method}] ${statusCode} - ${url} ${duration}ms`);
        return;
      }

      if (statusCode >= HttpStatus.BAD_REQUEST) {
        this.logger.warn(`[${method}] ${statusCode} - ${url} ${duration}ms`);
        return;
      }

      this.logger.log(`[${method}] ${statusCode} - ${url} ${duration}ms`);
    });

    next();
  }
}
