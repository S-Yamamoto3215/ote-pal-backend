import { Request, Response, NextFunction } from "express";

export interface IFamilyController {
  createFamily(req: Request, res: Response, next: NextFunction): Promise<void>;
  getFamilyById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateFamilyName(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateFamilyPaymentSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
}
