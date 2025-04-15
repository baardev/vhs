import request from 'supertest';
import { app } from '../src/index';

describe('Auth Routes', () => {
  test('POST /register - valid registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '1q2w3e'
      });
    expect(res.statusCode).toEqual(201);
  });

  test('POST /register - duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test@example.com', // Same email
        password: '1q2w3e'
      });
    expect(res.statusCode).toEqual(400);
  });
});