import { DataSource } from "typeorm";

import { UserRepository } from "@/domain/repositories/UserRepository/UserRepository";
// import { AppError } from "@/infrastructure/errors/AppError";

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
  });
});
