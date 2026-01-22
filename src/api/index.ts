import { Hono } from 'hono';
import { verifyJwtToken, validateRateLimit, validateStatus, verifyTemporalToken } from '../middlewares/index.js';
import { serveStatic } from '@hono/node-server/serve-static';
import { WebController, ApiController } from './controllers/index.js';
import apiRouter from './routes/index.js';

const app = new Hono();

app.use('/public/*', serveStatic({ root: './src' }));

app.get('/', WebController.home);

app.get('/docs', WebController.docs);

app.get('/es', WebController.esHome);

app.get('/docs/es', WebController.esDocs);

app.route('/', apiRouter);

export default app;
