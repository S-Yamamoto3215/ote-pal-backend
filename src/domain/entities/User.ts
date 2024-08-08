import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Family } from './Family';

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
}
