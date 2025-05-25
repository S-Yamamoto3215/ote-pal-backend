import { Family } from "@/domain/entities/Family";
import { CreateFamilyInput, FamilyDetailOutput, FamilyUser } from "@/types/FamilyTypes";

import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IUserRepository } from "@/domain/repositories/UserRepository";

import { IFamilyUseCase } from "@/application/usecases/FamilyUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

export class FamilyUseCase implements IFamilyUseCase {
  constructor(
    private familyRepository: IFamilyRepository,
    private userRepository: IUserRepository
  ) {}

  async createFamily(input: CreateFamilyInput): Promise<Family> {
    try {
      const user = await this.userRepository.findById(input.userId);
      if (!user) {
        throw new AppError("NotFound", "User not found");
      }

      if (!user.isVerified) {
        throw new AppError("Unauthorized", "User is not verified");
      }

      if (user.familyId) {
        throw new AppError(
          "ValidationError",
          "User already belongs to a family"
        );
      }

      const family = new Family(input.name, input.paymentSchedule);
      const savedFamily = await this.familyRepository.save(family, user);

      return savedFamily;
    } catch (error) {
      throw error;
    }
  }

  async getFamilyDetailById(
    familyId: number,
    requestUserId: number
  ): Promise<FamilyDetailOutput> {
    try {
      // リクエストしているユーザーの確認
      const requestUser = await this.userRepository.findById(requestUserId);
      if (!requestUser) {
        throw new AppError("NotFound", "User not found");
      }

      // ユーザーが指定された家族に属しているかチェック
      if (requestUser.familyId !== familyId) {
        throw new AppError("Forbidden", "User does not belong to this family");
      }

      // 家族情報の取得
      const family = await this.familyRepository.findById(familyId);
      if (!family) {
        throw new AppError("NotFound", "Family not found");
      }

      // 家族に属するユーザーの取得
      const users = await this.userRepository.findByFamilyId(familyId);

      // レスポンス形式に整形
      const familyUsers: FamilyUser[] = users.map((user) => ({
        userId: user.id!,
        userName: user.name,
      }));

      return {
        name: family.name,
        paymentSchedule: family.payment_schedule,
        users: familyUsers,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateFamilyName(name: string, familyId: number, requestUserId: number): Promise<Family> {
    try {
      // requestUserIdのユーザーが更新権限を持っているか確認
      const requestUser = await this.userRepository.findById(requestUserId);
      if (!requestUser || requestUser.familyId !== familyId || !requestUser.isVerified || requestUser.role !== "Parent") {
        throw new AppError("Forbidden", "User does not have permission to update family name");
      }

      // 家族情報の取得
      const family = await this.familyRepository.findById(familyId);
      if (!family) {
        throw new AppError("NotFound", "Family not found");
      }

      // 家族名の更新
      family.name = name;
      const updatedFamily = await this.familyRepository.save(family, requestUser);
      return updatedFamily;
    } catch (error) {
      throw error;
    }
  };

  async updateFamilyPaymentSchedule(paymentSchedule: number, familyId: number, requestUserId: number): Promise<Family> {
    try {
      // requestUserIdのユーザーが更新権限を持っているか確認
      const requestUser = await this.userRepository.findById(requestUserId);
      if (!requestUser || requestUser.familyId !== familyId || !requestUser.isVerified || requestUser.role !== "Parent") {
        throw new AppError(
          "Forbidden",
          "User does not have permission to update family payment schedule"
        );
      }

      // 家族情報の取得
      const family = await this.familyRepository.findById(familyId);
      if (!family) {
        throw new AppError("NotFound", "Family not found");
      }

      // 家族名の更新
      family.payment_schedule = paymentSchedule;
      const updatedFamily = await this.familyRepository.save(
        family,
        requestUser
      );
      return updatedFamily;
    } catch (error) {
      throw error;
    }
  };
}
