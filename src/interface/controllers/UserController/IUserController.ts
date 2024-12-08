import { Request, Response, NextFunction } from "express";

export interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
