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
}
