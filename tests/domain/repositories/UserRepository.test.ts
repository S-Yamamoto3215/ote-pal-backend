import { DataSource } from "typeorm";

import { UserRepository } from "@/domain/repositories/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { parentUser } from "@tests/resources/User/UserEntitys";
import { userSeeds } from "@tests/resources/User/UserSeeds";
import { testFamily1 } from "@tests/resources/Family/FamilyEntitys";

import {
  createTestDatabase,
  closeTestDataSource,
} from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("UserRepository", () => {
  let dataSource: DataSource;
  let userRepository: UserRepository;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    userRepository = new UserRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource(dataSource);
  });

  describe("findByEmail", () => {
    it("should return user when user exists", async () => {
      const targetUser = userSeeds[0];
      const user = await userRepository.findByEmail(targetUser.email);
      expect(user).not.toBeNull();
      expect(user?.name).toBe(targetUser.name);
    });

    it("should return null when user does not exist", async () => {
      const user = await userRepository.findByEmail("notFound@exsample.com");
      expect(user).toBeNull();
    });

    it("should throw AppError when database query fails", async () => {
      jest
        .spyOn(userRepository["userRepo"], "findOne")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(
        userRepository.findByEmail("error@exsample.com"),
      ).rejects.toThrow(AppError);
      await expect(
        userRepository.findByEmail("error@exsample.com"),
      ).rejects.toThrow("Database error");

      jest.restoreAllMocks();
    });
  });

  describe("save", () => {
    it("should save user successfully", async () => {
      const newUser = parentUser;
      const savedUser = await userRepository.save(newUser);
      expect(savedUser.id).not.toBeNull();
      expect(savedUser.name).toBe(newUser.name);
      expect(savedUser.email).toBe(newUser.email);
    });

    it("should throw AppError when database save fails", async () => {
      jest
        .spyOn(userRepository["userRepo"], "save")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(userRepository.save(parentUser)).rejects.toThrow(AppError);
      await expect(userRepository.save(parentUser)).rejects.toThrow(
        "Database error",
      );

      jest.restoreAllMocks();
    });
  });

  describe("saveWithFamily", () => {
    it("should save user and family successfully", async () => {
      const newUser = parentUser;
      const newFamily = testFamily1;

      const savedUser = await userRepository.saveWithFamily(newUser, newFamily);
      expect(savedUser.id).not.toBeNull();
      expect(savedUser.name).toBe(newUser.name);
      expect(savedUser.email).toBe(newUser.email);
    });

    it("should throw AppError when database save fails", async () => {
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        manager: {
          save: jest.fn().mockRejectedValue(new Error("Mock Database Error")),
        },
        rollbackTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        release: jest.fn(),
      };

      jest
        .spyOn(dataSource, "createQueryRunner")
        .mockReturnValue(mockQueryRunner as any);

      await expect(
        userRepository.saveWithFamily(parentUser, testFamily1)
      ).rejects.toThrow(AppError);
      await expect(
        userRepository.saveWithFamily(parentUser, testFamily1)
      ).rejects.toThrow("Failed to save user with family");

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      jest.restoreAllMocks();
    });
  });
});
