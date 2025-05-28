import { Request, Response, NextFunction } from "express";
import { AppError } from "@/infrastructure/errors/AppError";
import { UserRole, IRoleChecker, RoleChecker, RoleCheckResult } from "@/domain/permissions";

/**
 * Expressミドルウェア用のロールチェッカーアダプター
 */
export class RoleMiddlewareAdapter {
  private roleChecker: IRoleChecker;

  constructor() {
    this.roleChecker = new RoleChecker();
  }

  /**
   * 特定のロールを持つユーザーのみアクセスを許可するミドルウェアを生成
   * @param allowedRoles 許可するロールの配列
   * @returns Expressミドルウェア
   */
  hasRole(allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new AppError("Unauthorized", "認証が必要です");
        }

        const userRole = req.user.role as UserRole;
        const result = this.roleChecker.hasAnyRole(userRole, allowedRoles);

        if (result.success) {
          next();
        } else {
          throw new AppError(
            "Forbidden",
            result.errorMessage || "このリソースにアクセスする権限がありません"
          );
        }
      } catch (error) {
        if (error instanceof AppError) {
          next(error);
        } else if (error instanceof Error) {
          next(new AppError("Forbidden", error.message));
        } else {
          next(
            new AppError(
              "Forbidden",
              "このリソースにアクセスする権限がありません"
            )
          );
        }
      }
    };
  }

  /**
   * カスタムロールチェックを実行するミドルウェアを生成
   * @param checkFn カスタムチェック関数
   * @returns Expressミドルウェア
   */
  customRoleCheck(checkFn: (role: UserRole) => boolean) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new AppError("Unauthorized", "認証が必要です");
        }

        const userRole = req.user.role as UserRole;
        const result = this.roleChecker.customRoleCheck(userRole, checkFn);

        if (result.success) {
          next();
        } else {
          throw new AppError(
            "Forbidden",
            result.errorMessage || "このリソースにアクセスする権限がありません"
          );
        }
      } catch (error) {
        if (error instanceof AppError) {
          next(error);
        } else if (error instanceof Error) {
          next(new AppError("Forbidden", error.message));
        } else {
          next(
            new AppError(
              "Forbidden",
              "このリソースにアクセスする権限がありません"
            )
          );
        }
      }
    };
  }
}

// シングルトンインスタンスを作成
const roleMiddleware = new RoleMiddlewareAdapter();

// 既存の関数名をそのままエクスポートして、後方互換性を確保
export const hasRole = (allowedRoles: UserRole[]) => roleMiddleware.hasRole(allowedRoles);
export const parentOnly = roleMiddleware.hasRole(["Parent"]);
export const childOnly = roleMiddleware.hasRole(["Child"]);
export const anyRole = roleMiddleware.hasRole(["Parent", "Child"]);
export const customRoleCheck = (checkFn: (role: UserRole) => boolean) =>
  roleMiddleware.customRoleCheck(checkFn);
