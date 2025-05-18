import { AuthUseCase } from "@/application/usecases/AuthUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { AuthService } from "@/application/services/AuthService";
import { AppError } from "@/infrastructure/errors/AppError";
import { createMockUser } from "@tests/helpers/factories";

describe("AuthUseCase", () => {
  let authUseCase: AuthUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    authService = {
      generateToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    authUseCase = new AuthUseCase(userRepository, authService);
  });

  it("should generate a token for valid credentials", async () => {
    const mockParentUser = createMockUser({
      email: "parent@example.com",
      role: "Parent",
      isVerified: true
    });

    jest.spyOn(mockParentUser.password, "compare").mockResolvedValue(true);

    userRepository.findByEmail.mockResolvedValue(mockParentUser);
    authService.generateToken.mockReturnValue("jwt-token");

    const result = await authUseCase.login(
      "parent@example.com",
      "validPassword123"
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      "parent@example.com"
    );
    expect(mockParentUser.password.compare).toHaveBeenCalledWith(
      "validPassword123"
    );
    expect(authService.generateToken).toHaveBeenCalledWith(mockParentUser);
    expect(result).toBe("jwt-token");
  });

  it("should throw ValidationError if user is not verified", async () => {
    const mockChildUser = createMockUser({
      email: "child1@example.com",
      role: "Child",
      isVerified: false
    });

    jest.spyOn(mockChildUser.password, "compare").mockResolvedValue(true);
    userRepository.findByEmail.mockResolvedValue(mockChildUser);

    await expect(
      authUseCase.login("child1@example.com", "validPassword456")
    ).rejects.toThrow(AppError);

    await expect(
      authUseCase.login("child1@example.com", "validPassword456")
    ).rejects.toThrow("Email not verified");

    expect(mockChildUser.password.compare).not.toHaveBeenCalled();
  });

  it("should throw NotFound error if user does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authUseCase.login("unknown@example.com", "password")
    ).rejects.toThrow(AppError);
    await expect(
      authUseCase.login("unknown@example.com", "password")
    ).rejects.toThrow("User not found");
  });

  it("should throw ValidationError if password is incorrect", async () => {
    const mockParentUser = createMockUser({
      email: "parent@example.com",
      role: "Parent",
      isVerified: true
    });

    jest.spyOn(mockParentUser.password, "compare").mockResolvedValue(false);

    userRepository.findByEmail.mockResolvedValue(mockParentUser);

    await expect(
      authUseCase.login("parent@example.com", "wrong-password")
    ).rejects.toThrow(AppError);
    await expect(
      authUseCase.login("parent@example.com", "wrong-password")
    ).rejects.toThrow("Invalid password");
  });
});
