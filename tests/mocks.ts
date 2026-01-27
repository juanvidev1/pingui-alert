import { start } from 'node:repl';
import { vi } from 'vitest';

// Middlewares mock
vi.mock('../src/middlewares/index.js', () => ({
  verifyJwtToken: vi.fn((c, next) => next()),
  verifyTemporalToken: vi.fn((c, next) => next()),
  validateRateLimit: vi.fn((c, next) => next()),
  validateStatus: vi.fn((c, next) => next())
}));

// Integration service mock
export const mockIntegrationService = {
  changeRateLimit: vi.fn(),
  getIntegration: vi.fn(),
  createIntegration: vi.fn(),
  revokeIntegration: vi.fn(),
  registerUserIntegration: vi.fn(),
  createTemporalToken: vi.fn()
};

// Bot mock
export const mockBot = {
  start: vi.fn(),
  command: vi.fn(),
  api: {
    sendMessage: vi.fn()
  }
};

// Queue service mock
export const mockQueueService = {
  enqueueAlert: vi.fn()
};

// Logger mock
export const mockLogger = {
  errorLog: vi.fn(),
  infoLog: vi.fn()
};

// Utils mock
export const mockUtils = {
  generateUniqueId: vi.fn(() => 'test-id-123'),
  hashChatId: vi.fn(() => 'hashed-chat-id')
};

// Configuration of mocks for modules
vi.mock('../src/services/integration.service.js', () => ({
  IntegrationService: mockIntegrationService
}));

vi.mock('../src/bot/index.js', () => ({
  default: mockBot
}));

vi.mock('../src/services/queue.service.js', () => ({
  enqueueAlert: mockQueueService.enqueueAlert
}));

vi.mock('../src/logger/index.js', () => ({
  Logger: mockLogger
}));

vi.mock('../src/utils/index.js', () => mockUtils);
