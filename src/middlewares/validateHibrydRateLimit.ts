import { checkLimit } from '../services/rateLimit.service';

const store: Map<string, { count: number; lastReset: number }> = new Map();

const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQ_TOKEN = 120; // más alto para integraciones reales
const MAX_REQ_IP = 40; // más bajo para endpoint público

function getClientIp(req: any): string {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

export function hybridRateLimit(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const now = Date.now();

  let key;
  let limit;

  // 🔐 Si hay token → limitar por token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    key = `token:${token}`;
    limit = MAX_REQ_TOKEN;
  }
  // 🌍 Si no hay token → limitar por IP
  else {
    const ip = getClientIp(req);
    key = `ip:${ip}`;
    limit = MAX_REQ_IP;
  }

  const { allowed } = checkLimit(store, key, limit, WINDOW_MS, now);

  if (!allowed) {
    res.status(429).json({ error: 'Too Many Requests' });
    return;
  }
  // 🚀 Continuar con la lógica
  next();
}
