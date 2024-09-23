import { User } from "@/domain/entities/User";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAllByFamilyId(familyId: number): Promise<User[]>;
  delete(userId: number): Promise<void>;
}
