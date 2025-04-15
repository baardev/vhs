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
const courses_1 = __importDefault(require("./routes/courses"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const port = Number(process.env.PORT) || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
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
app.use('/api/courses', courses_1.default);
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
// Serve uploaded files
app.use('/uploads', express_1.default.static('uploads'));
// Global error handler middleware (must be after all routes)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});
// Start server
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`VHS backend listening at http://0.0.0.0:${port}`);
});
// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
    }
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    // Give the server some time to send any pending responses before exiting
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Continue running, but log the error
});
//# sourceMappingURL=index.js.map