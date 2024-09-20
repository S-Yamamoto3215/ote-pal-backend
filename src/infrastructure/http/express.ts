import express from "express";
import { setMiddleware } from "@/infrastructure/http/middlewares/setMiddleware";
import { setRoutes } from "@/infrastructure/http/routes/setRoutes";

const app = express();

setMiddleware(app);
setRoutes(app);

export default app;
