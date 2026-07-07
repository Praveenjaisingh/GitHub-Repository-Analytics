const { Sequelize } = require('sequelize');
// Sequelize loads the 'pg' driver with a *dynamic* require() based on the
// dialect string. Vercel's build-time file tracer can't follow dynamic
// requires, so 'pg' silently gets left out of the deployed function bundle
// even though it's a listed dependency — causing "Please install pg
// package manually" at runtime. Requiring it here statically, and passing
// it in via `dialectModule`, forces the tracer to include it.
const pg = require('pg');
const logger = require('./logger');

const isProd = process.env.NODE_ENV === 'production';

// Supabase (and most managed Postgres providers) require SSL and are
// reachable via a single connection string. We prefer DATABASE_URL when
// it's set (Vercel + Supabase deploys) and fall back to discrete
// DB_* vars for local/Docker development.
const useConnectionString = !!process.env.DATABASE_URL;

const sslOptions = isProd || process.env.DB_SSL === 'true'
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : {};

// Serverless platforms (Vercel) spin up a fresh function instance per
// request, so keep the pool tiny to avoid exhausting Supabase's
// connection limit. Prefer Supabase's connection pooler URL
// (port 6543, "Connection pooling" in Supabase dashboard) over the
// direct connection (port 5432) when deploying to Vercel.
const poolOptions = isProd
  ? { max: 2, min: 0, idle: 10000, acquire: 20000 }
  : { max: 5, min: 0, idle: 10000, acquire: 20000 };

const sequelize = useConnectionString
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectModule: pg,
      logging: false,
      dialectOptions: sslOptions,
      pool: poolOptions,
    })
  : new Sequelize(
      process.env.DB_NAME || 'github_analytics',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        dialectModule: pg,
        logging: false,
        dialectOptions: sslOptions,
        pool: poolOptions,
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connection established successfully.');
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error.message}`);
    // Don't crash the whole process in dev if DB isn't up yet;
    // routes that need DB will surface a clear error instead.
  }
};

module.exports = { sequelize, connectDB };
