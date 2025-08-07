const Comment = require('../models/Comment');
const Article = require('../models/Article');

exports.postComment = async (req, res) => {
  try {
    const { articleId, content, parentId } = req.body;
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    const comment = await Comment.create({
      article: articleId,
      author: req.user.id,
      content,
      parent: parentId || null
    });

    const populated = await comment.populate('author', 'username');
    req.io.to(article.author._id.toString()).emit('new-comment', {
      articleId,
      comment: populated,
      message: `New comment on your article "${article.title}" by ${populated.author.username}`
    });

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
};

exports.fetchComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('author', 'username role')
      .lean();

    const nested = buildTree(comments);
    res.json(nested);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

function buildTree(comments) {
  const map = {};
  comments.forEach(c => map[c._id] = { ...c, replies: [] });
  const roots = [];
  comments.forEach(c => {
    if (c.parent) {
      map[c.parent]?.replies.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });
  return roots;
}
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    await deleteCommentAndChildren(commentId);

    res.status(200).json({ message: 'Comment and replies deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

async function deleteCommentAndChildren(parentId) {
  const children = await Comment.find({ parent: parentId });
  for (const child of children) {
    await deleteCommentAndChildren(child._id);
  }
  await Comment.findByIdAndDelete(parentId);
}
