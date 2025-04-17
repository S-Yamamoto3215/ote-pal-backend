import { Password } from "@/domain/valueObjects/Password";

const parentUser1 = {
  id: 1,
  name: "Test Parent User1",
  email: "user1@example.com",
  password: new Password("validPassword123"),
  role: "Parent",
  isVerified: false,
  familyId: 1,
};

const childUser1 = {
  id: 2,
  name: "Test Child User1",
  email: "user2@example.com",
  password: new Password("validPassword456"),
  role: "Child",
  isVerified: false,
  familyId: 1,
};

const childUser2 = {
  id: 3,
  name: "Test Child User2",
  email: "user3@example.com",
  password: new Password("validPassword789"),
  role: "Child",
  isVerified: false,
  familyId: 1,
};

const otherFamilyUser = {
  id: 4,
  name: "Test Other Family User",
  email: "user4@example.com",
  password: new Password("validPassword012"),
  role: "Parent",
  isVerified: false,
  familyId: 2,
};

export const userSeeds = [parentUser1, childUser1, childUser2, otherFamilyUser];
