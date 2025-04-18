const futureDate = new Date();
futureDate.setHours(futureDate.getHours() + 1);

const pastDate = new Date();
pastDate.setHours(pastDate.getHours() - 1);

export const validToken1 = {
  id: 1,
  token: "valid-token-for-user1",
  expiresAt: futureDate,
  userId: 1,
};

export const validToken2 = {
  id: 2,
  token: "valid-token-for-user2",
  expiresAt: futureDate,
  userId: 2,
};

export const expiredToken = {
  id: 3,
  token: "expired-token",
  expiresAt: pastDate,
  userId: 3,
};

export const otherFamilyToken = {
  id: 4,
  token: "other-family-token",
  expiresAt: futureDate,
  userId: 4,
};

export const emailVerificationTokenSeeds = [
  validToken1,
  validToken2,
  expiredToken,
  otherFamilyToken,
];
