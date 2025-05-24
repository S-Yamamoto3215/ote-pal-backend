import { FamilyInvitationTokenRepository } from "@/domain/repositories/FamilyInvitationTokenRepository";
import { AppDataSource } from "@/infrastructure/database/dataSource";

export class FamilyInvitationTokenRepositoryFactory {
  static create(): FamilyInvitationTokenRepository {
    return new FamilyInvitationTokenRepository(AppDataSource);
  }
}
