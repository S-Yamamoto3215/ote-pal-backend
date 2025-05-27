import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * ユーザー登録用DTO
 * ユーザー登録リクエストの検証に使用するDTOクラス
 */
export class RegisterUserDTO {
  @IsNotEmpty({ message: "名前は必須です" })
  @IsString({ message: "名前は文字列で入力してください" })
  name!: string;

  @IsNotEmpty({ message: "メールアドレスは必須です" })
  @IsEmail({}, { message: "有効なメールアドレス形式で入力してください" })
  email!: string;

  @IsNotEmpty({ message: "パスワードは必須です" })
  @IsString({ message: "パスワードは文字列で入力してください" })
  @MinLength(8, { message: "パスワードは8文字以上で入力してください" })
  password!: string;
}
