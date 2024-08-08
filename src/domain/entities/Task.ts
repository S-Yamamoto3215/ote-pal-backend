import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Task extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;
}
