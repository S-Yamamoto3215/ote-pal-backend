import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// User attributes interface
interface UserAttributes {
  id: string;
  familyId: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

// Optional attributes for creation
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public familyId!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        familyId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "family_id",
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: "is_active",
        },
      },
      {
        sequelize,
        tableName: "users",
        timestamps: true,
      }
    );

    return User;
  }

  static associate(db: any) {
    db.User.belongsTo(db.Family, { foreignKey: "familyId", as: "family" });
    db.User.hasMany(db.Work, { foreignKey: "userId", as: "works" });
    db.User.hasMany(db.TaskDetail, { foreignKey: "userId", as: "taskDetails" });
  }
}
