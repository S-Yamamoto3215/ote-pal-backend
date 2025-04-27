import { Repository, DataSource } from "typeorm";

import { Family } from "@/domain/entities/Family";
import { User } from "@/domain/entities/User";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class FamilyRepository implements IFamilyRepository {
  private familyRepo: Repository<Family>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.familyRepo = dataSource.getRepository(Family);
  }

  async save(family: Family, user: User): Promise<Family> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedFamily = await queryRunner.manager.save(Family, family);

      user.familyId = savedFamily.id!;
      await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();

      return savedFamily;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppError("DatabaseError", "Failed to save family with user");
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: number): Promise<Family | null> {
    try {
      const family = await this.familyRepo.findOneBy({ id });
      return family;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.familyRepo.delete(id);
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }
}
