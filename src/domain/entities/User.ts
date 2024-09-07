export class User {
  constructor(
    private id: number | null,
    private familyId: number,
    private name: string,
    private email: string,
    private password: string,
    private role: "Parent" | "Child"
  ) {
    this.id = id;
    this.familyId = familyId;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  getId(): number | null {
    return this.id;
  }

  getFamilyId(): number {
    return this.familyId;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): "Parent" | "Child" {
    return this.role;
  }

  setId(id: number): void {
    this.id = id;
  }

  setFamilyId(familyId: number): void {
    this.familyId = familyId;
  }

  setName(name: string): void {
    this.name = name;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  setRole(role: "Parent" | "Child"): void {
    this.role = role;
  }
}
