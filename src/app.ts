import express from "express";
import setupSwagger from './config/swagger';

import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to OtePal API!");
});

export default app;
