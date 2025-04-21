import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}
