import { Injectable } from "@nestjs/common";

import { AbstractConfig } from "./abstract-config";

@Injectable()
export class ConfigService extends AbstractConfig {
  public readonly logger = {
    logLevel: this.getString("LOG_LEVEL", "info"),
  };

  public readonly db = {
    host: this.getString("DB_HOST", "localhost"),
    port: this.getNumber("DB_PORT", 5432),
    user: this.getString("DB_USER", "user"),
    pass: this.getString("DB_PASS", "pass"),
    name: this.getString("DB_NAME", "postgres"),

    postgresUseSsl: this.getBoolean("DB_USE_SSL", false),
    sslCerts: this.getString("DB_SSL_CERTS", ""),
  };
}
