import { DataSource } from "typeorm";

import { TaskRepository } from "@/domain/repositories/TaskRepository/TaskRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
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
    await closeTestDataSource();
  });

  // e.x) save method
  // describe("save", () => {
  //   it("should save a task successfully", async () => {
  //     const result = await taskRepository.save(parentTask);
  //
  //     expect(result).toBe(parentTask);
  //     expect(result.id).toBeDefined();
  //   });
  // });

});
