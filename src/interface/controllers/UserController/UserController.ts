import { Request, Response, NextFunction } from "express";

import { IUserUseCase } from "@/application/usecases/UserUseCase";
import { IUserController } from "@/interface/controllers/UserController";

export class UserController implements IUserController {
  constructor(private userUseCase: IUserUseCase) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familyId = Number(req.body.familyId);
      const users = await this.userUseCase.findAllByFamilyId(familyId);
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
      const { familyId, name, email, password, role } = req.body;

      const user = await this.userUseCase.createUser({
        familyId,
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
      const { userId, familyId, name, email, password, role } = req.body;

      const user = await this.userUseCase.updateUser(userId, {
        familyId,
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