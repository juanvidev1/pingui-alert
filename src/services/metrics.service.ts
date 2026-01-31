import { Metrics } from '../db/models';
import { Logger } from '../logger';

export class MetricsService {
  static async createDailyMetricsRecord() {
    const actualDate = new Date().toISOString().split('T')[0];
    try {
      const existingRecord = await Metrics.findOne({ where: { date: actualDate } });
      if (!existingRecord) {
        await Metrics.create({
          date: actualDate,
          totalIntegrations: 0,
          totalSentAlerts: 0,
          totalErrors: 0
        });
        Logger.infoLog({ chatId: 0, message: 'Created daily metrics record for ' + actualDate });
      } else {
        Logger.infoLog({ chatId: 0, message: 'Daily metrics record already exists for ' + actualDate });
      }
    } catch (error) {
      Logger.errorLog({ chatId: 0, message: 'Failed to create daily metrics record ' + error });
    }
  }

  static async incrementIntegrationsCount(chatId: number = 0) {
    const actualDate = new Date().toISOString().split('T')[0];
    try {
      await Metrics.increment('totalIntegrations', { by: 1, where: { date: actualDate } });
      return true;
    } catch (error) {
      Logger.errorLog({ chatId, message: 'Failed to increment integrations count ' + error });
      return false;
    }
  }

  static async incrementSentAlertsCount(chatId: number = 0) {
    const actualDate = new Date().toISOString().split('T')[0];
    try {
      const metric = await Metrics.findOne({ where: { date: actualDate } });
      await metric?.update({ totalSentAlerts: (metric?.dataValues.totalSentAlerts || 0) + 1 });
      Logger.infoLog({ chatId, message: 'Incremented sent alerts count' });
      return true;
    } catch (error) {
      Logger.errorLog({ chatId, message: 'Failed to increment sent alerts count ' + error });
      return false;
    }
  }

  static async incrementErrorsCount(chatId: number = 0) {
    try {
      await Metrics.increment('totalErrors', { by: 1 });
      return true;
    } catch (error) {
      Logger.errorLog({ chatId, message: 'Failed to increment errors count ' + error });
      return false;
    }
  }

  static async getMetrics() {
    try {
      const metrics = await Metrics.findAll();
      return metrics;
    } catch (error) {
      Logger.errorLog({ chatId: 0, message: 'Failed to get metrics ' + error });
      return null;
    }
  }

  static async getMetricsByDate(date: string) {
    return Metrics.findOne({ where: { date } });
  }
}
