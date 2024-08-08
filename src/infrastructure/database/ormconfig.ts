import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../../domain/entities/User";
import { Family } from "../../domain/entities/Family";
import { Work } from "../../domain/entities/Work";
import { Task } from "../../domain/entities/Task";
import { TaskDetail } from "../../domain/entities/TaskDetail";

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
  entities: [User, Family, Work, Task, TaskDetail],
  migrations: ["src/infrastructure/database/migrations/**/*.ts"],
  subscribers: ["src/infrastructure/database/subscribers/**/*.ts"],
});
