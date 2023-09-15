import { Transform } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class PaginationDto {
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
