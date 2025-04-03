import { Family } from "@/domain/entities/Family";

export interface IFamilyRepository {
  save(family: Family): Promise<Family>;
  findById(id: number): Promise<Family | null>;
  delete(id: number): Promise<void>;
}
