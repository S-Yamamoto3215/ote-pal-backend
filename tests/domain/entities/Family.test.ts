import { Family } from "@/domain/entities/Family";

describe("Family Entity", () => {
  it("should create a Family instance with the given name and payment schedule", () => {
    const family = new Family("Doe Family", "Monthly");
    expect(family.name).toBe("Doe Family");
    expect(family.payment_schedule).toBe("Monthly");
  });
});
