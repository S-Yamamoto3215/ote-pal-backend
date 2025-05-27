import { Work } from "@/domain/entities/Work";
import { CreateWorkInput } from "@/domain/types/WorkTypes";

import { IWorkRepository } from "@/domain/repositories/WorkRepository";

import { IWorkUseCase } from "@/application/usecases/WorkUseCase";

// import { AppError } from "@/infrastructure/errors/AppError";

export class WorkUseCase implements IWorkUseCase {
  constructor(private workRepository: IWorkRepository) {}

  async createWork(input: CreateWorkInput): Promise<Work> {
    try {
      const work = new Work(
        input.status,
        input.taskId,
        input.userId,
      );

      return this.workRepository.save(work);
    } catch (error) {
      throw error;
    }
  }

  async deleteWork(workId: number): Promise<void> {
    try {
      await this.workRepository.delete(workId);
    } catch (error) {
      throw error;
    }
  }
}
