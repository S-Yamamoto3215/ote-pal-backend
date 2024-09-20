import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  private id: number | undefined;

  @Column({
    update: false,
  })
  private task_id: number;

  @Column({
    update: false,
  })
  private user_id: number;

  @Column({
    type: "enum",
    enum: ["In Progress", "Completed", "Approved", "Rejected"],
    default: "In Progress",
  })
  private status: "In Progress" | "Completed" | "Approved" | "Rejected";

  constructor(
    task_id: number,
    user_id: number,
    status: "In Progress" | "Completed" | "Approved" | "Rejected"
  ) {
    this.task_id = task_id;
    this.user_id = user_id;
    this.status = status;
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

  getStatus(): "In Progress" | "Completed" | "Approved" | "Rejected" {
    return this.status;
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

  setStatus(
    status: "In Progress" | "Completed" | "Approved" | "Rejected"
  ): void {
    this.status = status;
  }
}
