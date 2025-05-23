import { Request, Response, NextFunction } from "express";

import { AppError } from "@/infrastructure/errors/AppError";
import { IFamilyUseCase } from "@/application/usecases/FamilyUseCase";
import { IFamilyController } from "@/interface/controllers/FamilyController";

export class FamilyController implements IFamilyController {
  constructor(private familyUseCase: IFamilyUseCase) {}

  async createFamily(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, paymentSchedule, userId } = req.body;

    if (!name || !paymentSchedule || !userId) {
      return next(
        new AppError(
          "ValidationError",
          "Missing required fields: name, paymentSchedule, userId"
        )
      );
    }

    try {
      const family = await this.familyUseCase.createFamily({
        name,
        paymentSchedule,
        userId
      });
      res.status(201).json(family);
    } catch (error) {
      next(error);
    }
  }
}
