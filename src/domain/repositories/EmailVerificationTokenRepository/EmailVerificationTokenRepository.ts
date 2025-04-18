import { Repository, DataSource } from "typeorm";

import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class EmailVerificationTokenRepository
  implements IEmailVerificationTokenRepository
{
  private repo: Repository<EmailVerificationToken>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(EmailVerificationToken);
  }

  async save(token: EmailVerificationToken): Promise<EmailVerificationToken> {
    try {
      return await this.repo.save(token);
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to save verification token");
    }
  }

  async findByToken(token: string): Promise<EmailVerificationToken | null> {
    try {
      return await this.repo.findOne({ where: { token } });
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to find verification token");
    }
  }

  async deleteByUserId(userId: number): Promise<void> {
    try {
      await this.repo.delete({ userId });
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to delete verification token");
    }
  }
}
