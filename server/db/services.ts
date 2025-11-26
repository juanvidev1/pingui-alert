// import { User } from "./models.ts";
import { dbHandler, dbOpenObj } from "./config.ts";

export class UserService {
  static createUser(username: string, chatId: number, secret: string) {
    const db = dbHandler();
    db.prepare(`INSERT INTO users (username, chat_id, secret) VALUES (?, ?, ?)`).run(username, chatId, secret);
    db.close();
    dbOpenObj.dbOpened = false;
    return true;
  }

  static getAllUsers() {
    const db = dbHandler();
    const rows = db.prepare("SELECT * FROM users").all();
    const users = rows.map(row => ({
      chatId: row.chat_id,
      username: row.username,
      secret: row.secret,
      registeredAt: row.registered_at
    })) as unknown as { chatId: number; username: string; secret: string; registeredAt: Date }[];
    db.close();
    dbOpenObj.dbOpened = false; 
    return users;
  }
}