export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "Parent" | "Child";
  familyId: number | null;
}
