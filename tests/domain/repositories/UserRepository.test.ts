import { DataSource } from "typeorm";

import { UserRepository } from "@/domain/repositories/UserRepository/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { parentUser } from "@tests/resources/User/UserEntitys";
import { userSeeds } from "@tests/resources/User/UserSeeds";

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
        .spyOn(userRepository["repo"], "findOne")
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
        .spyOn(userRepository["repo"], "save")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(userRepository.save(parentUser)).rejects.toThrow(AppError);
      await expect(userRepository.save(parentUser)).rejects.toThrow(
        "Database error",
      );

      jest.restoreAllMocks();
    });
  });
});
