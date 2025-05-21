import { IAuthService } from "@/application/services/AuthService";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { User } from "@/domain/entities/User";

export class AuthService implements IAuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = config.jwt.secret;
    this.jwtExpiresIn = config.jwt.expiresIn;
  }

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  verifyToken(token: string): string | jwt.JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw new Error("Token verification failed");
    }
  }
}
