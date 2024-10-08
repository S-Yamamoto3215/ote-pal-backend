import { UserController } from "@/interface/controllers/UserController";
import { UserUseCaseFactory } from "@/application/factories/User/UserUseCaseFactory";

export class UserControllerFactory {
  static create(): UserController {
    const userUseCase = UserUseCaseFactory.create();
    return new UserController(userUseCase);
  }
}
