import { Request, Response, NextFunction } from "express";

import { IUserUseCase } from "@/application/usecases/UserUseCase";
import { IUserController } from "@/interface/controllers/UserController";

export class UserController implements IUserController {
  constructor(private userUseCase: IUserUseCase) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const family = req.body.family;
      const users = await this.userUseCase.findAllByFamily(family);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const user = await this.userUseCase.getUserById(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { family, name, email, password, role } = req.body;

      const user = await this.userUseCase.createUser({
        family,
        name,
        email,
        password,
        role,
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, family, name, email, password, role } = req.body;

      const user = await this.userUseCase.updateUser(userId, {
        family,
        name,
        email,
        password,
        role,
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.body.userId;
      await this.userUseCase.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
