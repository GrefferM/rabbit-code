import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { UserEntity } from "../../../common/database/entities";
import { CreateUserDto, GetUserByDto } from "../dto";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const entity = this.userRepository.create(data);
    const result = await this.userRepository.save(entity);

    return result;
  }

  async getUserBy(data: FindOptionsWhere<GetUserByDto>): Promise<UserEntity> {
    const result = await this.userRepository.findOneBy(data);
    return result;
  }
}
