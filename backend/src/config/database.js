const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      max: 20,
      family: 4,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'gooddeeds',
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      max: 20,
      family: 4,
    });

module.exports = pool;
