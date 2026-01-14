const articleService = require('../services/article.service');

/**
 * Get All Articles (Public)
 * GET /articles
 */
const getArticles = async (req, res, next) => {
    try {
        const { page, limit, status, search } = req.query;

        const result = await articleService.getArticles({
            page,
            limit,
            status,
            search,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Article by ID (Public)
 * GET /articles/:id
 */
const getArticleById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const article = await articleService.getArticleById(id);

        res.status(200).json({
            success: true,
            data: { article },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create Article (Admin, Editor)
 * POST /articles
 */
const createArticle = async (req, res, next) => {
    try {
        const { title, content, status } = req.body;
        const authorId = req.user.id;

        const article = await articleService.createArticle({
            title,
            content,
            status,
            authorId,
        });

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            data: { article },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update Article (Owner or Admin)
 * PUT /articles/:id
 */
const updateArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const article = await articleService.updateArticle(
            id,
            userId,
            userRole,
            { title, content, status }
        );

        res.status(200).json({
            success: true,
            message: 'Article updated successfully',
            data: { article },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete Article (Admin only)
 * DELETE /articles/:id
 */
const deleteArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userRole = req.user.role;

        const result = await articleService.deleteArticle(id, userRole);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
};
