import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/UserRepository";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

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
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError("NotFound", "User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAllByFamilyId(familyId: number): Promise<User[]> {
    try {
      return this.userRepository.findAllByFamilyId(familyId);
    } catch (error) {
      throw error;
    }
  }

  async createUser(input: CreateUserInput): Promise<User> {
    try {
      const user = new User(
        input.familyId,
        input.name,
        input.email,
        input.password,
        input.role
      );

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: number, input: CreateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new AppError("NotFound", "User not found");
      }

      user.setFamilyId(input.familyId);
      user.setName(input.name);
      user.setEmail(input.email);
      user.setPassword(input.password);
      user.setRole(input.role);

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await this.userRepository.delete(userId);
    } catch (error) {
      throw error;
    }
  }
}
