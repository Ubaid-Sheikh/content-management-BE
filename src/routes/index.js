const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const articleRoutes = require('./article.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
