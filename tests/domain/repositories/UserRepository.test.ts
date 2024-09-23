import { DataSource, Repository } from "typeorm";

import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { UserRepository } from "@/domain/repositories/UserRepository/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";
import { userSeeds } from "@tests/resources/User/UserSeeds";

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

describe("UserRepository", () => {
  describe("findById", () => {
    it("should find a user by id", async () => {
      const userId = 1
      const user = await userRepository.findById(userId);

      expect(user?.getId()).toBe(userId);
    });

    it("should return null if user not found", async () => {
      const userId = 999;
      const user = await userRepository.findById(userId);

      expect(user).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      const targetUser = userSeeds[0];
      const user = await userRepository.findByEmail(targetUser.email);

      expect(user?.getId()).toBe(targetUser.id);
      expect(user?.getEmail()).toBe(targetUser.email);
    });

    it("should return null if user not found", async () => {
      const user = await userRepository.findByEmail("nofindmail@exsample.com");

      expect(user).toBeNull();
    });
  });

  describe("findAllByFamilyId", () => {
    it("should find all users by family", async () => {
      const targetFamilyId = 1;
      const users = await userRepository.findAllByFamilyId(targetFamilyId);

      expect(users.length).toBe(3);
      users.forEach((user) => {
        expect(user.getFamilyId()).toBe(targetFamilyId);
      });
    });

    it("should return an empty array if no users found", async () => {
      const targetFamilyId = 999;
      const users = await userRepository.findAllByFamilyId(targetFamilyId);

      expect(users.length).toBe(0);
    });
  });

  describe("save", () => {
    it("should save a user", async () => {
      const initialCount = await dataSource.getRepository(User).count();
      const newUser = new User(
        "Test User",
        "testuser1@exsample.com",
        "password1234",
        "Parent",
        1
      );
      const createdUser = await userRepository.save(newUser);
      const finalCount = await dataSource.getRepository(User).count();

      expect(createdUser).toBe(newUser);
      expect(finalCount).toBe(initialCount + 1);
    });
  });

  describe("delete", () => {
    it("should delete a user by id", async () => {
      const targetEmail = "testuser1@exsample.com";
      const targetUser = await userRepository.findByEmail(targetEmail);
      const initialCount = await dataSource.getRepository(User).count();

      await userRepository.delete(targetUser?.getId()!);

      const deletedUser = await userRepository.findByEmail(targetEmail);

      expect(deletedUser).toBeNull();
      const finalCount = await dataSource.getRepository(User).count();
      expect(finalCount).toBe(initialCount - 1);
    });
  });
});
