import express, { Request, Response } from 'express';
import { pool } from '../db';
import authenticateToken from './authenticateToken';

// Extended Request type with user property
interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

// Define the Todo item type
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  user_id: number;
  created_at: Date;
}

const router = express.Router();

// Get all todos for the authenticated user
router.get('/todos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
router.post('/todos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { text, completed, category } = req.body;
    const userId = req.user?.id;

    if (!text || !category) {
      res.status(400).json({ error: 'Text and category are required' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO todos (text, completed, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [text, completed || false, category, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
router.put('/todos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { text, completed, category } = req.body;
    const userId = req.user?.id;

    // Verify the todo belongs to the authenticated user
    const todoCheck = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (todoCheck.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found or not authorized' });
      return;
    }

    const result = await pool.query(
      'UPDATE todos SET text = $1, completed = $2, category = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [text, completed, category, id, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/todos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Verify the todo belongs to the authenticated user
    const todoCheck = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (todoCheck.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found or not authorized' });
      return;
    }

    await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;