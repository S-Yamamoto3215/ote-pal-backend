import { User } from "@/domain/entities/User";

import { testFamily1, testFamily2 } from "@tests/resources/Family/FamilyEntitys";

export const parentUser = new User(
  testFamily1,
  "Parent User",
  "parent@example.com",
  "password",
  "Parent"
);

export const childUser1 = new User(
  testFamily1,
  "Child User1",
  "child1@example.com",
  "password",
  "Child"
);

export const childUser2 = new User(
  testFamily1,
  "Child User2",
  "child2@example.com",
  "password",
  "Child"
);

export const otherFamilyUser = new User(
  testFamily2,
  "Other Family User",
  "other@example.com",
  "password",
  "Parent"
);
