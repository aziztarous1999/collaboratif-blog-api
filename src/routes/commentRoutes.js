const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, commentController.postComment);
router.get('/:articleId', commentController.fetchComments);
router.delete('/:id',verifyToken, commentController.deleteComment);

module.exports = router;