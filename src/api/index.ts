import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { WebController } from './controllers/index.js';
import apiRouter from './routes/index.js';

const app = new Hono();

app.use('/public/*', serveStatic({ root: './src' }));

app.get('/', WebController.home);

app.get('/docs', WebController.docs);

app.get('/es', WebController.esHome);

app.get('/docs/es', WebController.esDocs);

app.route('/', apiRouter);

export default app;
