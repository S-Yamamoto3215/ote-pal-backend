import { Request, Response, NextFunction } from "express";

export interface ITaskController {
  createTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTaskById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskById(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTaskById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
