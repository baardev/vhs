"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/test-db', async (req, res) => {
    try {
        const result = await db_1.pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    }
    catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});
exports.default = router;
//# sourceMappingURL=testDb.js.map