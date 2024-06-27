import {Sequelize, DataTypes, Model, Optional} from "sequelize";

// Family attributes interface
interface FamilyAttributes {
  id: string;
  name: string;
  paymentDay: number;
}

// Optional attributes for creation
interface FamilyCreationAttributes extends Optional<FamilyAttributes, "id"> {}

export class Family
  extends Model<FamilyAttributes, FamilyCreationAttributes>
  implements FamilyAttributes
{
  public id !: string;
  public name !: string;
  public paymentDay !: number;

  public readonly createdAt !: Date;
  public readonly updatedAt !: Date;

  static initModel(sequelize: Sequelize): typeof Family {
    Family.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      paymentDay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "payment_day"
      }
    }, {
      sequelize,
      tableName: "families",
      timestamps: true
    });

    return Family;
  }

  static associate(db : any) {
    db.Family.hasMany(db.User, { foreignKey: "familyId", as: "users" });
    db.Family.hasMany(db.Task, { foreignKey: "familyId", as: "tasks" });
  }
}
