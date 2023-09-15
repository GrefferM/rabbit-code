import { Injectable, Logger } from "@nestjs/common";
import { compare, genSalt, hash } from "bcrypt";
import { JwtDto, LoginUserDto, RegistrationUserDto } from "../dto";
import { ApplicationException } from "../../../common/exceptions";
import { JwtService } from "./jwt.service";
import { UserService } from "./user.service";

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginUserDto): Promise<JwtDto> {
    const { email, password } = data;

    const user = await this.userService.getUserBy({ email });
    if (!user) {
      throw new ApplicationException("NOT_EXISTS", "User not found");
    }

    if (!user.password) {
      throw new ApplicationException("NOT_ALLOWED", "User does not have a password");
    }

    const comparePasswords = await compare(password, user.password);

    if (!comparePasswords) {
      throw new ApplicationException("AUTH", "Wrong password or email");
    }

    const result = await this.jwtService.signIn(user);

    this.logger.log(`JWT succeed created: ${email}`);

    return result;
  }

  async registration(data: RegistrationUserDto): Promise<void> {
    const { email, password } = data;

    const isExist = await this.userService.getUserBy({ email });
    if (isExist) {
      throw new ApplicationException("ALREADY_EXISTS", "User already exists");
    }

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    await this.userService.createUser({
      email,
      password: hashPassword,
    });

    this.logger.log("User succeed created");
  }
}
