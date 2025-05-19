import { Family } from "@/domain/entities/Family";

import { familySeeds } from "@tests/resources/Family/FamilySeeds";

describe("Family Entity", () => {
  const validParams = {
    name: "Test Family 1",
    payment_schedule: 1,
  };

  it("should create a Family instance with the given name and payment schedule", () => {
    const family = new Family(
      validParams.name,
      validParams.payment_schedule
    );

    expect(family.name).toBe(validParams.name);
    expect(family.payment_schedule).toBe(validParams.payment_schedule);
  });
});
