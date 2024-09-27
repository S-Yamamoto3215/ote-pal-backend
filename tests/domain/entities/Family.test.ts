import { Family } from "@/domain/entities/Family";

describe("Family Entity", () => {
  it("should create a Family instance with the given name and payment schedule", () => {
    const family = new Family("Doe Family", "Monthly");
    expect(family.getName()).toBe("Doe Family");
    expect(family.getPaymentSchedule()).toBe("Monthly");
  });

  it("should set and get the id correctly", () => {
    const family = new Family("Doe Family", "Monthly");
    family.setId(1);
    expect(family.getId()).toBe(1);
  });

  it("should set and get the name correctly", () => {
    const family = new Family("Doe Family", "Monthly");
    family.setName("Smith Family");
    expect(family.getName()).toBe("Smith Family");
  });

  it("should set and get the payment schedule correctly", () => {
    const family = new Family("Doe Family", "Monthly");
    family.setPaymentSchedule("Weekly");
    expect(family.getPaymentSchedule()).toBe("Weekly");
  });
});
