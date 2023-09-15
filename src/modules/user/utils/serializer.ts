import { Injectable, Logger } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "../services";
import { ApplicationException } from "../../../common/exceptions";
import { UserEntity } from "../../../common/database/entities";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger(SessionSerializer.name);

  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(payload: UserEntity, done: any) {
    this.logger.log(`User ${payload.id} serialize succeed`);

    done(null, { id: payload.id, email: payload.email });
  }

  async deserializeUser(payload: UserEntity, done: any) {
    try {
      const user = await this.userService.getUserBy({ id: payload.id });

      if (!user) {
        throw new ApplicationException("NOT_EXISTS", "User not found");
      }

      done(null, user);
    } catch (err) {
      this.logger.error(`Failed deserialize user: ${JSON.stringify(err)}`);

      done(err, null);
    }
  }
}
