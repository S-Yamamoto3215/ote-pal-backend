import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";

import { expressConfig, setMiddleware } from "./helper/server";
import { setRoutes } from "./routes/setRoutes";

dotenv.config();

const app = express();

expressConfig(app);
setMiddleware(app);
setRoutes(app);

// Initialize Data Source

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
