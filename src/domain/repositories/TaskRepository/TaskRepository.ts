import { Repository, DataSource } from "typeorm";

import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/TaskRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class TaskRepository implements ITaskRepository {
  private repo: Repository<Task>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Task);
  }

  async save(task: Task): Promise<Task> {
    try {
      const savedTask = await this.repo.save(task);
      return savedTask;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async findById(id: number): Promise<Task | null> {
    try {
      const task = await this.repo.findOneBy({ id });
      return task;
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to find task");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to delete task");
    }
  }

  async findByFamilyId(familyId: number): Promise<Task[]> {
    try {
      const tasks = await this.repo.find({
        where: { familyId },
        order: { id: "DESC" } // 新しいタスク順に並べる
      });
      return tasks;
    } catch (error) {
      throw new AppError("DatabaseError", "Failed to find tasks by family ID");
    }
  }
}
