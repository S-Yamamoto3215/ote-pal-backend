import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/application/services/AuthService";
import { AppError } from "@/infrastructure/errors/AppError";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Unauthorized", "Authentication token is required");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", "Invalid authentication scheme");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Unauthorized", "Authentication token is required");
    }

    const authService = new AuthService();
    const payload = authService.verifyToken(token);

    if (typeof payload === 'object' && payload !== null) {
      req.user = {
        id: payload.id as number,
        email: payload.email as string,
        role: payload.role as string,
        iat: payload.iat,
        exp: payload.exp
      };
    } else {
      throw new AppError("Unauthorized", "Invalid token");
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(
        new AppError("Unauthorized", error.message || "Authentication failed")
      );
    } else {
      next(new AppError("Unauthorized", "Authentication failed"));
    }
  }
};
