import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Family } from './Family';
import { Work } from "./Work";
import { TaskDetail } from "./TaskDetail";

@Entity()
export class User extends BaseEntity {
  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: "parent" | "child";

  @Column({ default: true })
  isActive: boolean = true;

  @ManyToOne(() => Family, (family) => family.users)
  family!: Family;

  @OneToMany(() => User, (user) => user.works)
  works!: Work[];

  @OneToMany(() => User, (user) => user.taskDetails)
  taskDetails!: TaskDetail[];
}
