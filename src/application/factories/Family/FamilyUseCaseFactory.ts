import { FamilyUseCase } from "@/application/usecases/FamilyUseCase";
import { FamilyRepositoryFactory } from "@/application/factories/Family/FamilyRepositoryFactory";
import { UserRepositoryFactory } from "@/application/factories/User/UserRepositoryFactory";

export class FamilyUseCaseFactory {
  static create(): FamilyUseCase {
    const familyRepository = FamilyRepositoryFactory.create();
    const userRepository = UserRepositoryFactory.create();
    return new FamilyUseCase(familyRepository, userRepository);
  }
}
