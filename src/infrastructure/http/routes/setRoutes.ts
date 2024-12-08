import express from "express";

import { authRouter } from "./authRoutes";

export const setRoutes = (app: express.Express) => {
  app.get("/", (req, res) => {
    res.send("Welcome to OtePal API!");
  });
  app.use("/auth", authRouter);
};
