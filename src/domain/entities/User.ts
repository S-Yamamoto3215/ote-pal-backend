import {
  Entity,
  Column,
} from "typeorm";

import { BaseEntity } from "./BaseEntity";

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
  isActive!: boolean;
}
