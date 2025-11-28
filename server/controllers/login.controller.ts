import { Context } from 'hono';
import { UserService } from '../db/services.ts';

export class LoginController {
  static async login(c: Context) {
    const { chatId, password } = await c.req.json();
    const data = await UserService.login(Number(chatId), password);

    if (!data.success) {
      return c.json({ success: false, message: 'Invalid chatId or password' });
    }

    return c.json({ success: true, secret: data.secret });
  }
}
