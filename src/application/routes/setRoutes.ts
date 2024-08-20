import express from "express";
import authRoutes from "./authRoutes";

export const setRoutes = (app: express.Express) => {
  app.use("/auth", authRoutes);

  app.get("/", (req, res) => {
    res.send("Welcome to OtePal API!");
  });
};
