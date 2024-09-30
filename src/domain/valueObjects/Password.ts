import bcrypt from "bcrypt";
import { IsNotEmpty, Length, validateSync } from "class-validator";

import { AppError } from "@/infrastructure/errors/AppError";

export class Password {
  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  private value: string;

  constructor(value: string, isHashed = false) {
    this.value = value;

    if (!isHashed) {
      this.validate();
      this.value = this.hashPasswordSync(this.value);
    }
  }

  private validate(): void {
    const errors = validateSync(this);
    if (errors.length > 0) {
      const validationMessages = errors
        .map((err) => Object.values(err.constraints!))
        .flat();
      throw new AppError("ValidationError", validationMessages.join(", "));
    }
  }

  private hashPasswordSync(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.value);
  }

  public getValue(): string {
    return this.value;
  }
}
