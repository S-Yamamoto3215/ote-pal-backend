import express from "express";
import { setMiddleware } from "@/infrastructure/http/middlewares/setMiddleware";
import { setRoutes } from "@/infrastructure/http/routes/setRoutes";
import { errorHandler } from "@/infrastructure/http/middlewares/errorHandler";

const app = express();

setMiddleware(app);
setRoutes(app);
app.use(errorHandler);

export default app;
