import { Repository, DataSource } from "typeorm";

import { Work } from "@/domain/entities/Work";
import { IWorkRepository } from "@/domain/repositories/WorkRepository";
import { AppError } from "@/infrastructure/errors/AppError";

export class WorkRepository implements IWorkRepository {
  private repo: Repository<Work>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Work);
  }

  async save(work: Work): Promise<Work> {
    try {
      const savedWork = await this.repo.save(work);
      return savedWork;
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }

  async delete(workId: number): Promise<void> {
    try {
      await this.repo.delete(workId);
    } catch (error) {
      throw new AppError("DatabaseError", "Database error");
    }
  }
}
