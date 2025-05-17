import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";

export const parentUser = new User(
  "Parent User",
  "parent@example.com",
  new Password("validPassword123"),
  "Parent",
  true,
  1,
);

export const parentUser2 = new User(
  "Parent User2",
  "parent2@example.com",
  new Password("validPassword123"),
  "Parent",
  true,
  null
);

export const childUser1 = new User(
  "Child User1",
  "child1@example.com",
  new Password("validPassword456"),
  "Child",
  false,
  1
);

export const childUser2 = new User(
  "Child User2",
  "child2@example.com",
  new Password("validPassword789"),
  "Child",
  false,
  1
);

export const otherFamilyUser = new User(
  "Other Family User",
  "other@example.com",
  new Password("validPassword012"),
  "Parent",
  false,
  2
);

export const user5 = new User(
  "User5",
  "child2@example.com",
  new Password("validPassword789"),
  "Parent",
  false,
  null
);
