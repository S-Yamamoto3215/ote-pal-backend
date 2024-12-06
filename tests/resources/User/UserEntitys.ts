import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";

export const parentUser = new User(
  "Parent User",
  "parent@example.com",
  new Password("validPassword123"),
  "Parent",
  1,
);

export const childUser1 = new User(
  "Child User1",
  "child1@example.com",
  new Password("validPassword456"),
  "Child",
  1,
);

export const childUser2 = new User(
  "Child User2",
  "child2@example.com",
  new Password("validPassword789"),
  "Child",
  1,
);

export const otherFamilyUser = new User(
  "Other Family User",
  "other@example.com",
  new Password("validPassword012"),
  "Parent",
  2,
);
