import { Task } from "@/domain/entities/Task";

/**
 * Task エンティティのモックオブジェクトを生成するファクトリ関数
 *
 * @param override 基本値をオーバーライドするプロパティのオブジェクト
 * @returns Task エンティティのモックオブジェクト
 */
export const createMockTask = (override: {
  id?: number;
  name?: string;
  description?: string;
  reward?: number;
  familyId?: number;
} = {}): Task => {
  const defaultProps = {
    id: 1,
    name: "テストタスク",
    description: "テストタスクの説明です",
    reward: 100,
    familyId: 1
  };

  // オーバーライドプロパティを適用
  const mergedProps = { ...defaultProps, ...override };

  // Task オブジェクトを生成
  const task = new Task(
    mergedProps.name,
    mergedProps.description,
    mergedProps.reward,
    mergedProps.familyId
  );

  // IDを手動設定（コンストラクタでは設定されない）
  if (mergedProps.id !== undefined) {
    Object.defineProperty(task, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  return task;
};
