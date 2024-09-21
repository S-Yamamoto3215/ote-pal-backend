import { Router } from "express";

import { UserControllerFactory } from "@/application/factories/User/UserControllerFactory";

export const userRouter = Router();
const userController = UserControllerFactory.create();

userRouter.get("/", (req, res) => {
  userController.getAllUsers(req, res);
});

userRouter.get("/:userId", (req, res) => {
  userController.getUserById(req, res);
});

userRouter.post("/", (req, res) => {
  userController.createUser(req, res);
});

userRouter.put("/", (req, res) => {
  userController.updateUser(req, res);
});

userRouter.delete("/", (req, res) => {
  userController.deleteUser(req, res);
});
