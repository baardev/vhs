import express from 'express';
import { pool } from '../db';
import { logInfo, logError, logDebug } from '../utils/loggerClient';

const router = express.Router();

interface PlayerRound {
  player_id: number;
  play_date: Date;
  g_differential: number;
}

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] handicapCalc ${req.method} request received`);
  next();
});

// Root endpoint for backward compatibility
// @ts-ignore - Bypass TypeScript errors temporarily
router.get('/', async (req, res) => {
  logInfo('handicapCalc processing request at ' + new Date().toISOString(), 'handicapCalc');
  
  // Even more aggressive cache prevention
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  
  try {
    // Use a default player ID for backward compatibility
    const defaultPlayerId = 1; // Using ID 1 as default
    
    // Fetch the player's rounds data from the database
    logDebug(`About to execute query for default player ${defaultPlayerId}`, 'handicapCalc');
    const result = await pool.query(`
      SELECT 
          player_id,
          play_date,
          g_differential
      FROM player_cards
      WHERE 
          player_id = $1
          AND tarj = 'OK'
          AND g_differential IS NOT NULL
      ORDER BY play_date DESC
      LIMIT 20
    `, [defaultPlayerId]);
    
    logInfo(`Query executed, found ${result.rows.length} rounds for default player`, 'handicapCalc');
    logDebug('Result first row: ' + JSON.stringify(result.rows[0] || 'No rows found'), 'handicapCalc');
    
    // Get rounds data
    const rounds: PlayerRound[] = result.rows;
    
    // Calculate handicap in TypeScript
    const handicapData = calculateHandicap(rounds);
    
    logDebug('Calculated handicap data: ' + JSON.stringify(handicapData), 'handicapCalc');
    
    return res.json({ 
      avg_differential: handicapData.avgDifferential,
      handicap_index: handicapData.handicapIndex,
      rounds_used: handicapData.roundsUsed,
      success: true 
    });
  } catch (error) {
    logError('Error calculating handicap: ' + JSON.stringify(error), 'handicapCalc');
    
    // For development/testing, return mock data if there's any error
    // This helps during development until the database is fully set up
    logInfo('Using mock data due to error', 'handicapCalc');
    return res.json({ 
      avg_differential: 100.000, // Very distinctive value
      handicap_index: 100.000,    // Very distinctive value 
      rounds_used: 8,
      success: true,
      is_mock: true,
      error_occurred: true,      // Clear flag
      error_message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Alternative endpoint that uses the current_handicap_indexes view
// @ts-ignore - Bypass TypeScript errors temporarily
router.get('/view/:player_id', async (req, res) => {
  const playerId = req.params.player_id;
  logInfo(`handicapCalc view processing request for player ${playerId}`, 'handicapCalc');
  
  try {
    const result = await pool.query(`
      SELECT 
        player_id,
        player_name,
        total_rounds,
        differentials_to_use,
        handicap_index,
        last_play_date
      FROM current_handicap_indexes
      WHERE player_id = $1
    `, [playerId]);
    
    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: 'No handicap data found for player'
      });
    }
    
    const handicapData = result.rows[0];
    
    return res.json({
      handicap_index: handicapData.handicap_index,
      total_rounds: handicapData.total_rounds,
      differentials_used: handicapData.differentials_to_use,
      last_play_date: handicapData.last_play_date,
      success: true
    });
  } catch (error) {
    logError(`Error fetching handicap from view: ${error instanceof Error ? error.message : 'Unknown error'}`, 'handicapCalc');
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// @ts-ignore - Bypass TypeScript errors temporarily
router.get('/test', (req, res) => {
  logInfo('Test endpoint was called', 'handicapCalc');
  return res.json({
    message: 'Test endpoint working',
    time: new Date().toISOString(),
    success: true
  });
});

// @ts-ignore - Bypass TypeScript errors temporarily
router.get('/debug', async (req, res) => {
  try {
    // Check if the table exists
    logDebug('Debug endpoint: checking if table exists', 'handicapCalc');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'player_cards'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    logInfo(`Table check result: ${tableExists ? 'Table exists' : 'Table does not exist'}`, 'handicapCalc');
    
    // If table exists, check sample data
    let recordCount = 0;
    if (tableExists) {
      const countResult = await pool.query(`
        SELECT COUNT(*) FROM player_cards 
        WHERE player_id = $1 AND tarj = 'OK' AND g_differential IS NOT NULL
      `, [1]); // Using 1 as a sample player_id
      recordCount = parseInt(countResult.rows[0].count);
      logInfo(`Found ${recordCount} matching records`, 'handicapCalc');
    }
    
    return res.json({
      table_exists: tableExists,
      record_count: recordCount,
      db_connection: 'working',
      success: true
    });
  } catch (error) {
    logError(`Debug endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'handicapCalc');
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// @ts-ignore - Bypass TypeScript errors temporarily
router.get('/:player_id', async (req, res) => {
  const playerId = req.params.player_id;
  logInfo(`handicapCalc processing request for player ${playerId} at ${new Date().toISOString()}`, 'handicapCalc');
  
  // Even more aggressive cache prevention
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  
  try {
    // Fetch the player's rounds data from the database
    logDebug(`About to execute query for player ${playerId}`, 'handicapCalc');
    const result = await pool.query(`
      SELECT 
          player_id,
          play_date,
          g_differential
      FROM player_cards
      WHERE 
          player_id = $1
          AND tarj = 'OK'
          AND g_differential IS NOT NULL
      ORDER BY play_date DESC
      LIMIT 20
    `, [playerId]);
    
    logInfo(`Query executed, found ${result.rows.length} rounds for player ${playerId}`, 'handicapCalc');
    logDebug('Result first row: ' + JSON.stringify(result.rows[0] || 'No rows found'), 'handicapCalc');
    
    // Get rounds data
    const rounds: PlayerRound[] = result.rows;
    
    // Calculate handicap in TypeScript
    const handicapData = calculateHandicap(rounds);
    
    logDebug('Calculated handicap data: ' + JSON.stringify(handicapData), 'handicapCalc');
    
    return res.json({ 
      avg_differential: handicapData.avgDifferential,
      handicap_index: handicapData.handicapIndex,
      rounds_used: handicapData.roundsUsed,
      success: true 
    });
  } catch (error) {
    logError('Error calculating handicap: ' + JSON.stringify(error), 'handicapCalc');
    
    // For development/testing, return mock data if there's any error
    // This helps during development until the database is fully set up
    logInfo('Using mock data due to error', 'handicapCalc');
    return res.json({ 
      avg_differential: 100.000, // Very distinctive value
      handicap_index: 100.000,    // Very distinctive value 
      rounds_used: 8,
      success: true,
      is_mock: true,
      error_occurred: true,      // Clear flag
      error_message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Calculate handicap index from player rounds
 * Takes differentials from the 20 most recent rounds
 * Uses the best 8 differentials to calculate the handicap
 */
function calculateHandicap(rounds: PlayerRound[]) {
  // Convert differentials to numbers
  const roundsWithNumericDifferentials = rounds.map(round => ({
    ...round,
    g_differential: typeof round.g_differential === 'string' 
      ? parseFloat(round.g_differential) 
      : round.g_differential
  }));
  
  // Sort by differential (ascending - best scores first)
  const sortedRounds = [...roundsWithNumericDifferentials].sort(
    (a, b) => a.g_differential - b.g_differential
  );
  
  // Get the best 8 differentials
  const bestDifferentials = sortedRounds.slice(0, 8);
  
  // Calculate average differential
  const sum = bestDifferentials.reduce((acc, round) => acc + round.g_differential, 0);
  const avgDifferential = bestDifferentials.length > 0 ? sum / bestDifferentials.length : 0;
  
  // Calculate handicap index (average differential * 0.96, rounded to 1 decimal place)
  const handicapIndex = Math.round((avgDifferential * 0.96) * 10) / 10;
  
  return {
    avgDifferential,
    handicapIndex,
    roundsUsed: bestDifferentials.length
  };
}

export default router; 