import { User } from "@/domain/entities/User";

export const parentUser = new User(
  1,
  "Parent User",
  "parent@example.com",
  "password",
  "Parent"
);

export const childUser1 = new User(
  1,
  "Child User1",
  "child1@example.com",
  "password",
  "Child"
);

export const childUser2 = new User(
  1,
  "Child User2",
  "child2@example.com",
  "password",
  "Child"
);

export const otherFamilyUser = new User(
  2,
  "Other Family User",
  "other@example.com",
  "password",
  "Parent"
);
