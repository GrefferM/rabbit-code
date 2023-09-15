import { IApplicationException } from "./application-exception.interface";
import { ApplicationExceptionType } from "./application-exception.type";

export class ApplicationException<D, C = string> extends Error implements IApplicationException<D, C> {
  category: ApplicationExceptionType;
  code: C;
  details: D;
  constructor(category: ApplicationExceptionType, message: string) {
    super(message);
    this.category = category || "UNKNOWN";
  }
}
