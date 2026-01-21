import { Hono } from 'hono';
import { IntegrationService } from '../services/integration.service.js';
import { verifyJwtToken, validateRateLimit, validateStatus, verifyTemporalToken } from '../middlewares/index.js';
import path from 'path';
import { readFile, readFileSync } from 'fs';
import bot from '../bot/index.js';
import { Logger } from '../logger/index.js';
import { generateUniqueId, hashChatId } from '../utils/index.js';
import { serveStatic } from '@hono/node-server/serve-static';
import { enqueueAlert } from '../services/queue.service.js';

const app = new Hono();

app.use('/public/*', serveStatic({ root: './src' }));

app.get('/', async (c) => {
  const publicDir = path.join(process.cwd(), 'src', 'public');
  const indexPath = path.join(publicDir, 'index.html');
  const htmlContent = readFileSync(indexPath, 'utf-8');

  return c.html(htmlContent, 200, {
    'Content-Type': 'text/html'
  });
});

app.get('/docs', async (c) => {
  const publicDir = path.join(process.cwd(), 'src', 'public');
  const indexPath = path.join(publicDir, 'docs.html');
  const htmlContent = readFileSync(indexPath, 'utf-8');

  return c.html(htmlContent, 200, {
    'Content-Type': 'text/html'
  });
});

app.get('/es', async (c) => {
  const publicDir = path.join(process.cwd(), 'src', 'public');
  const indexPath = path.join(publicDir, 'index_es.html');
  const htmlContent = readFileSync(indexPath, 'utf-8');

  return c.html(htmlContent, 200, {
    'Content-Type': 'text/html'
  });
});

app.get('/docs/es', async (c) => {
  const publicDir = path.join(process.cwd(), 'src', 'public');
  const indexPath = path.join(publicDir, 'docs_es.html');
  const htmlContent = readFileSync(indexPath, 'utf-8');

  return c.html(htmlContent, 200, {
    'Content-Type': 'text/html'
  });
});

app.post('/temporal-token', async (c) => {
  const { chatId } = await c.req.json();

  if (!chatId) {
    const requestId = generateUniqueId(true);
    Logger.errorLog({ chatId: Number(requestId), message: 'Missing required fields on temporal-token endpoint' });
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const tempTokenData = await IntegrationService.createTemporalToken(chatId);

  return c.json({ token: tempTokenData });
});

app.post('/alert', verifyJwtToken, validateRateLimit, validateStatus, async (c) => {
  const data: any = await c.req.json();

  const requestId = generateUniqueId(true);
  if (!data.message || !data.chatId) {
    Logger.errorLog({ chatId: Number(requestId), message: 'Missing required fields' });
    bot.api.sendMessage(
      data.chatId,
      'There was a problem sendig the alert because all the required fields are not present. See the api reference for more information'
    );

    return c.json({ error: 'Missing required fields' }, 400);
  }

  const integration = await IntegrationService.changeRateLimit(data.chatId);

  if (!integration) {
    Logger.errorLog({ chatId: Number(requestId), message: 'Integration not found' });
    bot.api.sendMessage(data.chatId, 'There was a problem sendig the alert because the integration was not found');
    return c.json({ error: 'Integration not found' }, 404);
  }

  // bot.api.sendMessage(data.chatId, `${data.title}\n${data.message}`);

  await enqueueAlert({
    id: generateUniqueId(false),
    chatId: data.chatId,
    title: data.title || 'Alert',
    message: data.message
  });

  return c.json({ message: 'Alert enqueued' });
});

app.post('/createIntegration', verifyTemporalToken, async (c) => {
  const { chatId, scope }: any = await c.req.json();

  if (!chatId || !scope) {
    const requestId = generateUniqueId(false);

    if (chatId) {
      const hashedChatId = hashChatId(chatId);
      Logger.errorLog({
        chatId: Number(requestId),
        message: `Missing required fields on createIntegration endpoint, chatId: ${hashedChatId}`
      });
    }

    Logger.errorLog({
      chatId: Number(requestId),
      message: `Missing required fields on createIntegration endpoint`
    });

    return c.json({ error: 'Missing required fields' }, 400);
  }

  const existingIntegration = await IntegrationService.getIntegration(chatId);

  if (
    existingIntegration &&
    existingIntegration?.status === 'active' &&
    existingIntegration?.scope !== 'temporal-token'
  ) {
    const requestId = generateUniqueId(false);
    const hashedChatId = hashChatId(chatId);
    Logger.errorLog({ chatId: Number(requestId), message: `Integration already exists, chatId: ${hashedChatId}` });
    return c.json({ error: 'Integration already exists' }, 400);
  }

  const integration = await IntegrationService.createIntegration(chatId, scope, 10);

  return c.json({ integration });
});

app.get('/integrations/:chatId', verifyJwtToken, async (c) => {
  const chatId = c.req.param('chatId');

  if (!chatId) {
    const requestId = generateUniqueId(true);
    Logger.errorLog({ chatId: Number(requestId), message: `Missing required fields on integrations endpoint` });
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const integrations = await IntegrationService.getIntegration(Number(chatId));

  if (!integrations) {
    const requestId = generateUniqueId(false);
    const hashedChatId = hashChatId(Number(chatId));
    Logger.errorLog({ chatId: Number(requestId), message: `Integration not found, chatId: ${hashedChatId}` });
    return c.json({ error: 'Integration not found' }, 404);
  }

  return c.json({ integrations });
});

app.post('/updateRateLimit', verifyJwtToken, validateStatus, async (c) => {
  const { chatId, rateLimit }: any = await c.req.json();

  if (!chatId) {
    const requestId = generateUniqueId(true);
    Logger.errorLog({ chatId: Number(requestId), message: `Missing required fields on updateRateLimit endpoint` });
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const integration = await IntegrationService.changeRateLimit(Number(chatId), Number(rateLimit));
  return c.json({ integration });
});

app.post('/revokeIntegration', verifyJwtToken, async (c) => {
  const { chatId }: any = await c.req.json();

  if (!chatId) {
    const requestId = generateUniqueId(true);
    Logger.errorLog({ chatId: Number(requestId), message: `Missing required fields on revokeIntegration endpoint` });
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const integration = await IntegrationService.revokeIntegration(Number(chatId));

  if (!integration) {
    const requestId = generateUniqueId(false);
    const hashedChatId = hashChatId(Number(chatId));
    Logger.errorLog({ chatId: Number(requestId), message: `Integration not found, chatId: ${chatId}` });
    return c.json({ error: 'Integration not found' }, 404);
  }

  return c.json({ integration });
});

export default app;
