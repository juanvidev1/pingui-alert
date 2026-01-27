import { Integration } from '../db/models.js';

export async function resetRateLimitJob() {
  try {
    const integrations = await Integration.update({ rateLimit: 10 }, { where: {} });
    console.log(`Resetted rate limit for all integrations.`);
  } catch (error) {
    console.error('Error resetting rate limits:', error);
  }
}
