/**
 * @fileoverview Routes for managing player scorecards.
 *
 * @remarks
 * This module defines API endpoints for CRUD operations on player scorecards.
 * It includes routes to:
 * - Fetch all player cards with course and user information.
 * - Fetch player cards for a specific player or a specific course.
 * - Fetch chart data (last 50 'OK' scorecards) for the currently logged-in user.
 * - Fetch a specific player card by its ID.
 * - Update a specific player card by its ID.
 * Authentication is used for fetching user-specific chart data.
 * A `PlayerCard` interface is defined locally for type safety, though it's noted it could be moved to a shared types file.
 *
 * Called by:
 * - `backend/src/index.ts`
 *
 * Calls:
 * - `express` (external library)
 * - `../db` (likely `backend/src/db.ts` or `backend/src/db/index.ts` - provides `pool` and `safeQuery` for database interaction)
 * - `./authenticateToken` (`backend/src/routes/authenticateToken.ts` - for `AuthRequest` type and JWT authentication middleware)
 */
import { Router, Request, Response, NextFunction } from 'express';
import { pool, safeQuery } from '../db';
import authenticateToken, { AuthRequest } from './authenticateToken'; // Ensure AuthRequest is imported if needed

const router = Router();

// Simple test endpoint with no DB access
// router.get('/player-cards-test', async (req: Request, res: Response): Promise<void> => {
//   console.log('GET /player-cards-test - Test endpoint hit');
//   res.json({ message: 'Player cards test endpoint is working!' });
// });

