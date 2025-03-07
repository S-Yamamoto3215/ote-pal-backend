import { TaskRepository } from "@/domain/repositories/TaskRepository";
import { AppDataSource } from "@/infrastructure/database/dataSource";

export class TaskRepositoryFactory {
  static create(): TaskRepository {
    return new TaskRepository(AppDataSource);
  }
}
