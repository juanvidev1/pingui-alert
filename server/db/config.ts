import { DatabaseSync } from "node:sqlite";
import {Sequelize} from "sequelize";

export const dbOpenObj = {
  dbOpened: false
};
const db = new DatabaseSync("test.db");
dbOpenObj.dbOpened = true;
// console.log("Fuera de la función", db);

export const dbHandler = () => {
  // console.log("Dentro de la función", db, dbOpenObj.dbOpened);
  if (!dbOpenObj.dbOpened) {
    db.open();
    dbOpenObj.dbOpened = true;
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        chat_id INTEGER NOT NULL,
        secret TEXT NULLABLE,
        alerts_remaining INTEGER DEFAULT 10,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);
  return db;
}

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "test.db",
});

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}