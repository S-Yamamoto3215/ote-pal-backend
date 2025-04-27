import { CreateFamilyInput } from "@/types/FamilyTypes";
import { Family } from "@/domain/entities/Family";

export interface IFamilyUseCase {
  createFamily(input: CreateFamilyInput): Promise<Family>;
}
