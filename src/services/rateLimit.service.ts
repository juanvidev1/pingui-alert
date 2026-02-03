// Core function to check rate limits for token and IP based rate limiting
export function checkLimit(
  store: Map<string, { count: number; lastReset: number }>,
  key: string,
  limit: number,
  windowMs: number,
  now: number
): { allowed: boolean } {
  let entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, lastReset: now });
    return { allowed: true };
  }

  if (now - entry.lastReset > windowMs) {
    entry.count = 1;
    entry.lastReset = now;
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false };
  }

  entry.count++;
  return { allowed: true };
}
