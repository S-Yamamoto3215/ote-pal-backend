import { DataSource } from "typeorm";

import { EmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository/EmailVerificationTokenRepository";
import { AppError } from "@/infrastructure/errors/AppError";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("EmailVerificationTokenRepository", () => {
  let dataSource: DataSource;
  let emailVerificationTokenRepository: EmailVerificationTokenRepository;
  let originalRepoSaveMethod: any;
  let originalRepoFindOneMethod: any;
  let originalRepoDeleteMethod: any;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    emailVerificationTokenRepository = new EmailVerificationTokenRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource(dataSource);
  });

  describe("save", () => {
    it("should save token and return saved token when valid token is provided", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new EmailVerificationToken("test-token-123", expiresAt, 1);

      // Act
      const savedToken = await emailVerificationTokenRepository.save(token);

      // Assert
      expect(savedToken).toBeDefined();
      expect(savedToken.token).toBe("test-token-123");
      expect(savedToken.userId).toBe(1);
    });

    it("should throw AppError with 'Failed to save verification token' message when database save fails", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000);
      const token = new EmailVerificationToken(
        "test-token-error",
        expiresAt,
        1
      );

      originalRepoSaveMethod = emailVerificationTokenRepository["repo"].save;
      emailVerificationTokenRepository["repo"].save = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const saveAction = () => emailVerificationTokenRepository.save(token);
      await expect(saveAction()).rejects.toThrow(AppError);
      await expect(saveAction()).rejects.toThrow(
        "Failed to save verification token"
      );

      // Clean up
      emailVerificationTokenRepository["repo"].save = originalRepoSaveMethod;
    });
  });

  describe("findByToken", () => {
    it("should return correct token when token with given string exists", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new EmailVerificationToken("test-find-token", expiresAt, 1);
      await emailVerificationTokenRepository.save(token);

      // Act
      const foundToken = await emailVerificationTokenRepository.findByToken("test-find-token");

      // Assert
      expect(foundToken).toBeDefined();
      expect(foundToken?.token).toBe("test-find-token");
      expect(foundToken?.userId).toBe(1);
    });

    it("should return null when token with given string does not exist", async () => {
      // Arrange
      const nonExistentToken = "non-existent-token";

      // Act
      const foundToken = await emailVerificationTokenRepository.findByToken(nonExistentToken);

      // Assert
      expect(foundToken).toBeNull();
    });

    it("should throw AppError with 'Failed to find verification token' message when database query fails", async () => {
      // Arrange
      originalRepoFindOneMethod =
        emailVerificationTokenRepository["repo"].findOne;
      emailVerificationTokenRepository["repo"].findOne = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const findAction = () =>
        emailVerificationTokenRepository.findByToken("test-token");
      await expect(findAction()).rejects.toThrow(AppError);
      await expect(findAction()).rejects.toThrow(
        "Failed to find verification token"
      );

      // Clean up
      emailVerificationTokenRepository["repo"].findOne =
        originalRepoFindOneMethod;
    });
  });

  describe("deleteByUserId", () => {
    it("should successfully delete all tokens for specified user when valid user id is provided", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new EmailVerificationToken("test-delete-token", expiresAt, 2);
      await emailVerificationTokenRepository.save(token);

      // Act
      await emailVerificationTokenRepository.deleteByUserId(2);

      // Assert
      const foundToken = await emailVerificationTokenRepository.findByToken("test-delete-token");
      expect(foundToken).toBeNull();
    });

    it("should throw AppError with 'Failed to delete verification token' message when database delete fails", async () => {
      // Arrange
      originalRepoDeleteMethod =
        emailVerificationTokenRepository["repo"].delete;
      emailVerificationTokenRepository["repo"].delete = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const deleteAction = () =>
        emailVerificationTokenRepository.deleteByUserId(1);
      await expect(deleteAction()).rejects.toThrow(AppError);
      await expect(deleteAction()).rejects.toThrow(
        "Failed to delete verification token"
      );

      // Clean up
      emailVerificationTokenRepository["repo"].delete =
        originalRepoDeleteMethod;
    });
  });
});
