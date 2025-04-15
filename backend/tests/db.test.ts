import { pool } from '../src/db';
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

describe('Database', () => {
  beforeAll(async () => {
    await pool.query('SELECT 1'); // Test connection
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should connect to database', async () => {
    const result = await pool.query('SELECT NOW() as current_time');
    expect(result.rows[0].current_time).toBeInstanceOf(Date);
  });

  test('users table exists', async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
      )
    `);
    expect(result.rows[0].exists).toBe(true);
  });
});