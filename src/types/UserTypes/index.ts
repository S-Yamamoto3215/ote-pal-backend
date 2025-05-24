export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: "Parent" | "Child";
  familyId: number | null;
}

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
}

export type InviteFamilyMemberInput = {
  email: string;
  role: "Parent" | "Child";
  familyId: number;
  inviterId: number;
}

export type AcceptInvitationInput = {
  token: string;
  name: string;
  password: string;
}
