import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  private id?: number;

  @Column({
    update: false,
  })
  private familyId: number;

  @Column()
  private name: string;

  @Column({
    unique: true
  })
  private email: string;

  @Column()
  private password: string;

  @Column({
    type: "enum",
    enum: ["Parent", "Child"],
    update: false,
  })
  private role: "Parent" | "Child";

  constructor(
    familyId: number,
    name: string,
    email: string,
    password: string,
    role: "Parent" | "Child"
  ) {
    this.familyId = familyId;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  getId(): number | undefined {
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
