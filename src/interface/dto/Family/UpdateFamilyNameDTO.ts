import { IsNotEmpty, IsString } from "class-validator";

/**
 * 家族名更新用DTO
 * 家族名更新リクエストの検証に使用するDTOクラス
 */
export class UpdateFamilyNameDTO {
  @IsNotEmpty({ message: "家族名は必須です" })
  @IsString({ message: "家族名は文字列で入力してください" })
  name!: string;
}
