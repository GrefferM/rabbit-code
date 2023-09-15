import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../common/database/entities";
import { SessionSerializer } from "./utils";
import { JwtService, UserService, AuthorizationService } from "./services";
import { JWTController, AuthorizationController } from "./controllers";

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [SessionSerializer, JwtService, UserService, AuthorizationService],
  controllers: [JWTController, AuthorizationController],
})
export class UserModule {}
