import { FamilyController } from "@/interface/controllers/FamilyController";
import { FamilyUseCaseFactory } from "@/application/factories/Family/FamilyUseCaseFactory";

export class FamilyControllerFactory {
  static create(): FamilyController {
    const familyUseCase = FamilyUseCaseFactory.create();
    return new FamilyController(familyUseCase);
  }
}
