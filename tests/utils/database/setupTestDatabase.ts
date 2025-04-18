import { config } from "@/config";
import { DataSource } from "typeorm";

export async function createTestDatabase(): Promise<DataSource> {
  const dataSource = new DataSource({
    type: config.database.type as "postgres",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    synchronize: true,
    dropSchema: true,
    entities: ["src/domain/entities/**/*.ts"],
  });

  await dataSource.initialize();
  return dataSource;
}

export const closeTestDataSource = async (
  dataSource: DataSource,
): Promise<void> => {
  if (dataSource) {
    await dataSource.destroy();
  }
};
