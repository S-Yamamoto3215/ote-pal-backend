import { Request, Response, NextFunction } from "express";
import { AppError } from "@/infrastructure/errors/AppError";

export const checkResourcePermission = (resourceType: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", "Authentication required");
      }

      const userRole = req.user.role as "Parent" | "Child";
      let hasPermission = false;

      switch (resourceType) {
        case 'family':
          hasPermission = userRole === 'Parent';
          break;
        case 'task':
          if (action === 'create' || action === 'update' || action === 'delete') {
            hasPermission = userRole === 'Parent';
          } else if (action === 'read') {
            hasPermission = true;
          }
          break;
        case 'taskDetail':
          if (action === 'create' || action === 'update' || action === 'delete') {
            hasPermission = userRole === 'Parent';
          } else if (action === 'read') {
            hasPermission = true;
          }
          break;
        case 'work':
          if (action === 'create' || action === 'update') {
            hasPermission = userRole === 'Child';
          } else if (action === 'read') {
            hasPermission = true;
          } else if (action === 'delete') {
            hasPermission = userRole === 'Child';
          } else if (action === 'approve') {
            hasPermission = userRole === 'Parent';
          }
          break;
        case 'payment':
          hasPermission = userRole === 'Parent';
          break;
        default:
          hasPermission = false;
      }

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
