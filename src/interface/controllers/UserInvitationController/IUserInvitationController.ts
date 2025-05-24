import { Request, Response, NextFunction } from "express";

export interface IUserInvitationController {
  /**
   * 家族メンバーを招待するエンドポイント
   */
  inviteMember(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * 招待を受け入れるエンドポイント
   */
  acceptInvitation(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * 招待メールを再送信するエンドポイント
   */
  resendInvitation(req: Request, res: Response, next: NextFunction): Promise<void>;
}
