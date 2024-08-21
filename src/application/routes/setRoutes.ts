import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

export const setRoutes = (app: express.Express) => {
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);

  app.get("/", (req, res) => {
    res.send("Welcome to OtePal API!");
  });
};
