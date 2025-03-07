import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/TaskRepository";
import { TaskUseCase } from "@/application/usecases/TaskUseCase/TaskUseCase";
import { AppError } from "@/infrastructure/errors/AppError";

// import { taskSeeds } from "@tests/resources/Task/TaskSeeds";
// import { parentTask, childTask1, childTask2 } from "@tests/resources/Task/TaskEntitys";

describe("TaskUseCase", () => {
  let taskRepository: jest.Mocked<ITaskRepository>;
  let taskUseCase: TaskUseCase;

  beforeEach(() => {
    taskRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ITaskRepository>;

    taskUseCase = new TaskUseCase(taskRepository);
  });

  describe("getTaskById", () => {});
  describe("createTask", () => {});
  describe("updateTask", () => {});
  describe("deleteTask", () => {});
});
