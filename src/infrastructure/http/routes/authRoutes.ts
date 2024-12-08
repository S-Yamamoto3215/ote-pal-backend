import { Router } from "express";

import { AuthControllerFactory } from "@/application/factories/Auth/AuthControllerFactory";

export const authRouter = Router();
const authController = AuthControllerFactory.create();

authRouter.post("/login", (req, res, next) => {
  authController.login(req, res, next);
});
