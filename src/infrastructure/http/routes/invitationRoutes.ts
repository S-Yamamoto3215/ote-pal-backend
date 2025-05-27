import { Router } from "express";
import { UserInvitationControllerFactory } from "@/application/factories/UserInvitation/UserInvitationControllerFactory";
import { validationMiddleware } from "@/infrastructure/http/middlewares/validationMiddleware";
import {
  InviteMemberDTO,
  AcceptInvitationDTO,
  ResendInvitationDTO,
} from "@/interface/dto/Invitation";

export const invitationRouter = Router();
const userInvitationController = UserInvitationControllerFactory.create();

// 親ユーザーが家族メンバーを招待するエンドポイント
invitationRouter.post(
  "/invite",
  validationMiddleware(InviteMemberDTO),
  (req, res, next) => {
    userInvitationController.inviteMember(req, res, next);
  }
);

// 招待を受け入れるエンドポイント (認証不要)
invitationRouter.post(
  "/accept",
  validationMiddleware(AcceptInvitationDTO),
  (req, res, next) => {
    userInvitationController.acceptInvitation(req, res, next);
  }
);

// 招待メールを再送信するエンドポイント
invitationRouter.post(
  "/resend",
  validationMiddleware(ResendInvitationDTO),
  (req, res, next) => {
    userInvitationController.resendInvitation(req, res, next);
  }
);
