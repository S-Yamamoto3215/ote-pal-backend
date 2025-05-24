import { DataSource } from "typeorm";

import { FamilyInvitationTokenRepository } from "@/domain/repositories/FamilyInvitationTokenRepository/FamilyInvitationTokenRepository";
import { AppError } from "@/infrastructure/errors/AppError";
import { FamilyInvitationToken } from "@/domain/entities/FamilyInvitationToken";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("FamilyInvitationTokenRepository", () => {
  let dataSource: DataSource;
  let familyInvitationTokenRepository: FamilyInvitationTokenRepository;
  let originalRepoSaveMethod: any;
  let originalRepoFindOneMethod: any;
  let originalRepoDeleteMethod: any;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    familyInvitationTokenRepository = new FamilyInvitationTokenRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource(dataSource);
  });

  describe("save", () => {
    it("有効なトークンが提供された場合、トークンを保存して保存されたトークンを返すこと", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new FamilyInvitationToken(
        "test-invitation-token-123",
        expiresAt,
        "invited@example.com",
        "Child",
        1,
        1
      );

      // Act
      const savedToken = await familyInvitationTokenRepository.save(token);

      // Assert
      expect(savedToken).toBeDefined();
      expect(savedToken.token).toBe("test-invitation-token-123");
      expect(savedToken.email).toBe("invited@example.com");
      expect(savedToken.role).toBe("Child");
      expect(savedToken.familyId).toBe(1);
      expect(savedToken.inviterId).toBe(1);
    });

    it("データベース保存が失敗した場合、'Failed to save invitation token'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000);
      const token = new FamilyInvitationToken(
        "test-token-error",
        expiresAt,
        "error@example.com",
        "Parent",
        1,
        1
      );

      originalRepoSaveMethod = familyInvitationTokenRepository["repo"].save;
      familyInvitationTokenRepository["repo"].save = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const saveAction = () => familyInvitationTokenRepository.save(token);
      await expect(saveAction()).rejects.toThrow(AppError);
      await expect(saveAction()).rejects.toThrow(
        "招待トークンの保存に失敗しました"
      );

      // Clean up
      familyInvitationTokenRepository["repo"].save = originalRepoSaveMethod;
    });
  });

  describe("findByToken", () => {
    it("存在するトークン文字列が指定された場合、正しいトークンを返すこと", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new FamilyInvitationToken(
        "test-find-invitation-token",
        expiresAt,
        "find@example.com",
        "Child",
        1,
        1
      );
      await familyInvitationTokenRepository.save(token);

      // Act
      const foundToken = await familyInvitationTokenRepository.findByToken("test-find-invitation-token");

      // Assert
      expect(foundToken).toBeDefined();
      expect(foundToken?.token).toBe("test-find-invitation-token");
      expect(foundToken?.email).toBe("find@example.com");
    });

    it("存在しないトークン文字列が指定された場合、nullを返すこと", async () => {
      // Arrange
      const nonExistentToken = "non-existent-invitation-token";

      // Act
      const foundToken = await familyInvitationTokenRepository.findByToken(nonExistentToken);

      // Assert
      expect(foundToken).toBeNull();
    });

    it("データベースクエリが失敗した場合、'Failed to find invitation token'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      originalRepoFindOneMethod =
        familyInvitationTokenRepository["repo"].findOne;
      familyInvitationTokenRepository["repo"].findOne = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const findAction = () =>
        familyInvitationTokenRepository.findByToken("test-token");
      await expect(findAction()).rejects.toThrow(AppError);
      await expect(findAction()).rejects.toThrow(
        "招待トークンの検索に失敗しました"
      );

      // Clean up
      familyInvitationTokenRepository["repo"].findOne = originalRepoFindOneMethod;
    });
  });

  describe("findByEmail", () => {
    it("存在するメールアドレスと家族IDが指定された場合、正しいトークンを返すこと", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new FamilyInvitationToken(
        "test-find-by-email-token",
        expiresAt,
        "findemail@example.com",
        "Parent",
        2,
        1
      );
      await familyInvitationTokenRepository.save(token);

      // Act
      const foundToken = await familyInvitationTokenRepository.findByEmail("findemail@example.com", 2);

      // Assert
      expect(foundToken).toBeDefined();
      expect(foundToken?.token).toBe("test-find-by-email-token");
      expect(foundToken?.email).toBe("findemail@example.com");
      expect(foundToken?.familyId).toBe(2);
    });

    it("存在しないメールアドレスや家族IDが指定された場合、nullを返すこと", async () => {
      // Arrange
      const nonExistentEmail = "nonexistent@example.com";

      // Act
      const foundToken = await familyInvitationTokenRepository.findByEmail(nonExistentEmail, 1);

      // Assert
      expect(foundToken).toBeNull();
    });

    it("データベースクエリが失敗した場合、'Failed to find invitation token'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      originalRepoFindOneMethod =
        familyInvitationTokenRepository["repo"].findOne;
      familyInvitationTokenRepository["repo"].findOne = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const findAction = () =>
        familyInvitationTokenRepository.findByEmail("test@example.com", 1);
      await expect(findAction()).rejects.toThrow(AppError);
      await expect(findAction()).rejects.toThrow(
        "招待トークンの検索に失敗しました"
      );

      // Clean up
      familyInvitationTokenRepository["repo"].findOne = originalRepoFindOneMethod;
    });
  });

  describe("deleteByToken", () => {
    it("有効なトークンが指定された場合、トークンを正常に削除すること", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new FamilyInvitationToken(
        "test-delete-token",
        expiresAt,
        "delete@example.com",
        "Child",
        1,
        1
      );
      await familyInvitationTokenRepository.save(token);

      // Act
      await familyInvitationTokenRepository.deleteByToken("test-delete-token");

      // Assert
      const foundToken = await familyInvitationTokenRepository.findByToken("test-delete-token");
      expect(foundToken).toBeNull();
    });

    it("データベース削除が失敗した場合、'Failed to delete invitation token'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      originalRepoDeleteMethod =
        familyInvitationTokenRepository["repo"].delete;
      familyInvitationTokenRepository["repo"].delete = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const deleteAction = () =>
        familyInvitationTokenRepository.deleteByToken("test-token");
      await expect(deleteAction()).rejects.toThrow(AppError);
      await expect(deleteAction()).rejects.toThrow(
        "招待トークンの削除に失敗しました"
      );

      // Clean up
      familyInvitationTokenRepository["repo"].delete = originalRepoDeleteMethod;
    });
  });

  describe("deleteByEmail", () => {
    it("有効なメールアドレスと家族IDが指定された場合、トークンを正常に削除すること", async () => {
      // Arrange
      const expiresAt = new Date(Date.now() + 3600000); // 1時間後
      const token = new FamilyInvitationToken(
        "test-delete-by-email-token",
        expiresAt,
        "deleteemail@example.com",
        "Parent",
        3,
        1
      );
      await familyInvitationTokenRepository.save(token);

      // Act
      await familyInvitationTokenRepository.deleteByEmail("deleteemail@example.com", 3);

      // Assert
      const foundToken = await familyInvitationTokenRepository.findByEmail("deleteemail@example.com", 3);
      expect(foundToken).toBeNull();
    });

    it("データベース削除が失敗した場合、'Failed to delete invitation token'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      originalRepoDeleteMethod =
        familyInvitationTokenRepository["repo"].delete;
      familyInvitationTokenRepository["repo"].delete = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act & Assert
      const deleteAction = () =>
        familyInvitationTokenRepository.deleteByEmail("test@example.com", 1);
      await expect(deleteAction()).rejects.toThrow(AppError);
      await expect(deleteAction()).rejects.toThrow(
        "招待トークンの削除に失敗しました"
      );

      // Clean up
      familyInvitationTokenRepository["repo"].delete = originalRepoDeleteMethod;
    });
  });
});
