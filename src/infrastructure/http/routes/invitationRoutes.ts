import { Router } from "express";
import { UserInvitationControllerFactory } from "@/application/factories/UserInvitation/UserInvitationControllerFactory";
import { authenticate } from "@/infrastructure/http/middlewares/authMiddleware";

export const invitationRouter = Router();
const userInvitationController = UserInvitationControllerFactory.create();

// 親ユーザーが家族メンバーを招待するエンドポイント
invitationRouter.post("/invite", (req, res, next) => {
  userInvitationController.inviteMember(req, res, next);
});

// 招待を受け入れるエンドポイント (認証不要)
invitationRouter.post("/accept", (req, res, next) => {
  userInvitationController.acceptInvitation(req, res, next);
});

// 招待メールを再送信するエンドポイント
invitationRouter.post("/resend", (req, res, next) => {
  userInvitationController.resendInvitation(req, res, next);
});
