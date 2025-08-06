const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Unauthorized action !' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token !' });
  }
};

exports.authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Unauthorized action !' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token !' });
  }
};

exports.authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'Access denied !' });
  }
  next();
}