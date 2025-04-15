"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
const authenticateToken_1 = __importDefault(require("./authenticateToken"));
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
// Register a new user
router.post('/register', [
    (0, express_validator_1.body)('username')
        .trim()
        .custom((value) => {
        // Special case for 'jw' username
        if (value === 'jw')
            return true;
        // Otherwise require at least 3 characters
        return value.length >= 3;
    })
        .withMessage('Username must be at least 3 characters (or be "jw"'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Must provide a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
], async (req, res, next) => {
    try {
        console.log('Registration attempt received:', req.body.email);
        console.log('Full request body:', JSON.stringify(req.body));
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { username, email, password } = req.body;
        // Test database connection
        try {
            console.log('Testing database connection...');
            await db_1.pool.query('SELECT NOW()');
            console.log('Database connection successful');
        }
        catch (dbError) {
            console.error('Database connection failed:', dbError);
            res.status(500).json({ error: 'Database connection failed', details: dbError.message });
            return;
        }
        // Check if user already exists
        try {
            console.log('Checking if user exists with email:', email);
            const existingUser = await db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                console.log('User already exists with email:', email);
                res.status(400).json({ error: 'User with this email already exists' });
                return;
            }
            console.log('No existing user found with email:', email);
        }
        catch (userCheckError) {
            console.error('Error checking existing user:', userCheckError);
            res.status(500).json({ error: 'Failed to check existing user', details: userCheckError.message });
            return;
        }
        // Hash password
        let hashedPassword;
        try {
            console.log('Hashing password...');
            hashedPassword = await bcrypt_1.default.hash(password, 10);
            console.log('Password hashed successfully');
        }
        catch (hashError) {
            console.error('Error hashing password:', hashError);
            res.status(500).json({ error: 'Failed to hash password', details: hashError.message });
            return;
        }
        // Insert user into database
        try {
            console.log('Inserting user into database:', username, email);
            const result = await db_1.pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, hashedPassword]);
            console.log('User successfully registered:', result.rows[0]);
            res.status(201).json(result.rows[0]);
        }
        catch (insertError) {
            console.error('Error inserting user into database:', insertError);
            res.status(500).json({ error: 'Failed to create user', details: insertError.message });
            return;
        }
    }
    catch (error) {
        console.error('Unhandled error during registration:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
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
        const userResult = await db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        // Validate credentials
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Use a default secret if environment variable is not set
        const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: '2h' });
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
router.get('/profile', authenticateToken_1.default, async (req, res, next) => {
    try {
        const userResult = await db_1.pool.query('SELECT id, username, email, created_at, name, family_name, matricula, handicap FROM users WHERE id = $1', [req.user?.id]);
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
router.put('/profile', authenticateToken_1.default, [
    (0, express_validator_1.body)('username').trim().optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Must provide a valid email'),
    (0, express_validator_1.body)('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    (0, express_validator_1.body)('family_name').optional().isLength({ min: 2 }).withMessage('Family name must be at least 2 characters'),
    (0, express_validator_1.body)('matricula').optional().isLength({ min: 5 }).withMessage('Matricula must be at least 5 characters'),
    (0, express_validator_1.body)('handicap').optional().isLength({ min: 1 }).withMessage('Handicap must be at least 1 character')
], async (req, res, next) => {
    try {
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { username, email, name, family_name, matricula, handicap } = req.body;
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
        if (name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (family_name !== undefined) {
            updates.push(`family_name = $${paramCount++}`);
            values.push(family_name);
        }
        if (matricula !== undefined) {
            updates.push(`matricula = $${paramCount++}`);
            values.push(matricula);
        }
        if (handicap !== undefined) {
            updates.push(`handicap = $${paramCount++}`);
            values.push(handicap);
        }
        if (updates.length === 0) {
            res.status(400).json({ error: 'No update data provided' });
            return;
        }
        // Add user ID as the last parameter
        values.push(req.user?.id);
        // Update user
        const updatedUser = await db_1.pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, email, name, family_name, matricula, handicap`, values);
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
router.delete('/profile', authenticateToken_1.default, async (req, res, next) => {
    try {
        const result = await db_1.pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.user?.id]);
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
// Forgot password - request password reset
router.post('/forgot-password', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Must provide a valid email')
], async (req, res, next) => {
    try {
        const { email } = req.body;
        // Find user
        const userResult = await db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        // Always return success, even if user doesn't exist (for security)
        if (!user) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
            return;
        }
        // Generate a token
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // Token valid for 1 hour
        // Save token to database
        await db_1.pool.query('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.id, token, expires]);
        // In a real app, you would send an email with a link like:
        // https://yourdomain.com/reset-password/${token}
        console.log(`Password reset token generated for user ${user.id}:`);
        console.log(`Reset link would be: https://localhost/reset-password/${token}`);
        res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }
    catch (error) {
        console.error('Error in forgot-password:', error);
        next(error);
    }
});
// Reset password using token
router.post('/reset-password', [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Token is required'),
    (0, express_validator_1.body)('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
], async (req, res, next) => {
    try {
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { token, password } = req.body;
        // Find valid token
        const tokenResult = await db_1.pool.query('SELECT * FROM password_reset_tokens WHERE token = $1 AND used = false AND expires_at > NOW()', [token]);
        const resetToken = tokenResult.rows[0];
        if (!resetToken) {
            res.status(400).json({ error: 'Invalid or expired token' });
            return;
        }
        // Hash new password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Update user's password
        await db_1.pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, resetToken.user_id]);
        // Mark token as used
        await db_1.pool.query('UPDATE password_reset_tokens SET used = true WHERE id = $1', [resetToken.id]);
        res.status(200).json({ message: 'Password has been reset successfully' });
    }
    catch (error) {
        console.error('Error in reset-password:', error);
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map