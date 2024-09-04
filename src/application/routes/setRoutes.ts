import express from "express";

export const setRoutes = (app: express.Express) => {
  app.get("/", (req, res) => {
    res.send("Welcome to OtePal API!");
  });
};
