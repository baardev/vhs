/**
 * @fileoverview Route for fetching a random golf quote.
 *
 * @remarks
 * This module defines a single API endpoint (`/random-quote`) that retrieves a random quote
 * from the `golf_quotes` table in the database.
 * 
 * The quotes provided by this endpoint are used in the frontend application to display
 * inspirational golf quotes on various pages, primarily through the RandomQuote component.
 *
 * Called by:
 * - `backend/src/index.ts`
 * - Frontend API route: `frontend/app/api/random-quote/route.ts`
 * 
 * Calls:
 * - `express` (external library - for Router)
 * - `../db` (likely `backend/src/db.ts` or `backend/src/db/index.ts` - provides database connection pool)
 */
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router: Router = Router();

router.get('/random-quote', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM golf_quotes ORDER BY RANDOM() LIMIT 1'
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching random quote:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error' });
  }
});

export default router;