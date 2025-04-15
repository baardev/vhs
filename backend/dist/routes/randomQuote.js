"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/random-quote', async (req, res) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM golf_quotes ORDER BY RANDOM() LIMIT 1');
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error fetching random quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=randomQuote.js.map