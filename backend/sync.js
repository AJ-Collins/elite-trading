const sequelize = require('./config/db');
require('dotenv').config();

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // or force: true (for dev)
    console.log('✅ Database synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();
