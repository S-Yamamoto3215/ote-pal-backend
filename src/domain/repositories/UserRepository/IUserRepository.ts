import { User } from "@/domain/entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}
