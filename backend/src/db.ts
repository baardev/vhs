import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user:     process.env.DB_USER     || process.env.PGUSER     || 'admin',
  host:     process.env.DB_HOST     || process.env.PGHOST     || 'db',
  database: process.env.DB_NAME     || process.env.PGDATABASE || 'vhsdb',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'admin123',
  port:     Number(process.env.DB_PORT || process.env.PGPORT || 5432),
});

export { pool };
