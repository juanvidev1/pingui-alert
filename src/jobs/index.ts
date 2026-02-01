import cron from 'node-cron';
import { Logger } from '../logger/index.js';
import { resetRateLimitJob } from './resetRateLimit.job.js';
import { backupDbJob } from './backupDbJob.js';
import { MetricsService } from '../services/metrics.service.js';

export function initializeJobs() {
  console.log('Initializing scheduled jobs...');
  // Schedule the resetRateLimitJob to run every day at midnight. Sets rate limits back to 10 for all integrations, doesn't matter if they have messages left or not.
  cron.schedule('0 0 * * *', async () => {
    try {
      await resetRateLimitJob();
      Logger.jobsLog({ chatId: 0, message: '[JOB] resetRateLimitJob executed successfully.' });
    } catch (err) {
      console.error('[JOB ERROR]', err);
      Logger.errorLog({ chatId: 0, message: `[JOB ERROR] resetRateLimitJob failed: ${err}` });
    }
  });

  // Schedule the backupDbJob to run every day at 3 AM. Creates a backup of the database. For MVP it's a simple file copy. Possile to escalate in the future to more complex solutions.
  cron.schedule('0 3 * * *', async () => {
    try {
      await backupDbJob();
      Logger.jobsLog({ chatId: 0, message: '[JOB] backupDbJob executed successfully.' });
    } catch (err) {
      console.error('[JOB ERROR]', err);
      Logger.errorLog({ chatId: 0, message: `[JOB ERROR] backupDbJob failed: ${err}` });
    }
  });

  // Schedule the creation of new row on Metrics table every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      await MetricsService.createDailyMetricsRecord();
      Logger.jobsLog({ chatId: 0, message: '[JOB] createMetricsRowJob executed successfully.' });
    } catch (err) {
      console.error('[JOB ERROR]', err);
      Logger.errorLog({ chatId: 0, message: `[JOB ERROR] createMetricsRowJob failed: ${err}` });
    }
  });

  Logger.infoLog({ chatId: 0, message: '[JOBS] Jobs finished. Check logs for more details if needed.' });
}
