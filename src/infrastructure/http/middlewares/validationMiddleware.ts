import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { AppError } from "@/infrastructure/errors/AppError";

/**
 * バリデーションミドルウェア
 * リクエストボディを指定されたDTOクラスにマッピングし、バリデーションを実行する
 *
 * @param dtoClass バリデーション対象のDTOクラス
 * @param skipMissingProperties プロパティが欠けている場合にスキップするかどうか
 * @returns Express middleware function
 */
export function validationMiddleware(dtoClass: any, skipMissingProperties = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // リクエストボディをDTOクラスのインスタンスに変換
      const dtoObject = plainToInstance(dtoClass, req.body);

      // バリデーション実行
      const errors = await validate(dtoObject, {
        skipMissingProperties,
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        // バリデーションエラーがある場合はエラーメッセージを生成
        const messages = formatValidationErrors(errors);
        next(new AppError("ValidationError", messages));
      } else {
        // バリデーション成功の場合、変換済みオブジェクトをreq.bodyにセット
        req.body = dtoObject;
        next();
      }
    } catch (error) {
      next(new AppError("InternalServerError", "バリデーション処理中にエラーが発生しました"));
    }
  };
}

/**
 * バリデーションエラーのフォーマット
 * ネストされたバリデーションエラーも処理する
 *
 * @param errors バリデーションエラーの配列
 * @returns フォーマットされたエラーメッセージ
 */
function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((error: ValidationError) => {
      if (error.constraints) {
        // 制約のエラーメッセージを取得
        return Object.values(error.constraints).join(", ");
      } else if (error.children && error.children.length) {
        // ネストされたプロパティのエラーを処理
        return `${error.property}: ${formatValidationErrors(error.children)}`;
      }
      return `${error.property}の検証でエラーが発生しました`;
    })
    .join("; ");
}
