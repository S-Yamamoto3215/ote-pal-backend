import { Family } from "@/domain/entities/Family";
import { CreateFamilyInput } from "@/types/FamilyTypes";

import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IUserRepository } from "@/domain/repositories/UserRepository";

import { IFamilyUseCase } from "@/application/usecases/FamilyUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

export class FamilyUseCase implements IFamilyUseCase {
  constructor(
    private familyRepository: IFamilyRepository,
    private userRepository: IUserRepository
  ) { }

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
        throw new AppError("ValidationError", "User already belongs to a family");
      }

      const family = new Family(input.name, input.paymentSchedule);
      const savedFamily = await this.familyRepository.save(family, user);

      return savedFamily;
    } catch (error) {
      throw error;
    }
  }
}
