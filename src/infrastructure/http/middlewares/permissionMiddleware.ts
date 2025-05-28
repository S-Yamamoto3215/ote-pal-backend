import { Request, Response, NextFunction } from "express";
import { AppError } from "@/infrastructure/errors/AppError";
import { ResourcePermissionUtil } from "@/domain/permissions/resource/ResourcePermissionUtil";
import { ResourceType, OperationType } from "@/domain/permissions/resource/types";

export const checkResourcePermission = (resourceType: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", "Authentication required");
      }

      const userRole = req.user.role as "Parent" | "Child";
      const userId = req.user.id;

      // 新しい権限マトリックスを使用して権限チェック
      const hasPermission = ResourcePermissionUtil.canAccess(
        resourceType as ResourceType,
        action as OperationType,
        userRole
      );

      if (!hasPermission) {
        throw new AppError(
          "Forbidden",
          `You do not have permission to perform ${action} operation on ${resourceType}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else if (error instanceof Error) {
        next(new AppError("Forbidden", error.message));
      } else {
        next(
          new AppError(
            "Forbidden",
            "You do not have permission to access this resource"
          )
        );
      }
    }
  };
};
