import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  private id?: number;

  @Column({
    update: false,
  })
  private family_id: number;

  @Column()
  private name: string;

  @Column()
  private description: string;

  @Column()
  private reward: number;

  constructor(
    family_id: number,
    name: string,
    description: string,
    reward: number
  ) {
    this.family_id = family_id;
    this.name = name;
    this.description = description;
    this.reward = reward;
  }

  getId(): number | undefined {
    return this.id;
  }

  getFamilyId(): number {
    return this.family_id;
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

  setId(id: number): void {
    this.id = id;
  }

  setFamilyId(family_id: number): void {
    this.family_id = family_id;
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
}
