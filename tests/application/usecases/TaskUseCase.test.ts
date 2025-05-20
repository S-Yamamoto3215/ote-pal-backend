import { TaskUseCase } from "@/application/usecases/TaskUseCase/TaskUseCase";
import { ITaskRepository } from "@/domain/repositories/TaskRepository";
import { Task } from "@/domain/entities/Task";
import { CreateTaskInput } from "@/types/TaskTypes";
import { AppError } from "@/infrastructure/errors/AppError";
import { createMockTask } from "@tests/helpers/factories";

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

  describe("getTaskById", () => {
    it("should return the correct task when valid task id is provided and task exists", async () => {
      // Arrange
      const mockTask = createMockTask({
        name: "掃除",
        description: "リビングの掃除",
        reward: 500,
        familyId: 1
      });
      taskRepository.findById.mockResolvedValue(mockTask);

      // Act
      const result = await taskUseCase.getTaskById(1);

      // Assert
      expect(taskRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it("should throw AppError with 'Task not found' message when task does not exist", async () => {
      // Arrange
      taskRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskUseCase.getTaskById(999)).rejects.toThrow(AppError);
      await expect(taskUseCase.getTaskById(999)).rejects.toThrow("Task not found");

      expect(taskRepository.findById).toHaveBeenCalledWith(999);
    });

    it("should propagate unexpected errors when repository operation fails", async () => {
      // Arrange
      const unexpectedError = new Error("Unexpected error");
      taskRepository.findById.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(taskUseCase.getTaskById(1)).rejects.toThrow("Unexpected error");

      expect(taskRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe("createTask", () => {
    const validInput: CreateTaskInput = {
      name: "洗濯",
      description: "家族の洗濯物をたたむ",
      reward: 300,
      familyId: 1,
    };

    it("should create and return a new task when valid input is provided", async () => {
      // Arrange
      const mockTask = createMockTask({
        name: validInput.name,
        description: validInput.description,
        reward: validInput.reward,
        familyId: validInput.familyId
      });
      taskRepository.save.mockResolvedValue(mockTask);

      // Act
      const result = await taskUseCase.createTask(validInput);

      // Assert
      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining(validInput));
      expect(result).toEqual(mockTask);
    });

    it("should propagate database errors when repository save operation fails", async () => {
      // Arrange
      const unexpectedError = new Error("Database error");
      taskRepository.save.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(taskUseCase.createTask(validInput)).rejects.toThrow("Database error");
      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining(validInput));
    });

    it("should throw AppError with validation message when input data is invalid", async () => {
      // Arrange
      const invalidInput: CreateTaskInput = {
        name: "",
        description: "家族の洗濯物をたたむ",
        reward: 300,
        familyId: 1,
      };

      jest.spyOn(Task.prototype, 'validate').mockImplementation(() => {
        throw new AppError("ValidationError", "Name is required");
      });

      taskRepository.save.mockImplementation((task: Task) => {
        task.validate();
        return Promise.resolve(task);
      });

      // Act & Assert
      await expect(taskUseCase.createTask(invalidInput)).rejects.toThrow(AppError);
      await expect(taskUseCase.createTask(invalidInput)).rejects.toThrow("Name is required");

      jest.restoreAllMocks();
    });
  });

  describe("updateTask", () => {
    const updatedInput: CreateTaskInput = {
      name: "ゴミ出し",
      description: "燃えるゴミを出す",
      reward: 100,
      familyId: 1,
    };

    it("should update and return task with new values when task exists", async () => {
      // Arrange
      const existingTask = createMockTask({
        id: 1,
        name: "掃除",
        description: "リビングの掃除",
        reward: 500,
        familyId: 1
      });
      taskRepository.findById.mockResolvedValue(existingTask);

      const updatedTask = createMockTask({
        id: 1,
        name: updatedInput.name,
        description: updatedInput.description,
        reward: updatedInput.reward,
        familyId: updatedInput.familyId
      });
      taskRepository.save.mockResolvedValue(updatedTask);

      // Act
      const result = await taskUseCase.updateTask(1, updatedInput);

      // Assert
      expect(taskRepository.findById).toHaveBeenCalledWith(1);
      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining(updatedInput));
      expect(result).toEqual(updatedTask);
    });

    it("should throw AppError with 'Task not found' message when task does not exist", async () => {
      // Arrange
      taskRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskUseCase.updateTask(999, updatedInput)).rejects.toThrow(AppError);
      await expect(taskUseCase.updateTask(999, updatedInput)).rejects.toThrow("Task not found");

      expect(taskRepository.findById).toHaveBeenCalledWith(999);
      expect(taskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("should successfully delete task when valid task id is provided", async () => {
      // Arrange
      taskRepository.delete.mockResolvedValue();

      // Act
      await taskUseCase.deleteTask(1);

      // Assert
      expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should propagate unexpected errors when repository delete operation fails", async () => {
      // Arrange
      const unexpectedError = new Error("Delete error");
      taskRepository.delete.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(taskUseCase.deleteTask(1)).rejects.toThrow("Delete error");
      expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
