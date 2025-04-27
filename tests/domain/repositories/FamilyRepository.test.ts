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
    it("should find a family by id and return it", async () => {
      const targetFamily = familySeeds[0];
      const family = await familyRepository.findById(targetFamily.id);
      expect(family).not.toBeNull();
      expect(family?.name).toBe(targetFamily.name);
    });

    it("should return null if no family is found", async () => {
      const family = await familyRepository.findById(9999);
      expect(family).toBeNull();
    });

    it("should throw an AppError if finding fails", async () => {
      jest
        .spyOn(familyRepository["familyRepo"], "findOneBy")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(familyRepository.findById(1)).rejects.toThrow(AppError);
      await expect(familyRepository.findById(1)).rejects.toThrow(
        "Database error"
      );

      jest.restoreAllMocks();
    });
  });

  describe("delete", () => {
    it("should delete a family by id", async () => {
      await expect(familyRepository.delete(3)).resolves.not.toThrow();
    });

    it("should throw an AppError if deletion fails", async () => {
      jest
        .spyOn(familyRepository["familyRepo"], "delete")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(familyRepository.delete(1)).rejects.toThrow(AppError);
      await expect(familyRepository.delete(1)).rejects.toThrow(
        "Database error"
      );

      jest.restoreAllMocks();
    });
  });
});
