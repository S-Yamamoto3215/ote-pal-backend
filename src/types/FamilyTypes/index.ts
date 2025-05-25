export type CreateFamilyInput = {
  name: string;
  paymentSchedule: number;
  userId: number;
};

export type FamilyUser = {
  userId: number;
  userName: string;
};

export type FamilyDetailOutput = {
  name: string;
  paymentSchedule: number;
  users: FamilyUser[];
};
