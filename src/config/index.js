require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    pagination: {
        defaultPage: 1,
        defaultLimit: 10,
        maxLimit: 100,
    },
};

module.exports = config;
