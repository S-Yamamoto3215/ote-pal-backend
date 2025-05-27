import { IsNotEmpty, IsString } from "class-validator";

/**
 * メール検証用トークンDTO
 * メール検証リクエストの検証に使用するDTOクラス
 */
export class VerifyEmailDTO {
  @IsNotEmpty({ message: "トークンは必須です" })
  @IsString({ message: "トークンは文字列で入力してください" })
  token!: string;
}
