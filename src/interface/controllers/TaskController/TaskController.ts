import { Request, Response, NextFunction } from "express";
import { AppError } from "@/infrastructure/errors/AppError";

import { ITaskUseCase } from "@/application/usecases/TaskUseCase";
import { ITaskController } from "@/interface/controllers/TaskController";

export class TaskController implements ITaskController {
  constructor(private taskUseCase: ITaskUseCase) {}

  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, description, reward, familyId } = req.body;

    if (!name || !description || !reward || !familyId) {
      return next(
        new AppError(
          "ValidationError",
          "Missing required fields: name, description, reward, familyId",
        ),
      );
    }

    try {
      const task = await this.taskUseCase.createTask({name, description, reward, familyId})
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      return next(
        new AppError(
          "ValidationError",
          "Missing required fields: id",
        ),
      );
    }

    try {
      const task = await this.taskUseCase.getTaskById(parseInt(id));
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const { name, description, reward, familyId } = req.body;

    if (!id) {
      return next(
        new AppError(
          "ValidationError",
          "Missing required fields: id, name, description, reward, familyId",
        ),
      );
    }

    try {
      const task = await this.taskUseCase.updateTask(parseInt(id), { name, description, reward, familyId });
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      return next(
        new AppError(
          "ValidationError",
          "Missing required fields: id",
        ),
      );
    }

    try {
      await this.taskUseCase.deleteTask(parseInt(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 認証されたユーザーの確認
      if (!req.user || !req.user.id) {
        return next(new AppError("Unauthorized", "Authentication required"));
      }

      // ユーザーIDを取得
      const userId = req.user.id;

      // ユーザーIDからタスクの一覧を取得
      const tasks = await this.taskUseCase.getTasksByUserId(userId);

      // 結果を返す
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }
}
