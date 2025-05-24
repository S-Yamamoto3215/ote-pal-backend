export interface IMailService {
  sendVerificationEmail(email: string, name: string, token: string): Promise<void>;
  sendFamilyInvitationEmail(
    email: string,
    inviterName: string,
    familyName: string,
    role: "Parent" | "Child",
    token: string
  ): Promise<void>;
}
