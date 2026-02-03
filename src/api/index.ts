import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { WebController } from './controllers/index.js';
import { MetricsService } from '../services/metrics.service.js';
import { hybridRateLimit } from '../middlewares/validateHibrydRateLimit.js';
import apiRouter from './routes/index.js';

const app = new Hono();

MetricsService.createDailyMetricsRecord();

app.use('*', async (c, next) => {
  return new Promise(async (resolve) => {
    hybridRateLimit(c.req.raw, c.res, () => resolve(next()));
  });
});

app.use('/public/*', serveStatic({ root: './src' }));

app.get('/', WebController.home);

app.get('/docs', WebController.docs);

app.get('/es', WebController.esHome);

app.get('/docs/es', WebController.esDocs);

app.get('/metrics', WebController.metrics);

app.route('/', apiRouter);

export default app;
