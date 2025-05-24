import { IMailService } from "@/application/services/MailService";
import { AppError } from "@/infrastructure/errors/AppError";
import sgMail from "@sendgrid/mail";

export class MailService implements IMailService {
  constructor(
    private apiKey: string,
    private fromEmail: string,
    private baseUrl: string
  ) {
    sgMail.setApiKey(this.apiKey);
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    const verificationUrl = `${this.baseUrl}/users/verify-email?token=${token}`;

    const msg = {
      to: email,
      from: this.fromEmail,
      subject: "メールアドレスの確認",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>こんにちは、${name}さん</h2>
          <p>アカウントを有効化するために、以下のリンクをクリックしてメールアドレスを確認してください：</p>
          <p>
            <a
              href="${verificationUrl}"
              style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;"
            >
              メールアドレスを確認する
            </a>
          </p>
          <p>このリンクは1時間後に無効になります。</p>
          <p>リンクが機能しない場合は、以下のURLをブラウザに貼り付けてください：</p>
          <p>${verificationUrl}</p>
          <hr>
          <p style="font-size: 12px; color: #666;">このメールは自動送信されています。返信しないでください。</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error("Send email error:", error);
      throw new AppError("SendMailError", "メール送信に失敗しました");
    }
  }

  async sendFamilyInvitationEmail(
    email: string,
    inviterName: string,
    familyName: string,
    role: "Parent" | "Child",
    token: string
  ): Promise<void> {
    const invitationUrl = `${this.baseUrl}/invitation/accept?token=${token}`;
    const roleText = role === "Parent" ? "親" : "子";

    const msg = {
      to: email,
      from: this.fromEmail,
      subject: `【OtePal】${inviterName}さんから家族グループに招待されました`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>OtePalへの招待</h2>
          <p>${inviterName}さんがあなたを「${familyName}」という家族グループに${roleText}として招待しています。</p>
          <p>招待を受け入れて家族グループに参加するには、以下のリンクをクリックしてください：</p>
          <p>
            <a
              href="${invitationUrl}"
              style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;"
            >
              招待を受け入れる
            </a>
          </p>
          <p>このリンクは24時間後に無効になります。</p>
          <p>リンクが機能しない場合は、以下のURLをブラウザに貼り付けてください：</p>
          <p>${invitationUrl}</p>
          <hr>
          <p style="font-size: 12px; color: #666;">このメールは自動送信されています。返信しないでください。</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error("Send email error:", error);
      throw new AppError("SendMailError", "メール送信に失敗しました");
    }
  }
}
