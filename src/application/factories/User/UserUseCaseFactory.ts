import { UserUseCase } from "@/application/usecases/UserUseCase";
import { UserRepositoryFactory } from "@/application/factories/User/UserRepositoryFactory";
import { EmailVerificationTokenRepositoryFactory } from "@/application/factories/EmailVerificationToken/EmailVerificationTokenRepositoryFactory";
import { FamilyInvitationTokenRepositoryFactory } from "@/application/factories/FamilyInvitationToken/FamilyInvitationTokenRepositoryFactory";
import { FamilyRepositoryFactory } from "@/application/factories/Family/FamilyRepositoryFactory";
import { MailServiceFactory } from "@/application/factories/MailService/MailServiceFactory";

export class UserUseCaseFactory {
  static create(): UserUseCase {
    const userRepository = UserRepositoryFactory.create();
    const verificationTokenRepository = EmailVerificationTokenRepositoryFactory.create();
    const invitationRepository = FamilyInvitationTokenRepositoryFactory.create();
    const familyRepository = FamilyRepositoryFactory.create();
    const mailService = MailServiceFactory.create();

    return new UserUseCase(
      userRepository,
      verificationTokenRepository,
      invitationRepository,
      familyRepository,
      mailService
    );
  }
}
