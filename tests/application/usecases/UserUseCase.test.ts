import { UserUseCase } from "@/application/usecases/UserUseCase/UserUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IMailService } from "@/application/services/MailService";
import { User } from "@/domain/entities/User";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { AppError } from "@/infrastructure/errors/AppError";

// テストヘルパーのインポート
import { createMockUser, createMockEmailVerificationToken } from "@tests/helpers/factories";

// Password クラスをモック化
jest.mock("@/domain/valueObjects/Password/Password", () => {
  return {
    Password: jest.fn().mockImplementation(() => {
      return {
        compare: jest.fn().mockResolvedValue(true),
        getValue: jest.fn().mockReturnValue("hashed_password"),
        getIsHashed: jest.fn().mockReturnValue(true),
      };
    }),
  };
});

// crypto をモック化してランダムトークン生成を制御
jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue("mock-token"),
  }),
}));

describe("UserUseCase", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let emailVerificationTokenRepository: jest.Mocked<IEmailVerificationTokenRepository>;
  let mailService: jest.Mocked<IMailService>;
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      saveWithFamily: jest.fn(),
      updateVerificationStatus: jest.fn(),
    };

    emailVerificationTokenRepository = {
      save: jest.fn(),
      findByToken: jest.fn(),
      deleteByUserId: jest.fn(),
    };

    mailService = {
      sendVerificationEmail: jest.fn(),
    };

    userUseCase = new UserUseCase(
      userRepository,
      emailVerificationTokenRepository,
      mailService,
    );
  });

  describe("createUser", () => {
    it("should create a new user when the email is not already in use", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "Parent" as "Parent" | "Child",
        isVerified: false,
        familyId: 1,
      };

      userRepository.findByEmail.mockResolvedValue(null);
      const mockUser = createMockUser({
        name: input.name,
        email: input.email,
        role: input.role,
        isVerified: input.isVerified,
        familyId: input.familyId
      });
      userRepository.save.mockResolvedValue(mockUser);

      const result = await userUseCase.createUser(input);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should throw a ValidationError if the email is already in use", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "Parent" as "Parent" | "Child",
        isVerified: false,
        familyId: 1,
      };

      userRepository.findByEmail.mockResolvedValue(createMockUser({
        name: input.name,
        email: input.email,
        role: input.role,
        isVerified: input.isVerified,
        familyId: input.familyId
      }));

      await expect(userUseCase.createUser(input)).rejects.toThrow(AppError);
      await expect(userUseCase.createUser(input)).rejects.toThrow(
        "User already exists",
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should propagate any unexpected errors", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "Parent" as "Parent" | "Child",
        isVerified: false,
        familyId: 1,
      };

      const unexpectedError = new Error("Unexpected database error");
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockRejectedValue(unexpectedError);

      await expect(userUseCase.createUser(input)).rejects.toThrow(
        unexpectedError,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe("createUserWithFamily", () => {
    it("should create a new user with a family when the email is not already in use", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        familyName: "Test Family",
      };

      userRepository.findByEmail.mockResolvedValue(null);
      const mockUser = {
        id: 1,
        name: input.name,
        email: input.email,
        role: "Parent",
        isVerified: false,
        familyId: 1,
      } as User;

      userRepository.saveWithFamily.mockResolvedValue(mockUser);
      const result = await userUseCase.createUserWithFamily(input);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.saveWithFamily).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should throw a ValidationError if the email is already in use", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        familyName: "Test Family",
      };

      userRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: input.name,
        email: input.email,
        role: "Parent",
        isVerified: false,
        familyId: null,
      } as User);

      await expect(userUseCase.createUserWithFamily(input)).rejects.toThrow(AppError);
      await expect(userUseCase.createUserWithFamily(input)).rejects.toThrow("User already exists");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.saveWithFamily).not.toHaveBeenCalled();
    });

    it("should propagate any unexpected errors", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        familyName: "Test Family",
      };

      const unexpectedError = new Error("Unexpected database error");
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.saveWithFamily.mockRejectedValue(unexpectedError);

      await expect(userUseCase.createUserWithFamily(input)).rejects.toThrow(unexpectedError);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.saveWithFamily).toHaveBeenCalled();
    });
  });

  describe("registerUser", () => {
    it("should register a new user and send verification email", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      userRepository.findByEmail.mockResolvedValue(null);

      const mockUser = {
        id: 1,
        name: input.name,
        email: input.email,
        role: "Parent",
        isVerified: false,
        familyId: null,
      } as User;

      userRepository.save.mockResolvedValue(mockUser);
      emailVerificationTokenRepository.save.mockResolvedValue(
        createMockEmailVerificationToken({
          token: "mock-token",
          userId: 1,
          isExpired: () => false
        })
      );
      mailService.sendVerificationEmail.mockResolvedValue();

      const result = await userUseCase.registerUser(input);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        input.email,
        input.name,
        "mock-token"
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw a ValidationError if the email is already in use", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      userRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: input.name,
        email: input.email,
        role: "Parent",
        isVerified: false,
        familyId: null,
      } as User);

      await expect(userUseCase.registerUser(input)).rejects.toThrow(AppError);
      await expect(userUseCase.registerUser(input)).rejects.toThrow("User already exists");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should propagate any unexpected errors during user creation", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const unexpectedError = new Error("Unexpected database error");
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockRejectedValue(unexpectedError);

      await expect(userUseCase.registerUser(input)).rejects.toThrow(unexpectedError);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    it("should verify the user email when a valid token is provided", async () => {
      const mockToken = "valid-token";
      const mockUserId = 1;
      const mockExpiresAt = new Date();
      mockExpiresAt.setHours(mockExpiresAt.getHours() + 1); // 1時間後

      const mockVerificationToken = createMockEmailVerificationToken({
        token: mockToken,
        expiresAt: mockExpiresAt,
        userId: mockUserId,
        isExpired: () => false
      });

      const mockUser = createMockUser({
        id: mockUserId,
        name: "Test User",
        email: "test@example.com",
        role: "Parent",
        isVerified: true, // 検証後はtrueになる
        familyId: null
      });

      emailVerificationTokenRepository.findByToken.mockResolvedValue(mockVerificationToken);
      userRepository.updateVerificationStatus.mockResolvedValue(mockUser);
      emailVerificationTokenRepository.deleteByUserId.mockResolvedValue();

      const result = await userUseCase.verifyEmail(mockToken);

      expect(emailVerificationTokenRepository.findByToken).toHaveBeenCalledWith(mockToken);
      expect(userRepository.updateVerificationStatus).toHaveBeenCalledWith(mockUserId, true);
      expect(emailVerificationTokenRepository.deleteByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUser);
      expect(result.isVerified).toBe(true);
    });

    it("should throw a ValidationError when an invalid token is provided", async () => {
      const mockToken = "invalid-token";

      emailVerificationTokenRepository.findByToken.mockResolvedValue(null);

      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow(AppError);
      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow("Invalid verification token");

      expect(emailVerificationTokenRepository.findByToken).toHaveBeenCalledWith(mockToken);
      expect(userRepository.updateVerificationStatus).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.deleteByUserId).not.toHaveBeenCalled();
    });

    it("should throw a ValidationError when the token has expired", async () => {
      const mockToken = "expired-token";
      const mockUserId = 1;
      const mockExpiresAt = new Date();
      mockExpiresAt.setHours(mockExpiresAt.getHours() - 1); // 1時間前（期限切れ）

      const mockVerificationToken = {
        id: 1,
        token: mockToken,
        expiresAt: mockExpiresAt,
        userId: mockUserId,
        isExpired: jest.fn().mockReturnValue(true), // 期限切れ
      } as unknown as EmailVerificationToken;

      emailVerificationTokenRepository.findByToken.mockResolvedValue(mockVerificationToken);
      emailVerificationTokenRepository.deleteByUserId.mockResolvedValue();

      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow(AppError);
      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow("Verification token has expired");

      expect(emailVerificationTokenRepository.findByToken).toHaveBeenCalledWith(mockToken);
      expect(emailVerificationTokenRepository.deleteByUserId).toHaveBeenCalledWith(mockUserId);
      expect(userRepository.updateVerificationStatus).not.toHaveBeenCalled();
    });
  });

  describe("resendVerificationEmail", () => {
    it("should resend verification email to an unverified user", async () => {
      const mockEmail = "test@example.com";
      const mockUser = createMockUser({
        id: 1,
        name: "Test User",
        email: mockEmail,
        role: "Parent",
        isVerified: false, // 未検証
        familyId: null
      });

      userRepository.findByEmail.mockResolvedValue(mockUser);
      emailVerificationTokenRepository.deleteByUserId.mockResolvedValue();
      emailVerificationTokenRepository.save.mockResolvedValue(
        createMockEmailVerificationToken({
          token: "mock-token",
          userId: mockUser.id,
          isExpired: () => false
        })
      );
      mailService.sendVerificationEmail.mockResolvedValue();

      await userUseCase.resendVerificationEmail(mockEmail);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailVerificationTokenRepository.deleteByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(emailVerificationTokenRepository.save).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        mockEmail,
        mockUser.name,
        "mock-token"
      );
    });

    it("should throw a ValidationError when the user does not exist", async () => {
      const mockEmail = "nonexistent@example.com";

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow(AppError);
      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow("User not found");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailVerificationTokenRepository.deleteByUserId).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should throw a ValidationError when the user is already verified", async () => {
      const mockEmail = "verified@example.com";
      const mockUser = createMockUser({
        id: 1,
        name: "Verified User",
        email: mockEmail,
        role: "Parent",
        isVerified: true, // 既に検証済み
        familyId: null
      });

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow(AppError);
      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow("User is already verified");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailVerificationTokenRepository.deleteByUserId).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });
});
