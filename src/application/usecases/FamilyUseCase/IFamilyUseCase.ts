import { CreateFamilyInput, FamilyDetailOutput } from "@/types/FamilyTypes";
import { Family } from "@/domain/entities/Family";

export interface IFamilyUseCase {
  createFamily(input: CreateFamilyInput): Promise<Family>;
  getFamilyDetailById(familyId: number, requestUserId: number): Promise<FamilyDetailOutput>;
  updateFamilyName(name: string, familyId: number, requestUserId: number): Promise<Family>;
  updateFamilyPaymentSchedule(PaymentSchedule: number, familyId: number, requestUserId: number): Promise<Family>;
}
