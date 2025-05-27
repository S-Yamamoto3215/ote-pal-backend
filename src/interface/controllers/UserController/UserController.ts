import { Request, Response, NextFunction } from "express";

import { AppError } from "@/infrastructure/errors/AppError";
import { IUserUseCase } from "@/application/usecases/UserUseCase";
import { IUserController } from "@/interface/controllers/UserController";

export class UserController implements IUserController {
  constructor(private userUseCase: IUserUseCase) {}

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password, role, familyId } = req.body;
      const user = await this.userUseCase.createUser({
        name,
        email,
        password,
        role,
        familyId,
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const user = await this.userUseCase.registerUser({
        name,
        email,
        password,
      })
      res.status(201).json(user.id);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { token } = req.query as { token: string };
      await this.userUseCase.verifyEmail(token);
      res.status(200).json({
        message: "Email verified successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;
      await this.userUseCase.resendVerificationEmail(email);
      res.status(200).json({
        message: "Verification email resent successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
