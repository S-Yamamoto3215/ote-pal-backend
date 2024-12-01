import jwt from "jsonwebtoken";

import { User } from "@/domain/entities/User";

import { IUserRepository } from "@/domain/repositories/UserRepository";

import { IAuthUseCase } from "@/application/usecases/AuthUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

const secretkey = process.env.JWT_SECRET_KEY || "your_secret_key";

export class AuthUseCase implements IAuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("NotFound", "User not found");
    }

    const isPasswordValid = await user.password.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Unauthorized", "Invalid email or password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretkey, {
      expiresIn: "1h",
    });

    return token;
  }
}
