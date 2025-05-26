import { Task } from "@/domain/entities/Task";
import { CreateTaskInput } from "@/types/TaskTypes";

export interface ITaskUseCase {
  getTaskById(taskId: number): Promise<Task | null>;
  getTasks(familyId: number): Promise<Task[]>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(taskId: number, input: CreateTaskInput): Promise<Task>;
  deleteTask(taskId: number): Promise<void>;
}
