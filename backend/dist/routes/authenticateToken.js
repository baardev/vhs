"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }
        // Use a default secret if environment variable is not set
        const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.default = authenticateToken;
//# sourceMappingURL=authenticateToken.js.map