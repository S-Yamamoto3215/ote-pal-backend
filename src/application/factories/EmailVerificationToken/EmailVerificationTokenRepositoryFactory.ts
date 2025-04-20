import { EmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { AppDataSource } from "@/infrastructure/database/dataSource";

export class EmailVerificationTokenRepositoryFactory {
  static create(): EmailVerificationTokenRepository {
    return new EmailVerificationTokenRepository(AppDataSource);
  }
}
