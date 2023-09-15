import {
  ArgumentsHost,
  Catch,
  Injectable,
  Logger,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

import { ApplicationException } from "./application-exception";
import { ApplicationExceptionType } from "./application-exception.type";

@Catch(ApplicationException)
@Injectable()
export class ApplicationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  private readonly map: Map<ApplicationExceptionType, (message: string) => HttpException>;

  constructor() {
    this.map = new Map<ApplicationExceptionType, (message: string) => HttpException>([
      ["ALREADY_EXISTS", (message) => new ConflictException(message)],
      ["NOT_EXISTS", (message) => new NotFoundException(message)],
      ["UNKNOWN", () => new InternalServerErrorException("Internal error")],
      ["VALIDATION", (message) => new BadRequestException(message)],
      ["NOT_ALLOWED", (message) => new ForbiddenException(message)],
      ["AUTH", (message) => new UnauthorizedException(message)],
      ["BAD_REQUEST", (message) => new BadRequestException(message)],
      ["TO_MANY_REQUESTS", (message) => new HttpException(message, 429)],
      ["EXTERNAL_API_ERROR", (message) => new UnprocessableEntityException(message)],
    ]);
  }

  private inspect(category: ApplicationExceptionType, message: string): HttpException {
    const error = this.map.get(category);
    if (!error) {
      return new InternalServerErrorException("unknown error");
    }

    return error(message);
  }

  catch(exception: ApplicationException<ApplicationExceptionType, Record<string, any>>, host: ArgumentsHost): void {
    const { message, category } = exception;
    const httpError = this.inspect(category, message);
    const response = host.switchToHttp().getResponse<Response>();

    if (httpError.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`HTTP -> ${message}`);
    }

    if (httpError.getStatus() >= HttpStatus.BAD_REQUEST && httpError.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.warn(`HTTP -> ${message}`);
    }

    response
      .status(httpError.getStatus())
      .json({
        success: false,
        category,
        status: httpError.getStatus(),
        message,
      })
      .end();
  }
}
