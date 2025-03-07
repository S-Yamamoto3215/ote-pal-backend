import { Router } from "express";

import { TaskControllerFactory } from "@/application/factories/Task/TaskControllerFactory";

export const taskRouter = Router();
const taskController = TaskControllerFactory.create();

taskRouter.post("/new", (req, res, next) => {
  taskController.createTask(req, res, next);
});

taskRouter.get("/:id", (req, res, next) => {
  taskController.getTaskById(req, res, next);
});

taskRouter.delete("/:id", (req, res, next) => {
  taskController.deleteTaskById(req, res, next);
});
