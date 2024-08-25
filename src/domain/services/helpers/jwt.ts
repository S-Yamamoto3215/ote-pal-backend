import jwt from "jsonwebtoken";

import { User } from "../../entities/User";

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: "1h",
    }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
};
