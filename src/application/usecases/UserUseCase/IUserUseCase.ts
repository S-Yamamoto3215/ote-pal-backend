import { User } from "@/domain/entities/User";
import { CreateUserInput, CreateUserWithFamilyInput } from "@/types/UserTypes";

export interface IUserUseCase {
  createUser(input: CreateUserInput): Promise<User>;
  createUserWithFamily(input: CreateUserWithFamilyInput): Promise<User>;
}
