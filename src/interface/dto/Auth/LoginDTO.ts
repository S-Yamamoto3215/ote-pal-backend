import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * ログイン用DTO
 * ログインリクエストの検証に使用するDTOクラス
 */
export class LoginDTO {
  @IsNotEmpty({ message: "メールアドレスは必須です" })
  @IsEmail({}, { message: "有効なメールアドレス形式で入力してください" })
  email!: string;

  @IsNotEmpty({ message: "パスワードは必須です" })
  @IsString({ message: "パスワードは文字列で入力してください" })
  @MinLength(8, { message: "パスワードは8文字以上で入力してください" })
  password!: string;
}
