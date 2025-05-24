import { FamilyInvitationToken } from "@/domain/entities/FamilyInvitationToken";

export const createMockFamilyInvitationToken = (override: {
  id?: number;
  token?: string;
  expiresAt?: Date;
  email?: string;
  role?: "Parent" | "Child";
  familyId?: number;
  inviterId?: number;
  isExpired?: boolean | (() => boolean);
} = {}): FamilyInvitationToken => {
  const defaultExpiresAt = new Date();
  defaultExpiresAt.setHours(defaultExpiresAt.getHours() + 24);

  const defaultProps = {
    id: 1,
    token: "test-invitation-token",
    expiresAt: defaultExpiresAt,
    email: "test@example.com",
    role: "Parent" as "Parent" | "Child",
    familyId: 1,
    inviterId: 1
  };

  const mergedProps = { ...defaultProps, ...override };

  const token = new FamilyInvitationToken(
    mergedProps.token,
    mergedProps.expiresAt,
    mergedProps.email,
    mergedProps.role,
    mergedProps.familyId,
    mergedProps.inviterId
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
