import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { WebController } from './controllers/index.js';
import { MetricsService } from '../services/metrics.service.js';
import { Logger } from '../logger/index.js';
import apiRouter from './routes/index.js';

const app = new Hono();

MetricsService.createDailyMetricsRecord();

app.onError((err, c) => {
  if (err instanceof SyntaxError) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  Logger.errorLog({
    chatId: 0,
    message: `Unhandled error: ${err instanceof Error ? err.message : String(err)}`
  });

  return c.json({ error: 'Internal Server Error' }, 500);
});

app.use('/public/*', serveStatic({ root: './src' }));

app.get('/', WebController.home);

app.get('/docs', WebController.docs);

app.get('/es', WebController.esHome);

app.get('/docs/es', WebController.esDocs);

app.get('/metrics', WebController.metrics);

app.get('/members', WebController.integrationMembers);

app.route('/', apiRouter);

export default app;
