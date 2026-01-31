import type { Context } from 'hono';
import { MetricsService } from '../../services/metrics.service.js';

export class MetricsController {
  static async getMetrics(c: Context) {
    const { date } = c.req.query();

    if (date) {
      const metricsByDate = await MetricsService.getMetricsByDate(date as string);
      if (metricsByDate) {
        return c.json({ metrics: metricsByDate });
      } else {
        return c.json({ error: 'No metrics found for the specified date' }, 404);
      }
    }

    const metrics = await MetricsService.getMetrics();
    if (metrics) {
      return c.json({ metrics });
    } else {
      return c.json({ error: 'Failed to retrieve metrics' }, 500);
    }
  }
}
