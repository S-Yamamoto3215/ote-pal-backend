import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";

import { expressConfig, setMiddleware, setSwagger } from "./helper/server";
import { setRoutes } from "./routes/setRoutes";

import { AppDataSource } from "../infrastructure/database/ormconfig";

dotenv.config();

const app = express();

expressConfig(app);
setMiddleware(app);
setSwagger(app);
setRoutes(app);

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
