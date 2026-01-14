const { z } = require('zod');

/**
 * User Registration Validation Schema
 */
const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password is too long'),
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name is too long'),
        role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
    }),
});

/**
 * User Login Validation Schema
 */
const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};
