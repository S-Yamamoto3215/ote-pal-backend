import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Family } from "./Family";
import { Work } from "./Work";
import { TaskDetail } from "./TaskDetail";

@Entity()
export class Task extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => Family, (family) => family.tasks)
  family!: Family;

  @OneToMany(() => Task, (task) => task.works)
  works!: Work[];

  @OneToMany(() => Task, (task) => task.taskDetails)
  taskDetails!: TaskDetail[];
}
