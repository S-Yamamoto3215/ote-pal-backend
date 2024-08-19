import { User as AppUser } from "../../domain/entities/User";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
