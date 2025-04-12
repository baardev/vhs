"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
// Register a new user
router.post('/register', [
    (0, express_validator_1.body)('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Must provide a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
], async (req, res, next) => {
    try {
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Insert user into database
        const result = await db_1.default.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, hashedPassword]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
});
// Login user
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Must provide a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
    try {
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        // Find user
        const userResult = await db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        // Validate credentials
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get user profile
router.get('/profile', authenticateToken, async (req, res, next) => {
    try {
        const userResult = await db_1.default.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [req.user?.id]);
        if (userResult.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(userResult.rows[0]);
    }
    catch (error) {
        next(error);
    }
});
// Update user profile
router.put('/profile', authenticateToken, [
    (0, express_validator_1.body)('username').trim().optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Must provide a valid email')
], async (req, res, next) => {
    try {
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { username, email } = req.body;
        // Build SET clause for SQL dynamically based on provided fields
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (username) {
            updates.push(`username = $${paramCount++}`);
            values.push(username);
        }
        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (updates.length === 0) {
            res.status(400).json({ error: 'No update data provided' });
            return;
        }
        // Add user ID as the last parameter
        values.push(req.user?.id);
        // Update user
        const updatedUser = await db_1.default.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, email`, values);
        if (updatedUser.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(updatedUser.rows[0]);
    }
    catch (error) {
        next(error);
    }
});
// Delete user account
router.delete('/profile', authenticateToken, async (req, res, next) => {
    try {
        const result = await db_1.default.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.user?.id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ message: 'User account deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map