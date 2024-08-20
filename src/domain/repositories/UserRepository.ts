import { User } from "../entities/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../../infrastructure/database/ormconfig";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findById(id: User["id"]): Promise<User> {
    // TODO: UserRepository findById
    return await this.repository.findOne(id);
  }

  async findByFamilyID(familyID: User["family"]["id"]): Promise<User[]> {
    // TODO: UserRepository findByFamilyID
    return await this.repository.find({ where: { family: { id: familyID } } });
  }

  async delete(user: User): Promise<void> {
    // TODO: UserRepository delete
    await this.repository.remove(user);
  }

  async update(user: User): Promise<User> {
    // TODO: UserRepository update
    return await this.repository.save(user);
  }
}
