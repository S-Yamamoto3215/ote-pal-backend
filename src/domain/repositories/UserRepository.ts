import { User } from "../entities/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../../infrastructure/database/ormconfig";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}
