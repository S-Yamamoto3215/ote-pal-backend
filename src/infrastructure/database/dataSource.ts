import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "@/config";

export const AppDataSource = new DataSource({
  type: config.database.type as "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: true,
  logging: true,
  entities: ["src/domain/entities/**/*.ts"],
});
