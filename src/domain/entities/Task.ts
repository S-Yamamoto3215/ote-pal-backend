import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { Family } from "@/domain/entities/Family";
import { Work } from "@/domain/entities/Work";
import { TaskDetail } from "@/domain/entities/TaskDetail";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  reward: number;

  @Column()
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

  getId(): number | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getReward(): number {
    return this.reward;
  }

  getFamilyId(): number {
    return this.familyId;
  }

  setId(id: number): void {
    this.id = id;
  }

  setName(name: string): void {
    this.name = name;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setReward(reward: number): void {
    this.reward = reward;
  }

  setFamilyId(familyId: number): void {
    this.familyId = familyId;
  }
}
