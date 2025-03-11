import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { IsNotEmpty, Min, validateSync } from "class-validator";

import { Family } from "@/domain/entities/Family";
import { Work } from "@/domain/entities/Work";
import { TaskDetail } from "@/domain/entities/TaskDetail";

import { AppError } from "@/infrastructure/errors/AppError";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @Column()
  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @Column()
  @Min(1, { message: "Reward must be greater than 0" })
  reward: number;

  @Column()
  @IsNotEmpty({ message: "Family ID is required" })
  familyId!: number;

  @ManyToOne(() => Family, (family) => family.tasks)
  readonly family!: Family;

  @OneToMany(() => TaskDetail, (taskDetail) => taskDetail.task, {
    createForeignKeyConstraints: false,
    persistence: false,
  })
  readonly taskDetails?: TaskDetail[];

  @OneToMany(() => Work, (work) => work.task, {
    createForeignKeyConstraints: false,
    persistence: false,
  })
  readonly works?: Work[];

  constructor(
    name: string,
    description: string,
    reward: number,
    familyId: number
  ) {
    this.name = name;
    this.description = description;
    this.reward = reward;
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
