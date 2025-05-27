import { Request, Response } from "express";
import { TaskController } from "@/interface/controllers/TaskController";
import { ITaskUseCase } from "@/application/usecases/TaskUseCase";
import { createMockTask } from "@tests/helpers/factories";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
  expectMissingFieldsErrorToBeCalled,
  expectErrorWithMessageToBeCalled
} from "@tests/helpers/controllers";
import { createMockTaskUseCase } from "@tests/helpers/mocks";

describe("TaskController", () => {
  let taskUseCase: jest.Mocked<ITaskUseCase>;
  let taskController: TaskController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    taskUseCase = createMockTaskUseCase();
    taskController = new TaskController(taskUseCase);

    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  describe("createTask", () => {
    it("should return status 201 with task data when valid input is provided", async () => {
      // Arrange
      const mockTask = createMockTask({
        name: "サンプルタスク1",
        description: "これはサンプルタスク1の説明です。",
        reward: 1000,
        familyId: 1
      });
      req.body = mockTask;
      taskUseCase.createTask.mockResolvedValue(mockTask);

      // Act
      await taskController.createTask(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.createTask).toHaveBeenCalledWith(expect.objectContaining({
        name: mockTask.name,
        description: mockTask.description,
        reward: mockTask.reward,
        familyId: mockTask.familyId
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });
  });

  describe("getTaskById", () => {
    it("should return status 200 with task data when task exists", async () => {
      // Arrange
      const mockTask = createMockTask({
        id: 2,
        name: "サンプルタスク2",
        description: "これはサンプルタスク2の説明です。",
        reward: 2000,
        familyId: 1
      });
      req.params = { id: String(mockTask.id) };
      taskUseCase.getTaskById.mockResolvedValue(mockTask);

      // Act
      await taskController.getTaskById(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.getTaskById).toHaveBeenCalledWith(mockTask.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should call next with validation error when id parameter is missing", async () => {
      // Arrange
      req.params = {};

      // Act
      await taskController.getTaskById(req as Request, res as Response, next);

      // Assert
      expectErrorWithMessageToBeCalled(next, "Missing required fields: id");
    });
  });

  describe("updateTaskById", () => {
    it("should return status 200 with updated task when valid input is provided", async () => {
      // Arrange
      const updatedTask = createMockTask({
        name: "サンプルタスク1",
        description: "これはサンプルタスク1の説明です。",
        reward: 1000,
        familyId: 1
      });
      req.params = { id: "1" };
      req.body = updatedTask;

      taskUseCase.updateTask.mockResolvedValue(updatedTask);

      // Act
      await taskController.updateTaskById(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({
        name: updatedTask.name,
        description: updatedTask.description,
        reward: updatedTask.reward,
        familyId: updatedTask.familyId
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it("should call next with validation error when id parameter is missing", async () => {
      // Arrange
      req.params = {};
      req.body = {
        name: "更新タスク",
        description: "更新説明",
        reward: 500,
        familyId: 1
      };

      // Act
      await taskController.updateTaskById(req as Request, res as Response, next);

      // Assert
      // idのバリデーションはコントローラーに残っているが、bodyのバリデーションはDTOに移行
      expectErrorWithMessageToBeCalled(next, "Missing required fields: id");
    });
  });

  describe("deleteTaskById", () => {
    it("should return status 204 when task is successfully deleted", async () => {
      // Arrange
      req.params = { id: "1" };

      // Act
      await taskController.deleteTaskById(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.deleteTask).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should call next with validation error when id parameter is missing", async () => {
      // Arrange
      req.params = {};

      // Act
      await taskController.deleteTaskById(req as Request, res as Response, next);

      // Assert
      expectErrorWithMessageToBeCalled(next, "Missing required fields: id");
    });
  });

  describe("getTasks", () => {
    const userId = 1;
    const tasks = [
      createMockTask({ id: 1, name: "掃除", familyId: 1 }),
      createMockTask({ id: 2, name: "料理", familyId: 1 })
    ];

    beforeEach(() => {
      req.user = { id: userId, email: "test@example.com", role: "Parent" };
    });

    it("認証済みユーザーがタスク一覧を取得できること", async () => {
      // Arrange
      taskUseCase.getTasksByUserId.mockResolvedValue(tasks);

      // Act
      await taskController.getTasks(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.getTasksByUserId).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasks);
      expect(next).not.toHaveBeenCalled();
    });

    it("認証されていない場合はエラーを返すこと", async () => {
      // Arrange
      req.user = undefined; // 認証なし

      // Act
      await taskController.getTasks(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.getTasksByUserId).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          errorType: "Unauthorized",
          message: "Authentication required"
        })
      );
    });

    it("ユーザーにIDがない場合はエラーを返すこと", async () => {
      // Arrange
      req.user = { email: "test@example.com", role: "Parent" } as any; // idなし

      // Act
      await taskController.getTasks(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.getTasksByUserId).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          errorType: "Unauthorized",
          message: "Authentication required"
        })
      );
    });

    it("ユースケースでエラーが発生した場合は次のミドルウェアに渡すこと", async () => {
      // Arrange
      const error = new Error("テストエラー");
      taskUseCase.getTasksByUserId.mockRejectedValue(error);

      // Act
      await taskController.getTasks(req as Request, res as Response, next);

      // Assert
      expect(taskUseCase.getTasksByUserId).toHaveBeenCalledWith(userId);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
