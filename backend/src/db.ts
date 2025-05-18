import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a simple dummy data implementation if database connection fails
let useDummyData = false;
const dummyPlayerCards = [
  {
    id: 1,
    player_id: '1',
    play_date: '2023-04-15',
    course_id: 101,
    differential: 5.4,
    hcpi: 12.3,
    hcp: 12,
    gross: 90,
    net: 78,
    tarj: 'OK',
    verified: true,
    course_name: 'Sample Golf Club',
    player_name: 'John Doe'
  },
  {
    id: 2,
    player_id: '2',
    play_date: '2023-04-20',
    course_id: 102,
    differential: 4.2,
    hcpi: 10.5,
    hcp: 11,
    gross: 85,
    net: 74,
    tarj: 'OK',
    verified: true,
    course_name: 'Mountain View Golf',
    player_name: 'Jane Smith'
  }
];


const pool = new Pool({
  user:     process.env.DB_USER     || process.env.PGUSER     || 'admin',
  host:     process.env.DB_HOST     || process.env.PGHOST     || 'db', // Changed back to 'db' for Docker
  database: process.env.DB_NAME     || process.env.PGDATABASE || 'vhsdb',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'ABeoAuNKL5f',
  port:     Number(process.env.DB_PORT || process.env.PGPORT || 6541),
});



// Check if we can connect to the database
pool.query('SELECT NOW()')
  .then(() => {
    console.log('Database connection successful');
    useDummyData = false;
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
    console.log('Using dummy data as fallback');
    useDummyData = true;
  });

// Custom query method that falls back to dummy data if database is unavailable
const safeQuery = async (text: string, params?: any[]) => {
  if (useDummyData) {
    console.log('Using dummy data for query:', text);
    
    // Implement basic handling for player_cards queries
    if (text.includes('FROM player_cards')) {
      return { rows: dummyPlayerCards };
    }
    
    // Default empty result
    return { rows: [] };
  }
  
  // Use the real database
  return pool.query(text, params);
};

export { pool, safeQuery };
