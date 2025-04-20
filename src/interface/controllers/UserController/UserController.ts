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
    const { name, email, password, role, familyId } = req.body;

    if (!name || !email || !password || !role || !familyId) {
      return next(
        new AppError(
          "ValidationError",
          "Missing required fields: name, email, password, role, familyId",
        ),
      );
    }

    try {
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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new AppError(
          "ValidationError",
          "Missing required fields: name, email, password"
        )
      );
    }

    try {
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
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return next(new AppError("ValidationError", "Token is required"));
    }

    try {
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
    const { email } = req.body;

    if (!email) {
      return next(
        new AppError("ValidationError", "Missing required field: email")
      );
    }

    try {
      await this.userUseCase.resendVerificationEmail(email);
      res.status(200).json({
        message: "Verification email resent successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
