import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

/**
 * メンバー招待用DTO
 * 招待リクエストの検証に使用するDTOクラス
 */
export class InviteMemberDTO {
  @IsNotEmpty({ message: "メールアドレスは必須です" })
  @IsEmail({}, { message: "有効なメールアドレス形式で入力してください" })
  email!: string;

  @IsNotEmpty({ message: "ロールは必須です" })
  @IsEnum(["Parent", "Child"], { message: "ロールはParentまたはChildのいずれかである必要があります" })
  role!: "Parent" | "Child";
}
