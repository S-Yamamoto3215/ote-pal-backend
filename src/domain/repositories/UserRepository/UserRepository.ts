import { Repository, DataSource } from "typeorm";

import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class UserRepository implements IUserRepository {
  private repo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.repo.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async save(user: User): Promise<User> {
    try {
      const savedUser = await this.repo.save(user);
      return savedUser;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }
}
