const prisma = require('../config/database');
const config = require('../config');

/**
 * Get all articles with pagination and filtering
 */
const getArticles = async ({ page = 1, limit = 10, status, search }) => {
    // Parse and validate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(parseInt(limit), config.pagination.maxLimit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { title: { contains: search } },
            { content: { contains: search } },
        ];
    }

    // Fetch articles with pagination
    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        }),
        prisma.article.count({ where }),
    ]);

    return {
        articles,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

/**
 * Get article by ID
 */
const getArticleById = async (id) => {
    const article = await prisma.article.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    if (!article) {
        const error = new Error('Article not found');
        error.statusCode = 404;
        throw error;
    }

    return article;
};

/**
 * Create a new article
 */
const createArticle = async ({ title, content, imageUrl, status = 'DRAFT', authorId }) => {
    const article = await prisma.article.create({
        data: {
            title,
            content,
            imageUrl,
            status,
            authorId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return article;
};

/**
 * Update an article
 */
const updateArticle = async (id, userId, userRole, updateData) => {
    // Fetch the article
    const article = await prisma.article.findUnique({
        where: { id },
    });

    if (!article) {
        const error = new Error('Article not found');
        error.statusCode = 404;
        throw error;
    }

    // Authorization check: Only writer/owner or admin can update
    if (article.authorId !== userId && userRole !== 'ADMIN') {
        const error = new Error('Access Denied: You can only edit articles that you have authored.');
        error.statusCode = 403;
        error.operational = true;
        throw error;
    }

    // Update article
    const updatedArticle = await prisma.article.update({
        where: { id },
        data: updateData,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return updatedArticle;
};

/**
 * Delete an article (Admin only)
 */
const deleteArticle = async (id, userRole) => {
    // Only admins can delete
    if (userRole !== 'ADMIN') {
        const error = new Error('Only admins can delete articles');
        error.statusCode = 403;
        throw error;
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
        where: { id },
    });

    if (!article) {
        const error = new Error('Article not found');
        error.statusCode = 404;
        throw error;
    }

    // Delete article
    await prisma.article.delete({
        where: { id },
    });

    return { message: 'Article deleted successfully' };
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
};
