import { Request, Response, NextFunction } from "express";
import { IUserInvitationController } from "./IUserInvitationController";
import { IUserUseCase } from "@/application/usecases/UserUseCase";

export class UserInvitationController implements IUserInvitationController {
  constructor(private userUseCase: IUserUseCase) {}

  async inviteMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "認証が必要です" });
        return;
      }

      const { email, role, familyId } = req.body;

      await this.userUseCase.inviteFamilyMember({
        email,
        role,
        familyId,
        inviterId: userId,
      });

      res.status(200).json({ message: "招待メールが送信されました" });
    } catch (error) {
      next(error);
    }
  }

  async acceptInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, name, password } = req.body;

      const user = await this.userUseCase.acceptInvitation({
        token,
        name,
        password,
      });

      res.status(200).json({
        message: "家族グループへの参加が完了しました",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          familyId: user.familyId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resendInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "認証が必要です" });
        return;
      }

      const { email, familyId } = req.body;

      await this.userUseCase.resendInvitation(email, familyId);

      res.status(200).json({ message: "招待メールが再送信されました" });
    } catch (error) {
      next(error);
    }
  }
}
