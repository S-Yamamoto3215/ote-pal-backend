export interface IMailService {
  sendVerificationEmail(email: string, name: string, token: string): Promise<void>;
}
