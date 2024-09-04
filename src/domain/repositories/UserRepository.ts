import { User } from "../entities/User";
import { OrmUser } from "../../infrastructure/database/entities/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../../infrastructure/database/ormconfig";

export interface IUserRepository {
  save(user: User): Promise<OrmUser>;
  findById(userId: string): Promise<OrmUser | null>;
  findByEmail(email: string): Promise<OrmUser | null>;
  findMyFamilyUsers(familyId: string): Promise<OrmUser[]>;
  update(user: User): Promise<OrmUser>;
  delete(user: User): Promise<OrmUser>;
}

// TODO: Implement the methods of the IUserRepository interface
export class UserRepository implements IUserRepository {
  private repository: Repository<OrmUser>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrmUser);
  }

  async save(user: User): Promise<OrmUser> {
    const newUser = new OrmUser();
    // TODO: Userエンティティの値をOrmUserエンティティに変換して保存する
    newUser.id = user.getId();
    // newUser.email = user.getEmail();
    // newUser.password = user.getPassword();
    // newUser.role = user.getRole();
    // newUser.isActive = user.getIsActive();
    // newUser.family = user.getFamily();

    return await this.repository.save(newUser);
  }

  async findById(userId: string): Promise<OrmUser | null> {
    return await this.repository.findOneBy({ id: userId });
  }

  async findByEmail(email: string): Promise<OrmUser | null> {
    return await this.repository.findOneBy({ email: email });
  }

  async findMyFamilyUsers(userId: string): Promise<OrmUser[]> {
    const currentUser = await this.repository.findOneBy({ id: userId });
    return currentUser?.family.users || [];
  }

  async update(user: User): Promise<OrmUser> {
    const targetUser = await this.repository.findOneBy({ id: user.getId() });
    if (!targetUser) {
      throw new Error("User not found");
    }
    // TODO: Userエンティティの値をOrmUserエンティティに変換して更新する

    return await this.repository.save(targetUser);
  }

  async delete(user: User): Promise<OrmUser> {
    const targetUser = await this.repository.findOneBy({ id: user.getId() });
    if (!targetUser) {
      throw new Error("User not found");
    }

    return await this.repository.remove(targetUser);
  }
}
