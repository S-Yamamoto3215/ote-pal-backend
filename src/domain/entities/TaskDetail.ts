import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class TaskDetail {
  @PrimaryGeneratedColumn()
  private id?: number;

  @Column({
    update: false,
  })
  private task_id: number;

  @Column({
    update: false,
  })
  private user_id: number;

  @Column({
    nullable: true,
  })
  private custom_description: string;

  @Column({
    nullable: true,
  })
  private custom_reward: number;

  constructor(
    task_id: number,
    user_id: number,
    custom_description: string,
    custom_reward: number
  ) {
    this.task_id = task_id;
    this.user_id = user_id;
    this.custom_description = custom_description;
    this.custom_reward = custom_reward;
  }

  getId(): number | undefined {
    return this.id;
  }

  getTaskId(): number {
    return this.task_id;
  }

  getUserId(): number {
    return this.user_id;
  }

  getCustomDescription(): string {
    return this.custom_description;
  }

  getCustomReward(): number {
    return this.custom_reward;
  }

  setId(id: number): void {
    this.id = id;
  }

  setTaskId(task_id: number): void {
    this.task_id = task_id;
  }

  setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  setCustomDescription(custom_description: string): void {
    this.custom_description = custom_description;
  }

  setCustomReward(custom_reward: number): void {
    this.custom_reward = custom_reward;
  }
}
