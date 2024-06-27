import { Sequelize } from "sequelize";
import sequelize from "../config/database";

import { User } from "./user";
import { Family } from "./family";
import { Task } from "./task";
import { TaskDetail } from "./taskDetail";
import { Work } from "./work";
import { ObjectSerializer } from "./models";

const db: { [key: string]: any } = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User.initModel(sequelize);
db.Family = Family.initModel(sequelize);
db.Task = Task.initModel(sequelize);
db.TaskDetail = TaskDetail.initModel(sequelize);
db.Work = Work.initModel(sequelize);


db.User.associate(db);
db.Family.associate(db);
db.Task.associate(db);
db.TaskDetail.associate(db);
db.Work.associate(db);

export default db;
