import { DataSource } from "typeorm";

import { UserRepository } from "@/domain/repositories/UserRepository/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";
import { parentUser, childUser1, childUser2 } from "@tests/resources/User/UserEntitys";
import { userSeeds } from "@tests/resources/User/UserSeeds";


describe("UserRepository", () => {
  let dataSource: DataSource;
  let userRepository: UserRepository;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    userRepository = new UserRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  describe("save", () => {
    it("should save a user successfully", async () => {
      const result = await userRepository.save(parentUser);

      expect(result).toBe(parentUser);
      expect(result.id).toBeDefined();
    });

    it("should throw an AppError if saving fails", async () => {
      childUser1.email = "invalid-email";

      await expect(userRepository.save(childUser1)).rejects.toThrow(AppError);
    });
  });

  describe("findById", () => {
    it("should find a user by id successfully", async () => {
      const userId = 1;
      const result = await userRepository.findById(userId);

      expect(result).toBeDefined();
      expect(result?.id).toBe(userId);
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email successfully", async () => {
      const targetUser = userSeeds[0];

      const result = await userRepository.findByEmail(targetUser.email);

      expect(result).toBeDefined();
      expect(result?.email).toBe(targetUser.email);
    });
  });

  describe("findAllByFamilyId", () => {
    it("should find all users by familyId successfully", async () => {
      const users = await userRepository.findAllByFamilyId(1);
      const invalidFamilyId = users.find((user) => user.familyId !== 1);

      expect(invalidFamilyId).toBeUndefined();
      expect(users).toBeInstanceOf(Array);
    });
  });

  describe("delete", () => {
    it("should delete a user successfully", async () => {
      const savedUser = await userRepository.save(childUser2);

      if (!savedUser.id) {
        throw new Error("User id is undefined");
      }

      await userRepository.delete(savedUser.id);

      const result = await userRepository.findById(savedUser.id);
      expect(result).toBeNull();
    });
  });
});
