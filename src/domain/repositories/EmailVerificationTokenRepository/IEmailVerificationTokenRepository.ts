import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";

export interface IEmailVerificationTokenRepository {
  save(emailVerificationToken: EmailVerificationToken): Promise<EmailVerificationToken>;
  findByToken(token: string): Promise<EmailVerificationToken | null>;
  deleteByUserId(userId: number): Promise<void>;
}
