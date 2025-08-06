const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // store image URL or base64 string
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', ArticleSchema);
