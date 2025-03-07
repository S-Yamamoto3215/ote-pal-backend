import { Task } from "@/domain/entities/Task";

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: number): Promise<Task | null>;
  delete(taskId: number): Promise<void>;
}
