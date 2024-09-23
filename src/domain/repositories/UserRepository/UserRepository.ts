import { Repository, DataSource } from "typeorm";

import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class UserRepository implements IUserRepository {
  private repo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }

  async save(user: User): Promise<User> {
    try {
      return this.repo.save(user);
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to save user");
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return this.repo.findOneBy({ id });
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to find user");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.repo.findOneBy({ email });
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to find user");
    }
  }

  async findAllByFamilyId(familyId: number): Promise<User[]> {
    try {
      return this.repo.find({ where: { familyId } });
    } catch (error) {
      throw new AppError("DatabaseError", "failed to find users");
    }
  }

  async delete(userId: number): Promise<void> {
    try {
      await this.repo.delete(userId);
    } catch (error) {
      throw new AppError("DatabaseError", "failed to delete user");
    }
  }
}
