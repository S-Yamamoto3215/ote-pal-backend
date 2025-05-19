import { Request } from 'express';

export const createMockRequest = (options: {
  body?: Record<string, any>;
  params?: Record<string, string>;
  query?: Record<string, any>;
  user?: {
    id: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  };
  headers?: Record<string, string>;
} = {}): Partial<Request> => {
  return {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    user: options.user,
    headers: options.headers || {},
    ...options
  };
};
