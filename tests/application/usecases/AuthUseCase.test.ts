import { AuthUseCase } from "@/application/usecases/AuthUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { AuthService, IAuthService } from "@/application/services/AuthService";
import { AppError } from "@/infrastructure/errors/AppError";
import { createMockUser } from "@tests/helpers/factories";
import { createMockUserRepository, createMockAuthService } from "@tests/helpers/mocks";

describe("AuthUseCase", () => {
  let authUseCase: AuthUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let authService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    userRepository = createMockUserRepository();
    authService = createMockAuthService();
    authUseCase = new AuthUseCase(userRepository, authService);
  });

  describe("login", () => {
    it("should generate a token when valid credentials are provided for verified user", async () => {
      // Arrange
      const mockParentUser = createMockUser({
        email: "parent@example.com",
        role: "Parent",
        isVerified: true
      });

      jest.spyOn(mockParentUser.password, "compare").mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue(mockParentUser);
      authService.generateToken.mockReturnValue("jwt-token");

      // Act
      const result = await authUseCase.login(
        "parent@example.com",
        "validPassword123"
      );

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "parent@example.com"
      );
      expect(mockParentUser.password.compare).toHaveBeenCalledWith(
        "validPassword123"
      );
      expect(authService.generateToken).toHaveBeenCalledWith(mockParentUser);
      expect(result).toBe("jwt-token");
    });

    it("should throw AppError with 'Email not verified' message when user is not verified", async () => {
      // Arrange
      const mockChildUser = createMockUser({
        email: "child1@example.com",
        role: "Child",
        isVerified: false
      });

      jest.spyOn(mockChildUser.password, "compare").mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue(mockChildUser);

      // Act & Assert
      await expect(
        authUseCase.login("child1@example.com", "validPassword456")
      ).rejects.toThrow(AppError);

      await expect(
        authUseCase.login("child1@example.com", "validPassword456")
      ).rejects.toThrow("Email not verified");

      expect(mockChildUser.password.compare).not.toHaveBeenCalled();
    });

    it("should throw AppError with 'User not found' message when user does not exist", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        authUseCase.login("unknown@example.com", "password")
      ).rejects.toThrow(AppError);
      await expect(
        authUseCase.login("unknown@example.com", "password")
      ).rejects.toThrow("User not found");
    });

    it("should throw AppError with 'Invalid password' message when password is incorrect", async () => {
      // Arrange
      const mockParentUser = createMockUser({
        email: "parent@example.com",
        role: "Parent",
        isVerified: true
      });

      jest.spyOn(mockParentUser.password, "compare").mockResolvedValue(false);
      userRepository.findByEmail.mockResolvedValue(mockParentUser);

      // Act & Assert
      await expect(
        authUseCase.login("parent@example.com", "wrong-password")
      ).rejects.toThrow(AppError);
      await expect(
        authUseCase.login("parent@example.com", "wrong-password")
      ).rejects.toThrow("Invalid password");
    });
  });
});
