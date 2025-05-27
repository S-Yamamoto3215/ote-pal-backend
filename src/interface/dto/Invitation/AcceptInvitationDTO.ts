import { IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * 招待受け入れ用DTO
 * 招待受け入れリクエストの検証に使用するDTOクラス
 */
export class AcceptInvitationDTO {
  @IsNotEmpty({ message: "招待トークンは必須です" })
  @IsString({ message: "招待トークンは文字列で入力してください" })
  token!: string;

  @IsNotEmpty({ message: "名前は必須です" })
  @IsString({ message: "名前は文字列で入力してください" })
  name!: string;

  @IsNotEmpty({ message: "パスワードは必須です" })
  @IsString({ message: "パスワードは文字列で入力してください" })
  @MinLength(8, { message: "パスワードは8文字以上で入力してください" })
  password!: string;
}
