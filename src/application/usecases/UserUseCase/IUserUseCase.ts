import { User } from "@/domain/entities/User";
import {
  CreateUserInput,
  RegisterUserInput,
  InviteFamilyMemberInput,
  AcceptInvitationInput
} from "@/domain/types/UserTypes";

export interface IUserUseCase {
  createUser(input: CreateUserInput): Promise<User>;
  registerUser(input: RegisterUserInput): Promise<User>;
  verifyEmail(token: string): Promise<User>;
  resendVerificationEmail(email: string): Promise<void>;
  inviteFamilyMember(input: InviteFamilyMemberInput): Promise<void>;
  acceptInvitation(input: AcceptInvitationInput): Promise<User>;
  resendInvitation(email: string, familyId: number): Promise<void>;
}
