const { z } = require('zod');

/**
 * Create Article Validation Schema
 */
const createArticleSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(3, 'Title must be at least 3 characters')
            .max(200, 'Title is too long'),
        content: z
            .string()
            .min(10, 'Content must be at least 10 characters'),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    }).passthrough(),
});

/**
 * Update Article Validation Schema
 */
const updateArticleSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid article ID'),
    }),
    body: z.object({
        title: z
            .string()
            .min(3, 'Title must be at least 3 characters')
            .max(200, 'Title is too long')
            .optional(),
        content: z
            .string()
            .min(10, 'Content must be at least 10 characters')
            .optional(),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    }).passthrough(),
});

/**
 * Get Article by ID Validation Schema
 */
const getArticleSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid article ID'),
    }),
});

/**
 * Delete Article Validation Schema
 */
const deleteArticleSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid article ID'),
    }),
});

/**
 * Get Articles List Validation Schema (with pagination)
 */
const getArticlesSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
        search: z.string().optional(),
    }),
});

module.exports = {
    createArticleSchema,
    updateArticleSchema,
    getArticleSchema,
    deleteArticleSchema,
    getArticlesSchema,
};
