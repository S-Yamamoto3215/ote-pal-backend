import express from "express";
import setupSwagger from './config/swagger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("Welcome to OtePal API!");
});

export default app;
