import { MailService } from "@/application/services/MailService";
import { config } from "@/config";

export class MailServiceFactory {
  static create(): MailService {
    return new MailService(
      config.sendgrid.apiKey,
      config.sendgrid.fromEmail,
      config.app.baseUrl
    );
  }
}
