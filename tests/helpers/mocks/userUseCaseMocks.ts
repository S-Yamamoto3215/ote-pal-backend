import { IUserRepository } from "@/domain/repositories/UserRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IFamilyInvitationTokenRepository } from "@/domain/repositories/FamilyInvitationTokenRepository";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IMailService } from "@/application/services/MailService";
import { User } from "@/domain/entities/User";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { createMockUser, createMockEmailVerificationToken } from "@tests/helpers/factories";

export interface UserUseCaseMocks {
  userRepository: jest.Mocked<IUserRepository>;
  emailVerificationTokenRepository: jest.Mocked<IEmailVerificationTokenRepository>;
  familyInvitationTokenRepository: jest.Mocked<IFamilyInvitationTokenRepository>;
  familyRepository: jest.Mocked<IFamilyRepository>;
  mailService: jest.Mocked<IMailService>;
}

export const createUserUseCaseMocks = (): UserUseCaseMocks => {
  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    saveWithFamily: jest.fn(),
    updateVerificationStatus: jest.fn(),
    findByFamilyId: jest.fn(),
  } as jest.Mocked<IUserRepository>;

  const emailVerificationTokenRepository = {
    save: jest.fn(),
    findByToken: jest.fn(),
    deleteByUserId: jest.fn(),
  } as jest.Mocked<IEmailVerificationTokenRepository>;

  const familyInvitationTokenRepository = {
    save: jest.fn(),
    findByToken: jest.fn(),
    findByEmail: jest.fn(),
    deleteByToken: jest.fn(),
    deleteByEmail: jest.fn(),
  } as jest.Mocked<IFamilyInvitationTokenRepository>;

  const familyRepository = {
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<IFamilyRepository>;

  const mailService = {
    sendVerificationEmail: jest.fn(),
    sendFamilyInvitationEmail: jest.fn(),
  } as jest.Mocked<IMailService>;

  return {
    userRepository,
    emailVerificationTokenRepository,
    familyInvitationTokenRepository,
    familyRepository,
    mailService,
  };
};

// よく使われるシナリオのセットアップヘルパー
export const setupUserExistsScenario = (
  mocks: UserUseCaseMocks,
  userOverrides: Partial<User> = {}
): User => {
  const mockUser = createMockUser(userOverrides);
  mocks.userRepository.findByEmail.mockResolvedValue(mockUser);
  return mockUser;
};

export const setupUserNotExistsScenario = (
  mocks: UserUseCaseMocks
): void => {
  mocks.userRepository.findByEmail.mockResolvedValue(null);
};

export const setupUserCreatedSuccessfullyScenario = (
  mocks: UserUseCaseMocks,
  userOverrides: Partial<User> = {}
): User => {
  const mockUser = createMockUser(userOverrides);
  mocks.userRepository.findByEmail.mockResolvedValue(null);
  mocks.userRepository.save.mockResolvedValue(mockUser);
  return mockUser;
};

export const setupVerificationTokenScenario = (
  mocks: UserUseCaseMocks,
  tokenOverrides: Partial<EmailVerificationToken> = {},
  userOverrides: Partial<User> = {}
): { token: EmailVerificationToken, user: User } => {
  const mockUser = createMockUser(userOverrides);
  const mockToken = createMockEmailVerificationToken({
    userId: mockUser.id,
    ...tokenOverrides
  });

  mocks.emailVerificationTokenRepository.findByToken.mockResolvedValue(mockToken);
  mocks.userRepository.findById.mockResolvedValue(mockUser);

  return { token: mockToken, user: mockUser };
};
