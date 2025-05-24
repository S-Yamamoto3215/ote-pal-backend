import { UserInvitationController } from "@/interface/controllers/UserInvitationController";
import { UserUseCaseFactory } from "@/application/factories/User/UserUseCaseFactory";

export class UserInvitationControllerFactory {
  static create(): UserInvitationController {
    const userUseCase = UserUseCaseFactory.create();
    return new UserInvitationController(userUseCase);
  }
}
