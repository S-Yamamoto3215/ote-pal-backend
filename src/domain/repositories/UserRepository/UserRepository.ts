import { Repository, DataSource } from "typeorm";

import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class UserRepository implements IUserRepository {
  private userRepo: Repository<User>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.userRepo = dataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async save(user: User): Promise<User> {
    try {
      const savedUser = await this.userRepo.save(user);
      return savedUser;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async saveWithFamily(user: User, family: Family): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedFamily = await queryRunner.manager.save(Family, family);

      user.familyId = savedFamily.id!;
      const savedUser = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppError("DatabaseError", "Failed to save user with family");
    } finally {
      await queryRunner.release();
    }
  }
}
