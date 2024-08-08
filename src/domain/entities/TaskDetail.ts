import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class TaskDetail extends BaseEntity {
  @Column("int")
  amount!: number;
}
