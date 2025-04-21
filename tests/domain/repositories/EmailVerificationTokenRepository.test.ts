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
    it("should save a token successfully", async () => {
      // テスト用のトークンを作成
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new EmailVerificationToken("test-token-123", expiresAt, 1);

      // トークンを保存
      const savedToken = await emailVerificationTokenRepository.save(token);

      // 保存されたトークンを検証
      expect(savedToken).toBeDefined();
      expect(savedToken.token).toBe("test-token-123");
      expect(savedToken.userId).toBe(1);
    });

    it("should throw AppError if save fails", async () => {
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

      const saveAction = () => emailVerificationTokenRepository.save(token);
      await expect(saveAction()).rejects.toThrow(AppError);
      await expect(saveAction()).rejects.toThrow(
        "Failed to save verification token"
      );

      emailVerificationTokenRepository["repo"].save = originalRepoSaveMethod;
    });
  });

  describe("findByToken", () => {
    it("should find a token by token string", async () => {
      // 事前にトークンを保存
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new EmailVerificationToken("test-find-token", expiresAt, 1);
      await emailVerificationTokenRepository.save(token);

      // トークンを検索
      const foundToken = await emailVerificationTokenRepository.findByToken("test-find-token");

      // 検索結果を検証
      expect(foundToken).toBeDefined();
      expect(foundToken?.token).toBe("test-find-token");
      expect(foundToken?.userId).toBe(1);
    });

    it("should return null if token is not found", async () => {
      // 存在しないトークンを検索
      const foundToken = await emailVerificationTokenRepository.findByToken("non-existent-token");

      // 検索結果がnullであることを検証
      expect(foundToken).toBeNull();
    });

    it("should throw AppError if findByToken fails", async () => {
      originalRepoFindOneMethod =
        emailVerificationTokenRepository["repo"].findOne;
      emailVerificationTokenRepository["repo"].findOne = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const findAction = () =>
        emailVerificationTokenRepository.findByToken("test-token");
      await expect(findAction()).rejects.toThrow(AppError);
      await expect(findAction()).rejects.toThrow(
        "Failed to find verification token"
      );

      emailVerificationTokenRepository["repo"].findOne =
        originalRepoFindOneMethod;
    });
  });

  describe("deleteByUserId", () => {
    it("should delete tokens for the specified user", async () => {
      // 事前にトークンを保存
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new EmailVerificationToken("test-delete-token", expiresAt, 2);
      await emailVerificationTokenRepository.save(token);

      // トークンを削除
      await emailVerificationTokenRepository.deleteByUserId(2);

      // 削除されたことを確認
      const foundToken = await emailVerificationTokenRepository.findByToken("test-delete-token");
      expect(foundToken).toBeNull();
    });

    it("should throw AppError if deleteByUserId fails", async () => {
      originalRepoDeleteMethod =
        emailVerificationTokenRepository["repo"].delete;
      emailVerificationTokenRepository["repo"].delete = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const deleteAction = () =>
        emailVerificationTokenRepository.deleteByUserId(1);
      await expect(deleteAction()).rejects.toThrow(AppError);
      await expect(deleteAction()).rejects.toThrow(
        "Failed to delete verification token"
      );

      emailVerificationTokenRepository["repo"].delete =
        originalRepoDeleteMethod;
    });
  });
});
