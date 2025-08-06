const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
router.post(
    '/',
    authenticateUser,
    authorizeRoles('admin', 'author'),
    articleController.createArticle
);
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);
  
router.put(
    '/:id',
    authenticateUser,
    authorizeRoles('admin', 'editor', 'author'),
    articleController.updateArticle
);
router.delete(
    '/:id',
    authenticateUser,
    authorizeRoles('admin'),
    articleController.deleteArticle
);

module.exports = router;