import { Hono } from 'hono';
import { WebController } from '../controllers/web.controller.ts';
import { LoginController } from '../controllers/login.controller.ts';

export const loginRouter = new Hono().basePath('/auth');
loginRouter.post('/login', (c) => {
  return LoginController.login(c);
});

export const loginPageRouter = new Hono().basePath('/login');
loginPageRouter.get('/', (c) => {
  return WebController.login(c);
});
loginPageRouter.get('/css/login.css', (c) => {
  return WebController.serveLoginStyles(c);
});

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

export const userDataRouter = honoRouter.basePath('/user-data');
userDataRouter.get('/:chatId', (c) => {
  return WebController.userData(c);
});

userDataRouter.get('/css/userDataStyles.css', (c) => {
  return WebController.serveUserDataStyles(c);
});
