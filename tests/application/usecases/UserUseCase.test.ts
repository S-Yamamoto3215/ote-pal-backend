import { UserUseCase } from "@/application/usecases/UserUseCase/UserUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";
import { AppError } from "@/infrastructure/errors/AppError";

describe("UserUseCase", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      saveWithFamily: jest.fn(),
    };

    userUseCase = new UserUseCase(userRepository);
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
      const mockUser = new User(
        input.name,
        input.email,
        new Password(input.password),
        input.role,
        input.isVerified,
        input.familyId,
      );
      userRepository.save.mockResolvedValue(mockUser);

      const result = await userUseCase.createUser(input);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          email: input.email,
          role: input.role,
          familyId: input.familyId,
        }),
      );
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

      userRepository.findByEmail.mockResolvedValue(
        new User(
          input.name,
          input.email,
          new Password(input.password),
          input.role,
          input.isVerified,
          input.familyId,
        ),
      );

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
      const mockUser = new User(
        input.name,
        input.email,
        new Password(input.password),
        "Parent",
        false,
        null
      );

      // q. mockFamily,mockUserを使ってsaveWithFamilyをモックする
      userRepository.saveWithFamily.mockResolvedValue(mockUser);
      const result = await userUseCase.createUserWithFamily(input);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userRepository.saveWithFamily).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          email: input.email,
          password: expect.any(Password),
          role: "Parent",
          familyId: null,
        }),
        expect.objectContaining({
          name: input.familyName,
          payment_schedule: 1,
        })
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw a ValidationError if the email is already in use", async () => {
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        familyName: "Test Family",
      };

      userRepository.findByEmail.mockResolvedValue(
        new User(
          input.name,
          input.email,
          new Password(input.password),
          "Parent",
          false,
          null,
        ),
      );

      await expect(userUseCase.createUserWithFamily(input)).rejects.toThrow(AppError);
      await expect(userUseCase.createUserWithFamily(input)).rejects.toThrow("User already exists",);

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
});
