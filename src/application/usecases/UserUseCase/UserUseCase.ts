import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/UserRepository";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

interface CreateUserInput {
  familyId: number;
  name: string;
  email: string;
  password: string;
  role: "Parent" | "Child";
}

export class UserUseCase implements IUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async findAllByFamilyId(familyId: number): Promise<User[]> {
    return this.userRepository.findAllByFamilyId(familyId);
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const user = new User(
      input.familyId,
      input.name,
      input.email,
      input.password,
      input.role
    );

    return this.userRepository.save(user);
  }

  async updateUser(userId: number, input: CreateUserInput): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.familyId = input.familyId;
    user.name = input.name;
    user.email = input.email;
    user.password = input.password;
    user.role = input.role;

    return this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
