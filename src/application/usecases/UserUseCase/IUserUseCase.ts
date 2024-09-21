import { User } from "@/domain/entities/User";

// FIXME: CreateUserInput
interface CreateUserInput {
  familyId: number;
  name: string;
  email: string;
  password: string;
  role: "Parent" | "Child";
}

export interface IUserUseCase {
  getUserById(userId: number): Promise<User | null>;
  findAllByFamilyId(familyId: number): Promise<User[]>;
  createUser(input: CreateUserInput): Promise<User>;
  updateUser(userId: number, input: CreateUserInput): Promise<User>;
  deleteUser(userId: number): Promise<void>;
}
