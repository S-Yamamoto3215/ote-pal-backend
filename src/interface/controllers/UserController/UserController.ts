import { Request, Response } from "express";

import { IUserUseCase } from "@/application/usecases/UserUseCase";
import { IUserController } from "@/interface/controllers/UserController";

export class UserController implements IUserController {
  constructor(private userUseCase: IUserUseCase) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const familyId = Number(req.body.familyId);
    const users = await this.userUseCase.findAllByFamilyId(familyId);

    res.status(200).json(users);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    const user = await this.userUseCase.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const {
      familyId,
      name,
      email,
      password,
      role,
    } = req.body;

    const user = await this.userUseCase.createUser({
      familyId,
      name,
      email,
      password,
      role,
    });

    res.status(201).json(user);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const {
      userId,
      familyId,
      name,
      email,
      password,
      role,
    } = req.body;

    const user = await this.userUseCase.updateUser(userId, {
      familyId,
      name,
      email,
      password,
      role,
    });

    res.status(200).json(user);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId;
    await this.userUseCase.deleteUser(userId);

    res.status(204).send();
  }
}
