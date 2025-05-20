import { DataSource } from "typeorm";

import { WorkRepository } from "@/domain/repositories/WorkRepository/WorkRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { testWork1, testWork2 } from "@tests/resources/Work/WorkEntitys";
import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("WorkRepository", () => {
  let dataSource: DataSource;
  let workRepository: WorkRepository;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    workRepository = new WorkRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource(dataSource);
  });

  describe("save", () => {
    it("should save work and return work with id when valid work is provided", async () => {
      // Arrange
      jest.spyOn(workRepository["repo"], "save").mockResolvedValue({...testWork1, id: 1});

      // Act
      const result = await workRepository.save(testWork1);

      // Assert
      expect(result.status).toBe("InProgress");
      expect(result.taskId).toBe(1);
      expect(result.userId).toBe(1);
      expect(result.id).toBeDefined();
    });

    it("should throw AppError with 'Database error' message when database save fails", async () => {
      // Arrange
      jest.spyOn(workRepository["repo"], "save").mockRejectedValue(new Error("Mock Database Error"));

      // Act & Assert
      await expect(workRepository.save(testWork2)).rejects.toThrow(AppError);
      await expect(workRepository.save(testWork2)).rejects.toThrow("Database error");

      // Clean up
      jest.restoreAllMocks();
    });
  });

  describe("delete", () => {
    it("should successfully delete work when valid id is provided", async () => {
      // Arrange
      jest.spyOn(workRepository["repo"], "delete").mockResolvedValue({
        raw: [],
        affected: 1
      });

      // Act & Assert
      await expect(workRepository.delete(1)).resolves.not.toThrow();
    });

    it("should throw AppError with 'Database error' message when database delete fails", async () => {
      // Arrange
      jest.spyOn(workRepository["repo"], "delete").mockRejectedValue(new Error("Mock Database Error"));

      // Act & Assert
      await expect(workRepository.delete(1)).rejects.toThrow(AppError);
      await expect(workRepository.delete(1)).rejects.toThrow("Database error");

      // Clean up
      jest.restoreAllMocks();
    });
  });
});
