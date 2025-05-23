import { FamilyRepository } from "@/domain/repositories/FamilyRepository";
import { AppDataSource } from "@/infrastructure/database/dataSource";

export class FamilyRepositoryFactory {
  static create(): FamilyRepository {
    return new FamilyRepository(AppDataSource);
  }
}
