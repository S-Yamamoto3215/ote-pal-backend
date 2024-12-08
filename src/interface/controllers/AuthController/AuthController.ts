import { Request, Response, NextFunction } from "express";

import { IAuthUseCase } from "@/application/usecases/AuthUseCase";
import { IAuthController } from "@/interface/controllers/AuthController";

import { AppError } from "@/infrastructure/errors/AppError";

export class AuthController implements IAuthController {
  constructor(private authUseCase: IAuthUseCase) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError("ValidationError", "Email and password are required"),
      );
    }

    try {
      const token = await this.authUseCase.login(email, password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
