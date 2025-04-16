#!/usr/bin/env node

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Create a connection to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@db:5432/vhsdb'
});

async function createTestUser() {
  // Get command line arguments
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.error('Usage: node create-test-user.js <username> <email> <password>');
    process.exit(1);
  }

  const [username, email, password] = args;

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const checkResult = await pool.query(checkQuery, [username, email]);

    if (checkResult.rows.length > 0) {
      console.log('User already exists with that username or email.');
      process.exit(0);
    }

    // Insert the new user
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email';
    const result = await pool.query(insertQuery, [username, email, hashedPassword]);

    console.log('Test user created successfully:', result.rows[0]);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

createTestUser();