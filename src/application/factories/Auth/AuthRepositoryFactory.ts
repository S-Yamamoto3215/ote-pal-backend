import { UserRepository } from "@/domain/repositories/UserRepository";
import { AppDataSource } from "@/infrastructure/database/dataSource";

export class AuthRepositoryFactory {
  static create(): UserRepository {
    return new UserRepository(AppDataSource);
  }
}
