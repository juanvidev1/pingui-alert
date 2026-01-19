import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

export const verifyTemporalToken = async (c: Context, next: Next) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return c.json({ error: 'Missing token' }, 401);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const { scope } = decodedToken as { scope: string };

    if (scope !== 'temporal-token') {
      throw new Error('Invalid token');
    }

    await next();
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error(error.message);
        return c.json({ error: 'Invalid token' }, 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        console.error(error.message);
        return c.json({ error: 'Token expired' }, 401);
      }
      if (error instanceof jwt.NotBeforeError) {
        console.error(error.message);
        return c.json({ error: 'Token not active' }, 401);
      }
      console.error(error.message);
      return c.json({ error: 'Invalid token' }, 401);
    }
  }
};
