import path from 'node:path';
import { Context } from 'hono';
import { UserService } from '../db/services.ts';

export class WebController {
  private static publicDir = path.join(Deno.cwd(), 'server/public');

  public static async index(c: Context) {
    const content = await Deno.readTextFile(path.join(this.publicDir, 'index.html'));
    return c.html(content);
  }

  public static async docs(c: Context) {
    const content = await Deno.readTextFile(path.join(this.publicDir, 'docs.html'));
    return c.html(content);
  }

  public static async login(c: Context) {
    const content = await Deno.readTextFile(path.join(this.publicDir, 'login.html'));
    return c.html(content);
  }

  public static async userData(c: Context) {
    const chatId = c.req.param('chatId') || '';
    const data = await UserService.getUserByChatId(Number(chatId));

    if (!data.success) {
      return c.html(Deno.readTextFile(path.join(this.publicDir, 'not_found.html')));
    }

    const content = await Deno.readTextFile(path.join(this.publicDir, 'user_data.html'));
    const html = content.replace('{{chatId}}', data.chatId.toString() || '');
    const html2 = html.replace('{{username}}', data.user?.username || '');
    const html3 = html2.replace('{{secret}}', data.user?.secret || '');
    const html4 = html3.replace('{{alertsRemaining}}', data.user?.alertsRemaining.toString() || '');
    const html5 = html4.replace('{{registeredAt}}', data.user?.registeredAt.toLocaleDateString().toString() || '');
    return c.html(html5);
  }

  public static async serveStyles(c: Context) {
    const content = await Deno.readTextFile(path.join(this.publicDir, 'css/styles.css'));
    c.header('Content-Type', 'text/css');
    return c.body(content);
  }

  public static async serveUserDataStyles(c: Context) {
    const content = await Deno.readTextFile(path.join(this.publicDir, 'css/userDataStyles.css'));
    c.header('Content-Type', 'text/css');
    return c.body(content);
  }

  public static async serveLoginStyles(c: Context) {
    const content = await Deno.readTextFile(path.join(this.publicDir, 'css/login.css'));
    c.header('Content-Type', 'text/css');
    return c.body(content);
  }
}
