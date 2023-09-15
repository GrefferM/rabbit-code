import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from "../config";
import { ApplicationException } from "../exceptions";

@Injectable()
export class AuthorizationBearerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ApplicationException("AUTH", "Missing token");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.jwt.accessSecret,
      });

      request.user = payload;
    } catch {
      throw new ApplicationException("AUTH", "Token not valid");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
