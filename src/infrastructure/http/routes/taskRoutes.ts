import { Router } from "express";

import { TaskControllerFactory } from "@/application/factories/Task/TaskControllerFactory";
import { validationMiddleware } from "@/infrastructure/http/middlewares/validationMiddleware";
import { CreateTaskDTO, UpdateTaskDTO } from "@/interface/dto/Task";

export const taskRouter = Router();
const taskController = TaskControllerFactory.create();

// タスク一覧の取得（ログイン中のユーザーに紐づく家族のタスク）
taskRouter.get("/", (req, res, next) => {
  taskController.getTasks(req, res, next);
});

taskRouter.post(
  "/new",
  validationMiddleware(CreateTaskDTO),
  (req, res, next) => {
    taskController.createTask(req, res, next);
  }
);

taskRouter.get("/:id", (req, res, next) => {
  taskController.getTaskById(req, res, next);
});

taskRouter.patch(
  "/:id",
  validationMiddleware(UpdateTaskDTO, true),
  (req, res, next) => {
    taskController.updateTaskById(req, res, next);
  }
);

taskRouter.delete("/:id", (req, res, next) => {
  taskController.deleteTaskById(req, res, next);
});
