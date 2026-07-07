require('dotenv').config();

const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  if (process.env.NODE_ENV === 'development') {
    try {
      // Keeps tables in sync automatically in dev; use `npm run migrate`
      // for explicit, production-safe migrations (required in production —
      // sync() is intentionally skipped there, run migrations against
      // Supabase before/at deploy time instead).
      await sequelize.sync();
    } catch (err) {
      logger.error(`Model sync failed: ${err.message}`);
    }
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
};

start();
