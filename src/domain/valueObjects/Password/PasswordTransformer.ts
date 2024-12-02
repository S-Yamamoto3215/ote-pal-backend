import { ValueTransformer } from "typeorm";
import { Password } from "@/domain/valueObjects/Password";

export class PasswordTransformer implements ValueTransformer {
  to(value: Password): string {
    return value.getValue();
  }

  from(value: string): Password {
    return Password.fromHashed(value);
  }
}
