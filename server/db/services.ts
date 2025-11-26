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
      alertsRemaining: row.alerts_remaining,
      registeredAt: row.registered_at
    })) as unknown as { chatId: number; username: string; secret: string; alertsRemaining: number; registeredAt: Date }[];
    db.close();
    dbOpenObj.dbOpened = false; 
    return users;
  }

  static updateUserAlertsRemaining(chatId: number, alertsRemaining: number) {
    const db = dbHandler();
    db.prepare(`UPDATE users SET alerts_remaining = ? WHERE chat_id = ?`).run(alertsRemaining, chatId);
    db.close();
    dbOpenObj.dbOpened = false;
    return {chatId, alertsRemaining, success: true};
  }

  static resetAlertsQuota(chatId: number | string) {
    const db = dbHandler();
    db.prepare(`UPDATE users SET alerts_remaining = 10 WHERE chat_id = ?`).run(chatId);
    db.close();
    dbOpenObj.dbOpened = false;
    return true;
  }

  static getUserAlertsRemaining(chatId: number) {
    const db = dbHandler();
    const row = db.prepare(`SELECT alerts_remaining FROM users WHERE chat_id = ?`).get(chatId);
    db.close();
    dbOpenObj.dbOpened = false;
    return row?.alerts_remaining || 0;
  }
}