import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

/**
 * タスク更新用DTO
 * タスク更新リクエストの検証に使用するDTOクラス
 */
export class UpdateTaskDTO {
  @IsOptional()
  @IsString({ message: "タスク名は文字列で入力してください" })
  name?: string;

  @IsOptional()
  @IsString({ message: "タスクの説明は文字列で入力してください" })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "報酬額は数値で入力してください" })
  @IsPositive({ message: "報酬額は正の数値で入力してください" })
  reward?: number;

  @IsOptional()
  @IsNumber({}, { message: "家族IDは数値で入力してください" })
  @IsPositive({ message: "家族IDは正の数値で入力してください" })
  familyId?: number;
}
