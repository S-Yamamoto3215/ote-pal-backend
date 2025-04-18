import { DataSource } from "typeorm";

import { TaskRepository } from "@/domain/repositories/TaskRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { taskSeeds } from "@tests/resources/Task/TaskSeeds";
import { sampleTask } from "@tests/resources/Task/TaskEntitys";

import {
  createTestDatabase,
  closeTestDataSource,
} from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("TaskRepository", () => {
  let dataSource: DataSource;
  let taskRepository: TaskRepository;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    taskRepository = new TaskRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource(dataSource);
  });

  describe("findById", () => {
    it("should return task when task exists", async () => {
      const targetTask = taskSeeds[0];
      const task = await taskRepository.findById(1);
      expect(task).not.toBeNull();
      expect(task?.name).toBe(targetTask.name);
    });

    it("should return null when task does not exist", async () => {
      const task = await taskRepository.findById(9999);
      expect(task).toBeNull();
    });

    it("should throw AppError when database query fails", async () => {
      jest
        .spyOn(taskRepository["repo"], "findOneBy")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(taskRepository.findById(1)).rejects.toThrow(AppError);
      await expect(taskRepository.findById(1)).rejects.toThrow("Failed to find task");

      jest.restoreAllMocks();
    });
  });

  describe("save", () => {
    it("should save task successfully", async () => {
      const newTask = sampleTask;
      const savedTask = await taskRepository.save(newTask);

      expect(savedTask.id).not.toBeNull();
      expect(savedTask.name).toBe(newTask.name);
      expect(savedTask.reward).toBe(newTask.reward);
    });

    it("should throw AppError when database save fails", async () => {
      jest
        .spyOn(taskRepository["repo"], "save")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(taskRepository.save(sampleTask)).rejects.toThrow(AppError);
      await expect(taskRepository.save(sampleTask)).rejects.toThrow("Database error");

      jest.restoreAllMocks();
    });
  });

  describe("delete", () => {
    it("should delete task successfully", async () => {
      await expect(taskRepository.delete(1)).resolves.not.toThrow();
    });

    it("should throw AppError when database delete fails", async () => {
      jest
        .spyOn(taskRepository["repo"], "delete")
        .mockRejectedValue(new Error("Mock Database Error"));

      await expect(taskRepository.delete(1)).rejects.toThrow(AppError);
      await expect(taskRepository.delete(1)).rejects.toThrow("Failed to delete task");

      jest.restoreAllMocks();
    });
  });
});
