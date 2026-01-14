const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const {
    createArticleSchema,
    updateArticleSchema,
    getArticleSchema,
    deleteArticleSchema,
    getArticlesSchema,
} = require('../validators/article.validator');

/**
 * @route   GET /articles
 * @desc    Get all articles (with pagination)
 * @access  Public
 */
router.get('/', validate(getArticlesSchema), articleController.getArticles);

/**
 * @route   GET /articles/:id
 * @desc    Get article by ID
 * @access  Public
 */
router.get('/:id', validate(getArticleSchema), articleController.getArticleById);

/**
 * @route   POST /articles
 * @desc    Create a new article
 * @access  Private (Admin, Editor)
 */
router.post(
    '/',
    authenticate,
    authorize('ADMIN', 'EDITOR'),
    upload.single('image'),
    validate(createArticleSchema),
    articleController.createArticle
);

/**
 * @route   PUT /articles/:id
 * @desc    Update an article
 * @access  Private (Owner or Admin)
 */
router.put(
    '/:id',
    authenticate,
    authorize('ADMIN', 'EDITOR'),
    upload.single('image'),
    validate(updateArticleSchema),
    articleController.updateArticle
);

/**
 * @route   DELETE /articles/:id
 * @desc    Delete an article
 * @access  Private (Admin only)
 */
router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(deleteArticleSchema),
    articleController.deleteArticle
);

module.exports = router;
