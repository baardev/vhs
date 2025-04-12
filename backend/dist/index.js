"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Route handlers
app.use('/api/auth', auth_1.default);
app.get('/', (req, res) => {
    res.send('Hello from VHS backend!');
});
app.get('/api', (req, res) => {
    res.send('API is working');
});
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Backend is healthy!' });
});
// Start server
app.listen(port, () => {
    console.log(`VHS backend listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map