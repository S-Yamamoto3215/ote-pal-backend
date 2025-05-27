import { Router } from "express";
import { Request, Response, NextFunction } from "express";

import { UserControllerFactory } from "@/application/factories/User/UserControllerFactory";
import { validationMiddleware } from "@/infrastructure/http/middlewares/validationMiddleware";
import {
  CreateUserDTO,
  RegisterUserDTO,
  ResendVerificationEmailDTO
} from "@/interface/dto/User";
import { AppError } from "@/infrastructure/errors/AppError";

export const userRouter = Router();
const userController = UserControllerFactory.create();

userRouter.post(
  "/new",
  validationMiddleware(CreateUserDTO),
  (req, res, next) => {
    userController.createUser(req, res, next);
  }
);

userRouter.post(
  "/register",
  validationMiddleware(RegisterUserDTO),
  (req, res, next) => {
    userController.registerUser(req, res, next);
  }
);

// クエリパラメータのバリデーション用ミドルウェア
const verifyEmailValidator = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return next(new AppError("ValidationError", "トークンは必須です"));
  }

  next();
};

userRouter.get(
  "/verify-email",
  verifyEmailValidator,
  (req, res, next) => {
    userController.verifyEmail(req, res, next);
  }
);

userRouter.post(
  "/resend-verification",
  validationMiddleware(ResendVerificationEmailDTO),
  (req, res, next) => {
    userController.resendVerificationEmail(req, res, next);
  }
);
