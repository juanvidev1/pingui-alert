// import { User } from "./models.ts";
import { dbHandler, dbOpenObj } from './config.ts';
import { User } from './models.ts';

export class UserService {
  static createUser(username: string, chatId: number, secret: string) {
    const db = dbHandler();
    db.prepare(`INSERT INTO users (username, chat_id, secret) VALUES (?, ?, ?)`).run(username, chatId, secret);
    db.close();
    dbOpenObj.dbOpened = false;
    return true;
  }

  static async createUserV2(username: string, chatId: number, secret: string, password: string) {
    const user = await User.create({
      username,
      chatId,
      secret,
      password,
      alertsRemaining: 10,
      registeredAt: new Date()
    });
    return user;
  }

  static getAllUsers() {
    const db = dbHandler();
    const rows = db.prepare('SELECT * FROM users').all();
    const users = rows.map((row) => ({
      chatId: row.chat_id,
      username: row.username,
      secret: row.secret,
      alertsRemaining: row.alerts_remaining,
      registeredAt: row.registered_at
    })) as unknown as {
      chatId: number;
      username: string;
      secret: string;
      alertsRemaining: number;
      registeredAt: Date;
    }[];
    db.close();
    dbOpenObj.dbOpened = false;
    return users;
  }

  static async login(chatId: number, password: string) {
    if (!chatId || !password) {
      return { chatId, message: 'Invalid chatId or password', success: false };
    }

    const user = await User.findOne({ where: { chatId, password } });
    if (!user) {
      return { chatId, message: 'User not found', success: false };
    }
    return { chatId, success: true, secret: user.secret };
  }

  static async getAllUsersV2() {
    const users = await User.findAll();
    return users;
  }

  static async getUserByChatId(chatId: number) {
    const user = await User.findOne({ where: { chatId } });

    if (!user) {
      return { chatId, message: 'User not found', success: false };
    }

    const userWOSecret = { ...user.dataValues, secret: user.dataValues.secret };
    return { chatId, user: userWOSecret, success: true };
  }

  static updateUserAlertsRemaining(chatId: number, alertsRemaining: number) {
    const db = dbHandler();
    db.prepare(`UPDATE users SET alerts_remaining = ? WHERE chat_id = ?`).run(alertsRemaining, chatId);
    db.close();
    dbOpenObj.dbOpened = false;
    return { chatId, alertsRemaining, success: true };
  }

  static async updateUserAlertsRemainingV2(chatId: number, alertsRemaining: number) {
    const user = await User.findOne({ where: { chatId } });
    if (!user) {
      return { chatId, alertsRemaining, success: false };
    }
    user.alertsRemaining = alertsRemaining;
    await user.save();
    return { chatId, alertsRemaining, success: true };
  }

  static resetAlertsQuota(chatId: number | string) {
    const db = dbHandler();
    db.prepare(`UPDATE users SET alerts_remaining = 10 WHERE chat_id = ?`).run(chatId);
    db.close();
    dbOpenObj.dbOpened = false;
    return true;
  }

  static async resetAlertsQuotaV2(chatId: number | string) {
    const user = await User.findOne({ where: { chatId } });
    if (!user) {
      return { chatId, success: false };
    }
    user.alertsRemaining = 10;
    await user.save();
    return { chatId, success: true };
  }

  static getUserAlertsRemaining(chatId: number) {
    const db = dbHandler();
    const row = db.prepare(`SELECT alerts_remaining FROM users WHERE chat_id = ?`).get(chatId);
    db.close();
    dbOpenObj.dbOpened = false;
    return row?.alerts_remaining || 0;
  }

  static async updateUserData(chatId: number, username: string, secret: string) {
    const user = await User.findOne({ where: { chatId, secret } });
    if (!user) {
      return { chatId, success: false };
    }
    user.username = username;
    await user.save();
    return { chatId, success: true };
  }

  static async updatePassword(chatId: number, password: string, secret: string) {
    const user = await User.findOne({ where: { chatId, secret } });
    if (!user) {
      return { chatId, success: false };
    }
    user.password = password;
    await user.save();
    return { chatId, success: true };
  }
}
