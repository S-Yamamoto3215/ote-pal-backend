import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";

export const createMockEmailVerificationToken = (override: {
  id?: number;
  token?: string;
  expiresAt?: Date;
  userId?: number;
  isExpired?: boolean | (() => boolean);
} = {}): EmailVerificationToken => {
  const defaultExpiresAt = new Date();
  defaultExpiresAt.setHours(defaultExpiresAt.getHours() + 1);

  const defaultProps = {
    id: 1,
    token: "test-verification-token",
    expiresAt: defaultExpiresAt,
    userId: 1
  };

  const mergedProps = { ...defaultProps, ...override };

  const token = new EmailVerificationToken(
    mergedProps.token,
    mergedProps.expiresAt,
    mergedProps.userId
  );

  if (mergedProps.id !== undefined) {
    Object.defineProperty(token, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  if (override.isExpired !== undefined) {
    token.isExpired = typeof override.isExpired === 'function'
      ? override.isExpired
      : () => !!override.isExpired;
  }

  return token;
};
