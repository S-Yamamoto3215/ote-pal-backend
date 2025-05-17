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
    it("should return the correct task when found", async () => {
      const mockTask = createMockTask({
        name: "掃除",
        description: "リビングの掃除",
        reward: 500,
        familyId: 1
      });
      taskRepository.findById.mockResolvedValue(mockTask);

      const result = await taskUseCase.getTaskById(1);

      expect(taskRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it("should throw an AppError when task is not found", async () => {
      taskRepository.findById.mockResolvedValue(null);

      await expect(taskUseCase.getTaskById(999)).rejects.toThrow(AppError);
      await expect(taskUseCase.getTaskById(999)).rejects.toThrow("Task not found");

      expect(taskRepository.findById).toHaveBeenCalledWith(999);
    });

    it("should propagate unexpected errors", async () => {
      const unexpectedError = new Error("Unexpected error");
      taskRepository.findById.mockRejectedValue(unexpectedError);

      await expect(taskUseCase.getTaskById(1)).rejects.toThrow("Unexpected error");

      expect(taskRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe("createTask", () => {
    it("should create a new task successfully", async () => {
      const input: CreateTaskInput = {
        name: "洗濯",
        description: "家族の洗濯物をたたむ",
        reward: 300,
        familyId: 1,
      };

      const mockTask = createMockTask({
        name: input.name,
        description: input.description,
        reward: input.reward,
        familyId: input.familyId
      });
      taskRepository.save.mockResolvedValue(mockTask);

      const result = await taskUseCase.createTask(input);

      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining(input));
      expect(result).toEqual(mockTask);
    });

    it("should throw an AppError if taskRepository.save fails", async () => {
      const input: CreateTaskInput = {
        name: "料理",
        description: "夕食の準備",
        reward: 700,
        familyId: 2,
      };

      const unexpectedError = new Error("Database error");
      taskRepository.save.mockRejectedValue(unexpectedError);
      await expect(taskUseCase.createTask(input)).rejects.toThrow("Database error");

      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining(input));
    });

    it("should throw an AppError for invalid input data", async () => {
      // 無効なタスク入力データ（例：空の名前）
      const invalidInput: CreateTaskInput = {
        name: "", // 空の名前は無効
        description: "家族の洗濯物をたたむ",
        reward: 300,
        familyId: 1,
      };

      // Taskクラスのモックインスタンスを作成
      const mockTask = createMockTask({
        name: "",
        description: "家族の洗濯物をたたむ",
        reward: 300,
        familyId: 1
      });

      // saveの前に呼び出されるvalidateメソッドがエラーをスローするように設定
      jest.spyOn(Task.prototype, 'validate').mockImplementation(() => {
        throw new AppError("ValidationError", "Name is required");
      });

      // saveメソッドをモックして、taskRepositoryがvalidateメソッドを呼ぶ前にMockTaskを返すようにする
      taskRepository.save.mockImplementation((task: Task) => {
        // saveの前にvalidateが呼ばれる
        task.validate();
        return Promise.resolve(task);
      });

      // エラーがスローされることを確認
      await expect(taskUseCase.createTask(invalidInput)).rejects.toThrow(AppError);
      await expect(taskUseCase.createTask(invalidInput)).rejects.toThrow("Name is required");

      // モックをリストア
      jest.restoreAllMocks();
    });
  });

  describe("updateTask", () => {
    it("should update the task successfully", async () => {
      const existingTask = createMockTask({
        name: "掃除",
        description: "リビングの掃除",
        reward: 500,
        familyId: 1
      });
      taskRepository.findById.mockResolvedValue(existingTask);

      const updatedInput: CreateTaskInput = {
        name: "ゴミ出し",
        description: "燃えるゴミを出す",
        reward: 100,
        familyId: 1,
      };

      const updatedTask = createMockTask({
        name: updatedInput.name,
        description: updatedInput.description,
        reward: updatedInput.reward,
        familyId: updatedInput.familyId
      });

      taskRepository.save.mockResolvedValue(updatedTask);

      const result = await taskUseCase.updateTask(1, updatedInput);

      expect(taskRepository.findById).toHaveBeenCalledWith(1);
      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining(updatedInput));
      expect(result).toEqual(updatedTask);
    });

    it("should throw an AppError if the task to update is not found", async () => {
      taskRepository.findById.mockResolvedValue(null);

      const input: CreateTaskInput = {
        name: "掃除",
        description: "リビングの掃除",
        reward: 500,
        familyId: 1,
      };

      await expect(taskUseCase.updateTask(999, input)).rejects.toThrow(AppError);
      await expect(taskUseCase.updateTask(999, input)).rejects.toThrow("Task not found");
    });
  });

  describe("deleteTask", () => {
    it("should delete the task successfully", async () => {
      await taskUseCase.deleteTask(1);

      expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should propagate unexpected errors during task deletion", async () => {
      const unexpectedError = new Error("Delete error");
      taskRepository.delete.mockRejectedValue(unexpectedError);

      await expect(taskUseCase.deleteTask(1)).rejects.toThrow("Delete error");

      expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
