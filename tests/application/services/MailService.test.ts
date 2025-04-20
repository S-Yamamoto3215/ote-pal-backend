import { MailService } from "@/application/services/MailService";
import { AppError } from "@/infrastructure/errors/AppError";
import sgMail from "@sendgrid/mail";

// SendGridのモック化
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe("MailService", () => {
  let mailService: MailService;
  const mockApiKey = "mock-api-key";
  const mockFromEmail = "from@example.com";
  const mockBaseUrl = "http://localhost:3000";

  beforeEach(() => {
    jest.clearAllMocks();
    mailService = new MailService(mockApiKey, mockFromEmail, mockBaseUrl);
  });

  describe("constructor", () => {
    it("should initialize with the provided parameters", () => {
      expect(sgMail.setApiKey).toHaveBeenCalledWith(mockApiKey);
      // プライベートプロパティは直接テストできないため、間接的に動作をテストします
    });
  });

  describe("sendVerificationEmail", () => {
    const mockEmail = "user@example.com";
    const mockName = "Test User";
    const mockToken = "verification-token";

    it("should send an email with correct parameters", async () => {
      (sgMail.send as jest.Mock).mockResolvedValue({});

      await mailService.sendVerificationEmail(mockEmail, mockName, mockToken);

      expect(sgMail.send).toHaveBeenCalledTimes(1);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: mockEmail,
        from: mockFromEmail,
        subject: "メールアドレスの確認",
        html: expect.stringContaining(mockName),
      }));
    });

    it("should include verification URL in the email", async () => {
      (sgMail.send as jest.Mock).mockResolvedValue({});

      await mailService.sendVerificationEmail(mockEmail, mockName, mockToken);

      const expectedUrl = `${mockBaseUrl}/users/verify-email?token=${mockToken}`;
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        html: expect.stringContaining(expectedUrl),
      }));
    });

    it("should throw AppError when sending email fails", async () => {
      const mockError = new Error("Sending failed");
      (sgMail.send as jest.Mock).mockRejectedValue(mockError);

      await expect(mailService.sendVerificationEmail(mockEmail, mockName, mockToken))
        .rejects.toThrow(AppError);
      await expect(mailService.sendVerificationEmail(mockEmail, mockName, mockToken))
        .rejects.toThrow("メール送信に失敗しました");

      expect(sgMail.send).toHaveBeenCalledTimes(2);
    });
  });
});
