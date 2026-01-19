import sequelize from './sequelize.js';

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};
