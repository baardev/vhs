"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const news_1 = __importDefault(require("./routes/news"));
const randomQuote_1 = __importDefault(require("./routes/randomQuote"));
const testDb_1 = __importDefault(require("./routes/testDb"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const port = Number(process.env.PORT) || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Route handlers
// Mount news router at the correct path
app.use('/', news_1.default);
// Other routes
app.use('/api/auth', auth_1.default);
app.use('/api', randomQuote_1.default);
app.use('/api', testDb_1.default);
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
app.listen(port, '0.0.0.0', () => {
    console.log(`VHS backend listening at http://0.0.0.0:${port}`);
});
//# sourceMappingURL=index.js.map