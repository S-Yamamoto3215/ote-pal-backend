import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

/**
 * ユーザー作成用DTO
 * ユーザー作成リクエストの検証に使用するDTOクラス
 */
export class CreateUserDTO {
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

  @IsNotEmpty({ message: "ユーザーロールは必須です" })
  @IsString({ message: "ユーザーロールは文字列で入力してください" })
  @IsIn(["Parent", "Child"], { message: "ユーザーロールは'Parent'または'Child'である必要があります" })
  role!: "Parent" | "Child";

  @IsNotEmpty({ message: "家族IDは必須です" })
  @IsNumber({}, { message: "家族IDは数値で入力してください" })
  @IsPositive({ message: "家族IDは正の数値で入力してください" })
  familyId!: number;
}
