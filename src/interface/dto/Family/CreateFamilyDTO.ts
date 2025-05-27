import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

/**
 * 家族作成用DTO
 * 家族作成リクエストの検証に使用するDTOクラス
 */
export class CreateFamilyDTO {
  @IsNotEmpty({ message: "家族名は必須です" })
  @IsString({ message: "家族名は文字列で入力してください" })
  name!: string;

  @IsNotEmpty({ message: "支払い日は必須です" })
  @IsNumber({}, { message: "支払い日は数値で入力してください" })
  @Min(1, { message: "支払い日は1以上で入力してください" })
  paymentSchedule!: number;

  @IsNotEmpty({ message: "ユーザーIDは必須です" })
  @IsNumber({}, { message: "ユーザーIDは数値で入力してください" })
  @IsPositive({ message: "ユーザーIDは正の数値で入力してください" })
  userId!: number;
}
