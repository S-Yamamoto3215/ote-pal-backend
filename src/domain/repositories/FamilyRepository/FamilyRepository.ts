import { Repository, DataSource } from "typeorm";

import { Family } from "@/domain/entities/Family";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class FamilyRepository implements IFamilyRepository {
  private repo: Repository<Family>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Family);
  }

  // Implement the methods from IRepository here. e.x) save method
  // async save(family: Family): Promise<Family> {
  //   try {
  //     family.validate();
  //     return this.repo.save(family);
  //   } catch (error) {
  //     throw new AppError("DatabaseError", "Failed to save family");
  //   }
  // }
}
