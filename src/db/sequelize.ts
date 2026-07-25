import { Sequelize } from 'sequelize';
import config from '../config/index.js';

let sequelize: Sequelize;

if (config.dbUrl && config.dbUrl !== '') {
  sequelize = new Sequelize(config.dbUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.dbStorage || './storage/pingui.db',
    logging: false
  });
}

export default sequelize;
