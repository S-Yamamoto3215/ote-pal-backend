const parentUser1 = {
  id: 1,
  familyId: 1,
  name: "Test Parent User1",
  email: "user1@example.com",
  password: "password",
  role: "Parent",
};

const childUser1 = {
  id: 2,
  familyId: 1,
  name: "Test Child User1",
  email: "user2@example.com",
  password: "password",
  role: "Child",
};

const childUser2 = {
  id: 3,
  familyId: 1,
  name: "Test Child User2",
  email: "user3@example.com",
  password: "password",
  role: "Child",
};

const otherFamilyUser = {
  id: 4,
  familyId: 2,
  name: "Test Other Family User",
  email: "user4@example.com",
  password: "password",
  role: "Parent",
};


export const userSeeds = [
  parentUser1,
  childUser1,
  childUser2,
  otherFamilyUser
];
