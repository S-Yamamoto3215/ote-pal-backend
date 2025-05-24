import express from "express";

import { authRouter } from "./authRoutes";
import { userRouter } from "./userRoutes";
import { taskRouter } from "./taskRoutes";
import { familyRouter } from "./familyRoutes";
import { invitationRouter } from "./invitationRoutes";

export const setRoutes = (app: express.Express) => {
  app.get("/", (req, res) => {
    res.send("Welcome to OtePal API!");
  });
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/families", familyRouter);
  app.use("/tasks", taskRouter);
  app.use("/invitation", invitationRouter);
};
