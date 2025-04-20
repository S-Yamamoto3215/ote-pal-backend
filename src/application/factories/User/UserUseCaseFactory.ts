import { UserUseCase } from "@/application/usecases/UserUseCase";
import { UserRepositoryFactory } from "@/application/factories/User/UserRepositoryFactory";
import { EmailVerificationTokenRepositoryFactory } from "@/application/factories/EmailVerificationToken/EmailVerificationTokenRepositoryFactory";
import { MailServiceFactory } from "@/application/factories/MailService/MailServiceFactory";

export class UserUseCaseFactory {
  static create(): UserUseCase {
    const userRepository = UserRepositoryFactory.create();
    const verificationTokenRepository = EmailVerificationTokenRepositoryFactory.create();
    const mailService = MailServiceFactory.create();

    return new UserUseCase(
      userRepository,
      verificationTokenRepository,
      mailService
    );
  }
}
