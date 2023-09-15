import { ValueProvider } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { ALS_TOKEN } from "./logger.async_hooks-inject-token";

export const asyncStorageProvider: ValueProvider<AsyncLocalStorage<Map<string, string>>> = {
  provide: ALS_TOKEN,
  useValue: new AsyncLocalStorage(),
};
