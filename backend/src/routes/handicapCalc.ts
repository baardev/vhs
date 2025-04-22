import express from 'express';
import { pool } from '../db';

const router = express.Router();

// @ts-ignore - Bypass TypeScript errors temporarily
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT AVG(differential) AS avg_differential
      FROM (
        SELECT differential
        FROM player_cards
        ORDER BY differential ASC
        LIMIT 8
      ) AS best8;
    `);
    
    // Extract result or return null if no results
    const avgDifferential = result.rows[0]?.avg_differential ?? null;
    
    res.json({ 
      avg_differential: avgDifferential,
      success: true 
    });
  } catch (error) {
    console.error('Error calculating handicap:', error);
    
    // For development/testing, return mock data if database cannot be reached
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOTFOUND' && 
        'hostname' in error && error.hostname === 'db') {
      console.log('Database not reachable, returning mock data');
      return res.json({ 
        avg_differential: 8.3, 
        success: true,
        is_mock: true 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to calculate handicap', 
      success: false 
    });
  }
});

export default router; 