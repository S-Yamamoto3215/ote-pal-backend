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
  let originalConsoleError: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mailService = new MailService(mockApiKey, mockFromEmail, mockBaseUrl);
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe("constructor", () => {
    it("should properly initialize SendGrid with API key when service is created", () => {
      // Arrange & Act - constructor was called in beforeEach
      
      // Assert
      expect(sgMail.setApiKey).toHaveBeenCalledWith(mockApiKey);
      // プライベートプロパティは直接テストできないため、間接的に動作をテストします
    });
  });

  describe("sendVerificationEmail", () => {
    const mockEmail = "user@example.com";
    const mockName = "Test User";
    const mockToken = "verification-token";

    it("should call SendGrid API with correct email parameters when verification email is sent", async () => {
      // Arrange
      (sgMail.send as jest.Mock).mockResolvedValue({});

      // Act
      await mailService.sendVerificationEmail(mockEmail, mockName, mockToken);

      // Assert
      expect(sgMail.send).toHaveBeenCalledTimes(1);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: mockEmail,
        from: mockFromEmail,
        subject: "メールアドレスの確認",
        html: expect.stringContaining(mockName),
      }));
    });

    it("should include proper verification URL in email content when verification email is sent", async () => {
      // Arrange
      (sgMail.send as jest.Mock).mockResolvedValue({});

      // Act
      await mailService.sendVerificationEmail(mockEmail, mockName, mockToken);

      // Assert
      const expectedUrl = `${mockBaseUrl}/users/verify-email?token=${mockToken}`;
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        html: expect.stringContaining(expectedUrl),
      }));
    });

    it("should throw AppError with 'メール送信に失敗しました' message when SendGrid API fails", async () => {
      // Arrange
      const mockError = new Error("Sending failed");
      (sgMail.send as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(mailService.sendVerificationEmail(mockEmail, mockName, mockToken))
        .rejects.toThrow(AppError);
      await expect(mailService.sendVerificationEmail(mockEmail, mockName, mockToken))
        .rejects.toThrow("メール送信に失敗しました");

      expect(sgMail.send).toHaveBeenCalledTimes(2);
    });
  });
});
