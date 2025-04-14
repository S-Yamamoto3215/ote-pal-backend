import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  saveWithFamily(user: User, family: Family): Promise<User>;
}
