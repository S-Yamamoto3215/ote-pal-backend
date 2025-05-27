import { IsEmail, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

/**
 * 招待メール再送信用DTO
 * 招待メール再送信リクエストの検証に使用するDTOクラス
 */
export class ResendInvitationDTO {
  @IsNotEmpty({ message: "メールアドレスは必須です" })
  @IsEmail({}, { message: "有効なメールアドレス形式で入力してください" })
  email!: string;

  @IsNotEmpty({ message: "家族IDは必須です" })
  @IsNumber({}, { message: "家族IDは数値で入力してください" })
  @IsPositive({ message: "家族IDは正の数値で入力してください" })
  familyId!: number;
}
