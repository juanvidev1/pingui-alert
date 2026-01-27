import fs from 'fs';
import path from 'path';

export type Log = {
  chatId: number;
  message: string;
};

const logPath = path.join(process.cwd(), 'logs');

export class Logger {
  public static errorLog(log: Log) {
    const date = new Date().toISOString();

    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath);
    }

    const logFile = path.join(logPath, `error.log`);
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '');
    }
    fs.appendFileSync(logFile, `${date} - ${log.message}\n`);
  }

  public static infoLog(log: Log) {
    const date = new Date().toISOString();
    const logFile = path.join(logPath, `info.log`);
    fs.appendFileSync(logFile, `${date} - ${log.message}\n`);
  }

  public static warnLog(log: Log) {
    const date = new Date().toISOString();
    const logFile = path.join(logPath, `warn.log`);
    fs.appendFileSync(logFile, `${date} - ${log.message}\n`);
  }

  public static debugLog(log: Log) {
    const date = new Date().toISOString();
    const logFile = path.join(logPath, `debug.log`);
    fs.appendFileSync(logFile, `${date} - ${log.message}\n`);
  }

  public static jobsLog(log: Log) {
    const date = new Date().toISOString();
    const logFile = path.join(logPath, `jobs.log`);
    fs.appendFileSync(logFile, `${date} - ${log.message}\n`);
  }
}
