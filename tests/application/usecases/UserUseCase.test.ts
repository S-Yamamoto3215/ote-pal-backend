import { UserUseCase } from "@/application/usecases/UserUseCase/UserUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IMailService } from "@/application/services/MailService";
import { User } from "@/domain/entities/User";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { AppError } from "@/infrastructure/errors/AppError";

import { createMockUser, createMockEmailVerificationToken } from "@tests/helpers/factories";

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
    const validInput = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "Parent" as "Parent" | "Child",
      isVerified: false,
      familyId: 1,
    };

    it("should create a new user when the email is not already in use", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      const mockUser = createMockUser({
        name: validInput.name,
        email: validInput.email,
        role: validInput.role,
        isVerified: validInput.isVerified,
        familyId: validInput.familyId
      });
      userRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await userUseCase.createUser(validInput);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should throw AppError with 'User already exists' message when email is already in use", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(createMockUser({
        name: validInput.name,
        email: validInput.email,
        role: validInput.role,
        isVerified: validInput.isVerified,
        familyId: validInput.familyId
      }));

      // Act & Assert
      await expect(userUseCase.createUser(validInput)).rejects.toThrow(AppError);
      await expect(userUseCase.createUser(validInput)).rejects.toThrow(
        "User already exists",
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should propagate unexpected errors when database operation fails", async () => {
      // Arrange
      const unexpectedError = new Error("Unexpected database error");
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(userUseCase.createUser(validInput)).rejects.toThrow(
        unexpectedError,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe("createUserWithFamily", () => {
    const validInput = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      familyName: "Test Family",
    };

    it("should create a new user with a family when the email is not already in use", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      const mockUser = createMockUser({
        id: 1,
        name: validInput.name,
        email: validInput.email,
        role: "Parent",
        isVerified: false,
        familyId: 1,
      });

      userRepository.saveWithFamily.mockResolvedValue(mockUser);

      // Act
      const result = await userUseCase.createUserWithFamily(validInput);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.saveWithFamily).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should throw AppError with 'User already exists' message when email is already in use", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(createMockUser({
        id: 1,
        name: validInput.name,
        email: validInput.email,
        role: "Parent",
        isVerified: false,
        familyId: null,
      }));

      // Act & Assert
      await expect(userUseCase.createUserWithFamily(validInput)).rejects.toThrow(AppError);
      await expect(userUseCase.createUserWithFamily(validInput)).rejects.toThrow("User already exists");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.saveWithFamily).not.toHaveBeenCalled();
    });

    it("should propagate unexpected errors when database operation fails", async () => {
      // Arrange
      const unexpectedError = new Error("Unexpected database error");
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.saveWithFamily.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(userUseCase.createUserWithFamily(validInput)).rejects.toThrow(unexpectedError);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.saveWithFamily).toHaveBeenCalled();
    });
  });

  describe("registerUser", () => {
    const validInput = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    it("should successfully register a new user and send verification email when valid input is provided", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      const mockUser = createMockUser({
        id: 1,
        name: validInput.name,
        email: validInput.email,
        role: "Parent",
        isVerified: false,
        familyId: null,
      });

      userRepository.save.mockResolvedValue(mockUser);
      emailVerificationTokenRepository.save.mockResolvedValue(
        createMockEmailVerificationToken({
          token: "mock-token",
          userId: 1,
          isExpired: () => false
        })
      );
      mailService.sendVerificationEmail.mockResolvedValue();

      // Act
      const result = await userUseCase.registerUser(validInput);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        validInput.email,
        validInput.name,
        "mock-token"
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw AppError with 'User already exists' message when email is already in use", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(createMockUser({
        id: 1,
        name: validInput.name,
        email: validInput.email,
        role: "Parent",
        isVerified: false,
        familyId: null,
      }));

      // Act & Assert
      await expect(userUseCase.registerUser(validInput)).rejects.toThrow(AppError);
      await expect(userUseCase.registerUser(validInput)).rejects.toThrow("User already exists");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should propagate unexpected errors when database operation fails during user creation", async () => {
      // Arrange
      const unexpectedError = new Error("Unexpected database error");
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(userUseCase.registerUser(validInput)).rejects.toThrow(unexpectedError);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    it("should successfully verify the user email when a valid and non-expired token is provided", async () => {
      // Arrange
      const mockToken = "valid-token";
      const mockUserId = 1;
      const mockExpiresAt = new Date();
      mockExpiresAt.setHours(mockExpiresAt.getHours() + 1); // 1時間後（有効）

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

      // Act
      const result = await userUseCase.verifyEmail(mockToken);

      // Assert
      expect(emailVerificationTokenRepository.findByToken).toHaveBeenCalledWith(mockToken);
      expect(userRepository.updateVerificationStatus).toHaveBeenCalledWith(mockUserId, true);
      expect(emailVerificationTokenRepository.deleteByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUser);
      expect(result.isVerified).toBe(true);
    });

    it("should throw AppError with 'Invalid verification token' message when token is not found", async () => {
      // Arrange
      const mockToken = "invalid-token";
      emailVerificationTokenRepository.findByToken.mockResolvedValue(null);

      // Act & Assert
      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow(AppError);
      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow("Invalid verification token");

      expect(emailVerificationTokenRepository.findByToken).toHaveBeenCalledWith(mockToken);
      expect(userRepository.updateVerificationStatus).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.deleteByUserId).not.toHaveBeenCalled();
    });

    it("should throw AppError with 'Verification token has expired' message when token is expired", async () => {
      // Arrange
      const mockToken = "expired-token";
      const mockUserId = 1;
      const mockExpiresAt = new Date();
      mockExpiresAt.setHours(mockExpiresAt.getHours() - 1); // 1時間前（期限切れ）

      const mockVerificationToken = createMockEmailVerificationToken({
        id: 1,
        token: mockToken,
        expiresAt: mockExpiresAt,
        userId: mockUserId,
        isExpired: () => true, // 期限切れ
      });

      emailVerificationTokenRepository.findByToken.mockResolvedValue(mockVerificationToken);
      emailVerificationTokenRepository.deleteByUserId.mockResolvedValue();

      // Act & Assert
      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow(AppError);
      await expect(userUseCase.verifyEmail(mockToken)).rejects.toThrow("Verification token has expired");

      expect(emailVerificationTokenRepository.findByToken).toHaveBeenCalledWith(mockToken);
      expect(emailVerificationTokenRepository.deleteByUserId).toHaveBeenCalledWith(mockUserId);
      expect(userRepository.updateVerificationStatus).not.toHaveBeenCalled();
    });
  });

  describe("resendVerificationEmail", () => {
    it("should successfully resend verification email when unverified user exists", async () => {
      // Arrange
      const mockEmail = "test@example.com";
      const mockUser = createMockUser({
        id: 1,
        name: "Test User",
        email: mockEmail,
        role: "Parent",
        isVerified: false, // 未検証ユーザー
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

      // Act
      await userUseCase.resendVerificationEmail(mockEmail);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailVerificationTokenRepository.deleteByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(emailVerificationTokenRepository.save).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        mockEmail,
        mockUser.name,
        "mock-token"
      );
    });

    it("should throw AppError with 'User not found' message when user does not exist", async () => {
      // Arrange
      const mockEmail = "nonexistent@example.com";
      userRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow(AppError);
      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow("User not found");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailVerificationTokenRepository.deleteByUserId).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should throw AppError with 'User is already verified' message when user is already verified", async () => {
      // Arrange
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

      // Act & Assert
      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow(AppError);
      await expect(userUseCase.resendVerificationEmail(mockEmail)).rejects.toThrow("User is already verified");

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailVerificationTokenRepository.deleteByUserId).not.toHaveBeenCalled();
      expect(emailVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });
});
