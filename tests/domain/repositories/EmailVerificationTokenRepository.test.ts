import { DataSource } from "typeorm";

import { EmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository/EmailVerificationTokenRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("EmailVerificationTokenRepository", () => {
  let dataSource: DataSource;
  let emailVerificationTokenRepository: EmailVerificationTokenRepository;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    emailVerificationTokenRepository = new EmailVerificationTokenRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource(dataSource);
  });

  describe("save", () => {
    it("test true", async () => {
      return expect(true).toBe(true);
    });
  });

  // describe("findByToken", () => {});

  // describe("deleteByUserId", () => {});

});
