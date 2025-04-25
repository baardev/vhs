import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';

const router = Router();

// Get all player cards with course and user info
router.get('/player-cards', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        pc.id, 
        pc.player_id,
        pc.play_date,
        pc.course_id,
        pc.differential,
        pc.hcpi,
        pc.hcp,
        pc.gross,
        pc.net,
        pc.tarj,
        pc.verified,
        cn.course_name,
        u.username as player_name
      FROM 
        player_cards pc
      LEFT JOIN 
        course_names cn ON pc.course_id = cn.course_id
      LEFT JOIN 
        users u ON pc.player_id::INTEGER = u.id
      ORDER BY 
        pc.play_date DESC
      LIMIT 100
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching player cards:', error);
    next(error);
  }
});

// Get a specific player card by ID
router.get('/player-cards/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        pc.*,
        cn.course_name,
        u.username as player_name,
        tt.color as tee_name
      FROM 
        player_cards pc
      LEFT JOIN 
        course_names cn ON pc.course_id = cn.course_id
      LEFT JOIN 
        users u ON pc.player_id::INTEGER = u.id
      LEFT JOIN
        tee_types tt ON pc.tee_id = tt.id
      WHERE 
        pc.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Player card not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get player cards for a specific player
router.get('/player-cards/player/:playerId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { playerId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        pc.id, 
        pc.player_id,
        pc.play_date,
        pc.course_id,
        pc.differential,
        pc.hcpi,
        pc.hcp,
        pc.gross,
        pc.net,
        pc.tarj,
        pc.verified,
        cn.course_name
      FROM 
        player_cards pc
      LEFT JOIN 
        course_names cn ON pc.course_id = cn.course_id
      WHERE 
        pc.player_id = $1
      ORDER BY 
        pc.play_date DESC
    `, [playerId]);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get player cards for a specific course
router.get('/player-cards/course/:courseId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        pc.id, 
        pc.player_id,
        pc.play_date,
        pc.differential,
        pc.hcpi,
        pc.hcp,
        pc.gross,
        pc.net,
        pc.tarj,
        pc.verified,
        u.username as player_name
      FROM 
        player_cards pc
      LEFT JOIN 
        users u ON pc.player_id::INTEGER = u.id
      WHERE 
        pc.course_id = $1
      ORDER BY 
        pc.play_date DESC
    `, [courseId]);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router; 