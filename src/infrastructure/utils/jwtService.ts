import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const jwtService = {
  generateToken: (payload: object, expiresIn: string = "1h"): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  verifyToken: (token: string): any => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  },
};
