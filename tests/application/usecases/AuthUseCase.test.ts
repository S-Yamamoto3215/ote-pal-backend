import { AuthUseCase } from "@/application/usecases/AuthUseCase/AuthUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";
import { User } from "@/domain/entities/User";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("AuthUseCase", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let authUseCase: AuthUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    authUseCase = new AuthUseCase(userRepository);
  });

  describe("login", () => {
    it("should return a token when login is successful", async () => {
      const email = "test@example.com";
      const password = "password";
      const user = new User("Test User", email, password, "Parent", 1);

      userRepository.findByEmail.mockResolvedValue(user);
      (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

      const token = await authUseCase.login(email, password);

      expect(token).toBe("fake-jwt-token");
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        expect.any(String),
        { expiresIn: "1h" }
      );
    });

    it("should throw an AppError if user is not found", async () => {
      const email = "nonexistent@example.com";
      const password = "password";

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authUseCase.login(email, password)).rejects.toThrow(
        AppError
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it("should throw an AppError if password is incorrect", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";
      const user = new User("Test User", email, "correctpassword", "Parent", 1);

      userRepository.findByEmail.mockResolvedValue(user);

      await expect(authUseCase.login(email, password)).rejects.toThrow(
        AppError
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it("should throw an AppError if JWT signing fails", async () => {
      const email = "test@example.com";
      const password = "password";
      const user = new User("Test User", email, password, "Parent", 1);

      userRepository.findByEmail.mockResolvedValue(user);
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new AppError("JWTError", "JWT signing error");
      });

      await expect(authUseCase.login(email, password)).rejects.toThrow(
        AppError
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        expect.any(String),
        { expiresIn: "1h" }
      );
    });
  });
});
