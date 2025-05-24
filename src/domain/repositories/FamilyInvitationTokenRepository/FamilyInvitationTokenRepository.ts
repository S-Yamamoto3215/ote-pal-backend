import { Repository, DataSource } from "typeorm";

import { FamilyInvitationToken } from "@/domain/entities/FamilyInvitationToken";
import { IFamilyInvitationTokenRepository } from "@/domain/repositories/FamilyInvitationTokenRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class FamilyInvitationTokenRepository
  implements IFamilyInvitationTokenRepository
{
  private repo: Repository<FamilyInvitationToken>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(FamilyInvitationToken);
  }

  async save(invitationToken: FamilyInvitationToken): Promise<FamilyInvitationToken> {
    try {
      return await this.repo.save(invitationToken);
    } catch (error) {
      throw new AppError("DatabaseError", "招待トークンの保存に失敗しました");
    }
  }

  async findByToken(token: string): Promise<FamilyInvitationToken | null> {
    try {
      return await this.repo.findOne({ where: { token } });
    } catch (error) {
      throw new AppError("DatabaseError", "招待トークンの検索に失敗しました");
    }
  }

  async findByEmail(email: string, familyId: number): Promise<FamilyInvitationToken | null> {
    try {
      return await this.repo.findOne({ where: { email, familyId } });
    } catch (error) {
      throw new AppError("DatabaseError", "招待トークンの検索に失敗しました");
    }
  }

  async deleteByToken(token: string): Promise<void> {
    try {
      await this.repo.delete({ token });
    } catch (error) {
      throw new AppError("DatabaseError", "招待トークンの削除に失敗しました");
    }
  }

  async deleteByEmail(email: string, familyId: number): Promise<void> {
    try {
      await this.repo.delete({ email, familyId });
    } catch (error) {
      throw new AppError("DatabaseError", "招待トークンの削除に失敗しました");
    }
  }
}
