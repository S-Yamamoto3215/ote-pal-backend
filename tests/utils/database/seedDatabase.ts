import { DataSource } from "typeorm";

import { familySeeds } from "@tests/resources/Family/FamilySeeds";
import { userSeeds } from "@tests/resources/User/UserSeeds";
import { taskSeeds } from "@tests/resources/Task/TaskSeeds";
import { workSeeds } from "@tests/resources/Work/WorkSeeds";
import { emailVerificationTokenSeeds } from "@tests/resources/EmailVerificationToken/EmailVerificationTokenSeeds";

export async function seedDatabase(dataSource: DataSource) {
  await dataSource
    .createQueryBuilder()
    .insert()
    .into("family")
    .values(familySeeds)
    .execute();
  await dataSource
    .createQueryBuilder()
    .insert()
    .into("user")
    .values(userSeeds)
    .execute();
  await dataSource
    .createQueryBuilder()
    .insert()
    .into("task")
    .values(taskSeeds)
    .execute();
  await dataSource
    .createQueryBuilder()
    .insert()
    .into("work")
    .values(workSeeds)
    .execute();
  await dataSource
    .createQueryBuilder()
    .insert()
    .into("email_verification_token")
    .values(emailVerificationTokenSeeds)
    .execute();
}
