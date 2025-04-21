import { Request, Response, NextFunction } from "express";
import { AppError } from "@/infrastructure/errors/AppError";

type UserRole = "Parent" | "Child";

export const hasRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", "Authentication required");
      }

      const userRole = req.user.role as UserRole;

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(
          "Forbidden",
          "You do not have permission to access this resource"
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

export const parentOnly = hasRole(["Parent"]);
export const childOnly = hasRole(["Child"]);
export const anyRole = hasRole(["Parent", "Child"]);
