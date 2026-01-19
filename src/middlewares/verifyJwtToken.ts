import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

export const verifyJwtToken = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    await next();
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Invalid token' }, 401);
  }
};
