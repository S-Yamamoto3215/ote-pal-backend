import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Family } from "./Family";

@Entity()
export class Task extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => Family, (family) => family.tasks)
  family!: Family;
}
