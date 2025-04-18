import { DataSource } from "typeorm";
import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { Work } from "@/domain/entities/Work";
import { Task } from "@/domain/entities/Task";
import { TaskDetail } from "@/domain/entities/TaskDetail";
import { Payment } from "@/domain/entities/Payment";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";

export async function createTestDatabase(): Promise<DataSource> {
  const dataSource = new DataSource({
    type: process.env.DB_TYPE as "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME || "test_otepal_db",
    synchronize: true,
    dropSchema: true,
    entities: [
      User,
      Family,
      Work,
      Task,
      TaskDetail,
      Payment,
      EmailVerificationToken,
    ],
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
