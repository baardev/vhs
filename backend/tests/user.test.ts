import { pool } from '../src/db';

describe('User Model', () => {
  afterEach(async () => {
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['test%@example.com']);
  });

  test('create user', async () => {
    const res = await pool.query(`
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id
    `, ['testuser', 'test@example.com', 'hashed_password']);
    expect(res.rows[0].id).toBeGreaterThan(0);
  });
});