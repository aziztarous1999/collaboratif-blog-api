const Article = require('../models/Article');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.getAdminStats = async (req, res) => {
  try {
    console.log('Fetching admin statistics...');
    const [totalArticles, totalComments, totalUsers, tagsStats] = await Promise.all([
      Article.countDocuments(),
      Comment.countDocuments(),
      User.countDocuments(),
      Article.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      totalArticles,
      totalComments,
      totalUsers,
      tagsStats: tagsStats.map(tag => ({ tag: tag._id, count: tag.count }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [userArticles, userComments] = await Promise.all([
      Article.countDocuments({ author: userId }),
      Comment.countDocuments({ author: userId })
    ]);

    res.json({
      userArticles,
      userComments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};
