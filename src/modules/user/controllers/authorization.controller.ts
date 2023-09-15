import { Controller, Post, Body, HttpStatus, HttpCode } from "@nestjs/common";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { AuthorizationService } from "../services";
import { LoginUserDto, RegistrationUserDto, JwtDto } from "../dto";

@Controller("authorization")
@ApiTags("Authorization")
export class AuthorizationController {
  constructor(private readonly userService: AuthorizationService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: JwtDto })
  public async authorizationLocal(@Body() body: LoginUserDto): Promise<JwtDto> {
    const result = await this.userService.login(body);
    return result;
  }

  @Post("registration")
  @ApiResponse({ status: HttpStatus.CREATED })
  public async registrationLocal(@Body() body: RegistrationUserDto): Promise<void> {
    await this.userService.registration(body);
  }
}
