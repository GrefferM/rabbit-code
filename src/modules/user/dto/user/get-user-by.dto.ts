import { IsEmail, IsOptional, IsUUID } from "class-validator";

export class GetUserByDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
