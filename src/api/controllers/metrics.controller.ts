import type { Context } from 'hono';
import { MetricsService } from '../../services/metrics.service.js';

export class MetricsController {
  static async getMetrics(c: Context) {
    const { date } = c.req.query();

    const metrics = await MetricsService.getMetrics();
    const totalIntegrations = metrics?.reduce((sum, record) => sum + (record.dataValues.totalIntegrations || 0), 0);
    const totalSentAlerts = metrics?.reduce((sum, record) => sum + (record.dataValues.totalSentAlerts || 0), 0);
    const totalErrors = metrics?.reduce((sum, record) => sum + (record.dataValues.totalErrors || 0), 0);

    if (date) {
      const metricsByDate = await MetricsService.getMetricsByDate(date as string);
      if (metricsByDate) {
        return c.json({ totalIntegrations, totalSentAlerts, totalErrors, metrics: metricsByDate });
      } else {
        return c.json({ error: 'No metrics found for the specified date' }, 404);
      }
    }

    if (metrics) {
      return c.json({ totalIntegrations, totalSentAlerts, totalErrors, metrics });
    } else {
      return c.json({ error: 'Failed to retrieve metrics' }, 500);
    }
  }
}
