import { UserUseCase } from "@/application/usecases/UserUseCase";
import { UserRepositoryFactory } from "@/application/factories/User/UserRepositoryFactory";

export class UserUseCaseFactory {
  static create(): UserUseCase {
    const userRepository = UserRepositoryFactory.create();
    return new UserUseCase(userRepository);
  }
}
