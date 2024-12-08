import { Router } from "express";

import { UserControllerFactory } from "@/application/factories/User/UserControllerFactory";

export const userRouter = Router();
const userController = UserControllerFactory.create();

userRouter.post("/new", (req, res, next) => {
  userController.createUser(req, res, next);
});
