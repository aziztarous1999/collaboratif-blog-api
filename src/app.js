const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
function createApp(getIO) {
    const authRoutes = require('./routes/authRoutes');
    const articleRoutes = require('./routes/articleRoutes');
    const commentRoutes = require('./routes/commentRoutes');
    const path = require('path');
  
    const app = express();
  
    app.use(cors({ origin: process.env.CLIENT_URL }));
    app.use(express.json());
    app.use((req, res, next) => {
      req.io = getIO();
      next();
    });
  
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/api/auth', authRoutes);
    app.use('/api/articles', articleRoutes);
    app.use('/api/comments', commentRoutes);
  
    return app;
  }
  
  module.exports = createApp;
  