import { Repository, DataSource } from "typeorm";

import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/UserRepository";

export class UserRepository implements IUserRepository {
  private repo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  async findAllByFamilyId(familyId: number): Promise<User[]> {
    return this.repo.find({ where: { familyId } });
  }
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
