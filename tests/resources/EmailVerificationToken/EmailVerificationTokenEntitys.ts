import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";

export const testEmailVerificationToken1 = new EmailVerificationToken(
  "TestToken1",
  new Date(),
  1
);

export const testEmailVerificationToken2 = new EmailVerificationToken(
  "TestToken2",
  new Date(),
  20
);
