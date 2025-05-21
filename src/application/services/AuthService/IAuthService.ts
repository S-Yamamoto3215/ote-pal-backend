import jwt from "jsonwebtoken";
import { User } from "@/domain/entities/User";

export interface IAuthService {
  generateToken(user: User): string;
  verifyToken(token: string): string | jwt.JwtPayload;
}
