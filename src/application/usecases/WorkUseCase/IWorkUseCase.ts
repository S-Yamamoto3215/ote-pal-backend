import { Work } from "@/domain/entities/Work";

import { CreateWorkInput } from "@/types/WorkTypes";

export interface IWorkUseCase {
  createWork(input: CreateWorkInput): Promise<Work>;
  deleteWork(workId: number): Promise<void>;
}
