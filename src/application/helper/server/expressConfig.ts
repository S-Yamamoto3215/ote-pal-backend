import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

export const expressConfig = (app: express.Express) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan("dev"));
};
