import { Task } from "@/domain/entities/Task";
import { CreateTaskInput } from "@/domain/types/TaskTypes";

import { ITaskRepository } from "@/domain/repositories/TaskRepository";
import { IUserRepository } from "@/domain/repositories/UserRepository";

import { ITaskUseCase } from "@/application/usecases/TaskUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

export class TaskUseCase implements ITaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private userRepository: IUserRepository
  ) {}

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

  async getTasks(familyId: number): Promise<Task[]> {
    try {
      return await this.taskRepository.findByFamilyId(familyId);
    } catch (error) {
      throw error;
    }
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    try {
      // ユーザー情報を取得
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError("NotFound", "User not found");
      }

      // ユーザーがfamilyIdを持っていない場合
      if (!user.familyId) {
        throw new AppError("ValidationError", "User does not belong to any family");
      }

      // 家族のタスク一覧を取得
      return this.getTasks(user.familyId);
    } catch (error) {
      throw error;
    }
  }
}
