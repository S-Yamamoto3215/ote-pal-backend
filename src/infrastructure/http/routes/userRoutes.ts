import { Router } from "express";

import { UserControllerFactory } from "@/application/factories/User/UserControllerFactory";

export const userRouter = Router();
const userController = UserControllerFactory.create();

userRouter.get("/", (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

userRouter.get("/:userId", (req, res, next) => {
  userController.getUserById(req, res, next);
});

userRouter.post("/", (req, res, next) => {
  userController.createUser(req, res, next);
});

userRouter.put("/", (req, res, next) => {
  userController.updateUser(req, res, next);
});

userRouter.delete("/", (req, res, next) => {
  userController.deleteUser(req, res, next);
});
