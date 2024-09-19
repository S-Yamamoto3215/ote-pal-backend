import express from "express";
import { setMiddleware } from "./middlewares/setMiddleware";
import { setRoutes } from "./routes/setRoutes";

const app = express();

setMiddleware(app);
setRoutes(app);

export default app;
