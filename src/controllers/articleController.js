const Article = require('../models/Article');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage }).single('image');
exports.createArticle = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    try {
      const { title, content, tags } = req.body;

      // Basic validation
      if (!title || !content) {
        if (req.file) {
          const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return res.status(400).json({ message: 'Title and content are required.' });
      }

      const image = req.file ? req.file.filename : null;

      const article = new Article({
        title,
        content,
        tags,
        image,
        author: req.user.id,
      });

      await article.save();
      res.status(201).json({ message: 'Article created', article });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create article', error: err.message });
    }
  });
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'username role');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching articles', error: err.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'username role');
    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching article', error: err.message });
  }
};

exports.updateArticle = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        if (req.file) {
          const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return res.status(404).json({ message: 'Article not found' });
      }

      const isAuthor = article.author.toString() === req.user.id;
      const isEditorOrAdmin = ['admin', 'editor'].includes(req.user.role);

      if (!(isAuthor || isEditorOrAdmin)) {
        if (req.file) {
          const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      // Delete old image if new one is uploaded
      if (req.file && article.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', article.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const { title, content, tags } = req.body;
      // Basic validation
      if (!title || !content) {
        if (req.file) {
          const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return res.status(400).json({ message: 'Title and content are required.' });
      }

      article.title = title || article.title;
      article.content = content || article.content;
      article.tags = tags || article.tags;
      article.image = req.file ? req.file.filename : null;

      await article.save();
      res.status(200).json({ message: 'Article updated', article });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update article', error: err.message });
    }
  });
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Please Contact the admins to delete this article!' });
    }

    if (article.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', article.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await article.deleteOne();
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete article', error: err.message });
  }
};
