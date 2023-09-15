import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { ConfigService } from "../../config";
import { TypeormNamingStrategy } from "./typeorm-naming-strategy";
import { UserEntity } from "../entities";

export const rootDbConfig = {
  useFactory: (config: ConfigService) => ({
    type: "postgres",
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    ssl: config.db.postgresUseSsl
      ? {
          rejectUnauthorized: false,
        }
      : false,
    synchronize: false,
    entities: [UserEntity],
    namingStrategy: new TypeormNamingStrategy(),
    extra: {
      max: 60,
    },
  }),
  inject: [ConfigService],
} as TypeOrmModuleAsyncOptions;
