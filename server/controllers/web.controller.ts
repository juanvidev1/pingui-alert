import path from 'node:path';
import { Context } from 'hono';

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

  public static async serveStyles(c: Context) {
    const content = await Deno.readTextFile(path.join(this.publicDir, 'css/styles.css'));
    c.header('Content-Type', 'text/css');
    return c.body(content);
  }
}
