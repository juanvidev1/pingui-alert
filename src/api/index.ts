import { Hono } from 'hono';
import { IntegrationService } from '../services/integration.service.js';
import { verifyJwtToken, validateStatus, verifyTemporalToken } from '../middlewares/index.js';
import path from 'path';
import { readFile, readFileSync } from 'fs';

const app = new Hono();

app.get('/', async (c) => {
  const publicDir = path.join(process.cwd(), 'src', 'public');
  const indexPath = path.join(publicDir, 'docs.html');
  const htmlContent = readFileSync(indexPath, 'utf-8');

  return c.html(htmlContent, 200, {
    'Content-Type': 'text/html'
  });
});

// app.get('/docs', async (c) => {
//   const publicDir = path.join(process.cwd(), 'src', 'public');
//   const docsPath = path.join(publicDir, 'docs.html');
//   return c.html(Bun.file(docsPath));
// });

app.post('/temporal-token', async (c) => {
  const { chatId } = await c.req.json();

  if (!chatId) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const tempTokenData = await IntegrationService.createTemporalToken(chatId);

  return c.json({ token: tempTokenData });
});

app.post('/alert', verifyJwtToken, validateStatus, async (c) => {
  const data: any = await c.req.json();

  console.log(data);

  if (!data.title || !data.message || !data.chatId) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  console.log(data.title, data.message, data.chatId);

  return c.json({ message: 'Alert received' });
});

app.post('/createIntegration', verifyTemporalToken, async (c) => {
  const { chatId, scope }: any = await c.req.json();

  console.log(chatId, scope);

  if (!chatId || !scope) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const existingIntegration = await IntegrationService.getIntegration(chatId);

  if (
    existingIntegration &&
    existingIntegration?.status === 'active' &&
    existingIntegration?.scope !== 'temporal-token'
  ) {
    return c.json({ error: 'Integration already exists' }, 400);
  }

  const integration = await IntegrationService.createIntegration(chatId, scope, 10);

  return c.json({ integration });
});

app.get('/integrations/:chatId', verifyJwtToken, async (c) => {
  const chatId = c.req.param('chatId');

  console.log(chatId);

  if (!chatId) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const integrations = await IntegrationService.getIntegration(Number(chatId));

  if (!integrations) {
    return c.json({ error: 'Integration not found' }, 404);
  }

  return c.json({ integrations });
});

app.post('/update-rate-limit', verifyJwtToken, validateStatus, async (c) => {
  const { chatId, rateLimit }: any = await c.req.json();

  console.log(chatId, rateLimit);

  if (!chatId) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const integration = await IntegrationService.changeRateLimit(Number(chatId), rateLimit);
  return c.json({ integration });
});

app.post('/revokeIntegration', verifyJwtToken, async (c) => {
  const { chatId }: any = await c.req.json();

  if (!chatId) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const integration = await IntegrationService.revokeIntegration(Number(chatId));
  return c.json({ integration });
});

export default app;
