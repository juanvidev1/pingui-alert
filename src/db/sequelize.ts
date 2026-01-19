import { Sequelize } from 'sequelize';
import config from '../config/index.js';

const storage = config.dbStorage || ('./storage/pingui.db' as any);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

export default sequelize;
