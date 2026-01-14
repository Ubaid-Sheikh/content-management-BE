const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || /localhost|vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Explicitly handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadDir = process.env.VERCEL ? '/tmp' : 'uploads';
app.use('/uploads', express.static(uploadDir));

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

// Only start server if not in Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = config.port;
    app.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📝 Environment: ${config.nodeEnv}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
        console.log('='.repeat(50));
    });
}

// Export for Vercel
module.exports = app;
