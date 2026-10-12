import dotenv from 'dotenv';

dotenv.config();

export default {
  botToken: process.env.BOT_TOKEN,
  jwtSecret: process.env.JWT_SECRET,
  jwtPublic: process.env.JWT_PUBLIC,
  maxAlerts: process.env.MAX_ALERTS,
  dbDialect: process.env.DB_DIALECT,
  dbStorage: process.env.DB_STORAGE,
  backupRoute: process.env.DB_BACKUP_PATH,
  dbStoragePath: process.env.DB_STORAGE_PATH,
  dbUrl: process.env.DB_URL || '',
  port: Number(process.env.PORT ?? 3035),
  frontendUrl: (process.env.FRONTEND_URL ?? 'http://localhost:5173').replace(/\/$/, '')
};
