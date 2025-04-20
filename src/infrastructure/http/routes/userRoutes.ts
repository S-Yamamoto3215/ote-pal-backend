import { Router } from "express";

import { UserControllerFactory } from "@/application/factories/User/UserControllerFactory";

export const userRouter = Router();
const userController = UserControllerFactory.create();

userRouter.post("/new", (req, res, next) => {
  userController.createUser(req, res, next);
});

userRouter.post("/register", (req, res, next) => {
  userController.registerUser(req, res, next);
});

userRouter.get("/verify-email", (req, res, next) => {
  userController.verifyEmail(req, res, next);
});

userRouter.post("/resend-verification", (req, res, next) => {
  userController.resendVerificationEmail(req, res, next);
});
