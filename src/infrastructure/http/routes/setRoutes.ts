import express from "express";

import { userRouter } from "@/infrastructure/http/routes/userRoutes";

export const setRoutes = (app: express.Express) => {
  app.get("/", (req, res) => {
    res.send("Welcome to OtePal API!");
  });

  app.use("/users", userRouter);
};
