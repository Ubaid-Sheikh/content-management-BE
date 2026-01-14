const prisma = require('../config/database');
const config = require('../config');

const getArticles = async ({ page = 1, limit = 10, status, search }) => {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(parseInt(limit), config.pagination.maxLimit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status) where.status = status;
    if (search) {
        where.OR = [
            { title: { contains: search } },
            { content: { contains: search } },
        ];
    }

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, name: true, email: true, role: true },
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

const getArticleById = async (id) => {
    const article = await prisma.article.findUnique({
        where: { id },
        include: {
            author: {
                select: { id: true, name: true, email: true, role: true },
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

const createArticle = async ({ title, content, imageUrl, status = 'DRAFT', authorId }) => {
    return prisma.article.create({
        data: { title, content, imageUrl, status, authorId },
        include: {
            author: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    });
};

const updateArticle = async (id, userId, userRole, updateData) => {
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
        const error = new Error('Article not found');
        error.statusCode = 404;
        throw error;
    }

    if (article.authorId !== userId && userRole !== 'ADMIN') {
        const error = new Error('Access Denied: You can only edit articles that you have authored.');
        error.statusCode = 403;
        error.operational = true;
        throw error;
    }

    return prisma.article.update({
        where: { id },
        data: updateData,
        include: {
            author: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    });
};

const deleteArticle = async (id, userRole) => {
    if (userRole !== 'ADMIN') {
        const error = new Error('Only admins can delete articles');
        error.statusCode = 403;
        throw error;
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
        const error = new Error('Article not found');
        error.statusCode = 404;
        throw error;
    }

    await prisma.article.delete({ where: { id } });
    return { message: 'Article deleted successfully' };
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
};
