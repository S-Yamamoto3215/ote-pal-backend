import { Sequelize } from "sequelize";
import sequelize from "../config/database";

const db: { [key: string]: any } = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models can be initialized here
// db.User = require('./user')(sequelize, Sequelize);

export default db;
