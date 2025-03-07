import { Task } from "@/domain/entities/Task";
import { CreateTaskInput } from "@/types/TaskTypes";

import { ITaskRepository } from "@/domain/repositories/TaskRepository";

import { ITaskUseCase } from "@/application/usecases/TaskUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

export class TaskUseCase implements ITaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async getTaskById(taskId: number): Promise<Task | null> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new AppError("NotFound", "Task not found");
      }
      return task;
    } catch (error) {
      throw error;
    }
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    try {
      const task = new Task(
        input.name,
        input.description,
        input.reward,
        input.familyId
      );

      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  async updateTask(taskId: number, input: CreateTaskInput): Promise<Task> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new AppError("NotFound", "Task not found");
      }

      task.name = input.name;
      task.description = input.description;
      task.reward = input.reward;
      task.familyId = input.familyId;

      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    try {
      await this.taskRepository.delete(taskId);
    } catch (error) {
      throw error;
    }
  }
}
