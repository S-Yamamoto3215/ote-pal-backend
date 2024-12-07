import { AuthController } from "@/interface/controllers/AuthController";
import { AuthUseCaseFactory } from "@/application/factories/Auth/AuthUseCaseFactory";

export class AuthControllerFactory {
  static create(): AuthController {
    const authUseCase = AuthUseCaseFactory.create();
    return new AuthController(authUseCase);
  }
}
