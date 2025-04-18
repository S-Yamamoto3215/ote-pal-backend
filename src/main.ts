import "reflect-metadata";
import app from "@/infrastructure/http/express";
import { config } from "@/config";
import { AppDataSource } from "@/infrastructure/database/dataSource";

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");

    // サーバーの起動
    app.listen(config.app.port, () => {
      console.log(`Server is running on port ${config.app.port}`);
    });
  })
  .catch((error) => console.log("Database connection error: ", error));
