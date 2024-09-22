import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { UserUseCase } from "@/application/usecases/UserUseCase/UserUseCase";
import { AppError } from "@/infrastructure/errors/AppError";

import { parentUser, childUser1, childUser2, otherFamilyUser } from "../../resources/Users";


describe("UserUseCase", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findAllByFamilyId: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    userUseCase = new UserUseCase(userRepository);
  });

  describe("getUserById", () => {
    it("should return a user when found", async () => {
      const userId = 1;
      userRepository.findById.mockResolvedValue(parentUser);

      const result = await userUseCase.getUserById(userId);

      expect(result).toEqual(parentUser);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("should throw an AppError when user is not found", async () => {
      const userId = 1;
      userRepository.findById.mockResolvedValue(null);

      await expect(userUseCase.getUserById(userId)).rejects.toThrow(AppError);
      await expect(userUseCase.getUserById(userId)).rejects.toThrow(
        "User not found"
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("should propagate any other errors", async () => {
      const userId = 1;
      const error = new Error("Database error");
      userRepository.findById.mockRejectedValue(error);

      await expect(userUseCase.getUserById(userId)).rejects.toThrow(error);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("findAllByFamilyId", () => {
    it("should return users when found", async () => {
      const familyId = 1;
      const users = [parentUser, childUser1, childUser2];
      userRepository.findAllByFamilyId.mockResolvedValue(users);

      const result = await userUseCase.findAllByFamilyId(familyId);

      expect(result).toEqual(users);
      expect(userRepository.findAllByFamilyId).toHaveBeenCalledWith(familyId);
    });

    it("should return an empty array when no users are found", async () => {
      const familyId = 1;
      userRepository.findAllByFamilyId.mockResolvedValue([]);

      const result = await userUseCase.findAllByFamilyId(familyId);

      expect(result).toEqual([]);
      expect(userRepository.findAllByFamilyId).toHaveBeenCalledWith(familyId);
    });

    it("should propagate any other errors", async () => {
      const familyId = 1;
      const error = new Error("Database error");
      userRepository.findAllByFamilyId.mockRejectedValue(error);

      await expect(userUseCase.findAllByFamilyId(familyId)).rejects.toThrow(
        error
      );
      expect(userRepository.findAllByFamilyId).toHaveBeenCalledWith(familyId);
    });
  });

  describe("createUser", () => {
    it("should create and return a new user", async () => {
      const input = {
        familyId: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "Parent" as "Parent" | "Child",
      };
      const newUser = new User(
        input.familyId,
        input.name,
        input.email,
        input.password,
        input.role
      );
      userRepository.save.mockResolvedValue(newUser);

      const result = await userUseCase.createUser(input);

      expect(result).toEqual(newUser);
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
    });

    it("should propagate any errors", async () => {
      const input = {
        familyId: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "Parent" as "Parent" | "Child",
      };
      const error = new Error("Database error");
      userRepository.save.mockRejectedValue(error);

      await expect(userUseCase.createUser(input)).rejects.toThrow(error);
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    it("should update and return the user when found", async () => {
      const userId = 1;
      const input = {
        familyId: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "newpassword123",
        role: "Parent" as "Parent" | "Child",
      };
      const existingUser = new User(
        input.familyId,
        "Old Name",
        "old.email@example.com",
        "oldpassword",
        "Child"
      );
      userRepository.findById.mockResolvedValue(existingUser);
      const updatedUser = new User(
        input.familyId,
        input.name,
        input.email,
        input.password,
        input.role
      );
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await userUseCase.updateUser(userId, input);

      expect(result).toEqual(updatedUser);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalledWith(existingUser);
    });

    it("should throw an AppError when user is not found", async () => {
      const userId = 1;
      const input = {
        familyId: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "newpassword123",
        role: "Parent" as "Parent" | "Child",
      };
      userRepository.findById.mockResolvedValue(null);

      await expect(userUseCase.updateUser(userId, input)).rejects.toThrow(
        AppError
      );
      await expect(userUseCase.updateUser(userId, input)).rejects.toThrow(
        "User not found"
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("should propagate any other errors", async () => {
      const userId = 1;
      const input = {
        familyId: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "newpassword123",
        role: "Parent" as "Parent" | "Child",
      };
      const error = new Error("Database error");
      userRepository.findById.mockRejectedValue(error);

      await expect(userUseCase.updateUser(userId, input)).rejects.toThrow(
        error
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("deleteUser", () => {
    it("should delete the user when found", async () => {
      const userId = 1;
      userRepository.delete.mockResolvedValue(undefined);

      await userUseCase.deleteUser(userId);

      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });

    it("should propagate any errors", async () => {
      const userId = 1;
      const error = new Error("Database error");
      userRepository.delete.mockRejectedValue(error);

      await expect(userUseCase.deleteUser(userId)).rejects.toThrow(error);
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
