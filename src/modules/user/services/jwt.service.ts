import { Injectable, Logger } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { ApplicationException } from "../../../common/exceptions";
import { ConfigService } from "../../../common/config";
import { UserEntity } from "../../../common/database/entities";
import { UserService } from "./user.service";
import { JwtDto, RefreshTokenDto, RefreshTokenResponseDto } from "../dto";

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async verify(data: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = data;

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.jwt.refreshSecret,
      });
    } catch {
      throw new ApplicationException("AUTH", "Token not valid");
    }

    const user = await this.userService.getUserBy({ id: payload.sub });
    if (!user) {
      throw new ApplicationException("NOT_EXISTS", "User not found");
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: this.configService.jwt.accessSecret,
        expiresIn: this.configService.jwt.accessLifeTime,
      },
    );

    this.logger.log(`JWT succeed refreshed: ${user.email}`);

    return {
      accessToken,
    };
  }

  async signIn(user: UserEntity): Promise<JwtDto> {
    if (!user) {
      throw new ApplicationException("BAD_REQUEST", "User empty");
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: this.configService.jwt.accessSecret,
        expiresIn: this.configService.jwt.accessLifeTime,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: this.configService.jwt.refreshSecret,
        expiresIn: this.configService.jwt.refreshLifeTime,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
