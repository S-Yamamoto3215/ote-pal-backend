import { Request, Response, NextFunction } from "express";

export interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  registerUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
}
