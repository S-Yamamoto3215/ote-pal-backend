import { OperationType, PermissionPolicy, ResourceType } from "./types";

/**
 * リソース権限ポリシークラス
 * リソースタイプと操作タイプに基づいた権限ポリシーを定義・管理する
 *
 * このクラスは権限ポリシーの設定と管理のみを担当し、実際の権限チェックロジックは
 * ResourcePermissionCheckerクラスが担当する
 */
export class ResourcePermissionMatrix {
  private static policies: PermissionPolicy[] = [
    {
      resourceType: "family",
      allowedRoles: {
        create: ["Parent"],
        read: ["Parent", "Child"],
        update: ["Parent"],
        delete: ["Parent"]
      },
      requiresOwnership: {
        read: false,
        update: true,
        delete: true
      }
    },
    {
      resourceType: "task",
      allowedRoles: {
        create: ["Parent"],
        read: ["Parent", "Child"],
        update: ["Parent"],
        delete: ["Parent"]
      },
      requiresOwnership: {
        update: true,
        delete: true
      }
    },
    {
      resourceType: "taskDetail",
      allowedRoles: {
        create: ["Parent"],
        read: ["Parent", "Child"],
        update: ["Parent"],
        delete: ["Parent"]
      }
    },
    {
      resourceType: "work",
      allowedRoles: {
        create: ["Child"],
        read: ["Parent", "Child"],
        update: ["Child"],
        delete: ["Child"],
        approve: ["Parent"]
      },
      requiresOwnership: {
        update: true,
        delete: true
      },
      customChecks: {
        update: [
          // 承認済みのワークは更新不可
          (ctx) => !(ctx.additionalData?.isApproved === true)
        ]
      }
    },
    {
      resourceType: "payment",
      allowedRoles: {
        create: ["Parent"],
        read: ["Parent", "Child"],
        update: ["Parent"],
        delete: ["Parent"]
      }
    },
    {
      resourceType: "profile",
      allowedRoles: {
        read: ["Parent", "Child"],
        update: ["Parent", "Child"]
      },
      requiresOwnership: {
        update: true
      }
    }
  ];

  /**
   * 指定されたリソースタイプのポリシーを取得
   * @param resourceType リソースタイプ
   * @returns 該当するポリシー、存在しない場合はundefined
   */
  static getPolicy(resourceType: ResourceType): PermissionPolicy | undefined {
    return this.policies.find(policy => policy.resourceType === resourceType);
  }

  /**
   * 指定されたリソースタイプに対して定義されている全ポリシーを取得
   * @returns 全ポリシーの配列
   */
  static getAllPolicies(): PermissionPolicy[] {
    return [...this.policies];
  }

  /**
   * 指定されたリソースタイプと操作に対する許可ロールを取得
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @returns 許可されたロールの配列、存在しない場合は空配列
   */
  static getAllowedRoles(resourceType: ResourceType, operation: OperationType): string[] {
    const policy = this.getPolicy(resourceType);
    if (!policy || !policy.allowedRoles || !policy.allowedRoles[operation as keyof typeof policy.allowedRoles]) {
      return [];
    }
    return policy.allowedRoles[operation as keyof typeof policy.allowedRoles] || [];
  }

  /**
   * 指定されたリソースタイプと操作に対して所有権チェック設定を取得
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @returns 所有者チェックが必要であればtrue、そうでなければfalse
   */
  static getOwnershipRequirement(resourceType: ResourceType, operation: OperationType): boolean {
    const policy = this.getPolicy(resourceType);
    if (!policy || !policy.requiresOwnership) {
      return false;
    }

    // 型安全なアクセスのため、キーの存在を確認
    return policy.requiresOwnership.hasOwnProperty(operation) ?
      !!policy.requiresOwnership[operation as keyof typeof policy.requiresOwnership] : false;
  }

  /**
   * 指定されたリソースタイプと操作に対するカスタムチェック関数を取得
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @returns カスタムチェック関数の配列、存在しない場合は空配列
   */
  static getCustomChecks(resourceType: ResourceType, operation: OperationType): ((ctx: any) => boolean)[] {
    const policy = this.getPolicy(resourceType);
    if (!policy || !policy.customChecks) {
      return [];
    }

    // 型安全なアクセスのため、キーの存在を確認
    if (!policy.customChecks.hasOwnProperty(operation)) {
      return [];
    }

    return policy.customChecks[operation as keyof typeof policy.customChecks] || [];
  }

  // 互換性維持のためのメソッド
  /**
   * @deprecated isOperationAllowedForRoleメソッドはResourcePermissionCheckerに移行されました。
   * 代わりにResourcePermissionChecker.isOperationAllowedForRoleを使用してください。
   */
  static isOperationAllowedForRole(resourceType: ResourceType, operation: OperationType, role: string): boolean {
    const allowedRoles = this.getAllowedRoles(resourceType, operation);
    return allowedRoles.includes(role);
  }

  /**
   * @deprecated requiresOwnershipCheckメソッドはResourcePermissionCheckerに移行されました。
   * 代わりにResourcePermissionChecker.requiresOwnershipCheckを使用してください。
   */
  static requiresOwnershipCheck(resourceType: ResourceType, operation: OperationType): boolean {
    return this.getOwnershipRequirement(resourceType, operation);
  }

  /**
   * 新しいポリシーをマトリックスに追加
   * @param policy 追加するポリシー
   */
  static addPolicy(policy: PermissionPolicy): void {
    // 既存のポリシーを上書き、または新規追加
    const index = this.policies.findIndex(p => p.resourceType === policy.resourceType);
    if (index >= 0) {
      this.policies[index] = policy;
    } else {
      this.policies.push(policy);
    }
  }

  /**
   * 指定されたリソースタイプのポリシーを更新
   * @param resourceType リソースタイプ
   * @param policyUpdates 更新内容
   */
  static updatePolicy(resourceType: ResourceType, policyUpdates: Partial<PermissionPolicy>): void {
    const index = this.policies.findIndex(p => p.resourceType === resourceType);
    if (index >= 0) {
      this.policies[index] = { ...this.policies[index], ...policyUpdates };
    }
  }
}
