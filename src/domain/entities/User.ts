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
import { TaskDetail } from "@/domain/entities/TaskDetail";
import { Password, PasswordTransformer } from "@/domain/valueObjects/Password";

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

  @Column({
    type: "varchar",
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: Password;

  @Column({
    type: "enum",
    enum: ["Parent", "Child"],
    update: false,
  })
  @IsEnum(["Parent", "Child"], { message: "Role must be 'Parent' or 'Child'" })
  role: "Parent" | "Child";

  @Column({
    default: false,
  })
  isVerified: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  familyId: number | null;
  @ManyToOne(() => Family, (family) => family.users)
  readonly family!: Family;

  @OneToMany(() => Work, (work) => work.user, {
    createForeignKeyConstraints: false,
    persistence: false,
  })
  readonly works?: Work[];

  @OneToMany(() => TaskDetail, (taskDetail) => taskDetail.user, {
    createForeignKeyConstraints: false,
    persistence: false,
  })
  readonly taskDetails?: TaskDetail[];

  constructor(
    name: string,
    email: string,
    password: Password,
    role: "Parent" | "Child",
    isVerified: boolean,
    familyId: number | null
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isVerified = isVerified;
    this.familyId = familyId;
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
}
