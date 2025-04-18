import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  validateSync,
} from "class-validator";

// Associations Entity
import { User } from "@/domain/entities/User";

import { AppError } from "@/infrastructure/errors/AppError";

@Entity()
export class EmailVerificationToken {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  constructor(token: string, expiresAt: Date, userId: number) {
    this.token = token;
    this.expiresAt = expiresAt;
    this.userId = userId;
  }

  validate(): void {
    const errors = validateSync(this);
    if (errors.length > 0) {
      const validationMessages = errors
        .map((err) => Object.values(err.constraints!))
        .flat();
      throw new AppError("ValidationError", validationMessages.join(", "));
    }
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
