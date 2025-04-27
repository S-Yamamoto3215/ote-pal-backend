import { Family } from "@/domain/entities/Family";
import { User } from "@/domain/entities/User";

export interface IFamilyRepository {
  save(family: Family, user: User): Promise<Family>;
  findById(id: number): Promise<Family | null>;
  delete(id: number): Promise<void>;
}
