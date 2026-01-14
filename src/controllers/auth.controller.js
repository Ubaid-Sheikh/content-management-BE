const authService = require('../services/auth.service');

/**
 * Register Controller
 * POST /auth/register
 */
const register = async (req, res, next) => {
    try {
        const { email, password, name, role } = req.body;

        const result = await authService.register({
            email,
            password,
            name,
            role,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login Controller
 * POST /auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login({ email, password });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Current User Profile
 * GET /auth/me
 */
const getProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
};
