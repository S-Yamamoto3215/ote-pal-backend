import { Response } from 'express';

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };

  return res;
};
