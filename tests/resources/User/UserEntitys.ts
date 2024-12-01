import { User } from "@/domain/entities/User";

export const parentUser = new User(
  "Parent User",
  "parent@example.com",
  "validPassword123",
  "Parent",
  1,
);

export const childUser1 = new User(
  "Child User1",
  "child1@example.com",
  "validPassword456",
  "Child",
  1,
);

export const childUser2 = new User(
  "Child User2",
  "child2@example.com",
  "validPassword789",
  "Child",
  1,
);

export const otherFamilyUser = new User(
  "Other Family User",
  "other@example.com",
  "validPassword012",
  "Parent",
  2,
);
