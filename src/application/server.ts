import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "../infrastructure/database/ormconfig";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to OtePal API!");
});

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
