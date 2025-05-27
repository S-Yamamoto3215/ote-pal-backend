import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

/**
 * タスク作成用DTO
 * タスク作成リクエストの検証に使用するDTOクラス
 */
export class CreateTaskDTO {
  @IsNotEmpty({ message: "タスク名は必須です" })
  @IsString({ message: "タスク名は文字列で入力してください" })
  name!: string;

  @IsNotEmpty({ message: "タスクの説明は必須です" })
  @IsString({ message: "タスクの説明は文字列で入力してください" })
  description!: string;

  @IsNotEmpty({ message: "報酬額は必須です" })
  @IsNumber({}, { message: "報酬額は数値で入力してください" })
  @Min(1, { message: "報酬額は1以上で入力してください" })
  reward!: number;

  @IsOptional()
  @IsNumber({}, { message: "家族IDは数値で入力してください" })
  @IsPositive({ message: "家族IDは正の数値で入力してください" })
  familyId?: number;
}
