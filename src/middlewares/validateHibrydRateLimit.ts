import type { Context, Next } from 'hono';
import { getConnInfo } from '@hono/node-server/conninfo';
import { checkLimit, pruneExpired } from '../services/rateLimit.service.js';
import { Logger } from '../logger/index.js';
import { hashCode } from '../utils/index.js';

type RateLimitEntry = { count: number; lastReset: number };

const store: Map<string, RateLimitEntry> = new Map();

export const rateLimitStore = store;

export function resetRateLimitStore() {
  store.clear();
}

const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQ_TOKEN = 120; // más alto para integraciones reales
const MAX_REQ_IP = 40; // más bajo para endpoint público

// TODO: mover a variable de entorno (ADMIN_CHAT_ID)
const ADMIN_CHAT_ID = 1547430999;

function getClientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  try {
    return getConnInfo(c).remote.address || 'unknown';
  } catch {
    return 'unknown';
  }
}

export const hybridRateLimit = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json().catch(() => null);

    // El admin no está sujeto al rate limit al enviarse alertas a su propio chat
    if (body && Number(body.chatId) === ADMIN_CHAT_ID) {
      await next();
      return;
    }

    const authHeader = c.req.header('Authorization');

    let key: string;
    let limit: number;

    // 🔐 Si hay token → limitar por token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length);
      key = `token:${hashCode(token)}`;
      limit = MAX_REQ_TOKEN;
    }
    // 🌍 Si no hay token → limitar por IP
    else {
      key = `ip:${getClientIp(c)}`;
      limit = MAX_REQ_IP;
    }

    const { allowed } = checkLimit(store, key, limit, WINDOW_MS, Date.now());

    if (!allowed) {
      return c.json({ error: 'Too Many Requests' }, 429);
    }

    await next();
  } catch (error) {
    // Fail-open: nunca bloquear ni tumbar la request por un fallo del limitador
    Logger.errorLog({
      chatId: 0,
      message: `Rate limit middleware error, failing open: ${error instanceof Error ? error.message : String(error)}`
    });
    await next();
  }
};

const pruneTimer = setInterval(() => {
  pruneExpired(store, WINDOW_MS, Date.now());
}, WINDOW_MS);

pruneTimer.unref();
