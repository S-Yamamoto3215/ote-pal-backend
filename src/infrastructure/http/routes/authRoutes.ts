import { Router } from "express";

import { AuthControllerFactory } from "@/application/factories/Auth/AuthControllerFactory";
import { validationMiddleware } from "@/infrastructure/http/middlewares/validationMiddleware";
import { LoginDTO } from "@/interface/dto/Auth";

export const authRouter = Router();
const authController = AuthControllerFactory.create();

authRouter.post(
  "/login",
  validationMiddleware(LoginDTO),
  (req, res, next) => {
    authController.login(req, res, next);
  }
);
