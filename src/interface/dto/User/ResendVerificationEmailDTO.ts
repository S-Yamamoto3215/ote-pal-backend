import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * 検証メール再送信用DTO
 * 検証メール再送信リクエストの検証に使用するDTOクラス
 */
export class ResendVerificationEmailDTO {
  @IsNotEmpty({ message: "メールアドレスは必須です" })
  @IsEmail({}, { message: "有効なメールアドレス形式で入力してください" })
  email!: string;
}
