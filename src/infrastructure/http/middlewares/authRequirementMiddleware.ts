import { Request, Response, NextFunction } from "express";
import { AppError } from "@/infrastructure/errors/AppError";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", "認証が必要です"));
  }
  next();
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  next();
};
