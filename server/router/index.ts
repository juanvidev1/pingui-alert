import { Hono } from 'hono';
import { WebController } from '../controllers/web.controller.ts';

export const honoRouter = new Hono();
honoRouter.get('/', (c) => {
  return WebController.index(c);
});

honoRouter.get('/css/styles.css', (c) => {
  return WebController.serveStyles(c);
});

export const docsRouter = honoRouter.basePath('/docs');
docsRouter.get('/', (c) => {
  return WebController.docs(c);
});
