import { Controller, Post, Body, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { JwtService } from "../services";
import { RefreshTokenDto, RefreshTokenResponseDto } from "../dto";

@Controller("authorization")
@ApiTags("Authorization")
export class JWTController {
  constructor(private readonly jwtService: JwtService) {}

  @Post("refresh-token")
  @ApiResponse({ status: HttpStatus.OK, type: RefreshTokenResponseDto })
  public async verify(@Body() body: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const result = await this.jwtService.verify(body);
    return result;
  }
}
