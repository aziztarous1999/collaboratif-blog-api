const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

module.exports = app;