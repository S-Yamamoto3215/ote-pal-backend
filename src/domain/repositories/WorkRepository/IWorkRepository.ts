import { Work } from "@/domain/entities/Work";

export interface IWorkRepository {
  save(work: Work): Promise<Work>;
  delete(workId: number): Promise<void>;
}
