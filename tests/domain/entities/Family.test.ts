import { Family } from "@/domain/entities/Family";

import { familySeeds } from "@tests/resources/Family/FamilySeeds";

describe("Family Entity", () => {
  it("should create a Family instance with the given name and payment schedule", () => {
    const { name, payment_schedule } = familySeeds[0];

    const family = new Family(name, payment_schedule);
    expect(family.name).toBe(name);
    expect(family.payment_schedule).toBe(payment_schedule);
  });
});
