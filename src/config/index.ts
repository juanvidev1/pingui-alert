import dotenv from 'dotenv';

dotenv.config();

export default {
  botToken: process.env.BOT_TOKEN,
  jwtSecret: process.env.JWT_SECRET,
  jwtPublic: process.env.JWT_PUBLIC,
  maxAlerts: process.env.MAX_ALERTS,
  dbDialect: process.env.DB_DIALECT,
  dbStorage: process.env.DB_STORAGE
};
