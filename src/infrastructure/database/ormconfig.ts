import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { OrmUser } from "./entities/User";
import { OrmFamily } from "./entities/Family";
import { OrmWork } from "./entities/Work";
import { OrmTask } from "./entities/Task";
import { OrmTaskDetail } from "./entities/TaskDetail";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [OrmUser, OrmFamily, OrmWork, OrmTask, OrmTaskDetail],
  migrations: ["src/infrastructure/database/migrations/**/*.ts"],
  subscribers: ["src/infrastructure/database/subscribers/**/*.ts"],
});
