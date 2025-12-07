import { Context } from 'hono';
import { UserService } from '../db/services.ts';
import { bot } from '../main.ts';

export class ApiController {
  public static async alert(c: Context) {
    const body = await c.req.json();
    const alertMessage = body.alert;

    try {
      const users = await UserService.getAllUsersV2();
      const results: {
        chatId: number | string;
        message: string;
        success: boolean;
        error?: string;
        remainingAlerts?: number;
      }[] = [];
      for (const user of users) {
        try {
          const updatedUser = await UserService.updateUserAlertsRemainingV2(user.chatId, user.alertsRemaining - 1);
          if (updatedUser.alertsRemaining <= 0) {
            bot.api.sendMessage(
              user.chatId,
              'You have no remaining alerts today. Tomorrow you will have 10 free alerts again.'
            );
            results.push({
              chatId: user.chatId,
              message: 'User alerts quota exceeded.',
              success: false,
              error: 'No remaining alerts',
              remainingAlerts: updatedUser.alertsRemaining
            });
            continue;
          }
          bot.api.sendMessage(user.chatId, alertMessage);
          results.push({
            chatId: user.chatId,
            message: alertMessage,
            success: true,
            remainingAlerts: updatedUser.alertsRemaining
          });
        } catch (error) {
          console.error(`Failed to send to ${user.chatId}:`, error);
          results.push({
            chatId: user.chatId,
            message: alertMessage,
            success: false,
            error: String(error),
            remainingAlerts: user.alertsRemaining
          });
        }
      }
      return c.json({
        message: 'Alert processing complete',
        results
      });
    } catch (error) {
      console.error('Failed to process alert:', error);
      return c.json({
        message: 'Failed to process alert',
        error: String(error)
      });
    }
  }

  public static async users(c: Context) {
    const users = await UserService.getAllUsersV2();
    return c.json(users);
  }

  public static async user(c: Context) {
    const chatId = c.req.header('chatId') || '';
    const user = await UserService.getUserByChatId(Number(chatId));
    return c.json(user);
  }

  public static async reset(c: Context) {
    const chatId = c.req.header('chatId') || '';
    const result = await UserService.resetAlertsQuotaV2(chatId);
    return c.json({ message: 'Alerts quota reset', result });
  }

  public static async settings(c: Context) {
    const chatId = c.req.header('chatId') || '';

    const body = await c.req.json();

    if (!body.username || !body.secret) {
      return c.json({ message: 'Invalid username or secret', success: false });
    }

    const updatedUser = await UserService.updateUserData(Number(chatId), body.username, body.secret);
    return c.json({ message: 'User updated', updatedUser });
  }
}
