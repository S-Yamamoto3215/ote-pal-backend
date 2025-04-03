import { DataSource } from "typeorm";

import { FamilyRepository } from "@/domain/repositories/FamilyRepository/FamilyRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

describe("FamilyRepository", () => {
  let dataSource: DataSource;
  let familyRepository: FamilyRepository;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    await seedDatabase(dataSource);
    familyRepository = new FamilyRepository(dataSource);
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  // e.x) save method
  // describe("save", () => {
  //   it("should save a family successfully", async () => {
  //     const result = await familyRepository.save(parentFamily);
  //
  //     expect(result).toBe(parentFamily);
  //     expect(result.id).toBeDefined();
  //   });
  // });

});
