import express from "express";

import { authRouter } from "./authRoutes";
import { userRouter } from "./userRoutes";
import { taskRouter } from "./taskRoutes";

export const setRoutes = (app: express.Express) => {
  app.get("/", (req, res) => {
    res.send("Welcome to OtePal API!");
  });
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/tasks", taskRouter);
};
