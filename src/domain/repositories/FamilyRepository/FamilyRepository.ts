import { Repository, DataSource } from "typeorm";

import { Family } from "@/domain/entities/Family";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class FamilyRepository implements IFamilyRepository {
  private repo: Repository<Family>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Family);
  }

  async save(family: Family): Promise<Family> {
    try {
      const savedFamily = await this.repo.save(family);
      return savedFamily;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async findById(id: number): Promise<Family | null> {
    try {
      const family = await this.repo.findOneBy({ id });
      return family;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }
}
