import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAllByFamily(family: Family): Promise<User[]>;
  delete(id: number): Promise<void>;
}