// Get all player cards with course and user info
router.get('/player-cards', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('GET /player-cards - Fetching player cards for user:', req.user?.id);
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const result = await safeQuery(`
      SELECT 
        pc.id, 
        pc.player_id,
        pc.play_date,
        pc.course_id,
        pc.g_differential,
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
      WHERE 
        pc.player_id = $1
      ORDER BY 
        pc.play_date DESC
      LIMIT 100
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching player cards:', error);
    next(error);
  }
});

// Get player cards for a specific player - must come BEFORE the :id route
router.get('/player-cards/player/:playerId', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { playerId } = req.params;
    
    // Ensure users can only access their own cards
    if (!req.user || req.user.id !== parseInt(playerId)) {
      res.status(403).json({ error: 'Unauthorized access to player cards' });
      return;
    }
    
    const result = await safeQuery(`
      SELECT 
        pc.id, 
        pc.player_id,
        pc.play_date,
        pc.course_id,
        pc.g_differential,
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

// Get player cards for a specific course - must come BEFORE the :id route
router.get('/player-cards/course/:courseId', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const result = await safeQuery(`
      SELECT 
        pc.id, 
        pc.player_id,
        pc.play_date,
        pc.g_differential,
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
        AND pc.player_id = $2
      ORDER BY 
        pc.play_date DESC
    `, [courseId, req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get chart data for the current logged-in user's last 50 'OK' scorecards
router.get('/user/chart-data', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id; // Get user ID from authenticated request
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const query = `
      SELECT
        play_date,
        gross,
        net,
        g_differential AS differential
      FROM
        player_cards
      WHERE
        player_id = $1 AND
        tarj = 'OK'
      ORDER BY
        play_date DESC
      LIMIT 50;
    `;
    
    const result = await pool.query(query, [userId]);
    // The data is fetched DESC by date (most recent first). 
    // For charting, it's often better to have it ASC (oldest first).
    // So, we reverse it here before sending.
    res.json(result.rows.reverse()); 

  } catch (error) {
    console.error('Error fetching user chart data:', error);
    next(error);
  }
});

// Get a specific player card by ID - this route must come AFTER the more specific routes
router.get('/player-cards/:id', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // First check if this card belongs to the requesting user
    const ownerCheck = await safeQuery(`
      SELECT player_id FROM player_cards WHERE id = $1
    `, [id]);
    
    if (ownerCheck.rows.length === 0) {
      res.status(404).json({ error: 'Player card not found' });
      return;
    }
    
    // Ensure the user can only view their own cards
    if (parseInt(ownerCheck.rows[0].player_id) !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized access to player card' });
      return;
    }
    
    const result = await safeQuery(`
      SELECT 
        pc.*,
        cn.course_name,
        u.username as player_name,
        tt.tee_color as tee_name
      FROM 
        player_cards pc
      LEFT JOIN 
        course_names cn ON pc.course_id = cn.course_id
      LEFT JOIN 
        users u ON pc.player_id::INTEGER = u.id
      LEFT JOIN
        x_course_tee_types tt ON pc.tee_id = tt.tee_id
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

// PUT update a specific player card by ID
router.put('/player-cards/:id', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // First check if this card belongs to the requesting user
    const ownerCheck = await safeQuery(`
      SELECT player_id FROM player_cards WHERE id = $1
    `, [id]);
    
    if (ownerCheck.rows.length === 0) {
      res.status(404).json({ error: 'Player card not found' });
      return;
    }
    
    // Ensure the user can only update their own cards
    if (parseInt(ownerCheck.rows[0].player_id) !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized access to player card' });
      return;
    }
    
    // Define fields that can be updated
    const allowedFields = [
      'play_date', 'course_id', 'tee_id', 'g_differential', 
      'hcpi', 'hcp', 'gross', 'net', 'tarj', 'verified'
    ];
    
    const setClauses = [];
    const values = [];
    let valueCount = 0;
    
    // Filter to only allowed fields and build the SQL SET clause
    for (const field of allowedFields) {
      if (field in updateData) {
        valueCount++;
        setClauses.push(`${field} = $${valueCount}`);
        values.push(updateData[field]);
      }
    }
    
    if (setClauses.length === 0) {
      res.status(400).json({ error: 'No valid fields to update' });
      return;
    }
    
    valueCount++;
    values.push(id); // For the WHERE clause
    const updateQuery = `UPDATE player_cards SET ${setClauses.join(', ')} WHERE id = $${valueCount} RETURNING *`;
    
    const result = await safeQuery(updateQuery, values);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Player card not found or not updated' });
      return;
    }
    
    res.json(result.rows[0]); // Return the updated player card
  } catch (error) {
    console.error('Error updating player card:', error);
    next(error);
  }
});

// POST create a new player card
router.post('/player-cards', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const cardData = req.body;
    
    // Always set player_id to the authenticated user's ID, regardless of what was sent
    cardData.player_id = req.user.id;
    
    // Define the fields that are allowed to be inserted
    const allowedFields = [
      'player_id', 'play_date', 'course_id', 'tee_id', 'g_differential',
      'hcpi', 'hcp', 'gross', 'net', 'tarj', 'verified',
      'weather', 'day_of_week', 'category', 'post', 'judges',
      'ida', 'vta', 'adj_gross', 'bir', 'par_holes',
      'bog', 'bg2', 'bg3g', 'plus_bg3', 'putts',
      'h01', 'h02', 'h03', 'h04', 'h05', 'h06', 'h07', 'h08', 'h09',
      'h10', 'h11', 'h12', 'h13', 'h14', 'h15', 'h16', 'h17', 'h18'
    ];
    
    // Handle differential conversion if necessary (frontend might send differential instead of g_differential)
    if (cardData.differential !== undefined && cardData.g_differential === undefined) {
      cardData.g_differential = cardData.differential;
      delete cardData.differential;
    }
    
    const fields = [];
    const placeholders = [];
    const values = [];
    let valueCount = 0;
    
    // Filter to only allowed fields and build the SQL INSERT clause
    for (const field of allowedFields) {
      if (field in cardData) {
        fields.push(field);
        valueCount++;
        placeholders.push(`$${valueCount}`);
        values.push(cardData[field]);
      }
    }
    
    if (fields.length === 0) {
      res.status(400).json({ error: 'No valid fields provided' });
      return;
    }
    
    const insertQuery = `
      INSERT INTO player_cards (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await safeQuery(insertQuery, values);
    res.status(201).json(result.rows[0]); // Return the created player card with 201 Created status
  } catch (error) {
    console.error('Error creating player card:', error);
    next(error);
  }
});

export default router; 

// Helper type (can be moved to a types file if shared)
interface PlayerCard { 
  id: number;
  player_id: string | number; // player_id is integer in db
  play_date: string; // Or Date
  course_id: number;
  ext_id?: number;
  weather?: string;
  day_of_week?: string;
  category?: string;
  g_differential?: number; // In DB
  differential?: number; // Potentially from frontend
  post?: string;
  judges?: string;
  hcpi?: number;
  hcp?: number;
  ida?: number;
  vta?: number;
  gross?: number;
  adj_gross?: number;
  net?: number;
  tarj?: string;
  bir?: string;
  par_holes?: string;
  bog?: number;
  bg2?: number;
  bg3g?: number;
  plus_bg3?: string;
  putts?: string;
  tee_id?: string;
  h01?: number; h02?: number; h03?: number; h04?: number; h05?: number;
  h06?: number; h07?: number; h08?: number; h09?: number;
  h10?: number; h11?: number; h12?: number; h13?: number; h14?: number;
  h15?: number; h16?: number; h17?: number; h18?: number;
  verified?: boolean;
  created_at?: string; // Or Date
} 