import { readFileSync } from 'fs';
import path from 'path';
import type { Context } from 'hono';

export class WebController {
  static async home(c: Context) {
    const publicDir = path.join(process.cwd(), 'src', 'public');
    const indexPath = path.join(publicDir, 'index.html');
    const htmlContent = readFileSync(indexPath, 'utf-8');

    return c.html(htmlContent, 200, {
      'Content-Type': 'text/html'
    });
  }

  static async esHome(c: Context) {
    const publicDir = path.join(process.cwd(), 'src', 'public');
    const indexPath = path.join(publicDir, 'index_es.html');
    const htmlContent = readFileSync(indexPath, 'utf-8');

    return c.html(htmlContent, 200, {
      'Content-Type': 'text/html'
    });
  }

  static async docs(c: Context) {
    const publicDir = path.join(process.cwd(), 'src', 'public');
    const indexPath = path.join(publicDir, 'docs.html');
    const htmlContent = readFileSync(indexPath, 'utf-8');

    return c.html(htmlContent, 200, {
      'Content-Type': 'text/html'
    });
  }

  static async esDocs(c: Context) {
    const publicDir = path.join(process.cwd(), 'src', 'public');
    const indexPath = path.join(publicDir, 'docs_es.html');
    const htmlContent = readFileSync(indexPath, 'utf-8');

    return c.html(htmlContent, 200, {
      'Content-Type': 'text/html'
    });
  }

  static async metrics(c: Context) {
    const publicDir = path.join(process.cwd(), 'src', 'public');
    const indexPath = path.join(publicDir, 'metrics.html');
    const htmlContent = readFileSync(indexPath, 'utf-8');

    return c.html(htmlContent, 200, {
      'Content-Type': 'text/html'
    });
  }
}
