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
    try {
      const { name, paymentSchedule, userId } = req.body;
      const family = await this.familyUseCase.createFamily({
        name,
        paymentSchedule,
        userId,
      });
      res.status(201).json(family);
    } catch (error) {
      next(error);
    }
  }

  async getFamilyById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // リクエストパラメータからfamily_idを取得
      const familyId = parseInt(req.params.family_id, 10);

      if (isNaN(familyId)) {
        return next(new AppError("ValidationError", "Invalid family ID"));
      }

      // 認証されたユーザーのIDを取得
      if (!req.user || !req.user.id) {
        return next(new AppError("Unauthorized", "Authentication required"));
      }

      const userId = req.user.id;

      // 家族情報を取得
      const familyDetail = await this.familyUseCase.getFamilyDetailById(
        familyId,
        userId
      );

      // 結果を返す
      res.status(200).json(familyDetail);
    } catch (error) {
      next(error);
    }
  }

  async updateFamilyName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.body;

      // リクエストパラメータからfamily_idを取得
      const familyId = parseInt(req.params.family_id, 10);

      if (isNaN(familyId)) {
        return next(new AppError("ValidationError", "Invalid family ID"));
      }

      // 認証されたユーザーのIDを取得
      if (!req.user || !req.user.id) {
        return next(new AppError("Unauthorized", "Authentication required"));
      }

      const userId = req.user.id;

      // 家族情報を取得
      const updatedFamily = await this.familyUseCase.updateFamilyName(
        name,
        familyId,
        userId
      );

      // 結果を返す
      res.status(200).json(updatedFamily);
    } catch (error) {
      next(error);
    }
  }

  async updateFamilyPaymentSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { paymentSchedule } = req.body;

      // リクエストパラメータからfamily_idを取得
      const familyId = parseInt(req.params.family_id, 10);

      if (isNaN(familyId)) {
        return next(new AppError("ValidationError", "Invalid family ID"));
      }

      // 認証されたユーザーのIDを取得
      if (!req.user || !req.user.id) {
        return next(new AppError("Unauthorized", "Authentication required"));
      }

      const userId = req.user.id;

      // 家族情報を取得
      const updatedFamily =
        await this.familyUseCase.updateFamilyPaymentSchedule(
          paymentSchedule,
          familyId,
          userId
        );

      // 結果を返す
      res.status(200).json(updatedFamily);
    } catch (error) {
      next(error);
    }
  }
}
