import "reflect-metadata";
import app from "./infrastructure/http/express";
import { AppDataSource } from "./infrastructure/database/dataSource";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");

    // サーバーの起動
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection error: ", error));
