import { User } from "@/domain/entities/User";

import { IUserRepository } from "@/domain/repositories/UserRepository";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "Parent" | "Child";
  familyId: number;
}

export class UserUseCase implements IUserUseCase {
  constructor(private userRepository: IUserRepository) {}

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
        input.name,
        input.email,
        input.password,
        input.role,
        input.familyId
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

      user.name = input.name;
      user.email = input.email;
      user.password = input.password;
      user.role = input.role;
      user.familyId = input.familyId;

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
