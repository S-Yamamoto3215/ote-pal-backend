import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Work extends BaseEntity {
  @Column({ type: "enum", enum: ["in_progress", "pending", "completed"] })
  status!: "in_progress" | "pending" | "completed";

  @Column({ type: "timestamp", nullable: true })
  paymentDate?: Date;
}
