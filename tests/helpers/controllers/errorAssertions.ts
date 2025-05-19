import { NextFunction } from 'express';

export const expectErrorToBeCalled = (
  next: jest.MockedFunction<NextFunction>,
  errorType: string,
  errorMessage: string
): void => {
  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      errorType,
      message: errorMessage,
    })
  );
};

export const expectErrorWithMessageToBeCalled = (
  next: jest.MockedFunction<NextFunction>,
  errorMessage: string
): void => {
  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.stringContaining(errorMessage),
    })
  );
};

export const expectMissingFieldsErrorToBeCalled = (
  next: jest.MockedFunction<NextFunction>,
  ...missingFields: string[]
): void => {
  const fieldList = missingFields.join(', ');
  const expectedMessage = missingFields.length === 1
    ? `Missing required field: ${fieldList}`
    : `Missing required fields: ${fieldList}`;

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      errorType: 'ValidationError',
      message: expectedMessage,
    })
  );
};
