import { Router } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/random-quote', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM golf_quotes ORDER BY RANDOM() LIMIT 1');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching random quote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;