import fs from 'fs';
import path from 'path';
import { Logger } from '../logger/index.js';
import config from '../config/index.js';

export async function backupDbJob() {
  try {
    const dbPath = path.join(config.dbStoragePath || './storage/pingui.db');
    const backupPath = path.join(config.backupRoute || './backups/pingui/');

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `pingui-backup-${timestamp}.db`;
    const fullBackupPath = path.join(backupPath, backupFileName);

    fs.copyFileSync(dbPath, fullBackupPath);
    Logger.jobsLog({ chatId: 0, message: `Database backup created at ${fullBackupPath}` });
  } catch (error) {
    if (error instanceof Error) {
      Logger.errorLog({ chatId: 0, message: `Error creating database backup: ${error.message}` });
    } else {
      console.error('Unknown error occurred:', error);
    }
  }
}
