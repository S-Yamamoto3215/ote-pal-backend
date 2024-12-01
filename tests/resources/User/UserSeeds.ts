const parentUser1 = {
  id: 1,
  name: "Test Parent User1",
  email: "user1@example.com",
  password: "validPassword123",
  role: "Parent",
  familyId: 1,
};

const childUser1 = {
  id: 2,
  name: "Test Child User1",
  email: "user2@example.com",
  password: "validPassword456",
  role: "Child",
  familyId: 1,
};

const childUser2 = {
  id: 3,
  name: "Test Child User2",
  email: "user3@example.com",
  password: "validPassword789",
  role: "Child",
  familyId: 1,
};

const otherFamilyUser = {
  id: 4,
  name: "Test Other Family User",
  email: "user4@example.com",
  password: "validPassword012",
  role: "Parent",
  familyId: 2,
};

export const userSeeds = [parentUser1, childUser1, childUser2, otherFamilyUser];
