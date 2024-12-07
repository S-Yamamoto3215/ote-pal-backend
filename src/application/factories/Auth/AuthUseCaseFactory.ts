import { AuthService } from "@/application/services/AuthService";
import { AuthUseCase } from "@/application/usecases/AuthUseCase";
import { AuthRepositoryFactory } from "@/application/factories/Auth/AuthRepositoryFactory";

export class AuthUseCaseFactory {
  static create(): AuthUseCase {
    const authRepository = AuthRepositoryFactory.create();
    return new AuthUseCase(authRepository, new AuthService());
  }
}
