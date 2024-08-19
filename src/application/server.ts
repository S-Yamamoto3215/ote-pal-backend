import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";

import { AppDataSource } from "../infrastructure/database/ormconfig";
import sessionMiddleware from "../infrastructure/middleware/session";
import passport from "../infrastructure/middleware/passport";

import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// Express config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Middleware
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Swagger
const swaggerDocument = yaml.load(
  fs.readFileSync("./src/application/config/swagger/swagger.yaml", "utf8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument as JSON));

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to OtePal API!");
});

// Initialize Data Source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );

export default app;
