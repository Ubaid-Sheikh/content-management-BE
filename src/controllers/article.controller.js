const articleService = require('../services/article.service');

const getArticles = async (req, res, next) => {
    try {
        const { page, limit, status, search } = req.query;
        const result = await articleService.getArticles({ page, limit, status, search });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

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

const createArticle = async (req, res, next) => {
    try {
        const { title, content, status } = req.body;
        const authorId = req.user.id;
        let imageUrl = null;

        if (req.file) {
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            imageUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const article = await articleService.createArticle({
            title,
            content,
            imageUrl,
            status,
            authorId,
        });

        res.status(201).json({
            success: true,
            data: { article },
        });
    } catch (error) {
        next(error);
    }
};

const updateArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const updateData = { title, content, status };

        if (req.file) {
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            updateData.imageUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const article = await articleService.updateArticle(
            id,
            userId,
            userRole,
            updateData
        );

        res.status(200).json({
            success: true,
            data: { article },
        });
    } catch (error) {
        next(error);
    }
};

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
