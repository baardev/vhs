import express from 'express';
import { pool } from '../db';
import { logInfo, logError, logDebug } from '../utils/loggerClient';

const router = express.Router();

interface PlayerRound {
  player_id: string;
  play_date: Date;
  differential: number;
}

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] handicapCalc ${req.method} request received`);
  next();
});

// @ts-ignore - Bypass TypeScript errors temporarily
router.get('/', async (req, res) => {
  logInfo('handicapCalc processing request at ' + new Date().toISOString(), 'handicapCalc');
  
  // Even more aggressive cache prevention
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  
  try {
    // Fetch the player's rounds data from the database
    logDebug('About to execute query', 'handicapCalc');
    const result = await pool.query(`
      SELECT 
          player_id,
          play_date,
          differential
      FROM player_cards
      WHERE 
          player_id = 'vns'
          AND tarj = 'OK'
          AND differential IS NOT NULL
      ORDER BY play_date DESC
      LIMIT 20
    `);
    
    logInfo(`Query executed, found ${result.rows.length} rounds for player`, 'handicapCalc');
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
    differential: typeof round.differential === 'string' 
      ? parseFloat(round.differential) 
      : round.differential
  }));
  
  // Sort by differential (ascending - best scores first)
  const sortedRounds = [...roundsWithNumericDifferentials].sort(
    (a, b) => a.differential - b.differential
  );
  
  // Get the best 8 differentials
  const bestDifferentials = sortedRounds.slice(0, 8);
  
  // Calculate average differential
  const sum = bestDifferentials.reduce((acc, round) => acc + round.differential, 0);
  const avgDifferential = bestDifferentials.length > 0 ? sum / bestDifferentials.length : 0;
  
  // Calculate handicap index (average differential * 0.96, rounded to 1 decimal place)
  const handicapIndex = Math.round((avgDifferential * 0.96) * 10) / 10;
  
  return {
    avgDifferential,
    handicapIndex,
    roundsUsed: bestDifferentials.length
  };
}

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
        WHERE player_id = 'vns' AND tarj = 'OK' AND differential IS NOT NULL
      `);
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

export default router; 