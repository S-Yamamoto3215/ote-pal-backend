import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

/**
 * 家族支払い日更新用DTO
 * 家族支払い日更新リクエストの検証に使用するDTOクラス
 */
export class UpdateFamilyPaymentScheduleDTO {
  @IsNotEmpty({ message: "支払い日は必須です" })
  @IsInt({ message: "支払い日は整数値で入力してください" })
  @Min(1, { message: "支払い日は1以上で入力してください" })
  @Max(31, { message: "支払い日は31以下で入力してください" })
  paymentSchedule!: number;
}
