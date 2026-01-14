const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://content-management-fe-ten.vercel.app/',
        /\.vercel\.app$/
    ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Secure Content Workspace API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            articles: '/api/articles',
            health: '/api/health',
        },
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
    });
});

// Error Handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
