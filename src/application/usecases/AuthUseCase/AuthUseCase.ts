import { IUserRepository } from "@/domain/repositories/UserRepository";

import { AuthService } from "@/application/services/AuthService";
import { IAuthUseCase } from "@/application/usecases/AuthUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  async login(email: string, plainPassword: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("NotFound", "User not found");
    }

    const isSuccess = await user.password.compare(plainPassword);
    if (!isSuccess) {
      throw new AppError("ValidationError", "Invalid password");
    }

    return this.authService.generateToken(user);
  }
}
