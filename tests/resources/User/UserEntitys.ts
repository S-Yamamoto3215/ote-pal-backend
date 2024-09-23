import { User } from "@/domain/entities/User";

export const parentUser = new User(
  "Parent User",
  "parent@example.com",
  "password",
  "Parent",
  1
);

export const childUser1 = new User(
  "Child User1",
  "child1@example.com",
  "password",
  "Child",
  1
);

export const childUser2 = new User(
  "Child User2",
  "child2@example.com",
  "password",
  "Child",
  1
);

export const otherFamilyUser = new User(
  "Other Family User",
  "other@example.com",
  "password",
  "Parent",
  2
);
