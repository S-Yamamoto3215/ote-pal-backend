// filepath: /Users/yamamon/mygit/ote-pal/ote-pal-backend/tests/interface/controllers/TaskController.test.ts
import { Request, Response, NextFunction } from "express";
import { TaskController } from "@/interface/controllers/TaskController";

import { ITaskUseCase } from "@/application/usecases/TaskUseCase";

import { createMockTask } from "@tests/helpers/factories";

describe("TaskController", () => {
  let taskUseCase: jest.Mocked<ITaskUseCase>;

  let taskController: TaskController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    taskUseCase = {
      createTask: jest.fn(),
      getTaskById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    };

    taskController = new TaskController(taskUseCase);

    req = {
      body: {},
      params: {},
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  describe("createTask", () => {
    it("should create a new task and return status 201", async () => {
      const mockTask = createMockTask({
        name: "サンプルタスク1",
        description: "これはサンプルタスク1の説明です。",
        reward: 1000,
        familyId: 1
      });
      req.body = mockTask;

      taskUseCase.createTask.mockResolvedValue(mockTask);

      await taskController.createTask(req as Request, res as Response, next);

      expect(taskUseCase.createTask).toHaveBeenCalledWith(expect.objectContaining({
        name: mockTask.name,
        description: mockTask.description,
        reward: mockTask.reward,
        familyId: mockTask.familyId
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should call next with error if required fields are missing", async () => {
      req.body = { name: "掃除" };

      await taskController.createTask(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Missing required fields: name, description, reward, familyId",
        })
      );
    });
  });

  describe("getTaskById", () => {
    it("should return a task when it exists", async () => {
      const mockTask = createMockTask({
        id: 2,
        name: "サンプルタスク2",
        description: "これはサンプルタスク2の説明です。",
        reward: 2000,
        familyId: 1
      });
      req.params = { id: String(mockTask.id) };

      taskUseCase.getTaskById.mockResolvedValue(mockTask);

      await taskController.getTaskById(req as Request, res as Response, next);

      expect(taskUseCase.getTaskById).toHaveBeenCalledWith(mockTask.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should call next with error if id is missing", async () => {
      req.params = {};

      await taskController.getTaskById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Missing required fields: id" })
      );
    });
  });

  describe("updateTaskById", () => {
    it("should update a task successfully", async () => {
      const updatedTask = createMockTask({
        name: "サンプルタスク1",
        description: "これはサンプルタスク1の説明です。",
        reward: 1000,
        familyId: 1
      });
      req.params = { id: "1" };
      req.body = updatedTask;

      taskUseCase.updateTask.mockResolvedValue(updatedTask);

      await taskController.updateTaskById(req as Request, res as Response, next);

      expect(taskUseCase.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({
        name: updatedTask.name,
        description: updatedTask.description,
        reward: updatedTask.reward,
        familyId: updatedTask.familyId
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it("should call next with error if required fields are missing", async () => {
      req.params = {};

      await taskController.updateTaskById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Missing required fields: id, name, description, reward, familyId",
        })
      );
    });
  });

  describe("deleteTaskById", () => {
    it("should delete task successfully", async () => {
      req.params = { id: "1" };

      await taskController.deleteTaskById(req as Request, res as Response, next);

      expect(taskUseCase.deleteTask).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should call next with error if id is missing", async () => {
      req.params = {};

      await taskController.deleteTaskById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Missing required fields: id",
        })
      );
    });
  });
});
