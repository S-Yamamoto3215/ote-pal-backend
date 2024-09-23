import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Length,
  validateSync,
} from "class-validator";

import { Family } from "@/domain/entities/Family";
import { Work } from "@/domain/entities/Work";

import { AppError } from "@/infrastructure/errors/AppError";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @IsNotEmpty({ message: "Name is required" })
  @Length(1, 20, { message: "Name must be between 1 and 20" })
  name: string;

  @Column({
    unique: true,
  })
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Column()
  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 20, { message: "Password must be between 6 and 20" })
  password: string;

  @Column({
    type: "enum",
    enum: ["Parent", "Child"],
    update: false,
  })
  @IsEnum(["Parent", "Child"], { message: "Role must be 'Parent' or 'Child'" })
  role: "Parent" | "Child";

  @OneToMany(() => Work, (work) => work.user)
  works!: Work[];

  @ManyToOne(() => Family, (family) => family.users)
  family!: Family;

  constructor(
    family: Family,
    name: string,
    email: string,
    password: string,
    role: "Parent" | "Child"
  ) {
    this.family = family;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  validate(): void {
    const errors = validateSync(this);
    if (errors.length > 0) {
      const validationMessages = errors
        .map((err) => Object.values(err.constraints!))
        .flat();
      throw new AppError("ValidationError", validationMessages.join(", "));
    }
  }

  getId(): number | undefined {
    return this.id;
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

  getFamilyId(): number | undefined {
    return this.family.id;
  }

  setId(id: number): void {
    this.id = id;
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

  setFamily(family: Family): void {
    this.family = family;
  }
}
