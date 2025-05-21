import { IUserRepository } from "@/domain/repositories/UserRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IMailService } from "@/application/services/MailService";
import { User } from "@/domain/entities/User";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { createMockUser, createMockEmailVerificationToken } from "@tests/helpers/factories";

export interface UserUseCaseMocks {
  userRepository: jest.Mocked<IUserRepository>;
  emailVerificationTokenRepository: jest.Mocked<IEmailVerificationTokenRepository>;
  mailService: jest.Mocked<IMailService>;
}

export const createUserUseCaseMocks = (): UserUseCaseMocks => {
  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    saveWithFamily: jest.fn(),
    updateVerificationStatus: jest.fn(),
  } as jest.Mocked<IUserRepository>;

  const emailVerificationTokenRepository = {
    save: jest.fn(),
    findByToken: jest.fn(),
    deleteByUserId: jest.fn(),
  } as jest.Mocked<IEmailVerificationTokenRepository>;

  const mailService = {
    sendVerificationEmail: jest.fn(),
  } as jest.Mocked<IMailService>;

  return {
    userRepository,
    emailVerificationTokenRepository,
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
