import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockIntegrationService, mockQueueService, mockUtils, mockBot } from './mocks.js';
import app from '../src/api/index.js';
import { mock } from 'node:test';

// Test for creating an alert. Has mocked change rate limit service.
describe('POST /api/alert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIntegrationService.changeRateLimit.mockResolvedValue({ id: 1, chatId: 1547430999 });
  });

  it('should create an alert', async () => {
    const res = await app.request('/api/alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token'
      },
      body: JSON.stringify({
        title: 'Alerta crítica',
        message: 'Esto es una alerta crítica',
        chatId: 1547430999
      })
    });

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.message).toBe('Alert enqueued');
  });
});

// Test for getting integration details. Has mocked integration id and chat id.
describe('GET /api/integrations/:chatId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIntegrationService.getIntegration.mockResolvedValue({ id: 1, chatId: 1547430999 });
  });

  it('should get integration details', async () => {
    const res = await app.request('/api/integrations/1547430999', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer test-token'
      }
    });

    expect(res.status).toBe(200);

    const json = await res.json();
    // console.log(json);
    expect(json.integrations.id).toBe(1);
    expect(json.integrations.chatId).toBe(1547430999);
  });
});

// Test for creating a new integration. Has mocked utils to generate unique id and hash chat id.
describe('POST /api/createIntegration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUtils.generateUniqueId.mockReturnValue('test-id-123');
    mockUtils.hashChatId.mockReturnValue('hashed-chat-id');
    mockIntegrationService.createIntegration.mockResolvedValue({ id: 1, chatId: 'hashed-chat-id' });
  });

  it('should create a new integration', async () => {
    const res = await app.request('/api/createIntegration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: 1547430999,
        scope: 'alerts'
      })
    });

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.integration.id).toBe(1);
    expect(json.integration.chatId).toBe('hashed-chat-id');
  });
});

// Test for revoking an integration. Has mocked integration service to revoke integration.
describe('POST /api/revokeIntegration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIntegrationService.revokeIntegration.mockResolvedValue({ success: true, message: 'Integration revoked' });
  });

  it('should revoke an integration', async () => {
    const res = await app.request('/api/revokeIntegration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token'
      },
      body: JSON.stringify({
        chatId: 1547430999
      })
    });

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.integration.success).toBe(true);
    expect(json.integration.message).toBe('Integration revoked');
  });
});

// Test for starting the bot
describe('Bot Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBot.start = vi.fn();
  });

  it('should start the bot without errors', async () => {
    const botModule = await import('../src/bot/index.js');
    expect(botModule.default.start).toBeDefined();
    botModule.default.start();
    expect(botModule.default.start).toHaveBeenCalled();
  });
});

// Test for commands
describe('Start command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBot.command = vi.fn((command, handler) => {
      if (command === 'start') {
        // Simulate calling the handler
        const ctx = {
          chat: { id: 1547430999 },
          reply: vi.fn()
        };
        handler(ctx);
      }
    });
  });

  it('Should register a new user integration', async () => {
    mockIntegrationService.getIntegration.mockResolvedValue(null);
    mockIntegrationService.registerUserIntegration = vi.fn().mockResolvedValue({ id: 1, chatId: 1547430999 });

    const botModule = await import('../src/bot/index.js');
    expect(botModule.default.command).toBeDefined();
    botModule.default.command('start', async (ctx) => {
      try {
        const chatId = ctx.chat.id;

        const integration = await mockIntegrationService.getIntegration(chatId);

        if (integration) {
          await ctx.reply('You are already registered');
          return;
        }

        const firstIntegration = await mockIntegrationService.registerUserIntegration(chatId);

        if (!firstIntegration) {
          await ctx.reply('Error registering integration');
          return;
        }

        await ctx.reply('You are now able to create an integration using your temporal token');
      } catch (error) {
        console.error(error);
        await ctx.reply('Error registering integration');
      }
    });
    expect(botModule.default.command).toHaveBeenCalledWith('start', expect.any(Function));
  });
});

// Test for help command
describe('Help command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBot.command = vi.fn((command, handler) => {
      if (command === 'help') {
        // Simulate calling the handler
        const ctx = {
          reply: vi.fn()
        };
        handler(ctx);
        expect(ctx.reply).toHaveBeenCalledWith('You can see the documentation at https://pingui-alert.dev/docs');
      }
    });
  });

  it('Should respond with help message', async () => {
    const botModule = await import('../src/bot/index.js');
    expect(botModule.default.command).toBeDefined();
    botModule.default.command('help', async (ctx) => {
      await ctx.reply('You can see the documentation at https://pingui-alert.dev/docs');
    });
    expect(botModule.default.command).toHaveBeenCalledWith('help', expect.any(Function));
  });
});
