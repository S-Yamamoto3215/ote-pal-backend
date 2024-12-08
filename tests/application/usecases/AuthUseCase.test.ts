import { AuthUseCase } from "@/application/usecases/AuthUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { AuthService } from "@/application/services/AuthService";
import { AppError } from "@/infrastructure/errors/AppError";
import { parentUser } from "@tests/resources/User/UserEntitys";

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
    jest.spyOn(parentUser.password, "compare").mockResolvedValue(true);

    userRepository.findByEmail.mockResolvedValue(parentUser);
    authService.generateToken.mockReturnValue("jwt-token");

    const result = await authUseCase.login(
      "parent@example.com",
      "validPassword123",
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      "parent@example.com",
    );
    expect(parentUser.password.compare).toHaveBeenCalledWith(
      "validPassword123",
    );
    expect(authService.generateToken).toHaveBeenCalledWith(parentUser);
    expect(result).toBe("jwt-token");
  });

  it("should throw NotFound error if user does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authUseCase.login("unknown@example.com", "password"),
    ).rejects.toThrow(AppError);
    await expect(
      authUseCase.login("unknown@example.com", "password"),
    ).rejects.toThrow("User not found");
  });

  it("should throw ValidationError if password is incorrect", async () => {
    jest.spyOn(parentUser.password, "compare").mockResolvedValue(false);

    userRepository.findByEmail.mockResolvedValue(parentUser);

    await expect(
      authUseCase.login("parent@example.com", "wrong-password"),
    ).rejects.toThrow(AppError);
    await expect(
      authUseCase.login("parent@example.com", "wrong-password"),
    ).rejects.toThrow("Invalid password");
  });
});
