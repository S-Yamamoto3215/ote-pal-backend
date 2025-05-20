import { DataSource } from "typeorm";

import { FamilyRepository } from "@/domain/repositories/FamilyRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { familySeeds } from "@tests/resources/Family/FamilySeeds";
import { testFamily1, testFamily2 } from "@tests/resources/Family/FamilyEntitys";

import {
  createTestDatabase,
  closeTestDataSource,
} from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("FamilyRepository", () => {
  let dataSource: DataSource;
  let familyRepository: FamilyRepository;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    familyRepository = new FamilyRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource(dataSource);
  });

  // TODO: Add tests for the save method
  describe("save", () => {});

  describe("findById", () => {
    it("should return correct family when family with given id exists", async () => {
      // Arrange
      const targetFamily = familySeeds[0];

      // Act
      const family = await familyRepository.findById(targetFamily.id);

      // Assert
      expect(family).not.toBeNull();
      expect(family?.name).toBe(targetFamily.name);
    });

    it("should return null when family with given id does not exist", async () => {
      // Arrange
      const nonExistentId = 9999;

      // Act
      const family = await familyRepository.findById(nonExistentId);

      // Assert
      expect(family).toBeNull();
    });

    it("should throw AppError with 'Database error' message when database query fails", async () => {
      // Arrange
      jest
        .spyOn(familyRepository["familyRepo"], "findOneBy")
        .mockRejectedValue(new Error("Mock Database Error"));

      // Act & Assert
      await expect(familyRepository.findById(1)).rejects.toThrow(AppError);
      await expect(familyRepository.findById(1)).rejects.toThrow(
        "Database error"
      );

      jest.restoreAllMocks();
    });
  });

  describe("delete", () => {
    it("should successfully delete family when valid id is provided", async () => {
      // Arrange
      const validId = 3;

      // Act & Assert
      await expect(familyRepository.delete(validId)).resolves.not.toThrow();
    });

    it("should throw AppError with 'Database error' message when database delete fails", async () => {
      // Arrange
      jest
        .spyOn(familyRepository["familyRepo"], "delete")
        .mockRejectedValue(new Error("Mock Database Error"));

      // Act & Assert
      await expect(familyRepository.delete(1)).rejects.toThrow(AppError);
      await expect(familyRepository.delete(1)).rejects.toThrow(
        "Database error"
      );

      jest.restoreAllMocks();
    });
  });
});
