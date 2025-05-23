// sync.js
const { sequelize } = require('./models');

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // Use `force: true` only in development
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

syncDatabase();