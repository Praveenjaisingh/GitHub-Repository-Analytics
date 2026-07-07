require('dotenv').config();

const common = {
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: false,
};

// Local/Docker development uses discrete DB_* vars.
const development = {
  ...common,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'github_analytics',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
};

const test = {
  ...development,
  database: `${process.env.DB_NAME || 'github_analytics'}_test`,
};

// Production (Vercel + Supabase) uses a single connection string.
// Run `npm run migrate` locally / from CI with this DATABASE_URL set to
// your Supabase connection string (direct, port 5432, for migrations —
// not the pgbouncer pooler URL, which doesn't support DDL well).
const production = {
  ...common,
  use_env_variable: 'DATABASE_URL',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
};

module.exports = { development, test, production };
