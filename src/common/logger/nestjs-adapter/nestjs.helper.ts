import { P } from "pino";

export const stringifyNestedObject = (
  obj: Record<string, unknown>,
): Record<string, string> => {
  const stringified: Record<string, string> = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = obj[key];
    if (!value) stringified[key] = "null";
    if (typeof value === "string") stringified[key] = value;
    if (typeof value === "object") stringified[key] = JSON.stringify(value);
    stringified[key] = `${value}`;
  }
  return stringified;
};

export const isWrongExceptionsHandlerContract = (
  level: P.Level,
  message: any,
  params: any[],
): params is [string] =>
  level === "error" &&
  typeof message === "string" &&
  params.length === 1 &&
  typeof params[0] === "string" &&
  /\n\s*at /.test(params[0]);
