import { DataSource } from "typeorm";

import { familySeeds } from "@tests/resources/Family/FamilySeeds";
import { userSeeds } from "@tests/resources/User/UserSeeds";

export async function seedDatabase(dataSource: DataSource) {
  // Family Seed
  await dataSource
    .createQueryBuilder()
    .insert()
    .into("family")
    .values(familySeeds)
    .execute();
  // User Seed
  await dataSource
    .createQueryBuilder()
    .insert()
    .into("user")
    .values(userSeeds)
    .execute();
  // Work Seed
  // Task Seed
  // TaskDetail Seed
  // Payment Seed
}
