import { FamilyInvitationToken } from "@/domain/entities/FamilyInvitationToken";

export interface IFamilyInvitationTokenRepository {
  save(invitationToken: FamilyInvitationToken): Promise<FamilyInvitationToken>;
  findByToken(token: string): Promise<FamilyInvitationToken | null>;
  findByEmail(email: string, familyId: number): Promise<FamilyInvitationToken | null>;
  deleteByToken(token: string): Promise<void>;
  deleteByEmail(email: string, familyId: number): Promise<void>;
}
